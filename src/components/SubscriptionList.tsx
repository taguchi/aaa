import { Subscription } from '../types/subscription';
import { formatCurrency, formatDate, getDaysUntilDate } from '../utils/dateUtils';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onDelete: (id: string) => void;
}

const BILLING_CYCLE_LABELS: Record<string, string> = {
  monthly: '月次',
  yearly: '年次',
  weekly: '週次',
};

export function SubscriptionList({ subscriptions, onDelete }: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
        <div className="text-6xl mb-4">📋</div>
        <p className="text-gray-600 text-xl font-semibold">まだサブスクが登録されていません</p>
        <p className="text-gray-400 text-sm mt-3">上のボタンから追加してください</p>
      </div>
    );
  }

  // 次回課金日でソート
  const sortedSubscriptions = [...subscriptions].sort(
    (a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime()
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-6">
        登録中のサブスク
      </h2>
      {sortedSubscriptions.map((sub) => {
        const daysUntil = getDaysUntilDate(sub.nextBillingDate);
        const isUrgent = daysUntil <= 3 && daysUntil >= 0;
        const isPast = daysUntil < 0;

        return (
          <div
            key={sub.id}
            className={`group relative overflow-hidden bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl border-2 transition-all duration-300 hover:scale-[1.01] ${
              isUrgent
                ? 'border-red-400 bg-gradient-to-br from-red-50 to-orange-50'
                : isPast
                ? 'border-gray-300 bg-gray-50/80'
                : 'border-gray-200/50 hover:border-purple-300'
            }`}
          >
            {isUrgent && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full -mr-16 -mt-16"></div>
            )}
            <div className="flex justify-between items-start relative">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-bold text-gray-900">{sub.serviceName}</h3>
                  {sub.category && (
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-full shadow-sm">
                      {sub.category}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">料金:</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      {formatCurrency(sub.cost)}
                    </span>
                    <span className="text-sm text-gray-500">/ {BILLING_CYCLE_LABELS[sub.billingCycle]}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">次回課金:</span>
                    <span className="text-gray-800">{formatDate(sub.nextBillingDate)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      isUrgent
                        ? 'bg-red-100 text-red-700'
                        : isPast
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {daysUntil === 0 && '今日'}
                      {daysUntil === 1 && '明日'}
                      {daysUntil > 1 && `${daysUntil}日後`}
                      {daysUntil < 0 && `${Math.abs(daysUntil)}日前`}
                    </span>
                  </p>
                  {sub.memo && (
                    <p className="text-sm text-gray-500 mt-2 italic">
                      <span className="font-medium">メモ:</span> {sub.memo}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm(`${sub.serviceName}を削除しますか?`)) {
                    onDelete(sub.id);
                  }
                }}
                className="ml-6 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                削除
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
