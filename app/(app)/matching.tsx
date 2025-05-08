import AdvisorCard from '@/components/advisor/AdvisorCard';
import AdvisorDetailModal from '@/components/advisor/AdvisorDetailModal';
import { AdvisorMatch, MatchResult, matchingApi } from '@/lib/api/matching';
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
  
  // State for modal
  const [selectedAdvisor, setSelectedAdvisor] = useState<AdvisorMatch | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Fetch match results
  const fetchMatchResults = async (refresh = false) => {
    if (!resumeId) {
      setError("No resume selected");
      setIsLoading(false);
      return;
    }
    
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    setError(null);
    
    try {
      const response = await matchingApi.getMatchResults(resumeId as string);
      setMatchResult(response.data);
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
    fetchMatchResults();
  }, [resumeId]);
  
  // Handle refresh
  const onRefresh = () => {
    fetchMatchResults(true);
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
  
  const renderError = () => (
    <View className="items-center justify-center py-20">
      <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
      <Text className="text-red-500 mt-2 text-center">{error}</Text>
      <TouchableOpacity 
        className="mt-4 bg-gray-200 px-4 py-2 rounded-lg"
        onPress={() => fetchMatchResults()}
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
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Advisor Matches</Text>
          <Text className="text-gray-600 mt-1">
            Advisors who match your resume profile
          </Text>
        </View>
        
        {/* Sorting control */}
        {!isLoading && !error && matchResult && matchResult.advisors.length > 0 && (
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
        
        {isLoading && !isRefreshing ? renderLoading() : (
          error ? renderError() : (
            !matchResult || matchResult.advisors.length === 0 ? renderNoMatches() : renderAdvisors()
          )
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
