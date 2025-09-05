import { RepeatRule, createNextOccurrence } from './repeatLogic';
import { Todo } from '../models/Todo';
import Realm from 'realm';

// Example usage and test cases for repeat logic
export const repeatExamples = {
  // Daily: next due = previous due + 1 day
  daily: (): RepeatRule => ({
    type: 'daily',
    interval: 1
  }),

  // Weekly: next due = previous due + 7 days  
  weekly: (): RepeatRule => ({
    type: 'weekly',
    interval: 1
  }),

  // Monthly: same day next month (clamp to month end)
  monthly: (): RepeatRule => ({
    type: 'monthly',
    interval: 1
  }),

  // Custom cron-like rules
  everyMondayAt9AM: (): RepeatRule => ({
    type: 'custom',
    interval: 1,
    cronRule: '0 9 * * 1' // minute hour dayOfMonth month dayOfWeek
  }),

  everyFirstOfMonth: (): RepeatRule => ({
    type: 'custom',
    interval: 1,
    cronRule: '0 9 1 * *' // 9 AM on 1st of every month
  }),

  everyWeekday: (): RepeatRule => ({
    type: 'custom',
    interval: 1,
    cronRule: '0 9 * * 1-5' // 9 AM Monday to Friday
  })
};

// Test function to verify repeat logic
export const testRepeatLogic = () => {
  const baseTask: Todo = {
    _id: new Realm.BSON.ObjectId(),
    title: 'Test Task',
    description: 'Test Description',
    priority: 'medium',
    status: 'completed',
    completed: true,
    labels: [],
    color: '#4A90E2',
    createdAt: new Date(),
    updatedAt: new Date(),
    archived: false,
    dueAt: new Date('2024-01-31T09:00:00'), // January 31st
  } as Todo;

  console.log('Testing repeat logic:');
  
  // Test daily
  const dailyRule = repeatExamples.daily();
  const nextDaily = createNextOccurrence(baseTask, dailyRule);
  console.log('Daily:', nextDaily?.dueAt); // Should be Feb 1st
  
  // Test weekly  
  const weeklyRule = repeatExamples.weekly();
  const nextWeekly = createNextOccurrence(baseTask, weeklyRule);
  console.log('Weekly:', nextWeekly?.dueAt); // Should be Feb 7th
  
  // Test monthly (clamp to month end)
  const monthlyRule = repeatExamples.monthly();
  const nextMonthly = createNextOccurrence(baseTask, monthlyRule);
  console.log('Monthly:', nextMonthly?.dueAt); // Should be Feb 29th (clamped from 31st)
  
  // Test custom cron
  const cronRule = repeatExamples.everyMondayAt9AM();
  const nextCron = createNextOccurrence(baseTask, cronRule);
  console.log('Custom (Monday 9AM):', nextCron?.dueAt); // Should be next Monday at 9 AM
};