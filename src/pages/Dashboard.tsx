import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Settings } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import Layout from '../components/layout/Layout';
import Avatar from '../components/ui/Avatar';
import MoodForm from '../components/features/MoodForm';
import MoodChart from '../components/features/MoodChart';
import EventForm from '../components/features/EventForm';
import { getMoodChartData, getUpcomingEvents } from '../utils/helpers';
import { formatDate } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const { preferences } = useTheme();
  const { moodEntries, events, addMoodEntry, addEvent } = useData();
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  
  const upcomingEvents = getUpcomingEvents(events);
  const chartData = getMoodChartData(moodEntries.slice(0, 14));
  
  const latestMood = moodEntries.length > 0 ? moodEntries[0].mood : undefined;
  const today = new Date();
  const formattedToday = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const handleMoodSubmit = (mood, tags, notes) => {
    addMoodEntry({
      date: new Date().toISOString(),
      mood,
      tags,
      notes
    });
    setShowMoodForm(false);
  };
  
  const handleEventSubmit = (title, type, date, notes, reminderFrequency, color) => {
    addEvent({
      title,
      type,
      date: new Date(date).toISOString(),
      notes,
      reminderFrequency,
      color
    });
    setShowEventForm(false);
  };
  
  return (
    <Layout>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card flex flex-col items-center lg:col-span-2"
        >
          <div className="flex flex-col items-center">
            {preferences.showAvatar && (
              <Avatar mood={latestMood} size="lg" className="mb-4" />
            )}
            <h1 className="text-center text-2xl font-bold">Welcome to MoodSync</h1>
            <p className="mt-2 text-center text-neutral-500 dark:text-neutral-400">
              {formattedToday}
            </p>
          </div>
          
          {!showMoodForm ? (
            <button
              onClick={() => setShowMoodForm(true)}
              className="btn-primary mt-6 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              <span>Log Your Mood</span>
            </button>
          ) : (
            <div className="mt-6 w-full max-w-md">
              <MoodForm 
                onSubmit={handleMoodSubmit} 
              />
              <button
                onClick={() => setShowMoodForm(false)}
                className="btn-outline mt-4 w-full"
              >
                Cancel
              </button>
            </div>
          )}
        </motion.div>
        
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card"
        >
          <h2 className="mb-4 text-xl font-semibold">Quick Stats</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-primary-50 p-4 dark:bg-primary-900/20">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Mood Entries</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {moodEntries.length}
              </p>
            </div>
            <div className="rounded-lg bg-secondary-50 p-4 dark:bg-secondary-900/20">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Upcoming Events</p>
              <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                {upcomingEvents.length}
              </p>
            </div>
            <div className="rounded-lg bg-accent-50 p-4 dark:bg-accent-900/20">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Days Tracked</p>
              <p className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                {new Set(moodEntries.map(e => e.date.split('T')[0])).size}
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Mood Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          {chartData.length > 1 ? (
            <MoodChart data={chartData} />
          ) : (
            <div className="card flex flex-col items-center justify-center p-6 text-center">
              <Calendar className="h-12 w-12 text-neutral-400" />
              <h3 className="mt-4 text-lg font-semibold">Not enough data for mood trends</h3>
              <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                Add at least 2 mood entries to see your mood trends over time.
              </p>
            </div>
          )}
        </motion.div>
        
        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <button
              onClick={() => setShowEventForm(true)}
              className="rounded-full p-2 text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              aria-label="Add event"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          {showEventForm ? (
            <div>
              <EventForm 
                onSubmit={handleEventSubmit} 
              />
              <button
                onClick={() => setShowEventForm(false)}
                className="btn-outline mt-4 w-full"
              >
                Cancel
              </button>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg bg-neutral-100 p-6 text-center dark:bg-neutral-800">
              <Calendar className="mb-2 h-10 w-10 text-neutral-400" />
              <p className="text-neutral-500 dark:text-neutral-400">No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map(event => (
                <div 
                  key={event.id} 
                  className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700"
                >
                  <div 
                    className="h-8 w-2 rounded-full" 
                    style={{ backgroundColor: event.color }}
                  ></div>
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card lg:col-span-3"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">Settings</h2>
              <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                Customize your MoodSync experience
              </p>
            </div>
            <Settings className="h-6 w-6 text-neutral-500" />
          </div>
          
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <h3 className="font-medium">Theme</h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Current: {preferences.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </p>
              <p className="mt-3 text-xs">
                You can toggle the theme using the moon/sun icon in the top navigation bar.
              </p>
            </div>
            
            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <h3 className="font-medium">Avatar</h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {preferences.showAvatar ? 'Visible' : 'Hidden'}
              </p>
              <p className="mt-3 text-xs">
                The avatar reflects your current mood and adds a personal touch to your experience.
              </p>
            </div>
            
            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <h3 className="font-medium">Notifications</h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {preferences.enableNotifications ? 'Enabled' : 'Disabled'}
              </p>
              <p className="mt-3 text-xs">
                Get timely reminders for your upcoming events and track your mood.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;