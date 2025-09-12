import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export const ChecklistScreen: React.FC = () => {
  const { theme } = useTheme();
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: '1', text: 'Review projectId requirements', completed: true },
    { id: '2', text: 'Update documentation', completed: false },
    { id: '3', text: 'Test new features', completed: false }]);
  const [newItemText, setNewItemText] = useState('');

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const addItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      completed: false,
    };
    
    setItems(prev => [...prev, newItem]);
    setNewItemText('');
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const completedCount = items.filter(item => item.completed).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  const renderItem = ({ item }: { item: ChecklistItem }) => (
    <View style={[styles.itemCard, { backgroundColor: '#FFFFFF' }]}>
      <TouchableOpacity
        style={[
          styles.checkbox,
          { borderColor: '#CCCCCC' },
          item.completed && { backgroundColor: '#FFFFFF', borderColor: '#CCCCCC' }
        ]}
        onPress={() => toggleItem(item.id)}
      >
        {item.completed && <Text style={[styles.checkmark, { color: '#000000' }]}>✓</Text>}
      </TouchableOpacity>
      
      <Text style={[
        styles.itemText,
        { color: '#000000' },
        item.completed && { textDecorationLine: 'line-through', color: '#000000' }
      ]}>
        {item.text}
      </Text>
      
      <TouchableOpacity
        onPress={() => deleteItem(item.id)}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteIcon}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.title, { color: '#000000' }]}>Quick Checklist</Text>
      
      <View style={[styles.progressCard, { backgroundColor: '#FFFFFF' }]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: '#000000' }]}>Progress</Text>
          <Text style={[styles.progressCount, { color: '#000000' }]}>
            {completedCount} of {items.length} completed
          </Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: '#FFFFFF' }]}>
          <View 
            style={[
              styles.progressFill,
              { width: `${progress}%`, backgroundColor: '#FFFFFF' }
            ]} 
          />
        </View>
        <Text style={[styles.progressPercent, { color: '#000000' }]}>
          {Math.round(progress)}%
        </Text>
      </View>

      <View style={[styles.addSection, { backgroundColor: '#FFFFFF' }]}>
        <TextInput
          style={[styles.addInput, { color: '#000000' }]}
          placeholder="Add new item#FFFFFF' }]}
          onPress={addItem}
        >
          <Text style={[styles.addBtnText, { color: '#000000' }]}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FFFFFF' }]}>
          <Text style={[styles.actionBtnText, { color: '#000000' }]}>Clear Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FFFFFF' }]}>
          <Text style={[styles.actionBtnText, { color: '#000000' }]}>Save as Template</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  progressCard: { padding: 16, borderRadius: 8, marginBottom: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  progressTitle: { fontSize: 16, fontWeight: '600' },
  progressCount: { fontSize: 14 },
  progressBar: { height: 8, borderRadius: 4, marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  progressPercent: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  addSection: { flexDirection: 'row', padding: 12, borderRadius: 8, marginBottom: 16, gap: 12 },
  addInput: { flex: 1, fontSize: 16 },
  addBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  addBtnText: { fontSize: 14, fontWeight: '600' },
  list: { paddingBottom: 80 },
  itemCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 8, marginBottom: 8 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  checkmark: { fontSize: 14, fontWeight: 'bold' },
  itemText: { flex: 1, fontSize: 16 },
  deleteBtn: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  deleteIcon: { fontSize: 20, color: '#FF6B6B' },
  actions: { flexDirection: 'row', gap: 12, paddingVertical: 16 },
  actionBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  actionBtnText: { fontSize: 14, fontWeight: '600' },
});

export default ChecklistScreen;