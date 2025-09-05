import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio' | 'video';
  size: string;
  taskId?: string;
  projectId?: string;
  createdAt: Date;
}

export const AttachmentsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: '1', name: 'project_spec.pdf', type: 'document', size: '2.4 MB', taskId: '1', createdAt: new Date() },
    { id: '2', name: 'screenshot.png', type: 'image', size: '1.2 MB', projectId: '1', createdAt: new Date() },
    { id: '3', name: 'meeting_recording.mp3', type: 'audio', size: '15.6 MB', taskId: '2', createdAt: new Date() },
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'document': return '📄';
      case 'audio': return '🎵';
      case 'video': return '🎥';
      default: return '📎';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return '#4ECDC4';
      case 'document': return '#FF6B6B';
      case 'audio': return '#FFD93D';
      case 'video': return '#96CEB4';
      default: return '#A0A0A0';
    }
  };

  const deleteAttachment = (id: string) => {
    Alert.alert(
      'Delete Attachment',
      'Are you sure you want to delete this attachment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          setAttachments(prev => prev.filter(a => a.id !== id));
        }}
      ]
    );
  };

  const renderAttachment = ({ item }: { item: Attachment }) => (
    <View style={[styles.attachmentCard, { backgroundColor: theme.surface }]}>
      <View style={styles.attachmentInfo}>
        <View style={[styles.typeIcon, { backgroundColor: getTypeColor(item.type) }]}>
          <Text style={styles.iconText}>{getTypeIcon(item.type)}</Text>
        </View>
        <View style={styles.attachmentDetails}>
          <Text style={[styles.attachmentName, { color: theme.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.attachmentMeta, { color: theme.textSecondary }]}>
            {item.size} • {item.createdAt.toLocaleDateString()}
          </Text>
          <Text style={[styles.attachmentSource, { color: theme.primary }]}>
            {item.taskId ? 'Task' : 'Project'} attachment
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>👁️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>📤</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => deleteAttachment(item.id)}
        >
          <Text style={styles.actionIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const totalSize = attachments.reduce((sum, att) => {
    const size = parseFloat(att.size.replace(/[^\d.]/g, ''));
    return sum + size;
  }, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Attachments</Text>
      
      <View style={[styles.summary, { backgroundColor: theme.surface }]}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: theme.primary }]}>
            {attachments.length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Files</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: theme.primary }]}>
            {totalSize.toFixed(1)} MB
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total Size</Text>
        </View>
      </View>

      <FlatList
        data={attachments}
        renderItem={renderAttachment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.primary }]}>
        <Text style={[styles.addBtnText, { color: theme.background }]}>+ Add Attachment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  summary: { flexDirection: 'row', padding: 16, borderRadius: 8, marginBottom: 20 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNumber: { fontSize: 20, fontWeight: 'bold' },
  summaryLabel: { fontSize: 14, marginTop: 4 },
  list: { paddingBottom: 80 },
  attachmentCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 8, marginBottom: 8 },
  attachmentInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  typeIcon: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconText: { fontSize: 16 },
  attachmentDetails: { flex: 1 },
  attachmentName: { fontSize: 16, fontWeight: '500', marginBottom: 2 },
  attachmentMeta: { fontSize: 12, marginBottom: 2 },
  attachmentSource: { fontSize: 12, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  actionIcon: { fontSize: 16 },
  addBtn: { position: 'absolute', bottom: 20, left: 16, right: 16, padding: 16, borderRadius: 8, alignItems: 'center' },
  addBtnText: { fontSize: 16, fontWeight: '600' },
});