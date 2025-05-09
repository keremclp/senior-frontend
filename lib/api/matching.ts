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

export interface MatchApiResponse {
  message: string;
  data?: MatchResult | any;
  status: 'success' | 'error' | 'not_analyzed';
}

export const matchingApi = {
  findMatches: async (resumeId: string): Promise<MatchApiResponse> => {
    try {
      const response = await apiClient.get<{ message: string; data: any }>(
        `/matching/resume?resumeId=${resumeId}`
      );
      return {
        ...response.data,
        status: 'success'
      };
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return {
          message: "Resume has not been analyzed yet",
          status: 'not_analyzed'
        };
      }
      throw error;
    }
  },
  
  getMatchResults: async (resumeId: string): Promise<MatchApiResponse> => {
    try {
      const response = await apiClient.get<{ message: string; data: MatchResult }>(
        `/matching/results?resumeId=${resumeId}`
      );
      return {
        ...response.data,
        status: 'success'
      };
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return {
          message: "Resume has not been analyzed yet",
          status: 'not_analyzed'
        };
      }
      throw error;
    }
  },
};
