
import { useState, useEffect } from 'react';
import { loadData, saveData, generateId } from '@/utils/dataManager';
import projectsData from '@/data/projects.json';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'paused';
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  startDate: string;
  lastUpdated: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadedData = loadData('projects', projectsData as Project[]);
    setProjects(loadedData);
  }, []);

  const addProject = (projectData: Omit<Project, 'id' | 'startDate' | 'lastUpdated'>) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const newProject: Project = {
      ...projectData,
      id: generateId(),
      startDate: currentDate,
      lastUpdated: currentDate
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveData('projects', updatedProjects);
  };

  const updateProject = (id: string, updatedData: Partial<Project>) => {
    const updatedProjects = projects.map(project => 
      project.id === id ? { 
        ...project, 
        ...updatedData, 
        lastUpdated: new Date().toISOString().split('T')[0] 
      } : project
    );
    setProjects(updatedProjects);
    saveData('projects', updatedProjects);
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    saveData('projects', updatedProjects);
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject
  };
};
