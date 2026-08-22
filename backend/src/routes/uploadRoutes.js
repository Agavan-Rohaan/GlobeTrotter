const express = require('express');
const multer = require('multer');
const { Dropbox } = require('dropbox');
const fetch = require('isomorphic-fetch'); // Required by Dropbox SDK in Node environments
const path = require('path');

const router = express.Router();

// Configure Multer to store the incoming file purely in memory RAM
// We do not save to local disk to ensure the server stays lightweight
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST /api/upload
// Expects multipart/form-data with a field named "image"
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // 1. Initialize Dropbox Client using the Token we configured in .env
        const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch: fetch });

        // 2. Generate a highly unique filename to prevent overwriting
        const fileExt = path.extname(req.file.originalname) || '.jpg';
        const fileName = `globetrotter_${Date.now()}_${Math.round(Math.random() * 1E9)}${fileExt}`;
        const dropboxPath = `/Uploads/${fileName}`; // Folder inside your Dropbox account

        // 3. Upload the RAM buffer directly to Dropbox
        await dbx.filesUpload({
            path: dropboxPath,
            contents: req.file.buffer
        });

        // 4. Generate a public sharing link so the frontend can display the image
        const sharedLinkRes = await dbx.sharingCreateSharedLinkWithSettings({
            path: dropboxPath,
            settings: {
                requested_visibility: { '.tag': 'public' }
            }
        });

        // Dropbox sharing links end with ?dl=0 (which prompts a download).
        // By changing it to ?raw=1, the browser can embed the image directly in an <img> tag!
        let publicUrl = sharedLinkRes.result.url;
        publicUrl = publicUrl.replace('?dl=0', '?raw=1');

        res.status(200).json({ 
            message: 'Image uploaded successfully',
            url: publicUrl 
        });

    } catch (error) {
        console.error('Dropbox API Error:', error);
        res.status(500).json({ message: 'Image upload failed on the server', error: error.message });
    }
});

module.exports = router;
