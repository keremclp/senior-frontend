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
    
    // Add file from data.resume (assuming it's already FormData with a file)
    const resumeFile = data.resume.get('resume') as Blob;
    formData.append('resume', resumeFile);
    
    // Add other fields
    if (data.title) {
      formData.append('title', data.title);
    }
    formData.append('university', data.university);
    formData.append('engineeringField', data.engineeringField);
    
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
