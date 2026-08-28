import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    title: 'Instant Short Links',
    description:
      'Paste any long URL and get a clean, shareable short link in seconds. No configuration needed.',
    icon: '⚡',
  },
  {
    title: 'Click Analytics',
    description:
      'Track how many times each link has been clicked so you can measure reach and engagement.',
    icon: '📊',
  },
  {
    title: 'Manage Your Links',
    description:
      'View, edit, and delete all your shortened links from one organised dashboard.',
    icon: '🗂️',
  },
  {
    title: 'Secure & Private',
    description:
      'Links are tied to your account. Only you can see and manage them.',
    icon: '🔒',
  },
  {
    title: 'Always Available',
    description:
      'Built on modern infrastructure so your links resolve fast and reliably, every time.',
    icon: '🌐',
  },
  {
    title: 'Free to Use',
    description:
      'Get started for free with no credit card required. Create and share as many links as you need.',
    icon: '🎉',
  },
];

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col bg-background text-foreground'>
      {/* Nav */}
      <header className='border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
          <span className='text-xl font-bold tracking-tight'>Snip.ly</span>
          <nav className='flex items-center gap-3'>
            <Show when='signed-out'>
              <SignInButton mode='modal'>
                <Button variant='outline' size='sm'>
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode='modal'>
                <Button size='sm'>Get Started Free</Button>
              </SignUpButton>
            </Show>
            <Show when='signed-in'>
              <Link href='/dashboard'>
                <Button variant='outline' size='sm'>
                  Dashboard
                </Button>
              </Link>
              <UserButton />
            </Show>
          </nav>
        </div>
      </header>

      <main className='flex flex-col flex-1'>
        {/* Hero */}
        <section className='flex flex-col items-center justify-center text-center py-24 px-4 sm:py-32'>
          <Badge variant='secondary' className='mb-6'>
            ✨ Simple, fast link shortening
          </Badge>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl leading-tight'>
            Shorten links.
            <br />
            <span className='text-primary'>Share smarter.</span>
          </h1>
          <p className='mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl'>
            Turn long, unwieldy URLs into clean short links you can share
            anywhere — and track every click.
          </p>
          <div className='mt-10 flex flex-col sm:flex-row gap-4'>
            <Show when='signed-out'>
              <SignUpButton mode='modal'>
                <Button size='lg' className='px-8'>
                  Start for Free
                </Button>
              </SignUpButton>
              <SignInButton mode='modal'>
                <Button variant='outline' size='lg' className='px-8'>
                  Sign In
                </Button>
              </SignInButton>
            </Show>
            <Show when='signed-in'>
              <Link href='/dashboard'>
                <Button size='lg' className='px-8'>
                  Go to Dashboard
                </Button>
              </Link>
            </Show>
          </div>
        </section>

        {/* Features */}
        <section className='py-20 px-4 bg-muted/40'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-14'>
              <h2 className='text-3xl sm:text-4xl font-bold tracking-tight'>
                Everything you need
              </h2>
              <p className='mt-3 text-muted-foreground text-lg'>
                Powerful features packed into a dead-simple interface.
              </p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {features.map((feature) => (
                <Card key={feature.title} className='border-border'>
                  <CardHeader>
                    <div className='text-3xl mb-2'>{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className='text-sm leading-relaxed'>
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className='py-24 px-4 text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold tracking-tight'>
            Ready to get started?
          </h2>
          <p className='mt-4 text-muted-foreground text-lg max-w-md mx-auto'>
            Create your free account today and start shortening links in under a
            minute.
          </p>
          <div className='mt-8 flex flex-col sm:flex-row gap-4 justify-center'>
            <Show when='signed-out'>
              <SignUpButton mode='modal'>
                <Button size='lg' className='px-10'>
                  Create Free Account
                </Button>
              </SignUpButton>
            </Show>
            <Show when='signed-in'>
              <Link href='/dashboard'>
                <Button size='lg' className='px-10'>
                  Go to Dashboard
                </Button>
              </Link>
            </Show>
          </div>
        </section>
      </main>

      <footer className='border-t border-border py-6 text-center text-sm text-muted-foreground'>
        &copy; {new Date().getFullYear()} Snip.ly. All rights reserved.
      </footer>
    </div>
  );
}
