import { AlertType } from '@/context/alert-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Animated, {
    Easing,
    FadeIn,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message: string;
  type?: AlertType;
  onClose?: () => void;
  showConfirm?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const CustomAlert = ({
  visible,
  title,
  message,
  type = 'info',
  onClose,
  showConfirm = false,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: CustomAlertProps) => {
  // Animation values
  const scale = useSharedValue(0.8);
  
  // Update animations when visibility changes
  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { 
        damping: 12, 
        stiffness: 100 
      });
    } else {
      scale.value = withTiming(0.8, { 
        duration: 200, 
        easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
      });
    }
  }, [visible]);

  // Configure icon and colors based on alert type
  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return { 
          icon: 'checkmark-circle',
          color: '#10B981',
          bgColor: '#ECFDF5',
          borderColor: '#A7F3D0'
        };
      case 'error':
        return { 
          icon: 'alert-circle',
          color: '#EF4444',
          bgColor: '#FEF2F2',
          borderColor: '#FECACA'
        };
      case 'warning':
        return { 
          icon: 'warning',
          color: '#F59E0B',
          bgColor: '#FFFBEB',
          borderColor: '#FDE68A'
        };
      default:
        return { 
          icon: 'information-circle',
          color: '#3B82F6',
          bgColor: '#EFF6FF',
          borderColor: '#BFDBFE'
        };
    }
  };

  const { icon, color, bgColor, borderColor } = getAlertConfig();

  // Handle button presses
  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onConfirm) {
      onConfirm();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onCancel) {
      onCancel();
    }
    if (onClose) {
      onClose();
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={showConfirm ? undefined : onClose}>
        <View style={styles.overlay}>
          <Animated.View 
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={[
              styles.alertContainer, 
              { backgroundColor: bgColor, borderColor },
              animatedStyle
            ]}
          >
            {/* Alert Header */}
            <View style={styles.iconContainer}>
              <Ionicons name={icon as any} size={28} color={color} />
            </View>
            
            {/* Alert Content */}
            <View style={styles.contentContainer}>
              {title && (
                <Text style={[styles.title, { color }]}>{title}</Text>
              )}
              <Text style={styles.message}>{message}</Text>
            </View>
            
            {/* Alert Actions */}
            {showConfirm ? (
              <View style={styles.actionContainer}>
                <AnimatedTouchable
                  onPress={handleCancel}
                  style={[styles.actionButton, styles.cancelButton]}
                  entering={FadeIn.delay(100).duration(200)}
                >
                  <Text style={styles.cancelText}>{cancelText}</Text>
                </AnimatedTouchable>
                
                <AnimatedTouchable
                  onPress={handleConfirm}
                  style={[styles.actionButton, styles.confirmButton, { backgroundColor: color }]}
                  entering={FadeIn.delay(200).duration(200)}
                >
                  <Text style={styles.confirmText}>{confirmText}</Text>
                </AnimatedTouchable>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: color }]}
                onPress={onClose}
              >
                <Text style={styles.closeText}>Dismiss</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
  },
  actionContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0, 0, 0, 0.05)',
  },
  confirmButton: {
    backgroundColor: '#3B82F6',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default CustomAlert;
