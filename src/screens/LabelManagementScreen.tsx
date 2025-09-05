import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Label {
  id: string;
  name: string;
  color: string;
  count: number;
}

export const LabelManagementScreen: React.FC = () => {
  const { theme } = useTheme();
  const [labels, setLabels] = useState<Label[]>([
    { id: '1', name: 'Work', color: '#FF6B6B', count: 12 },
    { id: '2', name: 'Personal', color: '#4ECDC4', count: 8 },
    { id: '3', name: 'Urgent', color: '#FFD93D', count: 5 },
    { id: '4', name: 'Learning', color: '#96CEB4', count: 3 },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [labelName, setLabelName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');

  const colorOptions = [
    '#FF6B6B', '#4ECDC4', '#FFD93D', '#96CEB4', '#45B7D1',
    '#DDA0DD', '#F7DC6F', '#98D8C8', '#FFEAA7', '#A0A0A0'
  ];

  const handleSaveLabel = () => {
    if (!labelName.trim()) {
      Alert.alert('Error', 'Label name is required');
      return;
    }

    if (editingLabel) {
      setLabels(labels.map(label => 
        label.id === editingLabel.id 
          ? { ...label, name: labelName.trim(), color: selectedColor }
          : label
      ));
    } else {
      const newLabel: Label = {
        id: Date.now().toString(),
        name: labelName.trim(),
        color: selectedColor,
        count: 0,
      };
      setLabels([...labels, newLabel]);
    }

    resetForm();
  };

  const handleEditLabel = (label: Label) => {
    setEditingLabel(label);
    setLabelName(label.name);
    setSelectedColor(label.color);
    setShowAddForm(true);
  };

  const handleDeleteLabel = (labelId: string) => {
    const label = labels.find(l => l.id === labelId);
    if (label && label.count > 0) {
      Alert.alert(
        'Delete Label',
        `This label is used by ${label.count} tasks. Deleting it will remove the label from all tasks. Continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteLabel(labelId) },
        ]
      );
    } else {
      deleteLabel(labelId);
    }
  };

  const deleteLabel = (labelId: string) => {
    setLabels(labels.filter(label => label.id !== labelId));
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingLabel(null);
    setLabelName('');
    setSelectedColor('#FF6B6B');
  };

  const renderLabelItem = ({ item }: { item: Label }) => (
    <View style={[styles.labelCard, { backgroundColor: theme.surface }]}>
      <View style={styles.labelInfo}>
        <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
        <View style={styles.labelDetails}>
          <Text style={[styles.labelName, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.labelCount, { color: theme.textSecondary }]}>
            {item.count} tasks
          </Text>
        </View>
      </View>
      <View style={styles.labelActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.primary + '20' }]}
          onPress={() => handleEditLabel(item)}
        >
          <Text style={[styles.actionText, { color: theme.primary }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#FF6B6B20' }]}
          onPress={() => handleDeleteLabel(item.id)}
        >
          <Text style={[styles.actionText, { color: '#FF6B6B' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Manage Labels</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.primary }]}
          onPress={() => setShowAddForm(true)}
        >
          <Text style={[styles.addBtnText, { color: theme.background }]}>+ Add Label</Text>
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <View style={[styles.addForm, { backgroundColor: theme.surface }]}>
          <Text style={[styles.formTitle, { color: theme.text }]}>
            {editingLabel ? 'Edit Label' : 'Create New Label'}
          </Text>
          
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
            placeholder="Label name..."
            placeholderTextColor={theme.textSecondary}
            value={labelName}
            onChangeText={setLabelName}
          />

          <Text style={[styles.colorTitle, { color: theme.text }]}>Choose Color</Text>
          <View style={styles.colorGrid}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}
              onPress={handleSaveLabel}
            >
              <Text style={[styles.saveBtnText, { color: theme.background }]}>
                {editingLabel ? 'Update' : 'Create'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelBtn, { backgroundColor: theme.border }]}
              onPress={resetForm}
            >
              <Text style={[styles.cancelBtnText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={labels}
        renderItem={renderLabelItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addForm: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  colorTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#000',
    borderWidth: 3,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  saveBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 20,
  },
  labelCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  labelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  labelDetails: {
    flex: 1,
  },
  labelName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  labelCount: {
    fontSize: 14,
  },
  labelActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});