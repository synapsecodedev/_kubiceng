import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, getProjects } from '@/services/api';

interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  loading: boolean;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
      
      // Se não houver projeto selecionado ou o atual não existe mais, tenta selecionar o primeiro
      if (!selectedProject && data.length > 0) {
        setSelectedProject(data[0]);
      } else if (selectedProject) {
        const stillExists = data.find(p => p.id === selectedProject.id);
        if (!stillExists && data.length > 0) {
          setSelectedProject(data[0]);
        }
      }
    } catch (error) {
           console.error('Error fetching projects for context:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{ projects, selectedProject, setSelectedProject, loading, refreshProjects }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
