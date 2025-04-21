import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Edit, Trash } from 'lucide-react';
import { Event } from '../../types';
import { formatDate } from '../../utils/helpers';

type EventCardProps = {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
};

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="card overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div 
            className="mt-1 h-8 w-2 rounded-full" 
            style={{ backgroundColor: event.color }}
          ></div>
          <div>
            <h3 className="font-semibold">{event.title}</h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="mt-2">
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs capitalize dark:bg-primary-900/30">
                {event.type}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="rounded-lg p-2 text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
            aria-label="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg p-2 text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-error-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-error-400"
            aria-label="Delete"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {event.notes && (
        <div className="ml-11 mt-3 border-t border-neutral-200 pt-3 dark:border-neutral-700">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">{event.notes}</p>
        </div>
      )}
      
      <div className="ml-11 mt-3">
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Reminders:</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {event.reminderFrequency.includes('week') && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-700">
              Week before
            </span>
          )}
          {event.reminderFrequency.includes('day') && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-700">
              Day before
            </span>
          )}
          {event.reminderFrequency.includes('same-day') && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-700">
              Same day
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;