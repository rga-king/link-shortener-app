import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black'>
      <header className='border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <h1 className='text-xl font-semibold text-zinc-900 dark:text-zinc-50'>
              Dashboard
            </h1>
            <UserButton />
          </div>
        </div>
      </header>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-zinc-900 dark:text-zinc-50'>
          {/* Dashboard content goes here */}
        </div>
      </main>
    </div>
  );
}
