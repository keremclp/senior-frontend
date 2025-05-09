import HeaderUserDropdown from "@/components/header/HeaderUserDropdown";
import { useAuth } from "@/context/auth-context";
import { matchingApi } from "@/lib/api/matching";
import { resumeApi } from "@/lib/api/resume";
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HomeScreen() {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Simplified statistics with just resumes and best match
  const [stats, setStats] = useState({
    resumesUploaded: { value: 0, loading: true, error: false },
    matchScore: { value: 0, loading: true, error: false, noProcessedResumes: false }
  });

  // Fetch statistics from APIs
  const fetchStatistics = async (isRefresh = false) => {
    console.log('Starting fetchStatistics, current stats:', stats);
    
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      // Set all stats to loading state
      setStats(prev => ({
        resumesUploaded: { ...prev.resumesUploaded, loading: true, error: false },
        matchScore: { ...prev.matchScore, loading: true, error: false },
      }));
    }

    // Fetch resume count
    try {
      const resumeResponse = await resumeApi.getResumes();
      console.log('Got resumes:', resumeResponse.resumes.length);
      
      // Log the status of each resume to debug
      resumeResponse.resumes.forEach((resume, index) => {
        console.log(`Resume ${index}: id=${resume._id}, status=${resume.status}`);
      });
      
      setStats(prev => ({
        ...prev,
        resumesUploaded: { 
          value: resumeResponse.resumes.length, 
          loading: false,
          error: false 
        }
      }));
      
      // If there are resumes, check for matches regardless of status
      if (resumeResponse.resumes.length > 0) {
        try {
          // Set match score to loading while we check processed resumes
          setStats(prev => ({
            ...prev,
            matchScore: { ...prev.matchScore, loading: true }
          }));
          
          let highestScore = 0;
          let hasMatches = false;
          
          // Check all resumes for matches instead of filtering by status
          for (const resume of resumeResponse.resumes) {
            try {
              console.log(`Checking matches for resume ${resume._id} with status ${resume.status}`);
              const matchResult = await matchingApi.getMatchResults(resume._id);
              
              // Make sure we have valid data and advisors
              if (matchResult && matchResult.data && matchResult.data.advisors && 
                  matchResult.data.advisors.length > 0) {
                // We found at least one match
                hasMatches = true;
                
                // Find highest score for this resume
                const resumeHighestScore = Math.max(
                  ...matchResult.data.advisors.map((match: any) => match.matchScore)
                );
                
                console.log(`Highest score for resume ${resume._id}:`, resumeHighestScore);
                
                // Update overall highest score if this resume has a higher match
                if (resumeHighestScore > highestScore) {
                  highestScore = resumeHighestScore;
                  console.log('New overall highest score:', highestScore);
                }
              } else {
                console.log('No valid advisor matches in result for resume:', resume._id);
              }
            } catch (error: any) {
              // Only log as error if it's not a 404 (which means not analyzed yet)
              if (error.response && error.response.status === 404) {
                console.log(`Resume ${resume._id} hasn't been analyzed yet`);
              } else {
                console.error(`Error fetching matches for resume ${resume._id}:`, error);
              }
            }
          }
          
          // Update UI with the highest score found
          console.log('Final highest score before state update:', highestScore);
          
          setStats(prev => {
            const newStats = {
              ...prev,
              matchScore: { 
                value: highestScore,
                loading: false,
                error: false,
                // Only true if we checked all resumes and found no matches
                noProcessedResumes: !hasMatches
              }
            };
            console.log('Updated matchScore state:', newStats.matchScore);
            return newStats;
          });
        } catch (error) {
          console.error("Error processing matches:", error);
          setStats(prev => ({
            ...prev,
            matchScore: { ...prev.matchScore, loading: false, error: true }
          }));
        }
      } else {
        // No resumes, so no matches
        setStats(prev => ({
          ...prev,
          matchScore: { value: 0, loading: false, error: false, noProcessedResumes: true }
        }));
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      setStats(prev => ({
        ...prev,
        resumesUploaded: { ...prev.resumesUploaded, loading: false, error: true }
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Handle refresh
  const onRefresh = () => {
    fetchStatistics(true);
  };

  // Render stat value with loading or error state
  const renderStatValue = (stat: { value: number; loading: boolean; error: boolean; noProcessedResumes?: boolean }, isPercentage = false) => {
    if (stat.loading) {
      return <ActivityIndicator size="small" color="#1E3A8A" />;
    }
    if (stat.error) {
      return <Text className="text-red-500">--</Text>;
    }
    // Special case for match score when we have resumes but none are processed yet
    if (stat.noProcessedResumes) {
      // Remove the object equality check which is causing the issue
      return <Text className="text-lg font-medium text-amber-500">--</Text>;
    }
    
    // Format the value as a whole number for percentages
    const displayValue = isPercentage ? Math.round(stat.value) : stat.value;
    
    return (
      <Text className="text-2xl font-bold text-gray-800">
        {displayValue}{isPercentage ? '%' : ''}
      </Text>
    );
  };

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl 
          refreshing={isRefreshing} 
          onRefresh={onRefresh} 
          colors={["#1E3A8A"]} // Android
          tintColor="#1E3A8A" // iOS 
        />
      }
    >
      <LinearGradient
        colors={['#1E3A8A', '#2563EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-6 pt-8 pb-10 rounded-b-3xl shadow-lg"
      >
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Image 
              source={require('@/assets/images/react-logo.png')} 
              className="w-10 h-10 rounded-full mr-2"
              style={{ resizeMode: 'contain' }}
            />
            <Text className="text-white text-xl font-bold">ResumeMatch</Text>
          </View>
          <HeaderUserDropdown user={user} />
        </View>
        <View className="mt-4">
          <Text className="text-white text-2xl font-bold mb-2">
            Welcome, {user?.name?.split(' ')[0]}
          </Text>
          <Text className="text-white opacity-80">
            Let's find the perfect advisor for your career path
          </Text>
        </View>
      </LinearGradient>
      
      {/* Stats Cards */}
      <View className="px-6 -mt-6">
        <Animated.View 
          entering={FadeInDown.delay(200).duration(700)} 
          className="bg-white rounded-2xl shadow-md p-5 mb-6"
        > 
          <Text className="text-gray-700 font-medium mb-3">Your Progress</Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <View className="bg-blue-100 w-14 h-14 rounded-full items-center justify-center mb-2">
                <Ionicons name="document-text" size={24} color="#1E3A8A" />
              </View>
              {renderStatValue(stats.resumesUploaded)}
              <Text className="text-xs text-gray-500">Resumes</Text>
            </View>
            <View className="items-center">
              <View className="bg-yellow-100 w-14 h-14 rounded-full items-center justify-center mb-2">
                <Ionicons name="star" size={24} color="#FBBF24" />
              </View>
              {renderStatValue(stats.matchScore, true)}
              <Text className="text-xs text-gray-500">
                {stats.matchScore.value === 0 && stats.matchScore.noProcessedResumes ? "No Matches" : "Best Match"}
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
      
      <View className="p-6">
        {/* Quick Actions */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(700)}
          className="bg-white rounded-2xl p-6 shadow-md mb-6"
        > 
          <Text className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</Text>
          <View className="flex-row flex-wrap">
            <Link href={"/resume/upload" as any} asChild>
              <TouchableOpacity className="bg-blue-50 p-4 rounded-xl w-[48%] mr-[4%] mb-4 shadow-sm border border-blue-100">
                <View className="items-center">
                  <View className="bg-blue-100 w-12 h-12 rounded-full items-center justify-center mb-2">
                    <Ionicons name="cloud-upload-outline" size={24} color="#1E3A8A" />
                  </View>
                  <Text className="text-primary font-medium text-center">Upload Resume</Text>
                </View>
              </TouchableOpacity>
            </Link>
            <Link href={"/resume" as any} asChild>
              <TouchableOpacity className="bg-indigo-50 p-4 rounded-xl w-[48%] mb-4 shadow-sm border border-indigo-100">
                <View className="items-center">
                  <View className="bg-indigo-100 w-12 h-12 rounded-full items-center justify-center mb-2">
                    <Ionicons name="document-text-outline" size={24} color="#4F46E5" />
                  </View>
                  <Text className="text-indigo-700 font-medium text-center">View Resumes</Text>
                </View>
              </TouchableOpacity>
            </Link>
            <Link href={"/matching" as any} asChild>
              <TouchableOpacity className="bg-green-50 p-4 rounded-xl w-[48%] mr-[4%] shadow-sm border border-green-100">
                <View className="items-center">
                  <View className="bg-green-100 w-12 h-12 rounded-full items-center justify-center mb-2">
                    <Ionicons name="people-outline" size={24} color="#10B981" />
                  </View>
                  <Text className="text-green-700 font-medium text-center">View Matches</Text>
                </View>
              </TouchableOpacity>
            </Link>
            <Link href={"/profile" as any} asChild>
              <TouchableOpacity className="bg-amber-50 p-4 rounded-xl w-[48%] shadow-sm border border-amber-100">
                <View className="items-center">
                  <View className="bg-amber-100 w-12 h-12 rounded-full items-center justify-center mb-2">
                    <Ionicons name="settings-outline" size={24} color="#D97706" />
                  </View>
                  <Text className="text-amber-700 font-medium text-center">Settings</Text>
                </View>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
        
        {/* How It Works */}
        <Animated.View
          entering={FadeInDown.delay(800).duration(700)}
          className="bg-white rounded-2xl p-6 shadow-md"
        > 
          <Text className="text-lg font-semibold mb-4 text-gray-800">How It Works</Text>
          <View className="space-y-6">
            {/* Step 1 */}
            <View className="flex-row">
              <View className="items-center mr-4">
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                  <MaterialIcons name="upload-file" size={24} color="#1E3A8A" />
                </View>
                <View className="h-14 w-0.5 bg-blue-100 my-1"></View>
              </View>
              <View className="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <Text className="font-bold text-gray-800">Upload Your Resume</Text>
                <Text className="text-gray-600 text-sm mt-1">Upload your resume in PDF or DOCX format. We support all standard resume formats.</Text>
              </View>
            </View>
            
            {/* Step 2 */}
            <View className="flex-row">
              <View className="items-center mr-4">
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
                  <MaterialCommunityIcons name="file-document-edit" size={24} color="#8B5CF6" />
                </View>
                <View className="h-14 w-0.5 bg-purple-100 my-1"></View>
              </View>
              <View className="flex-1 bg-purple-50 p-4 rounded-xl border border-purple-100">
                <Text className="font-bold text-gray-800">Process Your Resume</Text>
                <Text className="text-gray-600 text-sm mt-1">Our AI analyzes your resume for key skills, experiences, and academic background to find your unique strengths.</Text>
              </View>
            </View>
            
            {/* Step 3 */}
            <View className="flex-row">
              <View className="items-center mr-4">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
                  <FontAwesome5 name="handshake" size={22} color="#059669" />
                </View>
              </View>
              <View className="flex-1 bg-green-50 p-4 rounded-xl border border-green-100">
                <Text className="font-bold text-gray-800">Get Matched with Advisors</Text>
                <Text className="text-gray-600 text-sm mt-1">View your personalized advisor matches ranked by compatibility with your profile and career goals.</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
      
      {/* Footer space */}
      <View className="h-6"></View>
    </ScrollView>
  );
}
