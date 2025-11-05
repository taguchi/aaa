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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          <h3 className="text-sm font-semibold text-blue-100 mb-3 tracking-wide uppercase">月間支出</h3>
          <p className="text-4xl md:text-5xl font-extrabold text-white">{formatCurrency(monthlyTotal)}</p>
        </div>
        <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-fuchsia-500 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          <h3 className="text-sm font-semibold text-purple-100 mb-3 tracking-wide uppercase">年間支出</h3>
          <p className="text-4xl md:text-5xl font-extrabold text-white">{formatCurrency(yearlyTotal)}</p>
        </div>
      </div>

      {upcomingBillings.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-lg border border-amber-200/50 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full -mr-32 -mt-32"></div>
          <h3 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            今週の課金予定
          </h3>
          <div className="space-y-4 relative">
            {upcomingBillings.map(sub => {
              const daysUntil = getDaysUntilDate(sub.nextBillingDate);
              return (
                <div
                  key={sub.id}
                  className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{sub.serviceName}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(sub.nextBillingDate)}
                      <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                        {daysUntil === 0 && '今日'}
                        {daysUntil === 1 && '明日'}
                        {daysUntil > 1 && `${daysUntil}日後`}
                      </span>
                    </p>
                  </div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
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
