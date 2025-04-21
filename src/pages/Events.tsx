import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/layout/Layout';
import EventForm from '../components/features/EventForm';
import EventList from '../components/features/EventList';

const Events: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  const handleAddClick = () => {
    setSelectedEvent(null);
    setShowForm(true);
  };
  
  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
  };
  
  const handleSubmit = (title, type, date, notes, reminderFrequency, color) => {
    if (selectedEvent) {
      updateEvent({
        ...selectedEvent,
        title,
        type,
        date: new Date(date).toISOString(),
        notes,
        reminderFrequency,
        color
      });
    } else {
      addEvent({
        title,
        type,
        date: new Date(date).toISOString(),
        notes,
        reminderFrequency,
        color
      });
    }
    setShowForm(false);
    setSelectedEvent(null);
  };
  
  const handleDelete = (id) => {
    const confirm = window.confirm('Are you sure you want to delete this event?');
    if (confirm) {
      deleteEvent(id);
    }
  };
  
  return (
    <Layout title="Events">
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddClick}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Event</span>
        </button>
      </div>
      
      {showForm ? (
        <div className="mx-auto max-w-md">
          <EventForm
            onSubmit={handleSubmit}
            initialTitle={selectedEvent?.title}
            initialType={selectedEvent?.type}
            initialDate={selectedEvent?.date ? selectedEvent.date.split('T')[0] : undefined}
            initialNotes={selectedEvent?.notes}
            initialReminderFrequency={selectedEvent?.reminderFrequency}
            initialColor={selectedEvent?.color}
          />
          <button
            onClick={() => {
              setShowForm(false);
              setSelectedEvent(null);
            }}
            className="btn-outline mt-4 w-full"
          >
            Cancel
          </button>
        </div>
      ) : (
        <EventList
          events={events}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}
    </Layout>
  );
};

export default Events;