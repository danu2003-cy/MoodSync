import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { EventType, ReminderFrequency } from '../../types';

type EventFormProps = {
  onSubmit: (
    title: string,
    type: EventType,
    date: string,
    notes: string,
    reminderFrequency: ReminderFrequency[],
    color: string
  ) => void;
  initialTitle?: string;
  initialType?: EventType;
  initialDate?: string;
  initialNotes?: string;
  initialReminderFrequency?: ReminderFrequency[];
  initialColor?: string;
};

const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  initialTitle = '',
  initialType = 'other',
  initialDate = new Date().toISOString().split('T')[0],
  initialNotes = '',
  initialReminderFrequency = ['day'],
  initialColor = '#8b5cf6',
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [type, setType] = useState<EventType>(initialType);
  const [date, setDate] = useState(initialDate);
  const [notes, setNotes] = useState(initialNotes);
  const [reminderFrequency, setReminderFrequency] = useState<ReminderFrequency[]>(
    initialReminderFrequency
  );
  const [color, setColor] = useState(initialColor);

  const eventTypes: { value: EventType; label: string }[] = [
    { value: 'birthday', label: 'Birthday' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'milestone', label: 'Milestone' },
    { value: 'other', label: 'Other' },
  ];

  const reminderOptions: { value: ReminderFrequency; label: string }[] = [
    { value: 'week', label: 'One week before' },
    { value: 'day', label: 'Day before' },
    { value: 'same-day', label: 'Same day' },
  ];

  const colorOptions = [
    '#8b5cf6', // purple (primary)
    '#14b8a6', // teal (secondary)
    '#f97316', // orange (accent)
    '#22c55e', // green (success)
    '#eab308', // yellow (warning)
    '#ef4444', // red (error)
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, type, date, notes, reminderFrequency, color);
  };

  const toggleReminderFrequency = (frequency: ReminderFrequency) => {
    if (reminderFrequency.includes(frequency)) {
      setReminderFrequency(reminderFrequency.filter(f => f !== frequency));
    } else {
      setReminderFrequency([...reminderFrequency, frequency]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="mb-6">
        <label htmlFor="title" className="label">Event Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter event title"
          required
          className="input"
        />
      </div>
      
      <div className="mb-6">
        <label className="label">Event Type</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {eventTypes.map((eventType) => (
            <motion.button
              key={eventType.value}
              type="button"
              whileTap={{ scale: 0.98 }}
              className={`rounded-lg p-3 text-center transition-all duration-200 ${
                type === eventType.value
                  ? 'bg-primary-100 ring-2 ring-primary-500 dark:bg-primary-900/30 dark:ring-primary-400'
                  : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700'
              }`}
              onClick={() => setType(eventType.value)}
            >
              {eventType.label}
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="date" className="label">Date</label>
        <div className="relative">
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="input pl-10"
          />
          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="label">Reminder</label>
        <div className="space-y-2">
          {reminderOptions.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                id={`reminder-${option.value}`}
                checked={reminderFrequency.includes(option.value)}
                onChange={() => toggleReminderFrequency(option.value)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-800"
              />
              <label
                htmlFor={`reminder-${option.value}`}
                className="ml-2 text-sm text-neutral-700 dark:text-neutral-300"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <label className="label">Color</label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              className={`h-8 w-8 rounded-full transition-all duration-200 ${
                color === colorOption ? 'ring-2 ring-offset-2 dark:ring-offset-neutral-800' : ''
              }`}
              style={{ backgroundColor: colorOption }}
              onClick={() => setColor(colorOption)}
              aria-label={`Select color ${colorOption}`}
            ></button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="notes" className="label">Notes (optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this event..."
          className="input min-h-[100px] resize-y"
        ></textarea>
      </div>
      
      <motion.button
        type="submit"
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full"
      >
        Save Event
      </motion.button>
    </form>
  );
};

export default EventForm;