import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Event } from '../../types';
import { formatDate } from '../../utils/helpers';
import EventCard from './EventCard';

type EventListProps = {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
};

const EventList: React.FC<EventListProps> = ({ events, onEdit, onDelete }) => {
  // Group events by month
  const groupedEvents = events.reduce((acc, event) => {
    const date = new Date(event.date);
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    
    acc[monthYear].push(event);
    return acc;
  }, {} as Record<string, Event[]>);
  
  return (
    <div>
      {Object.keys(groupedEvents).length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg bg-neutral-100 p-8 text-center dark:bg-neutral-800">
          <Calendar className="mb-2 h-12 w-12 text-neutral-400" />
          <h3 className="text-lg font-medium">No events found</h3>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            Start by adding your first event!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
            <div key={monthYear}>
              <h3 className="mb-4 text-lg font-semibold">{monthYear}</h3>
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {monthEvents
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map(event => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onEdit={() => onEdit(event)}
                        onDelete={() => onDelete(event.id)}
                      />
                    ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;