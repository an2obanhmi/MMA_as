/**
 * Date Utility for Editorial & Neo-Brutalist Task Management
 * Handles UTC ISO normalization, timezone offsets, relative labels, and status checks.
 */

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Quick date presets for task form
 */
export interface DatePreset {
  key: string;
  label: string;
  getDateString: () => string;
}

export const DATE_PRESETS: DatePreset[] = [
  {
    key: 'today',
    label: 'TODAY',
    getDateString: () => getLocalDateString(new Date()),
  },
  {
    key: 'tomorrow',
    label: 'TOMORROW',
    getDateString: () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return getLocalDateString(d);
    },
  },
  {
    key: 'weekend',
    label: 'THIS_WEEKEND',
    getDateString: () => {
      const d = new Date();
      const day = d.getDay(); // 0 is Sunday, 6 is Saturday
      const daysUntilSaturday = day === 6 ? 0 : (6 - day);
      d.setDate(d.getDate() + (daysUntilSaturday === 0 ? 7 : daysUntilSaturday));
      return getLocalDateString(d);
    },
  },
  {
    key: 'next_week',
    label: 'NEXT_WEEK',
    getDateString: () => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return getLocalDateString(d);
    },
  },
];

export type DueDateStatus = 'overdue' | 'today' | 'tomorrow' | 'upcoming' | 'none';

export interface DueDateDisplayInfo {
  label: string;
  raw: string;
  status: DueDateStatus;
  badgeBg: string;
  badgeText: string;
}

/**
 * Parses and evaluates due date string against local calendar date
 */
export const formatDueDateDisplay = (
  dueDateStr?: string,
  isTaskDone: boolean = false
): DueDateDisplayInfo | null => {
  if (!dueDateStr || !dueDateStr.trim()) return null;

  const trimmed = dueDateStr.trim();
  // Validate format YYYY-MM-DD
  const parts = trimmed.split('-');
  if (parts.length !== 3) {
    return {
      label: trimmed.toUpperCase(),
      raw: trimmed,
      status: 'upcoming',
      badgeBg: '#EFEFEA',
      badgeText: '#111111',
    };
  }

  const targetYear = parseInt(parts[0], 10);
  const targetMonth = parseInt(parts[1], 10) - 1;
  const targetDay = parseInt(parts[2], 10);

  const targetDate = new Date(targetYear, targetMonth, targetDay);
  if (isNaN(targetDate.getTime())) {
    return {
      label: trimmed.toUpperCase(),
      raw: trimmed,
      status: 'upcoming',
      badgeBg: '#EFEFEA',
      badgeText: '#111111',
    };
  }

  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Difference in whole calendar days
  const diffTime = targetDate.getTime() - todayDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Editorial short month: OCT 20
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const formattedAbsolute = `${monthNames[targetMonth]} ${String(targetDay).padStart(2, '0')}`;

  if (isTaskDone) {
    return {
      label: formattedAbsolute,
      raw: trimmed,
      status: 'none',
      badgeBg: '#EFEFEA',
      badgeText: '#888888',
    };
  }

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    const label = overdueDays === 1 ? 'OVERDUE (1D)' : `OVERDUE (${overdueDays}D)`;
    return {
      label,
      raw: trimmed,
      status: 'overdue',
      badgeBg: '#FF5A36', // Raw vermilion warning
      badgeText: '#FFFFFF',
    };
  }

  if (diffDays === 0) {
    return {
      label: 'DUE // TODAY',
      raw: trimmed,
      status: 'today',
      badgeBg: '#E2F952', // Acid Lime urgency
      badgeText: '#111111',
    };
  }

  if (diffDays === 1) {
    return {
      label: 'DUE // TOMORROW',
      raw: trimmed,
      status: 'tomorrow',
      badgeBg: '#002FA7', // Klein Blue
      badgeText: '#FFFFFF',
    };
  }

  return {
    label: formattedAbsolute,
    raw: trimmed,
    status: 'upcoming',
    badgeBg: '#EFEFEA',
    badgeText: '#111111',
  };
};
