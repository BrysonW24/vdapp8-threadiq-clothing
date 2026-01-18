import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
  Text,
  Divider,
  SegmentedButtons,
  useTheme,
} from 'react-native-paper';
import { Button, Card, Input, Avatar, List, Modal, Chip, Badge } from '../components';
import { validators } from '../components/Input';

/**
 * Component Showcase Screen
 *
 * Displays all available UI components with usage examples.
 * Useful for development, design review, and maintaining consistency.
 */
export default function ComponentShowcaseScreen() {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState('buttons');
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const tabs = [
    { value: 'buttons', label: 'Buttons' },
    { value: 'inputs', label: 'Inputs' },
    { value: 'cards', label: 'Cards' },
    { value: 'other', label: 'Other' },
  ];

  const renderButtonsTab = () => (
    <View style={styles.section}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Button Variants</Text>
      <Button mode="contained" onPress={() => {}}>Contained Button</Button>
      <Button mode="outlined" onPress={() => {}}>Outlined Button</Button>
      <Button mode="text" onPress={() => {}}>Text Button</Button>
      <Button mode="elevated" onPress={() => {}}>Elevated Button</Button>

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionTitle}>With Icons</Text>
      <Button mode="contained" icon="plus" onPress={() => {}}>Add Item</Button>
      <Button mode="outlined" icon="download" onPress={() => {}}>Download</Button>

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionTitle}>States</Text>
      <Button mode="contained" loading onPress={() => {}}>Loading</Button>
      <Button mode="contained" disabled onPress={() => {}}>Disabled</Button>

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionTitle}>Sizes</Text>
      <Button mode="contained" compact onPress={() => {}}>Compact</Button>
      <Button mode="contained" onPress={() => {}}>Default</Button>
    </View>
  );

  const renderInputsTab = () => (
    <View style={styles.section}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Text Inputs</Text>
      <Input
        label="Standard Input"
        placeholder="Enter text"
      />
      <Input
        label="With Icon"
        placeholder="Email address"
        left={<Input.Icon icon="email" />}
      />
      <Input
        label="Password"
        placeholder="Enter password"
        secureTextEntry
        right={<Input.Icon icon="eye" />}
      />

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionTitle}>With Validation</Text>
      <Input
        label="Email (Required)"
        placeholder="email@example.com"
        validate={validators.combine(
          validators.required('Email'),
          validators.email
        )}
      />
      <Input
        label="Password (Min 8 chars)"
        placeholder="Enter password"
        secureTextEntry
        validate={validators.combine(
          validators.required('Password'),
          validators.minLength(8)
        )}
      />

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionTitle}>Multiline</Text>
      <Input
        label="Description"
        placeholder="Enter description"
        multiline
        numberOfLines={4}
      />
    </View>
  );

  const renderCardsTab = () => (
    <View style={styles.section}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Basic Card</Text>
      <Card title="Card Title" subtitle="Card subtitle">
        <Text>Card content goes here. This is a basic card example with title and subtitle.</Text>
      </Card>

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionTitle}>Card with Actions</Text>
      <Card title="Card with Actions" subtitle="Subtitle text">
        <Text>Card content with action buttons below.</Text>
        <Card.Actions>
          <Button mode="text">Cancel</Button>
          <Button mode="contained">OK</Button>
        </Card.Actions>
      </Card>

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionTitle}>Card with Cover</Text>
      <Card title="Image Card" subtitle="Card with image header">
        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
        <Text style={{ padding: 16 }}>This card has an image cover.</Text>
      </Card>
    </View>
  );

  const renderOtherTab = () => (
    <View style={styles.section}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Avatars</Text>
      <View style={styles.row}>
        <Avatar size={40} label="John Doe" />
        <Avatar size={40} icon="account" />
        <Avatar size={40} source={{ uri: 'https://i.pravatar.cc/150?img=1' }} />
        <Avatar size={40} label="JD" badge={5} />
      </View>

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionTitle}>Chips</Text>
      <View style={styles.row}>
        <Chip>Default</Chip>
        <Chip variant="success">Success</Chip>
        <Chip variant="warning">Warning</Chip>
        <Chip variant="error">Error</Chip>
      </View>
      <View style={styles.row}>
        <Chip icon="star">With Icon</Chip>
        <Chip onClose={() => {}}>Closeable</Chip>
        <Chip selected>Selected</Chip>
      </View>

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionTitle}>Badges</Text>
      <View style={styles.row}>
        <Badge value={5}>
          <Avatar size={40} icon="account" />
        </Badge>
        <Badge value={99}>
          <Avatar size={40} icon="email" />
        </Badge>
        <Badge value={150} max={99}>
          <Avatar size={40} icon="bell" />
        </Badge>
      </View>

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionTitle}>Modals</Text>
      <Button mode="outlined" onPress={() => setModalVisible(true)}>
        Show Modal
      </Button>
      <Button mode="outlined" onPress={() => setConfirmModalVisible(true)}>
        Show Confirmation
      </Button>

      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        title="Example Modal"
      >
        <Text>This is a basic modal example with custom content.</Text>
        <Button mode="contained" onPress={() => setModalVisible(false)}>
          Close
        </Button>
      </Modal>

      <Modal.Confirmation
        visible={confirmModalVisible}
        onDismiss={() => setConfirmModalVisible(false)}
        onConfirm={() => {
          setConfirmModalVisible(false);
          console.log('Confirmed!');
        }}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
      />

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionTitle}>List Items</Text>
      <List
        data={[
          { id: '1', title: 'Item 1', description: 'Description 1' },
          { id: '2', title: 'Item 2', description: 'Description 2' },
          { id: '3', title: 'Item 3', description: 'Description 3' },
        ]}
        renderItem={(item) => (
          <List.Item
            title={item.title}
            description={item.description}
            left={() => <List.Icon icon="star" />}
            right={() => <List.Icon icon="chevron-right" />}
          />
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={selectedTab}
        onValueChange={setSelectedTab}
        buttons={tabs}
        style={styles.tabs}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {selectedTab === 'buttons' && renderButtonsTab()}
        {selectedTab === 'inputs' && renderInputsTab()}
        {selectedTab === 'cards' && renderCardsTab()}
        {selectedTab === 'other' && renderOtherTab()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    margin: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  divider: {
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
