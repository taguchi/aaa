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
      <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
        <p className="text-gray-500 text-lg">まだサブスクが登録されていません</p>
        <p className="text-gray-400 text-sm mt-2">上のボタンから追加してください</p>
      </div>
    );
  }

  // 次回課金日でソート
  const sortedSubscriptions = [...subscriptions].sort(
    (a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime()
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">登録中のサブスク</h2>
      {sortedSubscriptions.map((sub) => {
        const daysUntil = getDaysUntilDate(sub.nextBillingDate);
        const isUrgent = daysUntil <= 3 && daysUntil >= 0;
        const isPast = daysUntil < 0;

        return (
          <div
            key={sub.id}
            className={`bg-white p-5 rounded-lg shadow-md border-2 transition-all ${
              isUrgent
                ? 'border-red-400 bg-red-50'
                : isPast
                ? 'border-gray-300 bg-gray-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{sub.serviceName}</h3>
                  {sub.category && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {sub.category}
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">料金:</span> {formatCurrency(sub.cost)} /{' '}
                    {BILLING_CYCLE_LABELS[sub.billingCycle]}
                  </p>
                  <p>
                    <span className="font-medium">次回課金:</span> {formatDate(sub.nextBillingDate)}
                    <span className={`ml-2 font-semibold ${isUrgent ? 'text-red-600' : 'text-gray-700'}`}>
                      {daysUntil === 0 && '(今日)'}
                      {daysUntil === 1 && '(明日)'}
                      {daysUntil > 1 && `(${daysUntil}日後)`}
                      {daysUntil < 0 && `(${Math.abs(daysUntil)}日前)`}
                    </span>
                  </p>
                  {sub.memo && (
                    <p className="text-gray-500">
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
                className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md transition duration-200"
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
