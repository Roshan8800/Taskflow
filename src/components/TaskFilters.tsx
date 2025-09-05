import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { TaskFilters as ITaskFilters, TaskSort } from '../hooks/useTaskManager';

interface TaskFiltersProps {
  filters: ITaskFilters;
  sort: TaskSort;
  onFiltersChange: (filters: ITaskFilters) => void;
  onSortChange: (sort: TaskSort) => void;
  availableLabels: string[];
  availableProjects: string[];
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  availableLabels,
  availableProjects,
}) => {
  const { theme } = useTheme();
  const [showFilters, setShowFilters] = useState(false);

  const priorities = ['low', 'medium', 'high', 'urgent'];
  const sortFields = [
    { field: 'dueDate', label: 'Due Date' },
    { field: 'priority', label: 'Priority' },
    { field: 'createdAt', label: 'Created' },
    { field: 'title', label: 'Title' },
  ];

  const togglePriority = (priority: string) => {
    const currentPriorities = filters.priority || [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter(p => p !== priority)
      : [...currentPriorities, priority];
    
    onFiltersChange({ ...filters, priority: newPriorities });
  };

  const toggleLabel = (label: string) => {
    const currentLabels = filters.labels || [];
    const newLabels = currentLabels.includes(label)
      ? currentLabels.filter(l => l !== label)
      : [...currentLabels, label];
    
    onFiltersChange({ ...filters, labels: newLabels });
  };

  const setProject = (project: string) => {
    onFiltersChange({ ...filters, project: project === filters.project ? undefined : project });
  };

  const setCompleted = (completed: boolean | undefined) => {
    onFiltersChange({ ...filters, completed });
  };

  const setArchived = (archived: boolean | undefined) => {
    onFiltersChange({ ...filters, archived });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priority?.length) count++;
    if (filters.labels?.length) count++;
    if (filters.project) count++;
    if (filters.completed !== undefined) count++;
    if (filters.archived !== undefined) count++;
    return count;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#FF0000';
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFD93D';
      case 'low': return '#6BCF7F';
      default: return theme.textSecondary;
    }
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.surface }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Sort */}
          <View style={styles.sortContainer}>
            <TouchableOpacity
              style={[styles.sortBtn, { backgroundColor: theme.background }]}
              onPress={() => onSortChange({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
            >
              <Text style={[styles.sortText, { color: theme.text }]}>
                {sortFields.find(f => f.field === sort.field)?.label} {sort.direction === 'asc' ? '↑' : '↓'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Filters */}
          <TouchableOpacity
            style={[
              styles.filterBtn,
              { backgroundColor: filters.completed === false ? theme.primary : theme.background }
            ]}
            onPress={() => setCompleted(filters.completed === false ? undefined : false)}
          >
            <Text style={[
              styles.filterText,
              { color: filters.completed === false ? theme.background : theme.text }
            ]}>
              Active
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterBtn,
              { backgroundColor: filters.completed === true ? theme.primary : theme.background }
            ]}
            onPress={() => setCompleted(filters.completed === true ? undefined : true)}
          >
            <Text style={[
              styles.filterText,
              { color: filters.completed === true ? theme.background : theme.text }
            ]}>
              Completed
            </Text>
          </TouchableOpacity>

          {/* Priority Filters */}
          {priorities.map(priority => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.filterBtn,
                { 
                  backgroundColor: filters.priority?.includes(priority) 
                    ? getPriorityColor(priority) 
                    : theme.background 
                }
              ]}
              onPress={() => togglePriority(priority)}
            >
              <Text style={[
                styles.filterText,
                { 
                  color: filters.priority?.includes(priority) 
                    ? 'white' 
                    : theme.text 
                }
              ]}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}

          {/* More Filters Button */}
          <TouchableOpacity
            style={[styles.moreFiltersBtn, { backgroundColor: theme.primary }]}
            onPress={() => setShowFilters(true)}
          >
            <Text style={[styles.moreFiltersText, { color: theme.background }]}>
              Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Filters Modal */}
      <Modal visible={showFilters} animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={[styles.modalCloseBtn, { color: theme.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Filters & Sort</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={[styles.modalClearBtn, { color: theme.primary }]}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Sort Options */}
            <View style={styles.modalSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Sort By</Text>
              {sortFields.map(field => (
                <TouchableOpacity
                  key={field.field}
                  style={[
                    styles.optionBtn,
                    { backgroundColor: sort.field === field.field ? theme.primary + '20' : theme.surface }
                  ]}
                  onPress={() => onSortChange({ field: field.field as any, direction: sort.direction })}
                >
                  <Text style={[
                    styles.optionText,
                    { color: sort.field === field.field ? theme.primary : theme.text }
                  ]}>
                    {field.label}
                  </Text>
                  {sort.field === field.field && (
                    <TouchableOpacity
                      onPress={() => onSortChange({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
                    >
                      <Text style={[styles.sortDirection, { color: theme.primary }]}>
                        {sort.direction === 'asc' ? '↑' : '↓'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Projects */}
            {availableProjects.length > 0 && (
              <View style={styles.modalSection}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Project</Text>
                {availableProjects.map(project => (
                  <TouchableOpacity
                    key={project}
                    style={[
                      styles.optionBtn,
                      { backgroundColor: filters.project === project ? theme.primary + '20' : theme.surface }
                    ]}
                    onPress={() => setProject(project)}
                  >
                    <Text style={[
                      styles.optionText,
                      { color: filters.project === project ? theme.primary : theme.text }
                    ]}>
                      📁 {project}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Labels */}
            {availableLabels.length > 0 && (
              <View style={styles.modalSection}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Labels</Text>
                <View style={styles.labelsGrid}>
                  {availableLabels.map(label => (
                    <TouchableOpacity
                      key={label}
                      style={[
                        styles.labelChip,
                        { 
                          backgroundColor: filters.labels?.includes(label) 
                            ? theme.primary 
                            : theme.surface 
                        }
                      ]}
                      onPress={() => toggleLabel(label)}
                    >
                      <Text style={[
                        styles.labelChipText,
                        { 
                          color: filters.labels?.includes(label) 
                            ? theme.background 
                            : theme.text 
                        }
                      ]}>
                        #{label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Status */}
            <View style={styles.modalSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Status</Text>
              <TouchableOpacity
                style={[
                  styles.optionBtn,
                  { backgroundColor: filters.archived === false ? theme.primary + '20' : theme.surface }
                ]}
                onPress={() => setArchived(filters.archived === false ? undefined : false)}
              >
                <Text style={[
                  styles.optionText,
                  { color: filters.archived === false ? theme.primary : theme.text }
                ]}>
                  Active Tasks
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionBtn,
                  { backgroundColor: filters.archived === true ? theme.primary + '20' : theme.surface }
                ]}
                onPress={() => setArchived(filters.archived === true ? undefined : true)}
              >
                <Text style={[
                  styles.optionText,
                  { color: filters.archived === true ? theme.primary : theme.text }
                ]}>
                  Archived Tasks
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  scrollContent: { paddingHorizontal: 16, gap: 8 },
  sortContainer: {},
  sortBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  sortText: { fontSize: 14, fontWeight: '500' },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  filterText: { fontSize: 14, fontWeight: '500' },
  moreFiltersBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  moreFiltersText: { fontSize: 14, fontWeight: '500' },
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 50 },
  modalCloseBtn: { fontSize: 16 },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  modalClearBtn: { fontSize: 16, fontWeight: '600' },
  modalContent: { flex: 1, padding: 16 },
  modalSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  optionBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8, marginBottom: 8 },
  optionText: { fontSize: 16 },
  sortDirection: { fontSize: 18, fontWeight: 'bold' },
  labelsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  labelChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  labelChipText: { fontSize: 14, fontWeight: '500' },
});