import apiClient from './axios';

export interface Resume {
  _id: string;
  title: string;
  university: string;
  engineeringField: string;
  status: 'pending' | 'processed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface ResumeUploadData {
  resume: FormData;
  title?: string;
  university: string;
  engineeringField: string;
}

export const resumeApi = {
  getResumes: async (): Promise<{ resumes: Resume[] }> => {
    const response = await apiClient.get<{ resumes: Resume[] }>('/upload/resumes');
    return response.data;
  },
  
  uploadResume: async (data: ResumeUploadData): Promise<{ message: string; resume: Resume }> => {
    const formData = new FormData();
    
    // Add the file from data.resume
    Object.keys(data).forEach(key => {
      if (key !== 'resume') {
        formData.append(key, data[key as keyof ResumeUploadData] as string);
      }
    });
    
    // Special headers for file upload
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    
    const response = await apiClient.post<{ message: string; resume: Resume }>(
      '/upload/resume',
      formData,
      config
    );
    
    return response.data;
  },
  
  deleteResume: async (resumeId: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/upload/delete-resume',
      { resumeId }
    );
    return response.data;
  },
};
