import { AdvisorMatch } from "@/lib/api/matching";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AdvisorCardProps {
  match: AdvisorMatch;
  onPress: () => void;
}

export default function AdvisorCard({ match, onPress }: AdvisorCardProps) {
  const { advisor, matchScore, matchingAreas } = match;
  
  // Get score color based on percentage
  const getScoreColor = (score: number) => {
    const numericScore = Number(score) || 0;
    
    if (numericScore >= 75) return '#10B981'; // green-500
    if (numericScore >= 60) return '#3B82F6'; // blue-500
    if (numericScore >= 50) return '#FBBF24'; // yellow-500
    if (numericScore >= 25) return '#F97316'; // orange-500
    return '#EF4444'; // red-500
  };
  
  // Get score text based on percentage
  const getScoreText = (score: number) => {
    const numericScore = Number(score);
    
    if (numericScore >= 75) return "Excellent";
    if (numericScore >= 60) return "Good";
    if (numericScore >= 50) return "Average";
    if (numericScore >= 25) return "Low";
    return "Poor";
  };
  
  // Get icon name based on score
  const getScoreIcon = (score: number) => {
    const numericScore = Number(score);
    
    if (numericScore >= 75) return "star";
    if (numericScore >= 50) return "thumbs-up";
    if (numericScore >= 25) return "checkmark-circle";
    return "alert-circle";
  };
  
  const scoreColor = getScoreColor(matchScore);
  
  return (
    <TouchableOpacity 
      onPress={onPress}   
      className="bg-white rounded-xl shadow-sm mb-5 overflow-hidden"
      style={styles.cardContainer}
      activeOpacity={0.9}
    >
      {/* Score indicator ribbon at top of card */}
      <View style={[styles.ribbon, { backgroundColor: scoreColor }]}>
        <Text style={styles.ribbonText}>{getScoreText(matchScore)} Match</Text>
      </View>
      
      <View style={styles.cardContent}>
        <View className="flex-row justify-between items-center mb-4">
          <Text style={styles.advisorName} numberOfLines={2}>
            {advisor.prefix ? `${advisor.prefix} ${advisor.name}` : advisor.name}
          </Text>
          
          {/* Enhanced score circle */}
          <View style={[styles.scoreContainer, { borderColor: scoreColor }]}>
            <Text style={[styles.scoreNumber, { color: scoreColor }]}>{matchScore}</Text>
            <Text style={[styles.scorePercentage, { color: scoreColor }]}>%</Text>
            <View style={[styles.scoreIconContainer, { backgroundColor: scoreColor }]}>
              <Ionicons name={getScoreIcon(matchScore)} size={12} color="white" />
            </View>
          </View>
        </View>
        
        {/* University info with location icon */}
        <View style={styles.universityContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="school-outline" size={16} color="#4B5563" />
          </View>
          <Text style={styles.universityText}>{advisor.university}</Text>
        </View>
        
        {/* Department info with building icon */}
        <View style={styles.departmentContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="business-outline" size={16} color="#4B5563" />
          </View>
          <Text style={styles.departmentText}>{advisor.secondInfo || advisor.info || advisor.department || ""}</Text>
        </View>
        
        {advisor.tags && advisor.tags.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="ribbon-outline" size={16} color="#4B5563" style={{marginRight: 6}} />
              <Text style={styles.sectionTitle}>Expertise</Text>
            </View>
            <View style={styles.tagsContainer}>
              {advisor.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.expertiseTag}>
                  <Text style={styles.expertiseTagText}>{tag}</Text>
                </View>
              ))}
              {advisor.tags.length > 3 && (
                <View style={styles.moreTag}>
                  <Text style={styles.moreTagText}>+{advisor.tags.length - 3}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="git-merge-outline" size={16} color="#4B5563" style={{marginRight: 6}} />
            <Text style={styles.sectionTitle}>Matching Areas</Text>
            <Text style={styles.countBadge}>({matchingAreas.length})</Text>
          </View>
          {matchingAreas.length > 0 ? (
            <View style={styles.tagsContainer}>
              {matchingAreas.slice(0, 2).map((area, index) => (
                <View key={index} style={styles.matchingAreaTag}>
                  <Text style={styles.matchingAreaTagText}>{area}</Text>
                </View>
              ))}
              {matchingAreas.length > 2 && (
                <View style={styles.moreTag}>
                  <Text style={styles.moreTagText}>+{matchingAreas.length - 2}</Text>
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.noMatchingText}>No specific matching areas</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#EBEDF0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 16,
  },
  cardContent: {
    padding: 18,
  },
  advisorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 10,
    letterSpacing: 0.3,
  },
  ribbon: {
    position: 'absolute',
    top: 12,
    right: -30,
    paddingHorizontal: 30,
    paddingVertical: 6,
    transform: [{ rotate: '45deg' }],
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  ribbonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  scorePercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -5,
  },
  scoreIconContainer: {
    position: 'absolute',
    bottom: -5,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  universityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
  },
  departmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
  },
  iconContainer: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  universityText: {
    color: '#4B5563',
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  departmentText: {
    color: '#4B5563',
    fontSize: 14,
    flex: 1,
    lineHeight: 18,
  },
  sectionContainer: {
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 12,
    paddingBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  countBadge: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
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
    fontSize: 12,
    fontWeight: '600',
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
  },
  matchingAreaTagText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
  },
  moreTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  moreTagText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
  noMatchingText: {
    color: '#6B7280',
    fontSize: 13,
    fontStyle: 'italic',
  }
});
