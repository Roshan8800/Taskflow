import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ArchivedItem {
  id: string;
  title: string;
  type: 'task' | 'projectId';
  archivedAt: Date;
  originalData: any;
}

export const ArchiveScreen: React.FC = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'tasks' | 'projects'>('all');
  const [archivedItems] = useState<ArchivedItem[]>([
    { id: '1', title: 'Completed Project Alpha', type: 'projectId', archivedAt: new Date(2024, 0, 15), originalData: {} },
    { id: '2', title: 'Old task from last month', type: 'task', archivedAt: new Date(2024, 0, 10), originalData: {} },
    { id: '3', title: 'Finished Marketing Campaign', type: 'projectId', archivedAt: new Date(2024, 0, 5), originalData: {} }]);

  const filteredItems = archivedItems.filter(item => 
    filter === 'all' || item.type === filter.slice(0, -1)
  );

  const restoreItem = (id: string) => {
    // Implementation would restore item to active list
    console.log('Restore item:', id);
  };

  const permanentlyDelete = (id: string) => {
    // Implementation would permanently delete item
    console.log('Permanently delete:', id);
  };

  const getTypeIcon = (type: string) => {
    return type === 'task' ? '✓' : '📁';
  };

  const renderItem = ({ item }: { item: ArchivedItem }) => (
    <View style={[styles.itemCard, { backgroundColor: '#FFFFFF' }]}>
      <View style={styles.itemInfo}>
        <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
        <View style={styles.itemDetails}>
          <Text style={[styles.itemTitle, { color: '#000000' }]}>{item.title}</Text>
          <Text style={[styles.itemMeta, { color: '#000000' }]}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • Archived {item.archivedAt.toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#FFFFFF' }]}
          onPress={() => restoreItem(item.id)}
        >
          <Text style={[styles.actionText, { color: '#000000' }]}>Restore</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#FF6B6B' }]}
          onPress={() => permanentlyDelete(item.id)}
        >
          <Text style={[styles.actionText, { color: 'white' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.title, { color: '#000000' }]}>Archive</Text>
      
      <View style={styles.filters}>
        {['all', 'tasks', 'projects'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterBtn,
              { backgroundColor: filter === f ? theme.primary : theme.surface }
            ]}
            onPress={() => setFilter(f as any)}
          >
            <Text style={[
              styles.filterText,
              { color: filter === f ? theme.background : theme.text }
            ]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.summary, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.summaryText, { color: '#000000' }]}>
          {filteredItems.length} archived items
        </Text>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={[styles.emptyText, { color: '#000000' }]}>
              No archived items found
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  filterText: { fontSize: 14, fontWeight: '500' },
  summary: { padding: 12, borderRadius: 8, marginBottom: 16 },
  summaryText: { fontSize: 14, textAlign: 'center' },
  list: { paddingBottom: 20 },
  itemCard: { padding: 16, borderRadius: 8, marginBottom: 8 },
  itemInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  typeIcon: { fontSize: 20, marginRight: 12 },
  itemDetails: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  itemMeta: { fontSize: 14 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  actionText: { fontSize: 14, fontWeight: '500' },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 16 },
});

export default ArchiveScreen;