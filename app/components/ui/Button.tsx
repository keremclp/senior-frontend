import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const Button = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) => {
  
  // Button styling based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return 'bg-accent';
      case 'secondary':
        return 'bg-dark-100';
      case 'outline':
        return 'bg-transparent border border-accent';
      default:
        return 'bg-accent';
    }
  };

  // Text styling based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return 'text-white';
      case 'outline':
        return 'text-accent';
      default:
        return 'text-white';
    }
  };

  return (
    <TouchableOpacity
      onPress={loading ? undefined : onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center rounded-xl px-6 py-3.5 ${getButtonStyle()} ${disabled ? 'opacity-50' : 'opacity-100'}`}
      style={style}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'outline' ? '#AB8BFF' : '#fff'} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons 
              name={icon} 
              size={18} 
              color={variant === 'outline' ? '#AB8BFF' : '#fff'} 
              style={{ marginRight: 8 }} 
            />
          )}
          <Text className={`font-medium text-base ${getTextStyle()}`} style={textStyle}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons 
              name={icon} 
              size={18} 
              color={variant === 'outline' ? '#AB8BFF' : '#fff'} 
              style={{ marginLeft: 8 }} 
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
