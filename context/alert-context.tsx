import CustomAlert from '@/components/common/CustomAlert';
import * as Haptics from 'expo-haptics';
import React, { createContext, ReactNode, useContext, useState } from 'react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertOptions {
  title?: string;
  message: string;
  type?: AlertType;
  duration?: number;
  onClose?: () => void;
  showConfirm?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  vibrate?: boolean;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [alertProps, setAlertProps] = useState<AlertOptions>({
    message: '',
    type: 'info',
    duration: 3000,
    showConfirm: false,
  });
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const showAlert = (options: AlertOptions) => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Trigger haptic feedback based on alert type
    if (options.vibrate !== false) {
      switch (options.type) {
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        default:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }

    setAlertProps(options);
    setVisible(true);

    // Auto-hide the alert if it's not a confirmation dialog
    if (!options.showConfirm && options.duration !== 0) {
      const id = setTimeout(() => {
        hideAlert();
        if (options.onClose) {
          options.onClose();
        }
      }, options.duration || 3000);
      setTimeoutId(id);
    }
  };

  const hideAlert = () => {
    setVisible(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <CustomAlert
        visible={visible}
        {...alertProps}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  );
};
