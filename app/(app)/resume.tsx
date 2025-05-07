import { useAuth } from "@/context/auth-context";
import { matchingApi } from "@/lib/api/matching";
import { Resume, resumeApi } from "@/lib/api/resume";
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ResumeScreen() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch resumes on component mount
  useEffect(() => {
    fetchResumes();
  }, []);
  
  const fetchResumes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await resumeApi.getResumes();
      setResumes(response.resumes);
      
      // If there's only one resume, select it automatically
      if (response.resumes.length === 1) {
        setSelectedResumeId(response.resumes[0]._id);
      }
    } catch (err: any) {
      setError("Failed to fetch resumes: " + (err?.message || "Unknown error"));
      console.error("Error fetching resumes:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteResume = async (resumeId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      "Delete Resume",
      "Are you sure you want to delete this resume?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            setIsDeleting(resumeId);
            try {
              await resumeApi.deleteResume(resumeId);
              
              // Remove the deleted resume from the state
              setResumes(resumes.filter(resume => resume._id !== resumeId));
              
              // If the deleted resume was selected, clear the selection
              if (selectedResumeId === resumeId) {
                setSelectedResumeId(null);
              }
            } catch (err: any) {
              Alert.alert("Error", "Failed to delete resume: " + (err?.message || "Unknown error"));
              console.error("Error deleting resume:", err);
            } finally {
              setIsDeleting(null);
            }
          }
        }
      ]
    );
  };
  
  const handleAnalyzeResume = async () => {
    if (!selectedResumeId) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsAnalyzing(true);
    
    try {
      await matchingApi.findMatches(selectedResumeId);
      
      // Navigate to the matching results page
      router.push({
        pathname: "/matching",
        params: { resumeId: selectedResumeId }
      } as any);
    } catch (err: any) {
      Alert.alert("Error", "Failed to analyze resume: " + (err?.message || "Unknown error"));
      console.error("Error analyzing resume:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const renderResumes = () => {
    if (isLoading) {
      return (
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text className="text-gray-500 mt-4">Loading your resumes...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View className="items-center justify-center py-20">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className="text-red-500 mt-2">{error}</Text>
          <TouchableOpacity 
            className="mt-4 bg-gray-200 px-4 py-2 rounded-lg"
            onPress={fetchResumes}
          >
            <Text>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (resumes.length === 0) {
      return (
        <View className="items-center justify-center py-20">
          <Ionicons name="document-outline" size={48} color="#9CA3AF" />
          <Text className="text-gray-500 mt-2 text-center">You haven't uploaded any resumes yet</Text>
          <TouchableOpacity 
            className="mt-6 bg-primary px-6 py-3 rounded-lg"
            onPress={() => router.push("/resume/upload" as any)}
          >
            <Text className="text-white font-medium">Upload Resume</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View className="space-y-4">
        {resumes.map((resume) => (
          <View 
            key={resume._id}
            className={`bg-white rounded-lg p-4 border ${
              selectedResumeId === resume._id ? "border-primary" : "border-gray-200"
            }`}
          >
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => setSelectedResumeId(resume._id)}
                className="mr-3"
              >
                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  selectedResumeId === resume._id ? "border-primary" : "border-gray-400"
                }`}>
                  {selectedResumeId === resume._id && (
                    <View className="w-4 h-4 rounded-full bg-primary" />
                  )}
                </View>
              </TouchableOpacity>
              
              <View className="flex-1">
                <View className="flex-row justify-between items-center">
                  <Text className="font-bold text-lg">{resume.title || "Untitled Resume"}</Text>
                  {isDeleting === resume._id ? (
                    <ActivityIndicator size="small" color="#EF4444" />
                  ) : (
                    <TouchableOpacity onPress={() => handleDeleteResume(resume._id)}>
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
                
                <Text className="text-gray-500 text-sm mt-1">
                  {new Date(resume.createdAt).toLocaleDateString()}
                </Text>
                
                <View className="flex-col-reverse mt-2 space-y-reverse space-y-2">
                  <View className="bg-gray-100 rounded-full px-3 py-1 self-start">
                    <Text className="text-xs font-medium">{resume.engineeringField}</Text>
                  </View>
                  
                  <View className="bg-gray-100 rounded-full px-3 py-1 self-start">
                    <Text className="text-xs font-medium">{resume.university}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
        
        <TouchableOpacity
          className={`${
            selectedResumeId && !isAnalyzing ? "bg-primary" : "bg-gray-300"
          } py-4 rounded-lg mt-6`}
          onPress={handleAnalyzeResume}
          disabled={!selectedResumeId || isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-center text-white font-semibold">
              {selectedResumeId ? "Analyze Resume" : "Select a Resume"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 24 }}
    >
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-800">My Resumes</Text>
        <Text className="text-gray-600 mt-1">
          Select a resume to analyze and find matching advisors
        </Text>
      </View>
      
      {renderResumes()}
    </ScrollView>
  );
}