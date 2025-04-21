import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash } from 'lucide-react';
import { MoodEntry } from '../../types';
import { formatDate, getMoodEmoji } from '../../utils/helpers';

type MoodCardProps = {
  entry: MoodEntry;
  onEdit: () => void;
  onDelete: () => void;
};

const MoodCard: React.FC<MoodCardProps> = ({ entry, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="card overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
            <h3 className="font-semibold capitalize">{entry.mood}</h3>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {formatDate(entry.date)}
          </p>
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
      
      {entry.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary-100 px-2 py-0.5 text-xs dark:bg-primary-900/30"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {entry.notes && (
        <div className="mt-3 border-t border-neutral-200 pt-3 dark:border-neutral-700">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">{entry.notes}</p>
        </div>
      )}
    </motion.div>
  );
};

export default MoodCard;