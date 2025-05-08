import ENGINEERING_DISCIPLINES from '@/constant/enums/engineering-fields';
import UNIVERSITIES from '@/constant/enums/university-names.enum';
import { useAuth } from '@/context/auth-context';
import { resumeApi } from '@/lib/api/resume';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface SearchableDropdownProps {
  data: { [key: string]: string };
  placeholder: string;
  selectedValue: string;
  onSelect: (key: string, value: string) => void;
  error?: string;
}

const SearchableDropdown = ({
  data,
  placeholder,
  selectedValue,
  onSelect,
  error,
}: SearchableDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<[string, string][]>([]);
  
  // Convert the data object to array of [key, value] pairs for searching
  const dataArray = Object.entries(data);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(dataArray);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = dataArray.filter(([_, value]) => 
        value.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, data]);
  
  const handleSelect = (key: string, value: string) => {
    onSelect(key, value);
    setIsOpen(false);
    setSearchQuery('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  return (
    <View className="mb-4">
      <TouchableOpacity 
        className={`border rounded-lg p-4 bg-white flex-row justify-between items-center ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        onPress={() => setIsOpen(true)}
      >
        <Text className={selectedValue ? 'text-black' : 'text-gray-500'}>
          {selectedValue || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#6B7280" />
      </TouchableOpacity>
      
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
      
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 bg-black/30 justify-center items-center p-4">
          <View className="bg-white w-full max-h-[80%] rounded-lg overflow-hidden">
            <View className="p-4 border-b border-gray-200">
              <TextInput
                className="bg-gray-100 px-4 py-2 rounded-lg"
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>
            
            <FlatList
              data={filteredItems}
              keyExtractor={([key]) => key}
              renderItem={({ item: [key, value] }) => (
                <TouchableOpacity
                  className={`p-4 border-b border-gray-100 ${
                    value === selectedValue ? 'bg-blue-50' : ''
                  }`}
                  onPress={() => handleSelect(key, value)}
                >
                  <Text className={value === selectedValue ? 'text-primary font-medium' : ''}>
                    {value}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="p-4 items-center">
                  <Text className="text-gray-500">No results found</Text>
                </View>
              }
            />
            
            <TouchableOpacity
              className="p-4 border-t border-gray-200 bg-gray-50"
              onPress={() => setIsOpen(false)}
            >
              <Text className="text-center font-medium text-primary">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default function ResumeUploadScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [selectedUniversityKey, setSelectedUniversityKey] = useState('');
  const [selectedUniversityValue, setSelectedUniversityValue] = useState('');
  const [selectedFieldKey, setSelectedFieldKey] = useState('');
  const [selectedFieldValue, setSelectedFieldValue] = useState('');
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  
  const [titleError, setTitleError] = useState('');
  const [universityError, setUniversityError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [fileError, setFileError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle file selection
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) {
        return;
      }
      
      setFile(result.assets[0]);
      setFileError('');
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick document');
    }
  };
  
  // Form validation
  const validateForm = () => {
    let isValid = true;
    
    // Validate title (optional, but if provided should not be just whitespace)
    if (title && !title.trim()) {
      setTitleError('Title cannot be empty');
      isValid = false;
    } else {
      setTitleError('');
    }
    
    // Validate university selection
    if (!selectedUniversityKey) {
      setUniversityError('Please select a university');
      isValid = false;
    } else {
      setUniversityError('');
    }
    
    // Validate field selection
    if (!selectedFieldKey) {
      setFieldError('Please select an engineering field');
      isValid = false;
    } else {
      setFieldError('');
    }
    
    // Validate file
    if (!file) {
      setFileError('Please select a resume file');
      isValid = false;
    } else {
      setFileError('');
    }
    
    return isValid;
  };
  
  // Handle form submission
  const handleUpload = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create a FormData object
      const formData = new FormData();
      
      if (title.trim()) {
        formData.append('title', title.trim());
      }
      
      formData.append('university', selectedUniversityKey);
      formData.append('engineeringField', selectedFieldKey);
      
      // Add the file to FormData
      if (file) {
        const fileUri = Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri;
        
        formData.append('resume', {
          uri: fileUri,
          name: file.name,
          type: file.mimeType,
        } as any);
      }
      
      // Send the request
      const response = await resumeApi.uploadResume({
        resume: formData as any,
        university: selectedUniversityKey,
        engineeringField: selectedFieldKey,
        title: title.trim() || undefined,
      });
      
      Alert.alert('Success', 'Resume uploaded successfully');
      router.replace('/resume');
    } catch (err: any) {
      console.error('Upload error:', err);
      Alert.alert('Error', err?.message || 'Failed to upload resume');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle selecting university
  const handleSelectUniversity = (key: string, value: string) => {
    setSelectedUniversityKey(key);
    setSelectedUniversityValue(value);
    setUniversityError('');
  };
  
  // Handle selecting engineering field
  const handleSelectField = (key: string, value: string) => {
    setSelectedFieldKey(key);
    setSelectedFieldValue(value);
    setFieldError('');
  };
  
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1 p-6">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Upload Resume</Text>
          <Text className="text-gray-600 mt-1">
            Upload your resume to find matching advisors
          </Text>
        </View>
        
        <View className="space-y-4">
          {/* Title Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">Resume Title (Optional)</Text>
            <TextInput
              className={`border rounded-lg p-4 bg-white ${titleError ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g. My Software Engineering Resume"
              value={title}
              onChangeText={setTitle}
            />
            {titleError ? <Text className="text-red-500 text-sm mt-1">{titleError}</Text> : null}
          </View>
          
          {/* University Dropdown */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">University</Text>
            <SearchableDropdown
              data={UNIVERSITIES}
              placeholder="Select your university"
              selectedValue={selectedUniversityValue}
              onSelect={handleSelectUniversity}
              error={universityError}
            />
          </View>
          
          {/* Engineering Field Dropdown */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Engineering Field</Text>
            <SearchableDropdown
              data={ENGINEERING_DISCIPLINES}
              placeholder="Select your engineering field"
              selectedValue={selectedFieldValue}
              onSelect={handleSelectField}
              error={fieldError}
            />
          </View>
          
          {/* File Upload */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">Resume File</Text>
            <View className={`border rounded-lg p-4 bg-white ${fileError ? 'border-red-500' : 'border-gray-300'}`}>
              {file ? (
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center flex-1 pr-2">
                    <Ionicons name="document-text" size={24} color="#1E3A8A" />
                    <Text className="ml-2 text-gray-800 flex-1" numberOfLines={1}>{file.name}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setFile(null)}>
                    <Ionicons name="close-circle" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={pickDocument} className="flex-row items-center justify-center">
                  <Ionicons name="cloud-upload-outline" size={24} color="#6B7280" />
                  <Text className="text-gray-500 ml-2">Select PDF or Word document</Text>
                </TouchableOpacity>
              )}
            </View>
            {fileError ? <Text className="text-red-500 text-sm mt-1">{fileError}</Text> : null}
            
            <Text className="text-gray-500 text-xs mt-2">
              Accepted file types: PDF, DOC, DOCX
            </Text>
          </View>
          
          <TouchableOpacity
            className={`${isLoading ? 'bg-gray-400' : 'bg-primary'} py-4 rounded-lg mt-6`}
            onPress={handleUpload}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-center text-white font-semibold">Upload Resume</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
