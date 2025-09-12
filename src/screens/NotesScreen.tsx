import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const NotesScreen: React.FC = () => {
  const { theme } = useTheme();
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Meeting Notes', content: 'Discussed projectId timeline2', title: 'Ideas', content: 'New feature concepts');
  const [content, setContent] = useState('');

  const openEditor = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
    } else {
      setEditingNote(null);
      setTitle('');
      setContent('');
    }
    setShowEditor(true);
  };

  const saveNote = () => {
    if (!title.trim()) return;

    if (editingNote) {
      setNotes(prev => prev.map(n => 
        n.id === editingNote.id 
          ? { ...n, title: title.trim(), content: content.trim(), updatedAt: new Date() }
          : n
      ));
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNotes(prev => [newNote, ...prev]);
    }
    setShowEditor(false);
  };

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={[styles.noteCard, { backgroundColor: '#FFFFFF' }]}
      onPress={() => openEditor(item)}
    >
      <Text style={[styles.noteTitle, { color: '#000000' }]}>{item.title}</Text>
      <Text style={[styles.noteContent, { color: '#000000' }]} numberOfLines={2}>
        {item.content}
      </Text>
      <Text style={[styles.noteDate, { color: '#000000' }]}>
        {item.updatedAt.toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: '#000000' }]}>Notes</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: '#FFFFFF' }]}
          onPress={() => openEditor()}
        >
          <Text style={[styles.addBtnText, { color: '#000000' }]}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />

      <Modal visible={showEditor} animationType="slide">
        <View style={[styles.editorContainer, { backgroundColor: '#FFFFFF' }]}>
          <View style={styles.editorHeader}>
            <TouchableOpacity onPress={() => setShowEditor(false)}>
              <Text style={[styles.cancelBtn, { color: '#000000' }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={saveNote}>
              <Text style={[styles.saveBtn, { color: '#000000' }]}>Save</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.titleInput, { backgroundColor: '#FFFFFF', color: '#000000' }]}
            placeholder="Note title#FFFFFF', color: '#000000' }]}
            placeholder="Write your note heretop"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  addBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { fontSize: 24, fontWeight: 'bold' },
  list: { paddingBottom: 20 },
  row: { justifyContent: 'space-between' },
  noteCard: { width: '48%', padding: 12, borderRadius: 8, marginBottom: 12, minHeight: 120 },
  noteTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  noteContent: { fontSize: 14, lineHeight: 20, marginBottom: 8, flex: 1 },
  noteDate: { fontSize: 12 },
  editorContainer: { flex: 1, padding: 16, paddingTop: 50 },
  editorHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  cancelBtn: { fontSize: 16 },
  saveBtn: { fontSize: 16, fontWeight: '600' },
  titleInput: { padding: 12, borderRadius: 8, fontSize: 18, fontWeight: '600', marginBottom: 16 },
  contentInput: { flex: 1, padding: 12, borderRadius: 8, fontSize: 16 },
});

export default NotesScreen;