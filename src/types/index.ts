export type Mood = 'happy' | 'content' | 'neutral' | 'sad' | 'angry';

export type MoodEntry = {
  id: string;
  date: string;
  mood: Mood;
  tags: string[];
  notes: string;
  userId: string;
};

export type EventType = 'birthday' | 'anniversary' | 'milestone' | 'other';

export type ReminderFrequency = 'week' | 'day' | 'same-day';

export type Event = {
  id: string;
  title: string;
  type: EventType;
  date: string;
  notes: string;
  reminderFrequency: ReminderFrequency[];
  color: string;
  userId: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'mood';
  read: boolean;
  date: string;
  eventId?: string;
  userId: string;
};

export type UserPreferences = {
  theme: 'light' | 'dark';
  showAvatar: boolean;
  enableNotifications: boolean;
};

export type ChartData = {
  date: string;
  value: number;
};

export type User = {
  id: string;
  email: string;
  name: string;
  profilePic?: string;
  createdAt: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};