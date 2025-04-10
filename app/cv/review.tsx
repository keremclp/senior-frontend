import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../components/ui/Button';

type ResumeAnalysis = {
  skills: string[];
  education: string[];
  experience: string[];
  suggestedFields: string[];
  matchScore: number;
};

export default function CVReviewScreen() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Mock loading analysis data from API
    const loadAnalysis = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock analysis data
        setAnalysis({
          skills: ['JavaScript', 'React Native', 'Machine Learning', 'Data Analysis', 'Python'],
          education: ['Bachelor of Science, Computer Science', 'Master of Science, AI and Machine Learning'],
          experience: [
            'Software Engineer Intern at Tech Co',
            'Research Assistant, University Lab',
            'Teaching Assistant, Introduction to Computer Science'
          ],
          suggestedFields: ['Computer Science', 'Data Science', 'Artificial Intelligence'],
          matchScore: 85
        });
      } catch (error) {
        console.error('Failed to load analysis:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAnalysis();
  }, []);
  
  const renderSection = (title: string, items: string[]) => (
    <View className="mb-6">
      <Text className="text-light-100 text-lg font-medium mb-2">{title}</Text>
      <View className="bg-dark-100 rounded-lg p-4">
        {items.map((item, index) => (
          <View 
            key={index} 
            className="flex-row items-center py-2"
            style={{ borderBottomWidth: index < items.length - 1 ? 1 : 0, borderBottomColor: '#374151' }}
          >
            <View className="w-2 h-2 rounded-full bg-accent mr-3" />
            <Text className="text-light-300">{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
  
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="flex-row items-center mb-6">
            <Button
              title=""
              onPress={() => router.back()}
              icon="arrow-back"
              variant="secondary"
              style={{ width: 44, height: 44, borderRadius: 22 }}
            />
            <Text className="text-light-100 text-2xl font-bold ml-4">Resume Analysis</Text>
          </View>
          
          {isLoading ? (
            <View className="items-center justify-center" style={{ height: 300 }}>
              <ActivityIndicator size="large" color="#60A5FA" />
              <Text className="text-light-300 mt-4">Analyzing your resume...</Text>
            </View>
          ) : analysis ? (
            <>
              <View className="bg-dark-100 rounded-xl p-4 mb-6">
                <Text className="text-light-300 text-base">Match Score</Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-accent text-3xl font-bold">
                    {analysis.matchScore}%
                  </Text>
                  <Text className="text-light-300 ml-2">match with available advisors</Text>
                </View>
              </View>
              
              {renderSection('Skills Identified', analysis.skills)}
              {renderSection('Education', analysis.education)}
              {renderSection('Experience', analysis.experience)}
              {renderSection('Suggested Fields', analysis.suggestedFields)}
              
              <View className="mt-4 mb-8">
                <Button
                  title="View Matched Advisors"
                  onPress={() => router.push('/onboarding')}
                  icon="people-outline"
                />
              </View>
            </>
          ) : (
            <View className="items-center justify-center p-4">
              <Text className="text-light-300 text-center">
                Failed to analyze resume. Please try again.
              </Text>
              <Button
                title="Try Again"
                onPress={() => router.replace('/cv/upload')}
                icon="refresh"
                variant="outline"
                style={{ marginTop: 16 }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
