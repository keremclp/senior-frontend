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
    StyleSheet,
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
        style={styles.dropdownButton}
        onPress={() => {
          setIsOpen(true);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text className={`${selectedValue ? 'text-gray-800' : 'text-gray-500'}`}>
          {selectedValue || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#6B7280" />
      </TouchableOpacity>
      
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
      
      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white w-full max-h-[80%] rounded-2xl overflow-hidden" style={styles.modalContent}>
            <View className="p-5 border-b border-gray-100">
              <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl">
                <Ionicons name="search" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 text-gray-800 ml-2"
                  placeholder="Search..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#6B7280" />
                  </TouchableOpacity>
                ) : null}
              </View>
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
                  <Text className={`${value === selectedValue ? 'text-primary font-medium' : 'text-gray-800'}`}>
                    {value}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="p-8 items-center justify-center">
                  <Ionicons name="search-outline" size={40} color="#D1D5DB" />
                  <Text className="text-gray-500 mt-3 text-center">No results found</Text>
                </View>
              }
              style={{ maxHeight: 300 }}
            />
            
            <TouchableOpacity
              className="p-4 bg-gray-50"
              onPress={() => {
                setIsOpen(false);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={styles.closeButton}
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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) {
        return;
      }
      
      setFile(result.assets[0]);
      setFileError('');
      
      // Success feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick document');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
    
    if (!isValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Resume uploaded successfully');
      router.replace('/resume');
    } catch (err: any) {
      console.error('Upload error:', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800">Upload Resume</Text>
          <Text className="text-gray-600 mt-2">
            Upload your resume to find matching advisors
          </Text>
        </View>
        
        <View className="bg-white rounded-2xl shadow-sm p-6 mb-6" style={styles.formCard}>
          <View className="space-y-5">
            {/* Title Input */}
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">Resume Title (Optional)</Text>
              <TextInput
                className={`border rounded-xl p-4 bg-white ${titleError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. My Software Engineering Resume"
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                style={styles.textInput}
              />
              {titleError ? <Text className="text-red-500 text-sm mt-2">{titleError}</Text> : null}
            </View>
            
            {/* University Dropdown */}
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">University</Text>
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
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">Engineering Field</Text>
              <SearchableDropdown
                data={ENGINEERING_DISCIPLINES}
                placeholder="Select your engineering field"
                selectedValue={selectedFieldValue}
                onSelect={handleSelectField}
                error={fieldError}
              />
            </View>
            
            {/* File Upload */}
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">Resume File</Text>
              <View 
                className={`border rounded-xl p-5 ${fileError ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
                style={styles.fileUpload}
              >
                {file ? (
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center flex-1 pr-2">
                      <View className="bg-blue-100 p-2 rounded-lg mr-3">
                        <Ionicons name="document-text" size={24} color="#1E3A8A" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-800 font-medium" numberOfLines={1}>
                          {file.name}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          {(file.size / 1024).toFixed(1)}KB
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={() => {
                        setFile(null);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      className="bg-gray-100 p-2 rounded-full"
                    >
                      <Ionicons name="close" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={pickDocument} className="items-center justify-center py-4">
                    <View className="bg-blue-100 rounded-full p-3 mb-3">
                      <Ionicons name="cloud-upload-outline" size={28} color="#1E3A8A" />
                    </View>
                    <Text className="text-gray-700 font-medium">Select PDF or Word document</Text>
                    <Text className="text-gray-500 text-xs mt-1">Click to browse files</Text>
                  </TouchableOpacity>
                )}
              </View>
              {fileError ? (
                <Text className="text-red-500 text-sm mt-2">{fileError}</Text>
              ) : (
                <Text className="text-gray-500 text-xs mt-2 ml-1">
                  Accepted file types: PDF, DOC, DOCX
                </Text>
              )}
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          className={`py-4 rounded-xl ${isLoading ? 'bg-gray-400' : 'bg-primary'}`}
          style={isLoading ? styles.disabledButton : styles.submitButton}
          onPress={handleUpload}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text className="text-center text-white font-bold text-lg">Upload Resume</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  formCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  textInput: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  fileUpload: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  dropdownButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  submitButton: {
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modalContent: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  closeButton: {
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  }
});
