import React, { useState } from 'react';
import { Edit3 } from 'lucide-react';
import { useDashboardContext } from '../../context/DashboardContext';
import './QuickNotes.css';

const QuickNotesWidget = () => {
  const { notes, addNote } = useDashboardContext();
  const [inputValue, setInputValue] = useState('');

  const handleAddNote = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addNote(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="card h-full">
      <div className="card-title mb-4">
        <Edit3 size={16} className="text-primary" />
        <span>QUICK NOTES</span>
      </div>
      
      <div className="flex flex-col flex-1 justify-between">
        <ul className="notes-list mb-4">
          {notes.map((note) => (
            <li key={note.id} className="note-item text-sm font-medium">
              <div className="note-bullet"></div>
              {note.text}
            </li>
          ))}
        </ul>
        
        <input 
          type="text" 
          className="quick-note-input" 
          placeholder="Write a quick note..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddNote}
        />
      </div>
    </div>
  );
};

export default QuickNotesWidget;
