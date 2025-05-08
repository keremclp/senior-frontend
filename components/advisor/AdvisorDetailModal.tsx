import { AdvisorMatch } from "@/lib/api/matching";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import React from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    if (score >= 75) return "#10B981"; // green-500
    if (score >= 60) return "#3B82F6"; // blue-500
    if (score >= 50) return "#FBBF24"; // yellow-500
    if (score >= 25) return "#F97316"; // orange-500
    return "#EF4444"; // red-500
  };

  // Get score text based on percentage
  const getScoreText = (score: number) => {
    if (score >= 75) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 50) return "Average";
    if (score >= 25) return "Low";
    return "Poor";
  };
  
  // Get icon name based on score
  const getScoreIcon = (score: number) => {
    if (score >= 75) return "star";
    if (score >= 50) return "thumbs-up";
    if (score >= 25) return "checkmark-circle";
    return "alert-circle";
  };

  const handleContact = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // In a real app, this would open an email client or similar
  };
  
  const scoreColor = getScoreColor(matchScore);
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header with close button */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Advisor Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Score ribbon */}
            <View style={[styles.ribbon, { backgroundColor: scoreColor }]}>
              <Text style={styles.ribbonText}>{getScoreText(matchScore)} Match</Text>
            </View>
            
            {/* Advisor name and score */}
            <View style={styles.profileHeader}>
              <View style={styles.nameContainer}>
                <Text style={styles.advisorName}>{advisor.name}</Text>
                <Text style={styles.advisorPrefix}>{advisor.prefix || "Advisor"}</Text>
              </View>
              
              <View style={[styles.scoreContainer, { borderColor: scoreColor }]}>
                <Text style={[styles.scoreNumber, { color: scoreColor }]}>{matchScore}</Text>
                <Text style={[styles.scorePercentage, { color: scoreColor }]}>%</Text>
                <View style={[styles.scoreIconContainer, { backgroundColor: scoreColor }]}>
                  <Ionicons name={getScoreIcon(matchScore)} size={12} color="white" />
                </View>
              </View>
            </View>
            
            {/* Contact button */}
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleContact}
            >
              <View style={styles.contactButtonContent}>
                <Ionicons name="mail-outline" size={20} color="#2563EB" />
                <Text style={styles.contactButtonText}>{advisor.email}</Text>
                <Ionicons name="open-outline" size={18} color="#2563EB" />
              </View>
            </TouchableOpacity>
            
            {/* University section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="school-outline" size={16} color="#4B5563" />
                </View>
                <Text style={styles.sectionTitle}>University</Text>
              </View>
              <Text style={styles.sectionContent}>{advisor.university}</Text>
            </View>
            
            {/* Department section */}
            {advisor.secondInfo && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="business-outline" size={16} color="#4B5563" />
                  </View>
                  <Text style={styles.sectionTitle}>Department</Text>
                </View>
                <Text style={styles.sectionContent}>{advisor.secondInfo}</Text>
              </View>
            )}
            
            {/* Research area section */}
            {advisor.info && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="flask-outline" size={16} color="#4B5563" />
                  </View>
                  <Text style={styles.sectionTitle}>Research Area</Text>
                </View>
                <Text style={styles.sectionContent}>{advisor.info}</Text>
              </View>
            )}
            
            {/* Expertise tags section */}
            {advisor.tags && advisor.tags.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="ribbon-outline" size={16} color="#4B5563" />
                  </View>
                  <Text style={styles.sectionTitle}>Expertise</Text>
                  <Text style={styles.countBadge}>({advisor.tags.length})</Text>
                </View>
                <View style={styles.tagsContainer}>
                  {advisor.tags.map((tag, index) => (
                    <View key={index} style={styles.expertiseTag}>
                      <Text style={styles.expertiseTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {/* Matching areas section */}
            <View style={[styles.sectionContainer, styles.matchingContainer]}>
              <View style={styles.sectionHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="git-merge-outline" size={16} color="#4B5563" />
                </View>
                <Text style={styles.sectionTitle}>Matching Areas</Text>
                <Text style={styles.countBadge}>({matchingAreas.length})</Text>
              </View>
              {matchingAreas.length > 0 ? (
                <View style={styles.tagsContainer}>
                  {matchingAreas.map((area, index) => (
                    <View key={index} style={styles.matchingAreaTag}>
                      <Ionicons name="checkmark-circle" size={14} color="#059669" style={{marginRight: 4}} />
                      <Text style={styles.matchingAreaTagText}>{area}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noMatchingText}>No specific matching areas found</Text>
              )}
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.closeFullButton}
              onPress={onClose}
            >
              <Text style={styles.closeFullButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
  },
  ribbon: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  ribbonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  nameContainer: {
    flex: 1,
    paddingRight: 16,
  },
  advisorName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  advisorPrefix: {
    fontSize: 15,
    color: '#6B7280',
  },
  scoreContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  scoreNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  scorePercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: -6,
  },
  scoreIconContainer: {
    position: 'absolute',
    bottom: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  contactButton: {
    backgroundColor: '#EBF5FF',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  contactButtonText: {
    flex: 1,
    color: '#2563EB',
    fontSize: 15,
    marginLeft: 10,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  matchingContainer: {
    backgroundColor: '#F7FDF9',
    borderColor: '#E6F6EE',
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  countBadge: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  sectionContent: {
    color: '#4B5563',
    fontSize: 15,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  expertiseTag: {
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  expertiseTagText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '500',
  },
  matchingAreaTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchingAreaTagText: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '500',
  },
  noMatchingText: {
    color: '#6B7280',
    fontSize: 14,
    fontStyle: 'italic',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    padding: 16,
  },
  closeFullButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  closeFullButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
