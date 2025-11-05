import { BillingCycle } from '../types/subscription';

export const calculateNextBillingDate = (
  billingDate: number,
  billingCycle: BillingCycle,
  fromDate: Date = new Date()
): string => {
  const today = new Date(fromDate);
  let nextDate = new Date(today);

  switch (billingCycle) {
    case 'monthly': {
      // 今月の課金日を設定
      nextDate.setDate(billingDate);
      // もし今月の課金日が過ぎていれば、来月に設定
      if (nextDate <= today) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      break;
    }
    case 'yearly': {
      // 今年の課金月日を設定
      nextDate.setDate(billingDate);
      // もし今年の課金日が過ぎていれば、来年に設定
      if (nextDate <= today) {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }
      break;
    }
    case 'weekly': {
      // 次の課金曜日を計算
      const daysUntilNext = (billingDate - today.getDay() + 7) % 7;
      nextDate.setDate(today.getDate() + (daysUntilNext === 0 ? 7 : daysUntilNext));
      break;
    }
  }

  return nextDate.toISOString();
};

export const getDaysUntilDate = (dateString: string): number => {
  const targetDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
};
