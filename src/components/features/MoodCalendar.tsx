import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { format, isSameDay, parseISO } from 'date-fns';
import { MoodEntry } from '../../types';
import { getMoodColor, getMoodEmoji } from '../../utils/helpers';

type MoodCalendarProps = {
  entries: MoodEntry[];
  onDateClick: (date: Date) => void;
};

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const MoodCalendar: React.FC<MoodCalendarProps> = ({ entries, onDateClick }) => {
  const [value, setValue] = useState<Value>(new Date());
  
  const handleChange = (nextValue: Value) => {
    setValue(nextValue);
    if (nextValue instanceof Date) {
      onDateClick(nextValue);
    }
  };
  
  const findMoodForDate = (date: Date): MoodEntry | undefined => {
    return entries.find(entry => 
      isSameDay(parseISO(entry.date), date)
    );
  };
  
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const entry = findMoodForDate(date);
    if (!entry) return null;
    
    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs">
          {getMoodEmoji(entry.mood)}
        </span>
      </div>
    );
  };
  
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const entry = findMoodForDate(date);
    if (!entry) return null;
    
    return `${getMoodColor(entry.mood)} text-white relative`;
  };
  
  return (
    <div className="rounded-xl bg-white p-4 shadow-md dark:bg-neutral-800">
      <Calendar
        onChange={handleChange}
        value={value}
        tileContent={tileContent}
        tileClassName={tileClassName}
        formatDay={(locale, date) => format(date, 'd')}
      />
    </div>
  );
};

export default MoodCalendar;