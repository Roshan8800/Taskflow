import { Todo } from '../models/Todo';
import Realm from 'realm';

export interface RepeatRule {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number; // Every N days/weeks/months/years
  daysOfWeek?: number[]; // For weekly: [0=Sunday, 1=Monday, etc.]
  dayOfMonth?: number; // For monthly
  endDate?: Date;
  cronRule?: string; // For custom cron-like rules
}

export const createNextOccurrence = (completedTask: Todo, repeatRule: RepeatRule): Partial<Todo> => {
  const nextDueDate = calculateNextDueDate(completedTask.dueAt || new Date(), repeatRule);
  
  if (repeatRule.endDate && nextDueDate > repeatRule.endDate) {
    return null; // No more occurrences
  }

  return {
    _id: new Realm.BSON.ObjectId(),
    title: completedTask.title,
    description: completedTask.description,
    priority: completedTask.priority,
    status: 'pending',
    dueAt: nextDueDate,
    projectId: completedTask.projectId,
    labels: completedTask.labels,
    color: completedTask.color,
    createdAt: new Date(),
    updatedAt: new Date(),
    archived: false,
    deletedAt: null,
  };
};

const calculateNextDueDate = (currentDue: Date, rule: RepeatRule): Date => {
  const next = new Date(currentDue);

  switch (rule.type) {
    case 'daily':
      // next due = previous due + 1 day (or interval days)
      next.setDate(next.getDate() + (rule.interval || 1));
      break;
      
    case 'weekly':
      // next due = previous due + 7 days (or interval weeks)
      next.setDate(next.getDate() + (7 * (rule.interval || 1)));
      break;
      
    case 'monthly':
      // next due = same day next month (clamp to month end)
      const currentDay = next.getDate();
      next.setMonth(next.getMonth() + (rule.interval || 1));
      
      // Clamp to month end if day doesn't exist in new month
      const daysInNewMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
      if (currentDay > daysInNewMonth) {
        next.setDate(daysInNewMonth);
      } else {
        next.setDate(currentDay);
      }
      break;
      
    case 'yearly':
      next.setFullYear(next.getFullYear() + (rule.interval || 1));
      break;
      
    case 'custom':
      // compute next using stored cron-like rule
      if (rule.cronRule) {
        return calculateNextFromCron(currentDue, rule.cronRule);
      }
      break;
  }

  return next;
};

// Simple cron parser for basic patterns: "0 9 * * 1" (9 AM every Monday)
const calculateNextFromCron = (currentDue: Date, cronRule: string): Date => {
  const parts = cronRule.split(' ');
  if (parts.length !== 5) return new Date(currentDue.getTime() + 24 * 60 * 60 * 1000); // fallback to +1 day
  
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  const next = new Date(currentDue);
  
  // Set time if specified
  if (minute !== '*') next.setMinutes(parseInt(minute));
  if (hour !== '*') next.setHours(parseInt(hour));
  
  // Handle day of week (0=Sunday, 1=Monday, etc.)
  if (dayOfWeek !== '*') {
    const targetDay = parseInt(dayOfWeek);
    const currentDay = next.getDay();
    const daysToAdd = targetDay > currentDay ? targetDay - currentDay : 7 - currentDay + targetDay;
    next.setDate(next.getDate() + daysToAdd);
  }
  
  // Handle day of month
  if (dayOfMonth !== '*') {
    next.setDate(parseInt(dayOfMonth));
    if (next <= currentDue) {
      next.setMonth(next.getMonth() + 1);
    }
  }
  
  // Handle month
  if (month !== '*') {
    next.setMonth(parseInt(month) - 1); // months are 0-indexed
    if (next <= currentDue) {
      next.setFullYear(next.getFullYear() + 1);
    }
  }
  
  return next;
};