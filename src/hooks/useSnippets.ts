
import { useState, useEffect } from 'react';
import { loadData, saveData, generateId } from '@/utils/dataManager';
import snippetsData from '@/data/snippets.json';

export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  description: string;
  createdAt: string;
}

export const useSnippets = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  useEffect(() => {
    const loadedData = loadData('snippets', snippetsData);
    setSnippets(loadedData);
  }, []);

  const addSnippet = (snippetData: Omit<Snippet, 'id' | 'createdAt'>) => {
    const newSnippet: Snippet = {
      ...snippetData,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updatedSnippets = [...snippets, newSnippet];
    setSnippets(updatedSnippets);
    saveData('snippets', updatedSnippets);
  };

  const updateSnippet = (id: string, updatedData: Partial<Snippet>) => {
    const updatedSnippets = snippets.map(snippet => 
      snippet.id === id ? { ...snippet, ...updatedData } : snippet
    );
    setSnippets(updatedSnippets);
    saveData('snippets', updatedSnippets);
  };

  const deleteSnippet = (id: string) => {
    const updatedSnippets = snippets.filter(snippet => snippet.id !== id);
    setSnippets(updatedSnippets);
    saveData('snippets', updatedSnippets);
  };

  return {
    snippets,
    addSnippet,
    updateSnippet,
    deleteSnippet
  };
};
