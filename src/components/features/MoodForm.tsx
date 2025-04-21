import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { Mood } from '../../types';
import { getMoodEmoji } from '../../utils/helpers';
import Avatar from '../ui/Avatar';

type MoodFormProps = {
  onSubmit: (mood: Mood, tags: string[], notes: string) => void;
  initialMood?: Mood;
  initialTags?: string[];
  initialNotes?: string;
};

const MoodForm: React.FC<MoodFormProps> = ({
  onSubmit,
  initialMood = 'neutral',
  initialTags = [],
  initialNotes = '',
}) => {
  const [selectedMood, setSelectedMood] = useState<Mood>(initialMood);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');
  const [notes, setNotes] = useState(initialNotes);

  const moods: Mood[] = ['happy', 'content', 'neutral', 'sad', 'angry'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedMood, tags, notes);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="mb-6 flex items-center justify-center">
        <Avatar mood={selectedMood} size="lg" className="animate-float" />
      </div>
      
      <div className="mb-6">
        <label className="label">How are you feeling today?</label>
        <div className="grid grid-cols-5 gap-2">
          {moods.map((mood) => (
            <motion.button
              key={mood}
              type="button"
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center rounded-lg p-3 transition-all duration-200 ${
                selectedMood === mood
                  ? 'bg-primary-100 ring-2 ring-primary-500 dark:bg-primary-900/30 dark:ring-primary-400'
                  : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700'
              }`}
              onClick={() => setSelectedMood(mood)}
            >
              <span className="text-2xl">{getMoodEmoji(mood)}</span>
              <span className="mt-1 text-sm capitalize">{mood}</span>
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="tags" className="label">Tags (optional)</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm dark:bg-primary-900/30"
            >
              <span className="mr-1">{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="rounded-full text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <div className="flex">
            <input
              type="text"
              id="tags"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a tag..."
              className="input text-sm"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="ml-1 rounded-lg bg-primary-500 p-2 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="notes" className="label">Notes (optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How was your day? What made you feel this way?"
          className="input min-h-[120px] resize-y"
        ></textarea>
      </div>
      
      <motion.button
        type="submit"
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full"
      >
        Save Mood
      </motion.button>
    </form>
  );
};

export default MoodForm;