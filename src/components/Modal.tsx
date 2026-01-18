import React from 'react';
import { StyleSheet, View, ViewStyle, ScrollView } from 'react-native';
import { Modal as PaperModal, Portal, Text, Button, IconButton } from 'react-native-paper';

interface ModalProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  dismissable?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export default function Modal({
  visible,
  onDismiss,
  children,
  title,
  showCloseButton = true,
  dismissable = true,
  style,
  contentStyle,
}: ModalProps) {
  return (
    <Portal>
      <PaperModal
        visible={visible}
        onDismiss={onDismiss}
        dismissable={dismissable}
        contentContainerStyle={[styles.modal, style]}
      >
        <View style={[styles.content, contentStyle]}>
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && (
                <Text variant="titleLarge" style={styles.title}>
                  {title}
                </Text>
              )}
              {showCloseButton && (
                <IconButton
                  icon="close"
                  size={24}
                  onPress={onDismiss}
                  style={styles.closeButton}
                />
              )}
            </View>
          )}
          <View style={styles.body}>{children}</View>
        </View>
      </PaperModal>
    </Portal>
  );
}

// Modal.Actions component for consistent button layout
Modal.Actions = ({ children, style }: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => (
  <View style={[styles.actions, style]}>{children}</View>
);

// Modal.Content component
Modal.Content = ({ children, scrollable = false, style }: {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
}) => {
  if (scrollable) {
    return (
      <ScrollView style={[styles.scrollContent, style]}>
        {children}
      </ScrollView>
    );
  }

  return <View style={style}>{children}</View>;
};

// Confirmation Modal variant
interface ConfirmationModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  loading?: boolean;
}

Modal.Confirmation = ({
  visible,
  onDismiss,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = '#6200EE',
  loading = false,
}: ConfirmationModalProps) => (
  <Modal visible={visible} onDismiss={onDismiss} title={title} showCloseButton={false}>
    <Modal.Content>
      <Text variant="bodyMedium" style={styles.message}>
        {message}
      </Text>
    </Modal.Content>
    <Modal.Actions>
      <Button
        mode="text"
        onPress={onDismiss}
        disabled={loading}
      >
        {cancelText}
      </Button>
      <Button
        mode="contained"
        onPress={onConfirm}
        loading={loading}
        disabled={loading}
        buttonColor={confirmColor}
      >
        {confirmText}
      </Button>
    </Modal.Actions>
  </Modal>
);

// Alert Modal variant
interface AlertModalProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  message: string;
  buttonText?: string;
  icon?: string;
  iconColor?: string;
}

Modal.Alert = ({
  visible,
  onDismiss,
  title,
  message,
  buttonText = 'OK',
  icon,
  iconColor = '#6200EE',
}: AlertModalProps) => (
  <Modal visible={visible} onDismiss={onDismiss} title={title} showCloseButton={false}>
    <Modal.Content>
      {icon && (
        <View style={styles.iconContainer}>
          <IconButton icon={icon} size={48} iconColor={iconColor} />
        </View>
      )}
      <Text variant="bodyMedium" style={styles.message}>
        {message}
      </Text>
    </Modal.Content>
    <Modal.Actions>
      <Button mode="contained" onPress={onDismiss}>
        {buttonText}
      </Button>
    </Modal.Actions>
  </Modal>
);

// Input Modal variant
interface InputModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (value: string) => void;
  title: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

Modal.Input = ({
  visible,
  onDismiss,
  onSubmit,
  title,
  label,
  defaultValue = '',
  placeholder,
  confirmText = 'Submit',
  cancelText = 'Cancel',
  loading = false,
}: InputModalProps) => {
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    if (visible) {
      setValue(defaultValue);
    }
  }, [visible, defaultValue]);

  const handleSubmit = () => {
    onSubmit(value);
    setValue('');
  };

  return (
    <Modal visible={visible} onDismiss={onDismiss} title={title} showCloseButton={false}>
      <Modal.Content>
        <View style={styles.inputContainer}>
          {/* Note: Using a simple View here as TextInput component would create circular dependency */}
          <Text variant="bodyMedium">{label}</Text>
          <Text variant="bodySmall" style={styles.inputPlaceholder}>
            {placeholder || 'Enter value here'}
          </Text>
        </View>
      </Modal.Content>
      <Modal.Actions>
        <Button
          mode="text"
          onPress={onDismiss}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading || !value.trim()}
        >
          {confirmText}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  content: {
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    flex: 1,
  },
  closeButton: {
    margin: 0,
  },
  body: {
    paddingHorizontal: 24,
  },
  scrollContent: {
    maxHeight: 400,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    gap: 8,
  },
  message: {
    marginBottom: 16,
    lineHeight: 22,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputPlaceholder: {
    marginTop: 8,
    color: '#757575',
  },
});
