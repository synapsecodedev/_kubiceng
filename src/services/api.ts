import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333',
});

export interface Project {
  id: string;
  name: string;
  version: string;
  status: string;
  date: string;
}

export const getProjects = async () => {
  const response = await api.get<Project[]>('/projects');
  return response.data;
};
