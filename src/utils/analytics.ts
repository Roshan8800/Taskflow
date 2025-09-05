import { Todo } from '../models/Todo';

export const calculateProductivityMetrics = (todos: Todo[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Weekly metrics
  const weeklyTasks = todos.filter(todo => {
    const createdDate = new Date(todo.createdAt);
    return createdDate >= weekAgo;
  });

  const weeklyCompleted = weeklyTasks.filter(todo => todo.completed).length;
  const weeklyCompletionRate = weeklyTasks.length > 0 ? (weeklyCompleted / weeklyTasks.length) * 100 : 0;

  // Monthly metrics
  const monthlyTasks = todos.filter(todo => {
    const createdDate = new Date(todo.createdAt);
    return createdDate >= monthAgo;
  });

  const monthlyCompleted = monthlyTasks.filter(todo => todo.completed).length;
  const monthlyCompletionRate = monthlyTasks.length > 0 ? (monthlyCompleted / monthlyTasks.length) * 100 : 0;

  // Daily average
  const dailyAverage = weeklyTasks.length / 7;

  // Most productive day
  const dayStats = Array.from({ length: 7 }, (_, i) => {
    const dayTasks = weeklyTasks.filter(todo => {
      const taskDay = new Date(todo.createdAt).getDay();
      return taskDay === i;
    });
    return {
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      count: dayTasks.length,
      completed: dayTasks.filter(t => t.completed).length
    };
  });

  const mostProductiveDay = dayStats.reduce((max, day) => 
    day.completed > max.completed ? day : max, dayStats[0]
  );

  return {
    weekly: {
      total: weeklyTasks.length,
      completed: weeklyCompleted,
      completionRate: weeklyCompletionRate
    },
    monthly: {
      total: monthlyTasks.length,
      completed: monthlyCompleted,
      completionRate: monthlyCompletionRate
    },
    dailyAverage: Math.round(dailyAverage * 10) / 10,
    mostProductiveDay: mostProductiveDay.day,
    dayStats
  };
};

export const generateWeeklyChartData = (todos: Todo[], theme: any) => {
  const now = new Date();
  const weekData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const dayTasks = todos.filter(todo => {
      const taskDate = new Date(todo.createdAt);
      return taskDate >= dayStart && taskDate < dayEnd && todo.completed;
    });
    
    weekData.push({
      label: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
      value: dayTasks.length,
      color: theme.colors.primary
    });
  }
  
  return weekData;
};