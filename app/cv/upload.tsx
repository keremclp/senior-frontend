import React, { useState } from 'react';
import { View, Text, SafeAreaView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Button from '../components/ui/Button';
import Header from '../components/ui/Header';
import { Ionicons } from '@expo/vector-icons';

export default function UploadCVScreen() {
  const router = useRouter();
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select document');
    }
  };
  
  const uploadDocument = async () => {
    if (!file) {
      Alert.alert('No File', 'Please select a resume file first');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Mock upload success - in a real app this would call your API
      // const fileContent = await FileSystem.readAsStringAsync(file.uri, {
      //   encoding: FileSystem.EncodingType.Base64,
      // });
      
      // const response = await axios.post('your-api-endpoint/upload-cv', {
      //   name: file.name,
      //   type: file.mimeType,
      //   content: fileContent,
      // });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to the review screen
      router.push('/cv/review');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Could not upload your document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-primary" style={{ paddingTop: 0 }}>
      <Header title="Upload Resume" subtitle="Upload your CV for analysis" />
      
      <View className="p-4">
        <Text className="text-light-300 mb-6">
          Upload your resume (PDF or DOCX) and our AI will analyze it to match you with suitable advisors.
        </Text>
        
        <View className="bg-dark-100 rounded-xl p-6 items-center justify-center mb-6"
              style={{ height: 200 }}>
          {file ? (
            <>
              <Ionicons name="document-text" size={48} color="#60A5FA" />
              <Text className="text-light-100 text-lg mt-2">{file.name}</Text>
              {file.size && (
                <Text className="text-light-300 mt-1">
                  {(file.size / 1024).toFixed(1)} KB
                </Text>
              )}
            </>
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={48} color="#D1D5DB" />
              <Text className="text-light-100 text-lg mt-2">
                Tap to select a file
              </Text>
              <Text className="text-light-300 mt-1">
                PDF or DOCX format
              </Text>
            </>
          )}
        </View>
        
        <View className="space-y-3">
          <Button
            title={file ? "Change File" : "Select Resume File"}
            onPress={pickDocument}
            icon="document-outline"
            variant={file ? "outline" : "primary"}
          />
          
          {file && (
            <Button
              title="Upload and Analyze"
              onPress={uploadDocument}
              icon="cloud-upload-outline"
              loading={isUploading}
              disabled={isUploading}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
