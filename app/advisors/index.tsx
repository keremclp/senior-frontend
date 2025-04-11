import React, { useState } from 'react';
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity,ScrollView } from 'react-native';
import { Redirect, useRouter } from "expo-router";
import { useAuth } from '../context/auth-context';
import Header from '../components/ui/Header';
import { Ionicons } from '@expo/vector-icons';

interface Advisor {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  matchPercentage: number;
  image: string;
}

// Mock data for advisors
const mockAdvisors: Advisor[] = [
  {
    id: '1',
    name: 'Dr. Emily Johnson',
    title: 'Professor of Computer Science',
    expertise: ['Machine Learning', 'AI Ethics', 'Data Science'],
    matchPercentage: 95,
    image: 'https://placehold.co/60x60/374151/FFFFFF?text=EJ',
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    title: 'Associate Professor of Engineering',
    expertise: ['Robotics', 'Control Systems', 'IoT'],
    matchPercentage: 88,
    image: 'https://placehold.co/60x60/374151/FFFFFF?text=MC',
  },
  {
    id: '3',
    name: 'Dr. Sarah Williams',
    title: 'Assistant Professor of Data Science',
    expertise: ['Big Data', 'Statistical Analysis', 'Visualization'],
    matchPercentage: 82,
    image: 'https://placehold.co/60x60/374151/FFFFFF?text=SW',
  },
  {
    id: '4',
    name: 'Prof. David Lee',
    title: 'Professor of Software Engineering',
    expertise: ['Software Architecture', 'DevOps', 'Cloud Computing'],
    matchPercentage: 78,
    image: 'https://placehold.co/60x60/374151/FFFFFF?text=DL',
  },
  {
    id: '5',
    name: 'Dr. Rebecca Martinez',
    title: 'Research Professor of AI',
    expertise: ['Natural Language Processing', 'Computer Vision', 'Deep Learning'],
    matchPercentage: 75,
    image: 'https://placehold.co/60x60/374151/FFFFFF?text=RM',
  },
  {
    id: '1',
    name: 'Dr. Emily Johnson',
    title: 'Professor of Computer Science',
    expertise: ['Machine Learning', 'AI Ethics', 'Data Science'],
    matchPercentage: 95,
    image: 'https://placehold.co/60x60/374151/FFFFFF?text=EJ',
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    title: 'Associate Professor of Engineering',
    expertise: ['Robotics', 'Control Systems', 'IoT'],
    matchPercentage: 88,
    image: 'https://placehold.co/60x60/374151/FFFFFF?text=MC',
  },
  {
    id: '3',
    name: 'Dr. Sarah Williams',
    title: 'Assistant Professor of Data Science',
    expertise: ['Big Data', 'Statistical Analysis', 'Visualization'],
    matchPercentage: 82,
    image: 'https://placehold.co/60x60/374151/FFFFFF?text=SW',
  },
  {
    id: '4',
    name: 'Prof. David Lee',
    title: 'Professor of Software Engineering',
    expertise: ['Software Architecture', 'DevOps', 'Cloud Computing'],
    matchPercentage: 78,
    image: 'https://placehold.co/60x60/374151/FFFFFF?text=DL',
  },
  {
    id: '5',
    name: 'Dr. Rebecca Martinez',
    title: 'Research Professor of AI',
    expertise: ['Natural Language Processing', 'Computer Vision', 'Deep Learning'],
    matchPercentage: 75,
    image: 'https://placehold.co/60x60/374151/FFFFFF?text=RM',
  },
  {
    id: '1',
    name: 'Dr. Emily Johnson',
    title: 'Professor of Computer Science',
    expertise: ['Machine Learning', 'AI Ethics', 'Data Science'],
    matchPercentage: 95,
    image: 'https://placehold.co/60x60/374151/FFFFFF?text=EJ',
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    title: 'Associate Professor of Engineering',
    expertise: ['Robotics', 'Control Systems', 'IoT'],
    matchPercentage: 88,
    image: 'https://placehold.co/60x60/374151/FFFFFF?text=MC',
  },
  {
    id: '3',
    name: 'Dr. Sarah Williams',
    title: 'Assistant Professor of Data Science',
    expertise: ['Big Data', 'Statistical Analysis', 'Visualization'],
    matchPercentage: 82,
    image: 'https://placehold.co/60x60/374151/FFFFFF?text=SW',
  },
  {
    id: '4',
    name: 'Prof. David Lee',
    title: 'Professor of Software Engineering',
    expertise: ['Software Architecture', 'DevOps', 'Cloud Computing'],
    matchPercentage: 78,
    image: 'https://placehold.co/60x60/374151/FFFFFF?text=DL',
  },
  {
    id: '5',
    name: 'Dr. Rebecca Martinez',
    title: 'Research Professor of AI',
    expertise: ['Natural Language Processing', 'Computer Vision', 'Deep Learning'],
    matchPercentage: 75,
    image: 'https://placehold.co/60x60/374151/FFFFFF?text=RM',
  },
];

export default function Advisors() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [advisors] = useState<Advisor[]>(mockAdvisors);
  
  // Show loading state or redirect if not authenticated
  if (isLoading) return null;
  if (!user) return <Redirect href="/auth/login" />;

  // Render each advisor card with proper type annotation
  const renderAdvisor = ({ item }: { item: Advisor }) => (
    <TouchableOpacity 
      className="bg-dark-100 rounded-xl mb-4 p-4"
      onPress={() => router.push(`/advisors`)}
    >
        <ScrollView
            contentContainerStyle={{ paddingBottom: 55 }}
            showsVerticalScrollIndicator={false}
        >
            <View className="flex-row">
                
                <View className="flex-1">
                <Text className="text-light-100 text-lg font-semibold">{item.name}</Text>
                <Text className="text-light-300 text-sm">{item.title}</Text>
                
                <View className="flex-row items-center mt-1 flex-wrap">
                    {item.expertise.map((exp, index) => (
                    <View 
                        key={index} 
                        className="bg-dark-200 rounded-full px-2 py-1 mr-1 mt-1"
                    >
                        <Text className="text-light-300 text-xs">{exp}</Text>
                    </View>
                    ))}
                </View>
                </View>
                <View className="justify-center items-center">
                <View className="bg-dark-200 rounded-full w-12 h-12 items-center justify-center">
                    <Text className="text-accent font-bold">{item.matchPercentage}%</Text>
                </View>
                <Text className="text-light-300 text-xs mt-1">Match</Text>
                </View>
            </View>    
        </ScrollView> 
        
      
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView className="flex-1 bg-primary" style={{ paddingTop: 0 }}>
      <Header 
        title="Matched Advisors" 
        subtitle="Based on your resume"
        rightAction={{
          icon: "options-outline",
          onPress: () => console.log("Filter options pressed")
        }}
      />
      
      <View className="p-4">
        <FlatList
          data={advisors}
          renderItem={renderAdvisor}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-8">
              <Ionicons name="people-outline" size={48} color="#D1D5DB" />
              <Text className="text-light-300 mt-4 text-center">
                No matched advisors found. Upload your resume to get matched.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
