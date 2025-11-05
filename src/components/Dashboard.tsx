import { Subscription } from '../types/subscription';
import { formatCurrency, getDaysUntilDate, formatDate } from '../utils/dateUtils';

interface DashboardProps {
  subscriptions: Subscription[];
}

export function Dashboard({ subscriptions }: DashboardProps) {
  // 月間支出の計算
  const monthlyTotal = subscriptions.reduce((sum, sub) => {
    if (sub.billingCycle === 'monthly') {
      return sum + sub.cost;
    } else if (sub.billingCycle === 'yearly') {
      return sum + sub.cost / 12;
    } else if (sub.billingCycle === 'weekly') {
      return sum + sub.cost * 4;
    }
    return sum;
  }, 0);

  // 年間支出の計算
  const yearlyTotal = monthlyTotal * 12;

  // 次回課金予定（7日以内）
  const upcomingBillings = subscriptions
    .filter(sub => {
      const daysUntil = getDaysUntilDate(sub.nextBillingDate);
      return daysUntil >= 0 && daysUntil <= 7;
    })
    .sort((a, b) =>
      new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime()
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">月間支出</h3>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(monthlyTotal)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">年間支出</h3>
          <p className="text-3xl font-bold text-purple-600">{formatCurrency(yearlyTotal)}</p>
        </div>
      </div>

      {upcomingBillings.length > 0 && (
        <div className="bg-amber-50 p-6 rounded-lg shadow-md border border-amber-200">
          <h3 className="text-lg font-semibold text-amber-900 mb-4">
            今週の課金予定
          </h3>
          <div className="space-y-3">
            {upcomingBillings.map(sub => {
              const daysUntil = getDaysUntilDate(sub.nextBillingDate);
              return (
                <div
                  key={sub.id}
                  className="flex justify-between items-center bg-white p-3 rounded border border-amber-300"
                >
                  <div>
                    <p className="font-medium text-gray-900">{sub.serviceName}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(sub.nextBillingDate)}
                      {daysUntil === 0 && ' (今日)'}
                      {daysUntil === 1 && ' (明日)'}
                      {daysUntil > 1 && ` (${daysUntil}日後)`}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(sub.cost)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
