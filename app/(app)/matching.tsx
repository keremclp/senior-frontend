import AdvisorCard from '@/components/advisor/AdvisorCard';
import AdvisorDetailModal from '@/components/advisor/AdvisorDetailModal';
import { AdvisorMatch, MatchResult, matchingApi } from '@/lib/api/matching';
import { Resume, resumeApi } from '@/lib/api/resume';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function MatchingScreen() {
  const { resumeId } = useLocalSearchParams();
  const router = useRouter();
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [needsAnalysis, setNeedsAnalysis] = useState(false);
  
  // State for resumes
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [selectedResumeTitle, setSelectedResumeTitle] = useState<string | null>(null);
  
  // State for modal
  const [selectedAdvisor, setSelectedAdvisor] = useState<AdvisorMatch | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Fetch user's resumes when no resumeId is provided
  const fetchUserResumes = async () => {
    try {
      setLoadingResumes(true);
      const response = await resumeApi.getResumes();
      
      // Make sure we're correctly extracting the array of resumes
      if (response && response.resumes) {
        setResumes(response.resumes);
        
        // If resumeId is provided, find the corresponding resume title
        if (resumeId) {
          const selectedResume = response.resumes.find(resume => resume._id === resumeId);
          if (selectedResume) {
            setSelectedResumeTitle(selectedResume.title || "Untitled Resume");
          }
        }
      } else {
        console.error("Invalid response format from getResumes", response);
        setResumes([]);
      }
    } catch (err: any) {
      console.error("Error fetching user resumes:", err);
      setResumes([]);
    } finally {
      setLoadingResumes(false);
      setIsLoading(false);
    }
  };
  
  // Fetch match results
  const fetchMatchResults = async (id?: string, refresh = false) => {
    const targetResumeId = id || resumeId;
    
    if (!targetResumeId) {
      // If no resumeId provided, fetch user's resumes instead
      fetchUserResumes();
      return;
    }
    
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    setError(null);
    setNeedsAnalysis(false);
    
    try {
      // If we don't have the resume title yet, fetch it
      if (!selectedResumeTitle) {
        fetchUserResumes();
      }
      
      const response = await matchingApi.getMatchResults(targetResumeId as string);
      
      if (response.status === 'success' && response.data) {
        setMatchResult(response.data);
      } else if (response.status === 'not_analyzed') {
        setNeedsAnalysis(true);
      } else {
        setError("Invalid response format from getMatchResults");
        console.error("Invalid response format from getMatchResults", response);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch advisor matches");
      console.error("Error fetching match results:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Effect to fetch results on load
  useEffect(() => {
    const fetchData = async () => {
      if (resumeId) {
        await fetchMatchResults();
      } else {
        await fetchUserResumes();
      }
    };
    fetchData();
  }, [resumeId]);
  
  // Handle resume selection
  const handleResumeSelect = (id: string, title: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedResumeTitle(title);
    // Navigate to the same screen but with resumeId parameter
    router.push(`/matching?resumeId=${id}` as any);
  };
  
  // Handle refresh
  const onRefresh = () => {
    if (resumeId) {
      fetchMatchResults(undefined, true);
    } else {
      fetchUserResumes();
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Handle sorting
  const toggleSortOrder = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };
  
  // Sort advisors by match score
  const sortedAdvisors = matchResult?.advisors
    ? [...matchResult.advisors].sort((a, b) => {
        return sortOrder === 'desc' 
          ? b.matchScore - a.matchScore 
          : a.matchScore - b.matchScore;
      })
    : [];
  
  // Handler for advisor selection - updated to show modal instead of Alert
  const handleAdvisorSelect = (advisor: AdvisorMatch) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAdvisor(advisor);
    setIsModalVisible(true);
  };
  
  // Render functions for different states
  const renderLoading = () => (
    <View className="items-center justify-center py-20">
      <ActivityIndicator size="large" color="#1E3A8A" />
      <Text className="text-gray-500 mt-4">Loading advisor matches...</Text>
    </View>
  );
  
  const renderNeedsAnalysis = () => (
    <View className="items-center justify-center py-20">
      <Ionicons name="analytics-outline" size={48} color="#9CA3AF" />
      <Text className="text-gray-600 font-medium mt-4 text-center text-lg">
        This resume hasn't been analyzed yet
      </Text>
      <Text className="text-gray-500 mt-2 text-center px-6">
        Go to the Resume screen to analyze this resume and find matching advisors
      </Text>
      <TouchableOpacity 
        className="mt-8 bg-primary px-6 py-3 rounded-lg flex-row items-center"
        onPress={() => router.push("/resume" as any)}
      >
        <Ionicons name="document-text-outline" size={18} color="white" />
        <Text className="text-white font-medium ml-2">Go to Resume Screen</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderError = () => (
    <View className="items-center justify-center py-20">
      <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
      <Text className="text-red-500 mt-2 text-center">{error}</Text>
      <TouchableOpacity 
        className="mt-4 bg-gray-200 px-4 py-2 rounded-lg"
        onPress={() => resumeId ? fetchMatchResults() : fetchUserResumes()}
      >
        <Text>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderNoMatches = () => (
    <View className="items-center justify-center py-20">
      <Ionicons name="search-outline" size={48} color="#9CA3AF" />
      <Text className="text-gray-500 mt-2 text-center">No advisor matches found</Text>
      <TouchableOpacity 
        className="mt-6 bg-primary px-6 py-3 rounded-lg"
        onPress={() => router.push("/resume" as any)}
      >
        <Text className="text-white font-medium">View Resumes</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderAdvisors = () => (
    <View>
      {sortedAdvisors.map((match) => (
        <AdvisorCard 
          key={match._id.toString()} 
          match={match} 
          onPress={() => handleAdvisorSelect(match)} 
        />
      ))}
    </View>
  );
  
  // Resume selection UI
  const renderResumeSelection = () => (
    <View>
      <View className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-md overflow-hidden border border-blue-100">
        <View className="px-6 py-7">
          <View className="flex-row items-center mb-5">
            <View className="bg-primary h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 items-center justify-center mr-4 shadow-sm">
              <Ionicons name="newspaper-outline" size={26} color="#fffbeb" />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-blue-600 font-medium mb-1">MATCH WITH ADVISORS</Text>
              <Text className="text-3xl font-bold text-gray-800">Select Resume</Text>
            </View>
          </View>
          <View className="bg-white/70 px-4 py-3 rounded-xl mt-1">
            <Text className="text-gray-700 text-base leading-relaxed">
              Please select a resume to view matching advisors based on your profile and career goals.
            </Text>
          </View>
        </View>
        <View className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
      </View>
      
      {loadingResumes ? (
        <View className="items-center justify-center py-10">
          <ActivityIndicator size="small" color="#1E3A8A" />
          <Text className="text-gray-500 mt-2">Loading your resumes...</Text>
        </View>
      ) : resumes.length === 0 ? (
        <View className="items-center justify-center py-10">
          <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
          <Text className="text-gray-500 mt-2 text-center">No resumes found</Text>
          <TouchableOpacity 
            className="mt-6 bg-primary px-6 py-3 rounded-lg"
            onPress={() => router.push("/resume/upload" as any)}
          >
            <Text className="text-white font-medium">Upload Resume</Text>
          </TouchableOpacity>
        </View>
      ) : (
        resumes.map(resume => (
          <TouchableOpacity
            key={resume._id}
            className="mb-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            onPress={() => handleResumeSelect(resume._id, resume.title || "Untitled Resume")}
          >
            <View className="flex-row items-center">
              <View className="h-10 w-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                <Ionicons name="document" size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-medium text-gray-800">{resume.title || "Untitled Resume"}</Text>
                <Text className="text-sm text-gray-500">
                  {resume.createdAt ? `Uploaded ${new Date(resume.createdAt).toLocaleDateString()}` : ""}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
  
  // Main render
  return (
    <>
      <ScrollView 
        className="flex-1 bg-gray-50"
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#1E3A8A"]} // Android
            tintColor="#1E3A8A" // iOS
          />
        }
      >
        {!resumeId ? (
          // If no resumeId provided, show the resume selection UI
          renderResumeSelection()
        ) : (
          // If resumeId is provided, show the regular matching UI
          <>
            <View className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <View className="px-5 py-6">
                <View className="flex-row items-center mb-3">
                  <View className="h-10 w-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                    <Ionicons name="people" size={20} color="#1E3A8A" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-gray-800">Advisor Matches</Text>
                    {selectedResumeTitle && (
                      <Text className="text-primary font-medium mt-1">
                        for {selectedResumeTitle}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity 
                    className="bg-blue-50 p-2 rounded-full"
                    onPress={() => router.push("/matching" as any)}
                  >
                    <Ionicons name="list" size={20} color="#1E3A8A" />
                  </TouchableOpacity>
                </View>
                <Text className="text-gray-600 text-base mt-1">
                  {needsAnalysis 
                    ? " This resume hasn't been analyzed yet. Please analyze it to find matching advisors." 
                    : "We've analyzed your resume and found these advisors who match your profile and career goals."}
                </Text>
                {matchResult && (
                  <View className="mt-3 bg-blue-50 px-3 py-2 rounded-lg">
                    <Text className="text-blue-700 font-medium text-sm">
                      {needsAnalysis 
                        ? "Resume not analyzed yet" 
                        : `${matchResult.advisors.length} advisor${matchResult.advisors.length !== 1 ? 's' : ''} found`}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            
            {/* Sorting control */}
            {!isLoading && !error && !needsAnalysis && matchResult && matchResult.advisors.length > 0 && (
              <View className="flex-row justify-end mb-4">
                <TouchableOpacity 
                  className="flex-row items-center bg-white px-3 py-2 rounded-lg border border-gray-200"
                  onPress={toggleSortOrder}
                >
                  <Text className="mr-2 text-gray-600">Sort by Match Score</Text>
                  <Ionicons 
                    name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'} 
                    size={16} 
                    color="#4B5563"
                  />
                </TouchableOpacity>
              </View>
            )}
            
            {/* Content based on state */}
            {(isLoading && !isRefreshing) || (!error && !matchResult && !needsAnalysis) ? renderLoading() : 
              needsAnalysis ? renderNeedsAnalysis() :
                error ? renderError() : 
                  matchResult && matchResult.advisors.length === 0 ? renderNoMatches() : 
                    renderAdvisors()}
          </>
        )}
      </ScrollView>
      
      {/* Render the advisor detail modal */}
      <AdvisorDetailModal 
        advisorMatch={selectedAdvisor} 
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          // Allow animation to finish before clearing selected advisor
          setTimeout(() => setSelectedAdvisor(null), 300);
        }}
      />
    </>
  );
}
