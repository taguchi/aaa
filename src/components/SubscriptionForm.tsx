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
          className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          <span className="text-lg">+ 新しいサブスクを追加</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200/50">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            新規サブスク登録
          </h3>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                サービス名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Netflix, Spotify など"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                料金 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="1000"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                更新サイクル <span className="text-red-500">*</span>
              </label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="monthly">月次</option>
                <option value="yearly">年次</option>
                <option value="weekly">週次</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {billingCycle === 'weekly' ? '課金曜日' : '課金日'} <span className="text-red-500">*</span>
              </label>
              {billingCycle === 'weekly' ? (
                <select
                  value={billingDate}
                  onChange={(e) => setBillingDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="1"
                  min="1"
                  max="31"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                カテゴリ
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="エンタメ、仕事、など"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                メモ
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="追加情報など"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              追加
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
