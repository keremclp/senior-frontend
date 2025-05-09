import ENGINEERING_DISCIPLINES from '@/constant/enums/engineering-fields';
import UNIVERSITIES from '@/constant/enums/university-names.enum';
import { useAuth } from "@/context/auth-context";
import { matchingApi } from "@/lib/api/matching";
import { Resume, resumeApi } from "@/lib/api/resume";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Dimensions, Modal, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// LoadingOverlay component to show during analysis
interface LoadingOverlayProps {
  visible: boolean;
}

const LoadingOverlay = ({ visible }: LoadingOverlayProps) => {
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const progressValue = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  
  // Increase particles from 8 to 20 for a more immersive effect
  const particles = useRef([...Array(20)].map(() => ({
    position: new Animated.ValueXY({ x: 0, y: 0 }),
    opacity: new Animated.Value(0),
    size: Math.random() * 10 + 3, // Sizes from 3-13px for more variety
    color: [
      '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', 
      '#2563EB', '#1D4ED8', '#DBEAFE', '#EFF6FF',
      // Add more shades for variety
      '#1E40AF', '#3B82F6', '#60A5FA', '#7DD3FC'
    ][Math.floor(Math.random() * 12)],
    // Add speed variation for more organic movement
    speed: 0.7 + (Math.random() * 0.6), // Speed multiplier between 0.7-1.3
  }))).current;
  
  useEffect(() => {
    if (visible) {
      // Reset progress animation
      progressValue.setValue(0);
      
      // Background fade in
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Entrance animation
      Animated.parallel([
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Start rotation animation
      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
      
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Create infinite progress animation instead of one that completes
      startIndefiniteProgressAnimation();
      
      // Animate all particles across the modal with more varied delays
      particles.forEach((particle, index) => {
        // More staggered delays to avoid particles all appearing at once
        const delay = index * 150 + Math.random() * 800;
        animateParticleRandomly(particle, delay);
      });
    } else {
      // Exit animations
      Animated.parallel([
        Animated.timing(backgroundOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Function for continuous progress animation
  const startIndefiniteProgressAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressValue, {
          toValue: 0.9, // Go to 90%
          duration: 8000,
          useNativeDriver: false,
        }),
        // Hold at 90% with slight pulsing
        Animated.loop(
          Animated.sequence([
            Animated.timing(progressValue, {
              toValue: 0.93,
              duration: 800,
              useNativeDriver: false,
            }),
            Animated.timing(progressValue, {
              toValue: 0.9,
              duration: 800,
              useNativeDriver: false,
            }),
          ]),
          { iterations: 3 }
        ),
      ])
    ).start();
  };
  
  // Function to animate particles with random movement
  const animateParticleRandomly = (particle: {
    position: Animated.ValueXY;
    opacity: Animated.Value;
    size: number;
    color: string;
    speed: number;
  }, delay: number) => {
    // Generate random starting position with wider distribution
    const startX = (Math.random() * 320) - 160; // -160 to 160 (wider range)
    const startY = (Math.random() * 400) - 150; // -150 to 250 (wider range)
    
    // Particles always move upward but with some horizontal variation
    const endX = startX + (Math.random() * 100 - 50); // +/- 50 from start (more variation)
    const endY = startY - (100 + Math.random() * 200); // Move up 100-300px (more variation)
    
    particle.position.setValue({ x: startX, y: startY });
    particle.opacity.setValue(0);
    
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(particle.opacity, {
            toValue: 0.7 + (Math.random() * 0.3), // Random opacity 0.7-1.0
            duration: 800 + Math.random() * 1200, // Random duration
            useNativeDriver: true,
          }),
          Animated.timing(particle.position, {
            toValue: { x: endX, y: endY },
            // Use the particle's speed property to vary animation speed
            duration: (3000 + Math.random() * 3000) / particle.speed,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.delay(Math.random() * 1500), // Longer random delay for more varied timing
      ])
    ).start();
  };
  
  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const progressWidthInterpolate = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  
  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.loadingOverlay, { opacity: backgroundOpacity }]}>
        <Animated.View 
          style={[
            styles.loadingContent,
            {
              opacity: opacityValue,
              transform: [
                { scale: scaleValue },
              ]
            }
          ]}
        >
          {/* Render all floating particles */}
          {particles.map((particle, index) => (
            <Animated.View 
              key={index}
              style={[
                styles.particle,
                { 
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  opacity: particle.opacity,
                  transform: [
                    { translateX: particle.position.x },
                    { translateY: particle.position.y }
                  ] 
                }
              ]} 
            />
          ))}

          <Animated.View 
            style={[
              styles.iconBackground,
              { transform: [{ scale: pulseValue }] }
            ]}
          >
            <View style={styles.iconGlow} />
            <Animated.View style={[styles.iconContainer, { transform: [{ rotate }] }]}>
              <Ionicons name="search-outline" size={56} color="#1E3A8A" />
            </Animated.View>
          </Animated.View>
          
          <View style={styles.textContainer}>
            <Text style={styles.loadingTitle}>Analyzing Your Resume</Text>
            <Text style={styles.loadingSubtitle}>
              Our AI is processing your information to find the perfect advisor matches for you
            </Text>
          </View>
          
          <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressBar, { width: progressWidthInterpolate }]} />
          </View>

          <View style={styles.tipContainer}>
            <Ionicons name="bulb-outline" size={16} color="#3B82F6" />
            <Text style={styles.tipText}>
              The more detailed your resume is, the better the matches will be
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default function ResumeScreen() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch resumes whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchResumes();
      // Return cleanup function if needed
      return () => {
        // Any cleanup code
      };
    }, [])
  );
  
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
        // Don't show immediate alert as we'll navigate away
        console.log("Resume analyzed successfully");
      } else {
        Alert.alert("Error", "Failed to analyze resume: " + response.message);
        return;
      }
      
      // Check if the resume was already analyzed
      if(response.data.alreadyProcessed) {
        console.log("Resume was already processed");
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
                    <View className="w-7 h-7 bg-white rounded-full items-center justify-center mr-3" style={styles.detailIconContainer}>
                      <Ionicons name="school-outline" size={16} color="#2563EB" />
                    </View>
                    <Text className="text-sm font-medium text-gray-700">
                      {UNIVERSITIES[resume.university as keyof typeof UNIVERSITIES] || resume.university}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    <View className="w-7 h-7 bg-white rounded-full items-center justify-center mr-3" style={styles.detailIconContainer}>
                      <Ionicons name="code-outline" size={16} color="#2563EB" />
                    </View>
                    <Text className="text-sm font-medium text-gray-700">
                      {ENGINEERING_DISCIPLINES[resume.engineeringField as keyof typeof ENGINEERING_DISCIPLINES] || resume.engineeringField}
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
    <>
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
        <View className="mb-8 bg-white rounded-xl p-5 overflow-hidden" style={styles.headerCard}>
          <View className="absolute top-0 right-0 opacity-5">
            <Ionicons name="rocket" size={120} color="#1E3A8A" />
          </View>
          
          <View className="flex-row items-center mb-2">
            <View className="bg-primary w-10 h-10 rounded-lg items-center justify-center mr-3" style={styles.detailIconContainer}>
              <View className="flex-row">
                <Ionicons name="analytics-outline" size={20} color="#FFFFFF" />
                <Ionicons name="stats-chart-outline" size={20} color="#FFFFFF" style={{marginLeft: -5}} />
              </View>
            </View>
            <View>
              <Text className="text-3xl font-extrabold text-gray-800">Analyze Resumes</Text>
              <View className="h-1 bg-primary rounded-full w-16 mt-1" />
            </View>
          </View>
          
          <Text className="text-gray-600 mt-3 pl-1 text-base">
            Select a resume to find matching advisors
          </Text>
        </View>
        
        {renderResumes()}
      </ScrollView>
      
      {/* Loading overlay during analysis */}
      <LoadingOverlay visible={isAnalyzing} />
    </>
  );
}

const styles = StyleSheet.create({
  // ...existing styles...
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    width: Dimensions.get('window').width * 0.88,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconBackground: {
    width: 140,
    height: 140,
    backgroundColor: '#EBF5FF',
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 26,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 6,
    borderColor: '#DBEAFE',
    position: 'relative',
    overflow: 'visible',
  },
  iconGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(30, 58, 138, 0.15)',
    top: -10,
    left: -10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: 'rgba(219, 234, 254, 0.7)',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 14,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '85%',
  },
  progressContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 6,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    maxWidth: '90%',
  },
  tipText: {
    color: '#3B82F6',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 999, // Fully rounded
  },
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
  detailIconContainer: {
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
  headerCard: {
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
});