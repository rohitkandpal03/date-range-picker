import React from 'react';
import './PresetRanges.css';

interface PresetRangesProps {
  onSelectPreset: (startDate: Date, endDate: Date) => void;
  onConfirm: () => void;
}

const PresetRanges: React.FC<PresetRangesProps> = ({ onSelectPreset, onConfirm }) => {
  const handleLastSevenDays = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    onSelectPreset(sevenDaysAgo, today);
  };

  const handleLastThirtyDays = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    onSelectPreset(thirtyDaysAgo, today);
  };

  return (
    <div className="predefined-ranges">
      <button onClick={handleLastSevenDays}>Last 7 Days</button>
      <button onClick={handleLastThirtyDays}>Last 30 Days</button>
      <button onClick={onConfirm} className="ok-button">
        OK
      </button>
    </div>
  );
};

export default PresetRanges;