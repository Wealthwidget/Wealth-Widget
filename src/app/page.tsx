import dynamic from 'next/dynamic';

const WealthWidget = dynamic(() => import('@/components/wealth-widget'), {
  ssr: false
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-5xl">
        <WealthWidget />
      </div>
    </main>
  );
}