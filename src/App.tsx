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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="mb-12 text-center">
          <div className="inline-block">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-4 tracking-tight">
              サブスク管理
            </h1>
            <div className="h-1 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-6 text-lg">
            サブスクリプションを管理して、解約忘れを防ぎましょう
          </p>
        </header>

        <Dashboard subscriptions={subscriptions} />

        <div className="mt-12">
          <SubscriptionForm onAdd={handleAddSubscription} />
        </div>

        <div className="mt-12">
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
