
import { useState, useEffect } from 'react';
import { loadData, saveData, generateId } from '@/utils/dataManager';
import learningData from '@/data/learningEntries.json';

export interface LearningEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  tags: string[];
}

export const useLearningEntries = () => {
  const [entries, setEntries] = useState<LearningEntry[]>([]);

  useEffect(() => {
    const loadedData = loadData('learningEntries', learningData);
    setEntries(loadedData);
  }, []);

  const addEntry = (entryData: Omit<LearningEntry, 'id' | 'date'>) => {
    const newEntry: LearningEntry = {
      ...entryData,
      id: generateId(),
      date: new Date().toISOString().split('T')[0]
    };
    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    saveData('learningEntries', updatedEntries);
  };

  const updateEntry = (id: string, updatedData: Partial<LearningEntry>) => {
    const updatedEntries = entries.map(entry => 
      entry.id === id ? { ...entry, ...updatedData } : entry
    );
    setEntries(updatedEntries);
    saveData('learningEntries', updatedEntries);
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    saveData('learningEntries', updatedEntries);
  };

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry
  };
};
