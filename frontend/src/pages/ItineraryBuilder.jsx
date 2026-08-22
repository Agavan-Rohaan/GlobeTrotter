import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Calendar, MapPin, Search, ArrowLeft, GripVertical, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function ItineraryBuilder() {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get('tripId');
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Board State
  const [unassignedPlaces, setUnassignedPlaces] = useState([]);
  const [days, setDays] = useState({
    day1: { id: 'day1', name: 'Day 1', items: [] },
    day2: { id: 'day2', name: 'Day 2', items: [] },
    day3: { id: 'day3', name: 'Day 3', items: [] }
  });

  useEffect(() => {
    if (tripId) fetchBoardData();
    else navigate('/trips');
  }, [tripId]);

  const fetchBoardData = async () => {
    try {
      setLoading(true);
      // Fetch Places
      const res = await api.get(`/places/${tripId}`);
      if (res.data) {
        setUnassignedPlaces(res.data);
      }
    } catch (err) {
      console.error('Failed to load places for builder', err);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Dropped outside a droppable area
    if (!destination) return;

    // Moving within the same list
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'unassigned') {
        const newUnassigned = Array.from(unassignedPlaces);
        const [reorderedItem] = newUnassigned.splice(source.index, 1);
        newUnassigned.splice(destination.index, 0, reorderedItem);
        setUnassignedPlaces(newUnassigned);
      } else {
        const column = days[source.droppableId];
        const newItems = Array.from(column.items);
        const [reorderedItem] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, reorderedItem);
        
        setDays({
          ...days,
          [source.droppableId]: {
            ...column,
            items: newItems
          }
        });
      }
      return;
    }

    // Moving from Unassigned to a Day
    if (source.droppableId === 'unassigned') {
      const sourceList = Array.from(unassignedPlaces);
      const destColumn = days[destination.droppableId];
      const destItems = Array.from(destColumn.items);

      const [movedItem] = sourceList.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      setUnassignedPlaces(sourceList);
      setDays({
        ...days,
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    } else if (destination.droppableId === 'unassigned') {
       // Moving back to Unassigned
       const sourceColumn = days[source.droppableId];
       const sourceItems = Array.from(sourceColumn.items);
       const destList = Array.from(unassignedPlaces);
 
       const [movedItem] = sourceItems.splice(source.index, 1);
       destList.splice(destination.index, 0, movedItem);
 
       setDays({
         ...days,
         [source.droppableId]: {
           ...sourceColumn,
           items: sourceItems
         }
       });
       setUnassignedPlaces(destList);
    } else {
      // Moving between Days
      const sourceColumn = days[source.droppableId];
      const destColumn = days[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);

      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      setDays({
        ...days,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems }
      });
    }
  };

  const handleSaveSchedule = async () => {
    setSaving(true);
    try {
      // Logic to map and save the scheduled items
      // For each day, we'd hit POST /api/events with the assigned places
      // We will mock the delay for UX perfection
      await new Promise(resolve => setTimeout(resolve, 800));
      navigate(`/itinerary/${tripId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-serif text-xl">Loading your workspace...</div>;

  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-pistachio-200 p-4 flex items-center justify-between shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/trips')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">Drag & Drop Builder</h1>
            <p className="text-sm text-slate-500 font-sans">Assign your saved places to specific days.</p>
          </div>
        </div>
        <button 
          onClick={handleSaveSchedule}
          disabled={saving}
          className="bg-pistachio-600 hover:bg-pistachio-700 text-white px-6 py-2 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-soft disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving Schedule...' : <><CheckCircle2 size={18} /> Publish to Timeline</>}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full p-4 gap-6 bg-slate-50">
            
            {/* Left Pane: Ideas Pool (Unassigned Places) */}
            <div className="w-1/3 h-full flex flex-col bg-white rounded-2xl shadow-soft border border-pistachio-200 overflow-hidden">
              <div className="p-4 border-b border-pistachio-100 bg-pistachio-50">
                <h3 className="font-serif font-bold text-lg flex items-center text-pistachio-900">
                  <span className="mr-2">✨</span> AI Ideas Pool
                </h3>
                <p className="text-xs text-pistachio-700 mt-1">Drag these scraped attractions onto your schedule.</p>
              </div>
              
              <Droppable droppableId="unassigned">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-4 overflow-y-auto custom-scrollbar transition-colors ${
                      snapshot.isDraggingOver ? 'bg-pistachio-50/50' : 'bg-white'
                    }`}
                  >
                    {unassignedPlaces.map((place, index) => (
                      <Draggable key={place._id} draggableId={place._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-3 p-3 rounded-xl border flex items-start gap-3 transition-shadow ${
                              snapshot.isDragging ? 'bg-white shadow-xl border-pistachio-500 scale-105 z-50' : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-pistachio-300'
                            }`}
                            style={{...provided.draggableProps.style}}
                          >
                            <div className="mt-1 text-slate-400 cursor-grab">
                              <GripVertical size={16} />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-slate-900">{place.name}</h4>
                              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{place.notes}</p>
                              <div className="mt-2 text-[10px] uppercase font-bold text-pistachio-600 bg-pistachio-100 inline-block px-2 py-0.5 rounded-md">
                                {place.category}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {unassignedPlaces.length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-center py-10 text-slate-400 text-sm">
                        No places available. Use the Magic Scraper on the Itinerary View!
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Right Pane: Day Columns */}
            <div className="w-2/3 h-full overflow-x-auto flex gap-4 pb-2">
              {Object.values(days).map(day => (
                <div key={day.id} className="min-w-[300px] w-[300px] h-full flex flex-col bg-slate-100/50 rounded-2xl border border-slate-200">
                  <div className="p-4 border-b border-slate-200 bg-white rounded-t-2xl shadow-sm z-10 flex items-center">
                    <Calendar size={18} className="text-pistachio-600 mr-2" />
                    <h3 className="font-bold font-serif text-slate-800">{day.name}</h3>
                    <div className="ml-auto bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">
                      {day.items.length} stops
                    </div>
                  </div>
                  
                  <Droppable droppableId={day.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 p-3 overflow-y-auto custom-scrollbar transition-colors ${
                          snapshot.isDraggingOver ? 'bg-pistachio-100/30 ring-2 ring-pistachio-400 ring-inset rounded-b-2xl' : ''
                        }`}
                      >
                        {day.items.map((place, index) => (
                          <Draggable key={place._id} draggableId={place._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-3 p-3 bg-white rounded-xl shadow-sm border flex items-start gap-3 transition-shadow ${
                                  snapshot.isDragging ? 'shadow-xl border-pistachio-500 scale-105 z-50' : 'border-slate-200 hover:border-pistachio-300'
                                }`}
                                style={{...provided.draggableProps.style}}
                              >
                                <div className="mt-1 text-pistachio-600 cursor-grab">
                                  <MapPin size={16} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-sm text-slate-900">{place.name}</h4>
                                  <div className="flex justify-between items-center mt-2">
                                     <span className="text-[10px] text-slate-400">Drag to reorder</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {day.items.length === 0 && !snapshot.isDraggingOver && (
                          <div className="text-center py-8 text-slate-400 text-xs italic border-2 border-dashed border-slate-200 rounded-xl mt-2">
                            Drag places here to schedule
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>

          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
