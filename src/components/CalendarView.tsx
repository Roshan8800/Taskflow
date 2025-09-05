import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Todo } from '../models/Todo';

interface CalendarViewProps {
  tasks: Todo[];
  onTaskEdit: (task: Todo) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskEdit }) => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const TaskDot = ({ task }: { task: Todo }) => (
    <TouchableOpacity
      onPress={() => onTaskEdit(task)}
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: task.color,
        margin: 1,
      }}
    />
  );

  const DayCell = ({ date, isCurrentMonth = true }: { date: Date; isCurrentMonth?: boolean }) => {
    const dayTasks = getTasksForDate(date);
    const isToday = date.toDateString() === new Date().toDateString();
    
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          minHeight: 60,
          padding: 4,
          borderWidth: 0.5,
          borderColor: '#e0e0e0',
          backgroundColor: isToday ? '#e3f2fd' : 'white',
          opacity: isCurrentMonth ? 1 : 0.3,
        }}
      >
        <Text style={{
          fontSize: 12,
          fontWeight: isToday ? 'bold' : 'normal',
          color: isToday ? '#1976d2' : '#333',
        }}>
          {date.getDate()}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 }}>
          {dayTasks.slice(0, 3).map(task => (
            <TaskDot key={task._id.toString()} task={task} />
          ))}
          {dayTasks.length > 3 && (
            <Text style={{ fontSize: 8, color: '#666' }}>+{dayTasks.length - 3}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const MonthView = () => {
    const days = getDaysInMonth(currentDate);
    const weeks = [];
    
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <View key={day} style={{ flex: 1, padding: 8, alignItems: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#666' }}>{day}</Text>
            </View>
          ))}
        </View>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={{ flexDirection: 'row' }}>
            {week.map((day, dayIndex) => (
              <DayCell key={dayIndex} date={day} />
            ))}
          </View>
        ))}
      </View>
    );
  };

  const WeekView = () => {
    const days = getWeekDays(currentDate);
    
    return (
      <View style={{ flexDirection: 'row' }}>
        {days.map((day, index) => (
          <View key={index} style={{ flex: 1 }}>
            <View style={{ padding: 8, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
              <Text style={{ fontSize: 12, color: '#666' }}>
                {day.toLocaleDateString('en', { weekday: 'short' })}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{day.getDate()}</Text>
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              {getTasksForDate(day).map(task => (
                <TouchableOpacity
                  key={task._id.toString()}
                  onPress={() => onTaskEdit(task)}
                  style={{
                    margin: 2,
                    padding: 4,
                    backgroundColor: task.color,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ fontSize: 10, color: 'white' }} numberOfLines={1}>
                    {task.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </View>
    );
  };

  const DayView = () => {
    const dayTasks = getTasksForDate(currentDate);
    
    return (
      <View>
        <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 16, textAlign: 'center' }}>
          {currentDate.toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
        <FlatList
          data={dayTasks}
          keyExtractor={item => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onTaskEdit(item)}
              style={{
                margin: 8,
                padding: 12,
                backgroundColor: 'white',
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: item.color,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
              {item.description && (
                <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>{item.description}</Text>
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#666', marginTop: 32 }}>
              No tasks for this day
            </Text>
          }
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <TouchableOpacity
          onPress={() => {
            const newDate = new Date(currentDate);
            if (viewMode === 'month') newDate.setMonth(newDate.getMonth() - 1);
            else if (viewMode === 'week') newDate.setDate(newDate.getDate() - 7);
            else newDate.setDate(newDate.getDate() - 1);
            setCurrentDate(newDate);
          }}
          style={{ padding: 8 }}
        >
          <Text style={{ fontSize: 18 }}>‹</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 8, padding: 2 }}>
          {['month', 'week', 'day'].map(mode => (
            <TouchableOpacity
              key={mode}
              onPress={() => setViewMode(mode as any)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                backgroundColor: viewMode === mode ? '#4A90E2' : 'transparent',
              }}
            >
              <Text style={{
                fontSize: 12,
                color: viewMode === mode ? 'white' : '#666',
                textTransform: 'capitalize',
              }}>
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => {
            const newDate = new Date(currentDate);
            if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + 1);
            else if (viewMode === 'week') newDate.setDate(newDate.getDate() + 7);
            else newDate.setDate(newDate.getDate() + 1);
            setCurrentDate(newDate);
          }}
          style={{ padding: 8 }}
        >
          <Text style={{ fontSize: 18 }}>›</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {viewMode === 'month' && <MonthView />}
        {viewMode === 'week' && <WeekView />}
        {viewMode === 'day' && <DayView />}
      </ScrollView>
    </View>
  );
};