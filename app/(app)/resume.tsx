import ENGINEERING_DISCIPLINES from '@/constant/enums/engineering-fields';
import UNIVERSITIES from '@/constant/enums/university-names.enum';
import { useAlert } from '@/context/alert-context';
import { useAuth } from "@/context/auth-context";
import { matchingApi } from "@/lib/api/matching";
import { Resume, resumeApi } from "@/lib/api/resume";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Dimensions, Easing, Modal, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// LoadingOverlay component to show during analysis
interface LoadingOverlayProps {
  visible: boolean;
}

// Define waypoint interface for natural scanning
interface ScanWaypoint {
  id: string;
  x: number;
  y: number;
  section: string;
  focusLevel: number; // 0-1 where 1 is high focus (longer pause)
  title: string;
}

const LoadingOverlay = ({ visible }: LoadingOverlayProps) => {
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const magnifierPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const magnifierScale = useRef(new Animated.Value(1)).current;
  const magnifierRotation = useRef(new Animated.Value(0)).current;
  const highlightOpacity = useRef(new Animated.Value(0)).current;
  const highlightScale = useRef(new Animated.Value(1)).current;
  const statusTextOpacity = useRef(new Animated.Value(1)).current;
  
  // Resume scan status state
  const [scanStatus, setScanStatus] = useState("Initializing analysis...");
  
  // Track current waypoint for animation state
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const currentAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  
  // Define resume container dimensions for calculation
  const resumeWidth = 240;
  const resumeHeight = 340;
  
  // Create waypoints for more natural, human-like scanning
  // x and y values are relative to the center of the resume container
  const scanWaypoints: ScanWaypoint[] = [
    // Header section scanning
    { id: 'name', x: -80, y: 0, section: 'header', focusLevel: 0.7, title: 'Analyzing personal details...' },
    { id: 'contact', x: 40, y: 10, section: 'header', focusLevel: 0.5, title: 'Reading contact information...' },
    
    // Experience section - multiple points of interest
    { id: 'exp-title', x: -90, y: 60, section: 'experience', focusLevel: 0.6, title: 'Analyzing work experience...' },
    { id: 'exp-company1', x: -40, y: 70, section: 'experience', focusLevel: 0.9, title: 'Evaluating job history...' },
    { id: 'exp-desc1', x: 30, y: 80, section: 'experience', focusLevel: 0.8, title: 'Examining responsibilities...' },
    { id: 'exp-company2', x: -50, y: 100, section: 'experience', focusLevel: 0.7, title: 'Reviewing career progression...' },
    { id: 'exp-desc2', x: 60, y: 110, section: 'experience', focusLevel: 0.8, title: 'Identifying achievements...' },
    
    // Skills section - scan across different skills
    { id: 'skills-title', x: -70, y: 150, section: 'skills', focusLevel: 0.6, title: 'Extracting skill set...' },
    { id: 'skills-1', x: -40, y: 160, section: 'skills', focusLevel: 0.8, title: 'Analyzing technical skills...' },
    { id: 'skills-2', x: 10, y: 165, section: 'skills', focusLevel: 0.7, title: 'Identifying key competencies...' },
    { id: 'skills-3', x: 60, y: 162, section: 'skills', focusLevel: 0.8, title: 'Matching skills to advisors...' },
    
    // Education section
    { id: 'edu-title', x: -80, y: 220, section: 'education', focusLevel: 0.6, title: 'Reading education background...' },
    { id: 'edu-university', x: -30, y: 230, section: 'education', focusLevel: 0.9, title: 'Analyzing academic credentials...' },
    { id: 'edu-degree', x: 40, y: 235, section: 'education', focusLevel: 0.7, title: 'Checking degree relevance...' },
    
    // Projects section
    { id: 'proj-title', x: -90, y: 290, section: 'projects', focusLevel: 0.5, title: 'Evaluating projects...' },
    { id: 'proj-desc', x: -20, y: 300, section: 'projects', focusLevel: 0.8, title: 'Analyzing project achievements...' },
    { id: 'proj-tech', x: 60, y: 315, section: 'projects', focusLevel: 0.7, title: 'Identifying technical expertise...' },
  ];
  
  // Background particles for subtle effect (reduced number)
  const particles = useRef([...Array(12)].map(() => ({
    position: new Animated.ValueXY({ x: 0, y: 0 }),
    opacity: new Animated.Value(0),
    size: Math.random() * 6 + 2, // Smaller particles
    color: [
      '#3B82F6', '#60A5FA', '#DBEAFE', '#EFF6FF',
      '#2563EB', '#1D4ED8'
    ][Math.floor(Math.random() * 6)],
    speed: 0.7 + (Math.random() * 0.6),
  }))).current;
  
  // Function to add slight randomization to waypoint values
  const randomizeWaypoint = (waypoint: ScanWaypoint) => {
    // Add small random variations to create unpredictable movement
    // but keep within reasonable bounds
    const randomX = waypoint.x + (Math.random() * 15 - 7.5); // +/- 7.5px
    const randomY = waypoint.y + (Math.random() * 10 - 5); // +/- 5px
    
    // Slightly randomize focus for unpredictability
    const randomFocus = Math.min(1, Math.max(0.2, 
      waypoint.focusLevel + (Math.random() * 0.2 - 0.1))); // +/- 0.1
    
    return {
      ...waypoint,
      x: randomX,
      y: randomY,
      focusLevel: randomFocus
    };
  };
  
  // Create a natural scanning motion between two waypoints with bezier-like curves
  const createWaypointMotion = (fromWaypoint: ScanWaypoint, toWaypoint: ScanWaypoint, isStarting: boolean = false) => {
    const randomizedTo = randomizeWaypoint(toWaypoint);
    
    // Calculate a control point for bezier-like motion
    // Random offset for the control point creates variation in paths
    const controlPointOffset = {
      x: (Math.random() - 0.5) * 40, // Random x offset
      y: (Math.random() - 0.5) * 30  // Random y offset
    };
    
    // Midpoint between waypoints serves as base for control point
    const midX = (fromWaypoint.x + randomizedTo.x) / 2;
    const midY = (fromWaypoint.y + randomizedTo.y) / 2;
    
    // Generate animation steps
    const motionSteps = [];
    
    // If this is a starting motion, add a brief fade-in and shrink/expand effect
    if (isStarting) {
      motionSteps.push(
        // Start magnifier at the from position
        Animated.timing(magnifierPosition, {
          toValue: { x: fromWaypoint.x, y: fromWaypoint.y },
          duration: 50, // Quick reset
          useNativeDriver: true,
        }),
        
        // Fade in and grow
        Animated.parallel([
          Animated.timing(magnifierScale, {
            toValue: 1,
            duration: 400,
            easing: Easing.elastic(1.2),
            useNativeDriver: true,
          }),
          Animated.timing(highlightOpacity, {
            toValue: 0.3 + fromWaypoint.focusLevel * 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );
    }
    
    // Update the scan status text based on the destination waypoint
    motionSteps.push(
      Animated.sequence([
        // First fade out the current text
        Animated.timing(statusTextOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        // Then change the text and fade back in
        Animated.timing(statusTextOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    );
    
    // Calculate the distance to determine duration
    const distance = Math.sqrt(
      Math.pow(randomizedTo.x - fromWaypoint.x, 2) + 
      Math.pow(randomizedTo.y - fromWaypoint.y, 2)
    );
    
    // Base duration on distance to ensure consistent movement speed
    // Add random variation to movement speed (80-120% of base speed)
    const speedFactor = 0.8 + (Math.random() * 0.4);
    const baseDuration = 400 + (distance * 8); // Slower for longer distances
    const duration = baseDuration * speedFactor;
    
    // Create the main movement animation with small variations
    motionSteps.push(
      Animated.parallel([
        // Position animation - movement path
        Animated.timing(magnifierPosition, {
          toValue: { x: randomizedTo.x, y: randomizedTo.y },
          duration: duration,
          easing: Easing.bezier(0.33, 1, 0.68, 1), // Custom easing for natural motion
          useNativeDriver: true,
        }),
        
        // Subtle rotation during movement
        Animated.sequence([
          Animated.timing(magnifierRotation, {
            toValue: (Math.random() - 0.5) * 0.15, // Slight random rotation (-0.075 to +0.075 radians)
            duration: duration * 0.5,
            easing: Easing.out(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(magnifierRotation, {
            toValue: (Math.random() - 0.5) * 0.15, // Another slight random rotation
            duration: duration * 0.5,
            easing: Easing.in(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        
        // Subtle scale changes during movement
        Animated.sequence([
          Animated.timing(magnifierScale, {
            toValue: 0.95 + (Math.random() * 0.1), // Random scale between 0.95-1.05
            duration: duration * 0.5,
            useNativeDriver: true,
          }),
          Animated.timing(magnifierScale, {
            toValue: 1,
            duration: duration * 0.5,
            useNativeDriver: true,
          }),
        ]),
        
        // Highlight effects that follow the magnifier
        Animated.timing(highlightScale, {
          toValue: 0.9 + (Math.random() * 0.2), // Random scale variation
          duration: duration,
          useNativeDriver: true,
        }),
        
        // Change highlight opacity based on movement
        Animated.sequence([
          Animated.timing(highlightOpacity, {
            toValue: 0.3 + (Math.random() * 0.2), // Base opacity during movement
            duration: duration * 0.3,
            useNativeDriver: true,
          }),
          Animated.timing(highlightOpacity, {
            toValue: 0.2 + (Math.random() * 0.3), // Varied opacity
            duration: duration * 0.4,
            useNativeDriver: true,
          }),
          Animated.timing(highlightOpacity, {
            toValue: 0.3 + (randomizedTo.focusLevel * 0.4), // Higher opacity at destination
            duration: duration * 0.3,
            useNativeDriver: true, 
          }),
        ]),
      ])
    );
    
    // Add a pause at the destination based on its focus level
    // Higher focus = longer pause time
    const focusDuration = randomizedTo.focusLevel * 1200; // 0-1200ms based on focus level
    if (focusDuration > 200) { // Only pause if focus level is high enough
      motionSteps.push(
        Animated.parallel([
          // While paused, create a subtle "examining" effect
          Animated.sequence([
            // Zoom in slightly when focusing
            Animated.timing(magnifierScale, {
              toValue: 1.05 + (randomizedTo.focusLevel * 0.1), // More zoom for higher focus
              duration: 300,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            
            // Hold the zoom for a moment
            Animated.timing(magnifierScale, {
              toValue: 1.05 + (randomizedTo.focusLevel * 0.1),
              duration: focusDuration - 600, // Adjusted for the zoom in/out animations
              useNativeDriver: true,
            }),
            
            // Zoom back out
            Animated.timing(magnifierScale, {
              toValue: 1,
              duration: 300,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
          
          // Enhance highlight during focus
          Animated.sequence([
            Animated.timing(highlightOpacity, {
              toValue: 0.3 + (randomizedTo.focusLevel * 0.5), // Higher opacity for focus
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(highlightOpacity, {
              toValue: 0.3 + (randomizedTo.focusLevel * 0.5),
              duration: focusDuration - 600,
              useNativeDriver: true,
            }),
            Animated.timing(highlightOpacity, {
              toValue: 0.3,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          
          // Subtle pulsing effect on highlight during focus
          Animated.loop(
            Animated.sequence([
              Animated.timing(highlightScale, {
                toValue: 1 + (randomizedTo.focusLevel * 0.15),
                duration: 400,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }),
              Animated.timing(highlightScale, {
                toValue: 0.95 + (randomizedTo.focusLevel * 0.05),
                duration: 400,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }),
            ]),
            { iterations: Math.ceil(focusDuration / 800) }
          ),
          
          // Small rotation fidgets during focus
          Animated.loop(
            Animated.sequence([
              Animated.timing(magnifierRotation, {
                toValue: (Math.random() - 0.5) * 0.1 * randomizedTo.focusLevel,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(magnifierRotation, {
                toValue: (Math.random() - 0.5) * 0.1 * randomizedTo.focusLevel,
                duration: 300,
                useNativeDriver: true,
              }),
            ]),
            { iterations: Math.ceil(focusDuration / 600) }
          ),
        ])
      );
    }
    
    return Animated.sequence(motionSteps);
  };
  
  // Create a complete scanning animation that moves through waypoints
  const createHumanlikeScanning = () => {
    // Start at a random waypoint to add variety
    const startIndex = Math.floor(Math.random() * 4); // Random start position
    
    // Build a sequence that naturally moves through waypoints
    const completeAnimation: Animated.CompositeAnimation[] = [];
    
    // Add the initial waypoint motion
    completeAnimation.push(
      createWaypointMotion(
        scanWaypoints[startIndex], 
        scanWaypoints[startIndex], 
        true
      )
    );
    
    // Track the current waypoint index
    let currentIndex = startIndex;
    
    // Create a natural path through ALL waypoints to ensure continuous movement
    // We'll use all waypoints and then loop back to ensure magnifier stays on resume
    for (let i = 0; i < scanWaypoints.length; i++) {
      const fromWaypoint = scanWaypoints[currentIndex];
      
      // Choose next waypoint - prefer moving forward but sometimes jump around
      let nextIndex;
      if (Math.random() > 0.9) {
        // Occasionally jump to a random waypoint (10% chance)
        nextIndex = Math.floor(Math.random() * scanWaypoints.length);
      } else {
        // Usually move to next waypoint or nearby one
        nextIndex = currentIndex + 1;
        if (nextIndex >= scanWaypoints.length) {
          // Loop back to beginning area with some randomness
          nextIndex = Math.floor(Math.random() * 3);
        }
      }
      
      // Move to the next waypoint
      completeAnimation.push(
        createWaypointMotion(fromWaypoint, scanWaypoints[nextIndex])
      );
      
      currentIndex = nextIndex;
    }
    
    // Make the scanning loop continuously with infinite iterations
    return Animated.loop(
      Animated.sequence(completeAnimation),
      { iterations: -1 } // Ensure it never stops
    );
  };
  
  useEffect(() => {
    let scanningAnimation: Animated.CompositeAnimation | null = null;
    let statusUpdateInterval: NodeJS.Timeout | number | null = null;
    
    // Always create and run the scanning animation when the component mounts
    // This ensures the magnifier is always scanning, even when modal is not visible
    const startScanning = () => {
      // Reset position to prepare for animation
      magnifierPosition.setValue({ x: -120, y: 0 });
      magnifierScale.setValue(1);
      magnifierRotation.setValue(0);
      highlightScale.setValue(1);
      highlightOpacity.setValue(0);
      
      // Start scanning animation
      scanningAnimation = createHumanlikeScanning() as Animated.CompositeAnimation;
      scanningAnimation.start();
      currentAnimationRef.current = scanningAnimation;
      
      // Update status text based on magnifier position
      statusUpdateInterval = setInterval(() => {
        const currentX = Number(JSON.stringify(magnifierPosition.x));
        const currentY = Number(JSON.stringify(magnifierPosition.y));
        
        // Find which section we're closest to scanning
        let closestDistance = Infinity;
        let closestWaypoint = scanWaypoints[0];
        
        scanWaypoints.forEach(waypoint => {
          const distance = Math.sqrt(
            Math.pow(waypoint.x - currentX, 2) + 
            Math.pow(waypoint.y - currentY, 2)
          );
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestWaypoint = waypoint;
          }
        });
        
        if (closestWaypoint) {
          setScanStatus(closestWaypoint.title);
        }
      }, 100);
    };
    
    if (visible) {
      // Background fade in
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Entrance animation
      Animated.parallel([
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Start or ensure scanning animation is running
      if (!currentAnimationRef.current) {
        startScanning();
      }
      
      // Animate background particles
      particles.forEach((particle, index) => {
        const delay = index * 150 + Math.random() * 800;
        animateParticleRandomly(particle, delay);
      });
    } else {
      // Exit animations for modal
      Animated.parallel([
        Animated.timing(backgroundOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      // DO NOT stop the animation when the modal is hidden
      // Let it continue running in the background
    }
    
    // Only clean up animations on component unmount
    return () => {
      if (currentAnimationRef.current) {
        currentAnimationRef.current.stop();
        currentAnimationRef.current = null;
      }
      if (statusUpdateInterval) {
        clearInterval(statusUpdateInterval);
      }
    };
  }, [visible]);
  
  // Function to animate particles with random movement (simplified)
  const animateParticleRandomly = (particle: {
    position: Animated.ValueXY;
    opacity: Animated.Value;
    size: number;
    color: string;
    speed: number;
  }, delay: number) => {
    const startX = (Math.random() * 320) - 160;
    const startY = (Math.random() * 400) - 150;
    
    const endX = startX + (Math.random() * 100 - 50);
    const endY = startY - (100 + Math.random() * 200);
    
    particle.position.setValue({ x: startX, y: startY });
    particle.opacity.setValue(0);
    
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(particle.opacity, {
            toValue: 0.7,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(particle.position, {
            toValue: { x: endX, y: endY },
            duration: (3000 + Math.random() * 3000) / particle.speed,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.delay(Math.random() * 1500),
      ])
    ).start();
  };
  
  // Convert rotation value to interpolated string for transform
  const magnifierRotateStr = magnifierRotation.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-15deg', '15deg']
  });
  
  // Highlight should follow magnifier position with slight smoothing/delay
  const highlightTranslateX = magnifierPosition.x;
  const highlightTranslateY = magnifierPosition.y;
  
  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.loadingOverlay, { opacity: backgroundOpacity }]}>
        <Animated.View 
          style={[
            styles.loadingContent,
            {
              opacity: opacityValue,
              transform: [
                { scale: scaleValue },
              ]
            }
          ]}
        >
          {/* Background particles */}
          {particles.map((particle, index) => (
            <Animated.View 
              key={index}
              style={[
                styles.particle,
                { 
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  opacity: particle.opacity,
                  transform: [
                    { translateX: particle.position.x },
                    { translateY: particle.position.y }
                  ] 
                }
              ]} 
            />
          ))}

          <Text style={styles.loadingTitle}>AI Resume Analysis</Text>
          
          {/* Resume skeleton UI */}
          <View style={styles.resumeContainer}>
            {/* Header section */}
            <View style={styles.resumeHeader}>
              <View style={styles.resumeNamePlaceholder} />
              <View style={styles.resumeContactPlaceholder} />
            </View>
            
            {/* Experience section */}
            <View style={styles.resumeSection}>
              <View style={styles.resumeSectionTitle} />
              <View style={styles.resumeEntryContainer}>
                <View style={styles.resumeEntryTitle} />
                <View style={styles.resumeEntrySubtitle} />
                <View style={styles.resumeEntryDescription} />
              </View>
              <View style={styles.resumeEntryContainer}>
                <View style={styles.resumeEntryTitle} />
                <View style={styles.resumeEntrySubtitle} />
                <View style={styles.resumeEntryDescription} />
              </View>
            </View>
            
            {/* Skills section */}
            <View style={styles.resumeSection}>
              <View style={styles.resumeSectionTitle} />
              <View style={styles.skillsContainer}>
                {[...Array(8)].map((_, i) => (
                  <View key={i} style={styles.skillPill} />
                ))}
              </View>
            </View>
            
            {/* Education section */}
            <View style={styles.resumeSection}>
              <View style={styles.resumeSectionTitle} />
              <View style={styles.resumeEntryContainer}>
                <View style={styles.resumeEntryTitle} />
                <View style={styles.resumeEntrySubtitle} />
              </View>
            </View>
            
            {/* Projects section */}
            <View style={styles.resumeSection}>
              <View style={styles.resumeSectionTitle} />
              <View style={styles.resumeEntryContainer}>
                <View style={styles.resumeEntryTitle} />
                <View style={styles.resumeEntryDescription} />
              </View>
            </View>
            
            {/* Enhanced circular scanning highlight effect */}
            <Animated.View 
              style={[
                styles.scanningHighlight,
                {
                  opacity: highlightOpacity,
                  transform: [
                    { translateX: highlightTranslateX },
                    { translateY: highlightTranslateY },
                    { scale: highlightScale }
                  ]
                }
              ]}
            />
            
            {/* Enlarged moving magnifying glass with rotation */}
            <Animated.View
              style={[
                styles.magnifierContainer,
                {
                  transform: [
                    { translateX: magnifierPosition.x },
                    { translateY: magnifierPosition.y },
                    { scale: magnifierScale },
                    { rotate: magnifierRotateStr }
                  ]
                }
              ]}
            >
              <View style={styles.magnifierInner}>
                <Ionicons name="search" size={28} color="#1E3A8A" />
              </View>
            </Animated.View>
          </View>
          
          {/* Dynamic status text */}
          <Animated.View style={{ opacity: statusTextOpacity, marginTop: 20 }}>
            <View style={styles.statusTextContainer}>
              <Ionicons name="scan-outline" size={16} color="#3B82F6" />
              <Text style={styles.statusText}>{scanStatus}</Text>
            </View>
          </Animated.View>
          
          <Text style={styles.loadingSubtitle}>
            Our AI is processing your resume to identify the best advisor matches based on your experience and skills
          </Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default function ResumeScreen() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();
  
  // Fetch resumes whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user) {  // Only fetch resumes if user is authenticated
        fetchResumes();
      }
      return () => {
        // Any cleanup code
      };
    }, [user])  // Add user as a dependency
  );
  
  const fetchResumes = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      const response = await resumeApi.getResumes();
      setResumes(response.resumes);
      
      // If there's only one resume, select it automatically
      if (response.resumes.length === 1) {
        setSelectedResumeId(response.resumes[0]._id);
      }
    } catch (err: any) {
      setError("Failed to fetch resumes: " + (err?.message || "Unknown error"));
      console.error("Error fetching resumes:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    fetchResumes(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const handleDeleteResume = async (resumeId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    showAlert({
      type: 'error',
      title: 'Delete Resume',
      message: 'Are you sure you want to delete this resume?',
      showConfirm: true,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setIsDeleting(resumeId);
        try {
          await resumeApi.deleteResume(resumeId);
          
          // Remove the deleted resume from the state
          setResumes(resumes.filter(resume => resume._id !== resumeId));
          
          // If the deleted resume was selected, clear the selection
          if (selectedResumeId === resumeId) {
            setSelectedResumeId(null);
          }
          
          showAlert({
            type: 'success',
            message: 'Resume deleted successfully'
          });
        } catch (err: any) {
          showAlert({
            type: 'error',
            title: 'Error',
            message: 'Failed to delete resume: ' + (err?.message || 'Unknown error')
          });
          console.error("Error deleting resume:", err);
        } finally {
          setIsDeleting(null);
        }
      }
    });
  };
  
  const handleAnalyzeResume = async () => {
    if (!selectedResumeId) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsAnalyzing(true);
    
    try {
      const response = await matchingApi.findMatches(selectedResumeId);

      if(response.data.success) {
        // Don't show immediate alert as we'll navigate away
        console.log("Resume analyzed successfully");
      } else {
        Alert.alert("Error", "Failed to analyze resume: " + response.message);
        return;
      }
      
      // Check if the resume was already analyzed
      if(response.data.alreadyProcessed) {
        console.log("Resume was already processed");
      }
      
      // Navigate to the matching results page (regardless of whether it's newly analyzed or already done)
      router.push({
        pathname: "/matching",
        params: { resumeId: selectedResumeId }
      } as any);
    } catch (err: any) {
      Alert.alert("Error", "Failed to analyze resume: " + (err?.message || "Unknown error"));
      console.error("Error analyzing resume:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const renderResumes = () => {
    if (isLoading) {
      return (
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text className="text-gray-500 mt-4 font-medium">Loading your resumes...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View className="items-center justify-center py-20">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className="text-red-500 mt-3 font-medium text-center">{error}</Text>
          <TouchableOpacity 
            className="mt-6 bg-gray-200 px-6 py-3 rounded-lg"
            onPress={() => fetchResumes()}
            style={styles.shadowLight}
          >
            <Text className="font-medium">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (resumes.length === 0) {
      return (
        <View className="items-center justify-center py-20">
          <View className="bg-gray-100 w-20 h-20 rounded-full items-center justify-center mb-2">
            <Ionicons name="document-outline" size={40} color="#6B7280" />
          </View>
          <Text className="text-gray-700 mt-4 text-center font-semibold text-lg">No Resumes Found</Text>
          <Text className="text-gray-500 text-center px-6 mt-2">Upload a resume to find matching advisors</Text>
          <TouchableOpacity 
            className="mt-8 bg-primary px-8 py-3 rounded-lg flex-row items-center"
            onPress={() => router.push("/resume/upload" as any)}
            style={styles.shadowPrimary}
          >
            <Ionicons name="cloud-upload-outline" size={20} color="#FFF" />
            <Text className="text-white font-semibold ml-2">Upload Resume</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View className="space-y-4">
        {resumes.map((resume) => {
          const isSelected = selectedResumeId === resume._id;
          
          return (
            <TouchableOpacity
              key={resume._id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedResumeId(resume._id);
              }}
              activeOpacity={0.7}
            >
              <View 
                className={`rounded-xl p-4 border ${
                  isSelected ? "border-primary bg-blue-50" : "border-gray-200 bg-white"
                }`}
                style={isSelected ? styles.selectedCard : styles.card}
              >
                <View className="flex-row items-center mb-2">
                  <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    isSelected ? "border-primary" : "border-gray-300"
                  }`}>
                    {isSelected && (
                      <View className="w-4 h-4 rounded-full bg-primary" />
                    )}
                  </View>
                  
                  <Text className={`font-bold text-lg ml-3 flex-1 ${
                    isSelected ? "text-primary" : "text-gray-800"
                  }`}>
                    {resume.title || "Untitled Resume"}
                  </Text>
                  
                  {isDeleting === resume._id ? (
                    <ActivityIndicator size="small" color="#EF4444" />
                  ) : (
                    <TouchableOpacity 
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeleteResume(resume._id);
                      }}
                      className="bg-red-50 p-2 rounded-full"
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
                
                <View className="flex-row items-center mb-3">
                  <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                  <Text className="text-gray-500 text-xs ml-1 font-medium">
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                
                <View className="mt-3 pt-3 border-t border-gray-100">
                  <View className="flex-row mb-2 items-center">
                    <View className="w-7 h-7 bg-white rounded-full items-center justify-center mr-3" style={styles.detailIconContainer}>
                      <Ionicons name="school-outline" size={16} color="#2563EB" />
                    </View>
                    <Text className="text-sm font-medium text-gray-700">
                      {UNIVERSITIES[resume.university as keyof typeof UNIVERSITIES] || resume.university}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    <View className="w-7 h-7 bg-white rounded-full items-center justify-center mr-3" style={styles.detailIconContainer}>
                      <Ionicons name="code-outline" size={16} color="#2563EB" />
                    </View>
                    <Text className="text-sm font-medium text-gray-700">
                      {ENGINEERING_DISCIPLINES[resume.engineeringField as keyof typeof ENGINEERING_DISCIPLINES] || resume.engineeringField}
                    </Text>
                  </View>
                </View>
                
                {isSelected && (
                  <View className="absolute -right-1 -top-1 bg-primary w-6 h-6 rounded-full items-center justify-center" style={styles.checkmarkBadge}>
                    <Ionicons name="checkmark" size={14} color="#FFF" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
        
        <TouchableOpacity
          className={`py-4 rounded-xl mt-6 flex-row items-center justify-center ${
            selectedResumeId && !isAnalyzing ? "bg-primary" : "bg-gray-300"
          }`}
          onPress={handleAnalyzeResume}
          disabled={!selectedResumeId || isAnalyzing}
          style={selectedResumeId && !isAnalyzing ? styles.shadowPrimary : {}}
        >
          {isAnalyzing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons 
                name={selectedResumeId ? "analytics-outline" : "document-text-outline"} 
                size={20} 
                color="#FFFFFF" 
              />
              <Text className="text-white font-semibold ml-2">
                {selectedResumeId ? "Analyze Resume" : "Select a Resume"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <>
      <ScrollView 
        className="flex-1 bg-gray-50"
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#1E3A8A"]} // Android
            tintColor="#1E3A8A" // iOS
          />
        }
      >
        <View className="mb-8 bg-white rounded-xl p-5 overflow-hidden" style={styles.headerCard}>
          <View className="absolute top-0 right-0 opacity-5">
            <Ionicons name="rocket" size={120} color="#1E3A8A" />
          </View>
          
          <View className="flex-row items-center mb-2">
            <View className="bg-primary w-10 h-10 rounded-lg items-center justify-center mr-3" style={styles.detailIconContainer}>
              <View className="flex-row">
                <Ionicons name="analytics-outline" size={20} color="#FFFFFF" />
                <Ionicons name="stats-chart-outline" size={20} color="#FFFFFF" style={{marginLeft: -5}} />
              </View>
            </View>
            <View>
              <Text className="text-3xl font-extrabold text-gray-800">Analyze Resumes</Text>
              <View className="h-1 bg-primary rounded-full w-16 mt-1" />
            </View>
          </View>
          
          <Text className="text-gray-600 mt-3 pl-1 text-base">
            Select a resume to find matching advisors
          </Text>
        </View>
        
        {renderResumes()}
      </ScrollView>
      
      {/* Loading overlay during analysis */}
      <LoadingOverlay visible={isAnalyzing} />
    </>
  );
}

const styles = StyleSheet.create({
  // ...existing styles...
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    width: Dimensions.get('window').width * 0.88,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  loadingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '85%',
    marginTop: 20,
  },
  statusTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  statusText: {
    color: '#3B82F6',
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  resumeContainer: {
    width: 280,
    height: 360,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    position: 'relative',
  },
  resumeHeader: {
    marginBottom: 20,
  },
  resumeNamePlaceholder: {
    height: 18,
    width: '70%',
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  resumeContactPlaceholder: {
    height: 10,
    width: '50%',
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  resumeSection: {
    marginBottom: 16,
  },
  resumeSectionTitle: {
    height: 12,
    width: '30%',
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
    marginBottom: 10,
  },
  resumeEntryContainer: {
    marginBottom: 12,
    paddingLeft: 5,
  },
  resumeEntryTitle: {
    height: 10,
    width: '60%',
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 6,
  },
  resumeEntrySubtitle: {
    height: 8,
    width: '40%',
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 6,
  },
  resumeEntryDescription: {
    height: 6,
    width: '80%',
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 4,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 5,
  },
  skillPill: {
    height: 8,
    width: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    margin: 3,
  },
  magnifierContainer: {
    position: 'absolute',
    width: 50, // Increased from 40
    height: 50, // Increased from 40
    borderRadius: 25, // Half of width/height
    justifyContent: 'center',
    alignItems: 'center',
  },
  magnifierInner: {
    width: 46, // Increased from 36
    height: 46, // Increased from 36
    borderRadius: 23, // Half of width/height
    backgroundColor: 'rgba(219, 234, 254, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  scanningHighlight: {
    position: 'absolute',
    width: 60, // Changed to match magnifier size
    height: 60, // Changed to match magnifier size
    borderRadius: 30, // Make it circular
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 3,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 999,
  },
  // ...existing card styles and other styles remain...
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedCard: {
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  detailIconContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  checkmarkBadge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  shadowPrimary: {
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  shadowLight: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerCard: {
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
});