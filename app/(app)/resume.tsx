import { useAuth } from "@/context/auth-context";
import { matchingApi } from "@/lib/api/matching";
import { Resume, resumeApi } from "@/lib/api/resume";
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Animated, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import UNIVERSITIES from '@/constant/enums/university-names.enum';
import ENGINEERING_DISCIPLINES from '@/constant/enums/engineering-fields';

export default function ResumeScreen() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch resumes on component mount
  useEffect(() => {
    fetchResumes();
  }, []);
  
  const fetchResumes = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
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
      setIsRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    fetchResumes(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      const response = await matchingApi.findMatches(selectedResumeId);

      if(response.data.success) {
        Alert.alert("Success", "Resume analyzed successfully.");
      } else {
        Alert.alert("Error", "Failed to analyze resume: " + response.message);
        return;
      }
      
      // Check if the resume was already analyzed
      if(response.data.alreadyProcessed) {
        Alert.alert("Info", "This resume has already been analyzed. You can view the results now.");
      }
      
      // Navigate to the matching results page (regardless of whether it's newly analyzed or already done)
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
          <Text className="text-gray-500 mt-4 font-medium">Loading your resumes...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View className="items-center justify-center py-20">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className="text-red-500 mt-3 font-medium text-center">{error}</Text>
          <TouchableOpacity 
            className="mt-6 bg-gray-200 px-6 py-3 rounded-lg"
            onPress={() => fetchResumes()}
            style={styles.shadowLight}
          >
            <Text className="font-medium">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (resumes.length === 0) {
      return (
        <View className="items-center justify-center py-20">
          <View className="bg-gray-100 w-20 h-20 rounded-full items-center justify-center mb-2">
            <Ionicons name="document-outline" size={40} color="#6B7280" />
          </View>
          <Text className="text-gray-700 mt-4 text-center font-semibold text-lg">No Resumes Found</Text>
          <Text className="text-gray-500 text-center px-6 mt-2">Upload a resume to find matching advisors</Text>
          <TouchableOpacity 
            className="mt-8 bg-primary px-8 py-3 rounded-lg flex-row items-center"
            onPress={() => router.push("/resume/upload" as any)}
            style={styles.shadowPrimary}
          >
            <Ionicons name="cloud-upload-outline" size={20} color="#FFF" />
            <Text className="text-white font-semibold ml-2">Upload Resume</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View className="space-y-4">
        {resumes.map((resume) => {
          const isSelected = selectedResumeId === resume._id;
          
          return (
            <TouchableOpacity
              key={resume._id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedResumeId(resume._id);
              }}
              activeOpacity={0.7}
            >
              <View 
                className={`rounded-xl p-4 border ${
                  isSelected ? "border-primary bg-blue-50" : "border-gray-200 bg-white"
                }`}
                style={isSelected ? styles.selectedCard : styles.card}
              >
                <View className="flex-row items-center mb-2">
                  <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    isSelected ? "border-primary" : "border-gray-300"
                  }`}>
                    {isSelected && (
                      <View className="w-4 h-4 rounded-full bg-primary" />
                    )}
                  </View>
                  
                  <Text className={`font-bold text-lg ml-3 flex-1 ${
                    isSelected ? "text-primary" : "text-gray-800"
                  }`}>
                    {resume.title || "Untitled Resume"}
                  </Text>
                  
                  {isDeleting === resume._id ? (
                    <ActivityIndicator size="small" color="#EF4444" />
                  ) : (
                    <TouchableOpacity 
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeleteResume(resume._id);
                      }}
                      className="bg-red-50 p-2 rounded-full"
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
                
                <View className="flex-row items-center mb-3">
                  <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                  <Text className="text-gray-500 text-xs ml-1 font-medium">
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                
                <View className="mt-3 pt-3 border-t border-gray-100">
                  <View className="flex-row mb-2 items-center">
                    <View className="w-7 h-7 bg-white rounded-full items-center justify-center mr-3" style={styles.iconContainer}>
                      <Ionicons name="school-outline" size={16} color="#2563EB" />
                    </View>
                    <Text className="text-sm font-medium text-gray-700">
                      {UNIVERSITIES[resume.university] || resume.university}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    <View className="w-7 h-7 bg-white rounded-full items-center justify-center mr-3" style={styles.iconContainer}>
                      <Ionicons name="code-outline" size={16} color="#2563EB" />
                    </View>
                    <Text className="text-sm font-medium text-gray-700">
                      {ENGINEERING_DISCIPLINES[resume.engineeringField] || resume.engineeringField}
                    </Text>
                  </View>
                </View>
                
                {isSelected && (
                  <View className="absolute -right-1 -top-1 bg-primary w-6 h-6 rounded-full items-center justify-center" style={styles.checkmarkBadge}>
                    <Ionicons name="checkmark" size={14} color="#FFF" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
        
        <TouchableOpacity
          className={`py-4 rounded-xl mt-6 flex-row items-center justify-center ${
            selectedResumeId && !isAnalyzing ? "bg-primary" : "bg-gray-300"
          }`}
          onPress={handleAnalyzeResume}
          disabled={!selectedResumeId || isAnalyzing}
          style={selectedResumeId && !isAnalyzing ? styles.shadowPrimary : {}}
        >
          {isAnalyzing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons 
                name={selectedResumeId ? "analytics-outline" : "document-text-outline"} 
                size={20} 
                color="#FFFFFF" 
              />
              <Text className="text-white font-semibold ml-2">
                {selectedResumeId ? "Analyze Resume" : "Select a Resume"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 20 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={["#1E3A8A"]} // Android
          tintColor="#1E3A8A" // iOS
        />
      }
    >
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-800">My Resumes</Text>
        <Text className="text-gray-600 mt-1">
          Select a resume to find matching advisors
        </Text>
      </View>
      
      {renderResumes()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedCard: {
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  checkmarkBadge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  shadowPrimary: {
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  shadowLight: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});