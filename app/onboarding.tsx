import React, { useState } from 'react';
import { View, Text, Image, FlatList, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import Button from './components/ui/Button';

const { width } = Dimensions.get('window');

type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Find Your Perfect Advisor',
    description: 'Connect with academic advisors who match your interests, skills, and career goals.',
    image: 'https://placehold.co/600x400/374151/FFFFFF?text=Advisor+Matching',
  },
  {
    id: '2',
    title: 'Upload Your Resume',
    description: 'Our AI analyzes your resume to identify your strengths and interests.',
    image: 'https://placehold.co/600x400/374151/FFFFFF?text=Resume+Upload',
  },
  {
    id: '3',
    title: 'Get Personalized Matches',
    description: 'Receive personalized advisor recommendations based on your unique profile.',
    image: 'https://placehold.co/600x400/374151/FFFFFF?text=AI+Matching',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const renderItem = ({ item }: { item: OnboardingSlide }) => (
    <View style={{ width }} className="items-center justify-center px-4">
      <Image
        source={{ uri: item.image }}
        className="w-full rounded-xl mb-8"
        style={{ height: 250 }}
        resizeMode="cover"
      />
      <Text className="text-light-100 text-2xl font-bold text-center mb-2">
        {item.title}
      </Text>
      <Text className="text-light-300 text-base text-center">
        {item.description}
      </Text>
    </View>
  );
  
  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSkip();
    }
  };
  
  const handleSkip = () => {
    router.replace('/auth/login');
  };
  
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1">
        <View className="flex-row justify-end p-4">
          <Button
            title="Skip"
            onPress={handleSkip}
            variant="secondary"
            style={{ paddingHorizontal: 16, paddingVertical: 8 }}
            textStyle={{ fontSize: 14 }}
          />
        </View>
        
        <FlatList
          data={slides}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
        />
        
        <View className="p-4">
          <View className="flex-row justify-center space-x-2 my-4">
            {slides.map((_, index) => (
              <View 
                key={index} 
                className={`h-2 rounded-full ${
                  index === currentIndex ? 'bg-accent w-4' : 'bg-dark-100 w-2'
                }`} 
              />
            ))}
          </View>
          
          <Button
            title={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
            onPress={handleNext}
            icon={currentIndex === slides.length - 1 ? "arrow-forward" : undefined}
            iconPosition="right"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}