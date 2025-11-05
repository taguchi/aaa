import { useState } from 'react';
import { Subscription, BillingCycle } from '../types/subscription';
import { calculateNextBillingDate } from '../utils/dateUtils';

interface SubscriptionFormProps {
  onAdd: (subscription: Omit<Subscription, 'id' | 'createdAt'>) => void;
}

export function SubscriptionForm({ onAdd }: SubscriptionFormProps) {
  const [serviceName, setServiceName] = useState('');
  const [cost, setCost] = useState('');
  const [billingDate, setBillingDate] = useState('1');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [category, setCategory] = useState('');
  const [memo, setMemo] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName || !cost || !billingDate) {
      alert('サービス名、料金、課金日は必須です');
      return;
    }

    const costNum = parseFloat(cost);
    const billingDateNum = parseInt(billingDate);

    if (isNaN(costNum) || costNum <= 0) {
      alert('料金は正の数値を入力してください');
      return;
    }

    if (billingCycle !== 'weekly' && (billingDateNum < 1 || billingDateNum > 31)) {
      alert('課金日は1〜31の範囲で入力してください');
      return;
    }

    if (billingCycle === 'weekly' && (billingDateNum < 0 || billingDateNum > 6)) {
      alert('曜日は0(日曜)〜6(土曜)の範囲で入力してください');
      return;
    }

    const nextBillingDate = calculateNextBillingDate(billingDateNum, billingCycle);

    onAdd({
      serviceName,
      cost: costNum,
      billingDate: billingDateNum,
      billingCycle,
      nextBillingDate,
      category: category || undefined,
      memo: memo || undefined,
    });

    // フォームをリセット
    setServiceName('');
    setCost('');
    setBillingDate('1');
    setBillingCycle('monthly');
    setCategory('');
    setMemo('');
    setIsOpen(false);
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
        >
          + 新しいサブスクを追加
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">新規サブスク登録</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                サービス名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Netflix, Spotify など"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                料金 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1000"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                更新サイクル <span className="text-red-500">*</span>
              </label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">月次</option>
                <option value="yearly">年次</option>
                <option value="weekly">週次</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {billingCycle === 'weekly' ? '課金曜日' : '課金日'} <span className="text-red-500">*</span>
              </label>
              {billingCycle === 'weekly' ? (
                <select
                  value={billingDate}
                  onChange={(e) => setBillingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">日曜日</option>
                  <option value="1">月曜日</option>
                  <option value="2">火曜日</option>
                  <option value="3">水曜日</option>
                  <option value="4">木曜日</option>
                  <option value="5">金曜日</option>
                  <option value="6">土曜日</option>
                </select>
              ) : (
                <input
                  type="number"
                  value={billingDate}
                  onChange={(e) => setBillingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                  min="1"
                  max="31"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリ
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="エンタメ、仕事、など"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メモ
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="追加情報など"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              追加
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
