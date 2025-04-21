import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/layout/Layout';
import MoodForm from '../components/features/MoodForm';
import MoodList from '../components/features/MoodList';
import MoodCalendar from '../components/features/MoodCalendar';
import MoodChart from '../components/features/MoodChart';
import { getMoodChartData } from '../utils/helpers';

const MoodTracker: React.FC = () => {
  const { moodEntries, addMoodEntry, updateMoodEntry, deleteMoodEntry } = useData();
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  const handleAddClick = () => {
    setSelectedEntry(null);
    setShowForm(true);
  };
  
  const handleEditClick = (entry) => {
    setSelectedEntry(entry);
    setShowForm(true);
  };
  
  const handleSubmit = (mood, tags, notes) => {
    if (selectedEntry) {
      updateMoodEntry({
        ...selectedEntry,
        mood,
        tags,
        notes
      });
    } else {
      addMoodEntry({
        date: new Date().toISOString(),
        mood,
        tags,
        notes
      });
    }
    setShowForm(false);
    setSelectedEntry(null);
  };
  
  const handleDelete = (id) => {
    const confirm = window.confirm('Are you sure you want to delete this mood entry?');
    if (confirm) {
      deleteMoodEntry(id);
    }
  };
  
  const handleDateClick = (date) => {
    const entry = moodEntries.find(e => 
      new Date(e.date).toDateString() === date.toDateString()
    );
    
    if (entry) {
      setSelectedEntry(entry);
      setShowForm(true);
    } else {
      setSelectedEntry(null);
      setShowForm(true);
    }
  };
  
  const chartData = getMoodChartData(moodEntries.slice(0, 14));
  
  return (
    <Layout title="Mood Tracker">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`btn ${
              viewMode === 'list'
                ? 'btn-primary'
                : 'btn-outline'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`btn ${
              viewMode === 'calendar'
                ? 'btn-primary'
                : 'btn-outline'
            }`}
          >
            Calendar View
          </button>
        </div>
        <button
          onClick={handleAddClick}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Entry</span>
        </button>
      </div>
      
      {chartData.length > 1 && (
        <div className="mb-6">
          <MoodChart data={chartData} />
        </div>
      )}
      
      {showForm ? (
        <div className="mx-auto max-w-md">
          <MoodForm
            onSubmit={handleSubmit}
            initialMood={selectedEntry?.mood}
            initialTags={selectedEntry?.tags}
            initialNotes={selectedEntry?.notes}
          />
          <button
            onClick={() => {
              setShowForm(false);
              setSelectedEntry(null);
            }}
            className="btn-outline mt-4 w-full"
          >
            Cancel
          </button>
        </div>
      ) : viewMode === 'list' ? (
        <MoodList
          entries={moodEntries}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      ) : (
        <MoodCalendar
          entries={moodEntries}
          onDateClick={handleDateClick}
        />
      )}
    </Layout>
  );
};

export default MoodTracker;