import apiClient from './axios';

export interface Advisor {
  _id: string;
  name: string;
  email: string;
  university: string;
  department?: string;
  info?: string;
  secondInfo?: string;
  prefix?: string;
  tags?: string[];
  expertise?: string[];
}

export interface AdvisorMatch {
  advisor: Advisor;
  matchScore: number;
  matchingAreas: string[];
  _id: string;
}

export interface MatchResult {
  _id: string;
  resumeId: string;
  userId: string;
  advisors: AdvisorMatch[];
  createdAt: string;
  updatedAt?: string;
}

export const matchingApi = {
  findMatches: async (resumeId: string): Promise<{ message: string; data: any }> => {
    const response = await apiClient.get<{ message: string; data: any }>(
      `/matching/resume?resumeId=${resumeId}`
    );
    return response.data;
  },
  
  getMatchResults: async (resumeId: string): Promise<{ message: string; data: MatchResult }> => {
    const response = await apiClient.get<{ message: string; data: MatchResult }>(
      `/matching/results?resumeId=${resumeId}`
    );
    return response.data;
  },
};
