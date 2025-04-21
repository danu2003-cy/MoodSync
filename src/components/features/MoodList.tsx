import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { SmilePlus } from 'lucide-react';
import { MoodEntry } from '../../types';
import MoodCard from './MoodCard';

type MoodListProps = {
  entries: MoodEntry[];
  onEdit: (entry: MoodEntry) => void;
  onDelete: (id: string) => void;
};

const MoodList: React.FC<MoodListProps> = ({ entries, onEdit, onDelete }) => {
  // Group entries by date (today, yesterday, this week, earlier)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const groupedEntries = entries.reduce((acc, entry) => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    
    if (entryDate.getTime() === today.getTime()) {
      if (!acc.today) acc.today = [];
      acc.today.push(entry);
    } else if (entryDate.getTime() === yesterday.getTime()) {
      if (!acc.yesterday) acc.yesterday = [];
      acc.yesterday.push(entry);
    } else if (entryDate >= oneWeekAgo) {
      if (!acc.thisWeek) acc.thisWeek = [];
      acc.thisWeek.push(entry);
    } else {
      if (!acc.earlier) acc.earlier = [];
      acc.earlier.push(entry);
    }
    
    return acc;
  }, {} as Record<string, MoodEntry[]>);
  
  const sections = [
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'thisWeek', label: 'This Week' },
    { key: 'earlier', label: 'Earlier' },
  ];
  
  return (
    <div>
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg bg-neutral-100 p-8 text-center dark:bg-neutral-800">
          <SmilePlus className="mb-2 h-12 w-12 text-neutral-400" />
          <h3 className="text-lg font-medium">No mood entries yet</h3>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            Start tracking your mood by adding an entry!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sections.map(section => {
            const sectionEntries = groupedEntries[section.key];
            if (!sectionEntries || sectionEntries.length === 0) return null;
            
            return (
              <div key={section.key}>
                <h3 className="mb-4 text-lg font-semibold">{section.label}</h3>
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {sectionEntries
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(entry => (
                        <MoodCard
                          key={entry.id}
                          entry={entry}
                          onEdit={() => onEdit(entry)}
                          onDelete={() => onDelete(entry.id)}
                        />
                      ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MoodList;