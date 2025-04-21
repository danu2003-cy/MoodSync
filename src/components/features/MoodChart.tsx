import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ChartData } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

type MoodChartProps = {
  data: ChartData[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const moodValue = payload[0].value;
    let moodLabel = 'Neutral';
    
    if (moodValue === 5) moodLabel = 'Happy';
    else if (moodValue === 4) moodLabel = 'Content';
    else if (moodValue === 3) moodLabel = 'Neutral';
    else if (moodValue === 2) moodLabel = 'Sad';
    else if (moodValue === 1) moodLabel = 'Angry';
    
    return (
      <div className="rounded-md bg-white p-2 shadow-md dark:bg-neutral-800">
        <p className="text-xs">{`${label}`}</p>
        <p className="text-sm font-semibold text-primary-500">{moodLabel}</p>
      </div>
    );
  }

  return null;
};

const MoodChart: React.FC<MoodChartProps> = ({ data }) => {
  const { preferences } = useTheme();
  const isDarkMode = preferences.theme === 'dark';
  
  return (
    <div className="card h-[300px]">
      <h3 className="mb-4 text-lg font-semibold">Mood Trends</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? '#404040' : '#e5e5e5'}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke={isDarkMode ? '#a3a3a3' : '#737373'}
            axisLine={{ stroke: isDarkMode ? '#404040' : '#e5e5e5' }}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(value) => {
              const labels = {
                1: 'Angry',
                2: 'Sad',
                3: 'Neutral',
                4: 'Content', 
                5: 'Happy'
              };
              return labels[value as keyof typeof labels] || '';
            }}
            tick={{ fontSize: 12 }}
            stroke={isDarkMode ? '#a3a3a3' : '#737373'}
            axisLine={{ stroke: isDarkMode ? '#404040' : '#e5e5e5' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            activeDot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;