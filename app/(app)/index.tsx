import { useAuth } from "@/context/auth-context";
import { Link } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        <View className="bg-primary rounded-lg p-6 mb-6">
          <Text className="text-white text-2xl font-bold mb-2">
            Welcome, {user?.name}
          </Text>
          <Text className="text-white opacity-80">
            Use this dashboard to manage your resumes and view advisor matches.
          </Text>
        </View>

        <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <Text className="text-lg font-semibold mb-4">Quick Actions</Text>
          
          <View className="flex-row flex-wrap">
            <Link href={"/resume/upload" as any} asChild>
              <TouchableOpacity className="bg-blue-50 p-4 rounded-lg w-[48%] mr-[4%] mb-4">
                <Text className="text-primary font-medium text-center">Upload Resume</Text>
              </TouchableOpacity>
            </Link>
            
            <Link href={"/resume" as any} asChild>
              <TouchableOpacity className="bg-blue-50 p-4 rounded-lg w-[48%] mb-4">
                <Text className="text-primary font-medium text-center">View Resumes</Text>
              </TouchableOpacity>
            </Link>
            
            <Link href={"/matching" as any} asChild>
              <TouchableOpacity className="bg-blue-50 p-4 rounded-lg w-[48%] mr-[4%]">
                <Text className="text-primary font-medium text-center">View Matches</Text>
              </TouchableOpacity>
            </Link>
            
            <Link href={"/profile" as any} asChild>
              <TouchableOpacity className="bg-blue-50 p-4 rounded-lg w-[48%]">
                <Text className="text-primary font-medium text-center">Profile Settings</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-lg font-semibold mb-4">How It Works</Text>
          
          <View className="space-y-4">
            <View className="flex-row">
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Text className="text-primary font-bold">1</Text>
              </View>
              <View className="flex-1">
                <Text className="font-medium">Upload Your Resume</Text>
                <Text className="text-gray-600 text-sm">Upload your resume in PDF or DOCX format.</Text>
              </View>
            </View>
            
            <View className="flex-row">
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Text className="text-primary font-bold">2</Text>
              </View>
              <View className="flex-1">
                <Text className="font-medium">Process Your Resume</Text>
                <Text className="text-gray-600 text-sm">We'll analyze your resume for key skills and experiences.</Text>
              </View>
            </View>
            
            <View className="flex-row">
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Text className="text-primary font-bold">3</Text>
              </View>
              <View className="flex-1">
                <Text className="font-medium">Get Matched with Advisors</Text>
                <Text className="text-gray-600 text-sm">View your advisor matches based on your resume profile.</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
