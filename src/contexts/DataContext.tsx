import React, { createContext, useContext, useEffect, useState } from 'react';
import { generateId, needsReminder } from '../utils/helpers';
import { MoodEntry, Event, Notification, Mood, ReminderFrequency, EventType } from '../types';

type DataContextType = {
  moodEntries: MoodEntry[];
  events: Event[];
  notifications: Notification[];
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateMoodEntry: (entry: MoodEntry) => void;
  updateEvent: (event: Event) => void;
  deleteMoodEntry: (id: string) => void;
  deleteEvent: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  generateMoodNotification: (mood: Mood) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const sampleMoodEntries: MoodEntry[] = [
  {
    id: '1',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    mood: 'content',
    tags: ['work', 'productive'],
    notes: 'Had a productive day at work.'
  },
  {
    id: '2',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    mood: 'happy',
    tags: ['friends', 'outdoors'],
    notes: 'Went hiking with friends. Beautiful day!'
  },
  {
    id: '3',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    mood: 'neutral',
    tags: ['routine'],
    notes: 'Normal day, nothing special.'
  },
  {
    id: '4',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    mood: 'sad',
    tags: ['stress', 'work'],
    notes: 'Deadline pressure is getting to me.'
  },
  {
    id: '5',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    mood: 'angry',
    tags: ['conflict', 'misunderstanding'],
    notes: 'Had an argument with a colleague.'
  },
  {
    id: '6',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    mood: 'content',
    tags: ['relax', 'weekend'],
    notes: 'Relaxing weekend at home.'
  }
];

const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Mom\'s Birthday',
    type: 'birthday',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5).toISOString(),
    notes: 'Buy a cake and flowers',
    reminderFrequency: ['week', 'day', 'same-day'],
    color: '#f97316'
  },
  {
    id: '2',
    title: 'Wedding Anniversary',
    type: 'anniversary',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 12).toISOString(),
    notes: 'Plan dinner at favorite restaurant',
    reminderFrequency: ['week', 'day'],
    color: '#8b5cf6'
  },
  {
    id: '3',
    title: 'Job Promotion',
    type: 'milestone',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2).toISOString(),
    notes: 'Celebrate with team',
    reminderFrequency: ['day', 'same-day'],
    color: '#22c55e'
  }
];

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Welcome to MoodSync!',
    message: 'Start tracking your mood and never miss important dates.',
    type: 'mood',
    read: false,
    date: new Date().toISOString()
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('moodEntries');
    return saved ? JSON.parse(saved) : sampleMoodEntries;
  });
  
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : sampleEvents;
  });
  
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
  }, [moodEntries]);
  
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);
  
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  // Check for events that need reminders every day
  useEffect(() => {
    const checkForReminders = () => {
      const reminderFrequencies: ReminderFrequency[] = ['week', 'day', 'same-day'];
      
      reminderFrequencies.forEach(frequency => {
        events.forEach(event => {
          if (needsReminder(event, frequency)) {
            // Create notification
            const message = frequency === 'same-day' 
              ? `Today is ${event.title}!` 
              : frequency === 'day' 
                ? `${event.title} is tomorrow!` 
                : `${event.title} is in a week!`;
                
            const notification: Notification = {
              id: generateId(),
              title: `Reminder: ${event.title}`,
              message,
              type: 'event',
              read: false,
              date: new Date().toISOString(),
              eventId: event.id
            };
            
            // Check if we already have this notification
            const exists = notifications.some(
              n => n.eventId === event.id && n.message === message
            );
            
            if (!exists) {
              setNotifications(prev => [notification, ...prev]);
            }
          }
        });
      });
    };
    
    // Check on mount and set up daily check
    checkForReminders();
    
    // Set up interval to check once a day
    const intervalId = setInterval(checkForReminders, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [events, notifications]);
  
  const addMoodEntry = (entry: Omit<MoodEntry, 'id'>) => {
    const newEntry = { ...entry, id: generateId() };
    setMoodEntries(prev => [newEntry, ...prev]);
    
    // Generate notification
    generateMoodNotification(entry.mood);
  };
  
  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = { ...event, id: generateId() };
    setEvents(prev => [newEvent, ...prev]);
    
    // Create notification for new event
    const notification: Notification = {
      id: generateId(),
      title: 'New Event Added',
      message: `You've added ${event.title} to your calendar.`,
      type: 'event',
      read: false,
      date: new Date().toISOString(),
      eventId: newEvent.id
    };
    
    setNotifications(prev => [notification, ...prev]);
  };
  
  const updateMoodEntry = (entry: MoodEntry) => {
    setMoodEntries(prev => 
      prev.map(e => e.id === entry.id ? entry : e)
    );
  };
  
  const updateEvent = (event: Event) => {
    setEvents(prev => 
      prev.map(e => e.id === event.id ? event : e)
    );
  };
  
  const deleteMoodEntry = (id: string) => {
    setMoodEntries(prev => prev.filter(e => e.id !== id));
  };
  
  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    // Also remove any notifications related to this event
    setNotifications(prev => 
      prev.filter(n => n.eventId !== id)
    );
  };
  
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  const generateMoodNotification = (mood: Mood) => {
    let message = '';
    
    switch (mood) {
      case 'happy':
        message = 'Great to see you\'re feeling happy today! Keep up the positive energy!';
        break;
      case 'content':
        message = 'Feeling content is wonderful. Enjoy the peaceful state of mind!';
        break;
      case 'neutral':
        message = 'Neutral days are important too. Take some time for self-care.';
        break;
      case 'sad':
        message = 'Sorry to hear you\'re feeling sad. Remember to be kind to yourself today.';
        break;
      case 'angry':
        message = 'Anger is a normal emotion. Try some deep breathing to help calm down.';
        break;
      default:
        message = 'Thanks for logging your mood today!';
    }
    
    const notification: Notification = {
      id: generateId(),
      title: 'Mood Logged',
      message,
      type: 'mood',
      read: false,
      date: new Date().toISOString()
    };
    
    setNotifications(prev => [notification, ...prev]);
  };
  
  return (
    <DataContext.Provider value={{
      moodEntries,
      events,
      notifications,
      addMoodEntry,
      addEvent,
      updateMoodEntry,
      updateEvent,
      deleteMoodEntry,
      deleteEvent,
      markNotificationAsRead,
      clearAllNotifications,
      generateMoodNotification
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  
  return context;
};