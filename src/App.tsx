import { useLocalStorage } from './hooks/useLocalStorage';
import { Subscription } from './types/subscription';
import { Dashboard } from './components/Dashboard';
import { SubscriptionForm } from './components/SubscriptionForm';
import { SubscriptionList } from './components/SubscriptionList';

function App() {
  const [subscriptions, setSubscriptions] = useLocalStorage<Subscription[]>(
    'subscriptions',
    []
  );

  const handleAddSubscription = (
    newSub: Omit<Subscription, 'id' | 'createdAt'>
  ) => {
    const subscription: Subscription = {
      ...newSub,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    setSubscriptions([...subscriptions, subscription]);
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            サブスク管理アプリ
          </h1>
          <p className="text-gray-600">
            サブスクリプションを管理して、解約忘れを防ぎましょう
          </p>
        </header>

        <Dashboard subscriptions={subscriptions} />

        <div className="mt-8">
          <SubscriptionForm onAdd={handleAddSubscription} />
        </div>

        <div className="mt-8">
          <SubscriptionList
            subscriptions={subscriptions}
            onDelete={handleDeleteSubscription}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
