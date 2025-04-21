import { addDays, format, isBefore, isSameDay, parseISO } from 'date-fns';
import { 
  Mood, 
  MoodEntry, 
  Event, 
  Notification, 
  ReminderFrequency, 
  ChartData 
} from '../types';

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Format date to display
export const formatDate = (date: string): string => {
  return format(parseISO(date), 'MMMM d, yyyy');
};

// Convert mood to numerical value for charts
export const moodToValue = (mood: Mood): number => {
  const moodValues: Record<Mood, number> = {
    'happy': 5,
    'content': 4,
    'neutral': 3,
    'sad': 2,
    'angry': 1
  };
  
  return moodValues[mood];
};

// Get color for mood
export const getMoodColor = (mood: Mood): string => {
  const moodColors: Record<Mood, string> = {
    'happy': 'bg-success-500',
    'content': 'bg-secondary-500',
    'neutral': 'bg-neutral-400',
    'sad': 'bg-accent-500',
    'angry': 'bg-error-500'
  };
  
  return moodColors[mood];
};

// Check if an event needs reminder based on frequency
export const needsReminder = (event: Event, frequency: ReminderFrequency): boolean => {
  if (!event.reminderFrequency.includes(frequency)) {
    return false;
  }
  
  const eventDate = parseISO(event.date);
  const today = new Date();
  
  if (frequency === 'week') {
    const weekBefore = addDays(eventDate, -7);
    return isSameDay(today, weekBefore);
  }
  
  if (frequency === 'day') {
    const dayBefore = addDays(eventDate, -1);
    return isSameDay(today, dayBefore);
  }
  
  if (frequency === 'same-day') {
    return isSameDay(today, eventDate);
  }
  
  return false;
};

// Get upcoming events
export const getUpcomingEvents = (events: Event[]): Event[] => {
  const today = new Date();
  
  return events
    .filter(event => {
      const eventDate = parseISO(event.date);
      return (isSameDay(eventDate, today) || isBefore(today, eventDate));
    })
    .sort((a, b) => {
      return parseISO(a.date).getTime() - parseISO(b.date).getTime();
    })
    .slice(0, 5);
};

// Get mood data for chart
export const getMoodChartData = (entries: MoodEntry[]): ChartData[] => {
  return entries
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .map(entry => ({
      date: format(parseISO(entry.date), 'MMM d'),
      value: moodToValue(entry.mood)
    }));
};

// Get unread notifications count
export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter(notification => !notification.read).length;
};

// Get emoji for mood
export const getMoodEmoji = (mood: Mood): string => {
  const emojis: Record<Mood, string> = {
    'happy': '😄',
    'content': '🙂',
    'neutral': '😐',
    'sad': '😔',
    'angry': '😠'
  };
  
  return emojis[mood];
};

// Get event color based on type
export const getEventColor = (type: Event['type']): string => {
  const colors: Record<Event['type'], string> = {
    'birthday': 'bg-accent-500',
    'anniversary': 'bg-primary-500',
    'milestone': 'bg-success-500',
    'other': 'bg-neutral-400'
  };
  
  return colors[type];
};