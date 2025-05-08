import { AdvisorMatch } from "@/lib/api/matching";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface AdvisorDetailModalProps {
  advisorMatch: AdvisorMatch | null;
  visible: boolean;
  onClose: () => void;
}

export default function AdvisorDetailModal({ 
  advisorMatch, 
  visible, 
  onClose 
}: AdvisorDetailModalProps) {
  
  if (!advisorMatch) return null;
  
  const { advisor, matchScore, matchingAreas } = advisorMatch;
  
  // Function to determine the color based on the match score
  const getScoreColor = (score: number) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const handleContact = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // In a real app, this would open an email client or similar
    // For now, we'll just use this as a placeholder
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          <ScrollView className="pt-6 px-6">
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-1 mr-4">
                <Text className="text-2xl font-bold text-gray-800">{advisor.name}</Text>
                <Text className="text-gray-500 mt-1">{advisor.prefix || "Advisor"}</Text>
              </View>
              <View className={`${getScoreColor(matchScore)} rounded-full w-16 h-16 items-center justify-center`}>
                <Text className="text-white font-bold text-xl">{matchScore}%</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              className="bg-blue-50 p-3 rounded-lg flex-row items-center mb-6"
              onPress={handleContact}
            >
              <Ionicons name="mail-outline" size={20} color="#1E3A8A" />
              <Text className="text-primary ml-2 flex-1">{advisor.email}</Text>
              <Ionicons name="open-outline" size={20} color="#1E3A8A" />
            </TouchableOpacity>
            
            <View className="border-t border-gray-100 pt-4">
              <Text className="font-medium text-gray-800 mb-2">University</Text>
              <Text className="text-gray-600 mb-4">{advisor.university}</Text>
              
              {advisor.secondInfo && (
                <>
                  <Text className="font-medium text-gray-800 mb-2">Department</Text>
                  <Text className="text-gray-600 mb-4">{advisor.secondInfo}</Text>
                </>
              )}
              
              {advisor.info && (
                <>
                  <Text className="font-medium text-gray-800 mb-2">Research Area</Text>
                  <Text className="text-gray-600 mb-4">{advisor.info}</Text>
                </>
              )}
              
              {advisor.tags && advisor.tags.length > 0 && (
                <>
                  <Text className="font-medium text-gray-800 mb-2">Expertise</Text>
                  <View className="flex-row flex-wrap mb-4">
                    {advisor.tags.map((tag, index) => (
                      <View key={index} className="bg-blue-50 px-3 py-1 rounded-full mr-2 mb-2">
                        <Text className="text-primary text-sm">{tag}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
            
            <View className="border-t border-gray-100 pt-4 mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-4">Matching Areas</Text>
              {matchingAreas.length > 0 ? (
                <View className="space-y-2">
                  {matchingAreas.map((area, index) => (
                    <View key={index} className="bg-green-50 px-3 py-2 rounded-lg flex-row items-center">
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                      <Text className="text-gray-800 ml-2">{area}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-gray-500">No specific matching areas found</Text>
              )}
            </View>
          </ScrollView>
          
          <View className="border-t border-gray-100 p-4">
            <TouchableOpacity 
              className="bg-primary py-3 rounded-lg"
              onPress={onClose}
            >
              <Text className="text-center text-white font-medium">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
