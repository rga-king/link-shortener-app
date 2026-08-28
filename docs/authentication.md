# Authentication Guidelines

## Overview
All authentication in this application is **exclusively handled by Clerk**. No other authentication methods, libraries, or custom auth solutions should be implemented or used.

---

## Core Authentication Rules

### 1. Clerk is the Single Source of Truth
- ✅ **ALWAYS** use Clerk's authentication APIs and hooks
- ❌ **NEVER** implement custom authentication logic
- ❌ **NEVER** use alternative auth libraries (NextAuth, Auth0, custom JWT, etc.)
- ❌ **NEVER** bypass Clerk's authentication flow

### 2. Modal-Based Sign In/Sign Up
All authentication UI must be displayed as modals, not full-page redirects.

**Implementation:**
```typescript
import { SignIn, SignUp } from '@clerk/nextjs';

// Sign In Modal
export default function SignInModal() {
  return (
    <div className="modal-container">
      <SignIn 
        routing="virtual"
        signUpUrl="/sign-up"
      />
    </div>
  );
}

// Sign Up Modal
export default function SignUpModal() {
  return (
    <div className="modal-container">
      <SignUp 
        routing="virtual"
        signInUrl="/sign-in"
      />
    </div>
  );
}
```

### 3. Protected Routes
The `/dashboard` route and any sub-routes are protected and require authentication.

**Implementation in Server Components:**
```typescript
// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  // Dashboard content for authenticated users
  return <div>Dashboard</div>;
}
```

**Implementation in Layouts:**
```typescript
// app/dashboard/layout.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  return <>{children}</>;
}
```

### 4. Home Route Behavior
The home route (`/`) has special redirect logic based on authentication status:

- **Authenticated users** → Redirect to `/dashboard`
- **Unauthenticated users** → Allow access to home page

**Implementation:**
```typescript
// app/page.tsx (Home Page)
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { userId } = await auth();
  
  // Redirect authenticated users to dashboard
  if (userId) {
    redirect('/dashboard');
  }
  
  // Show landing page for unauthenticated users
  return <div>Welcome to Link Shortener</div>;
}
```

**Important:** Only the `/` route requires this redirect behavior. Other public routes (marketing pages, about, etc.) can be accessed by both authenticated and unauthenticated users unless specified otherwise

---

## Authentication Patterns

### Server-Side Authentication Check
Use `auth()` from `@clerk/nextjs/server` in Server Components and Server Actions.

```typescript
import { auth } from '@clerk/nextjs/server';

export default async function ServerComponent() {
  const { userId } = await auth();
  
  if (!userId) {
    // Handle unauthenticated state
  }
  
  // Proceed with authenticated logic
}
```

### Client-Side Authentication Check
Use Clerk hooks in Client Components.

```typescript
"use client";

import { useUser, useAuth } from '@clerk/nextjs';

export default function ClientComponent() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }
  
  return (
    <div>
      <p>Hello {user.firstName}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### Server Actions Authentication
Always verify authentication in Server Actions before performing sensitive operations.

```typescript
"use server";

import { auth } from '@clerk/nextjs/server';

export async function createLink(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized: User must be authenticated');
  }
  
  // Proceed with authenticated action
  const url = formData.get('url') as string;
  // ... create link logic
}
```

---

## Middleware Configuration

Use Next.js middleware with Clerk to protect routes at the edge.

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isHomeRoute = createRouteMatcher(['/']);

const isDashboardRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  
  // Redirect authenticated users from home route to dashboard
  if (userId && isHomeRoute(request.nextUrl)) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  // Protect dashboard routes
  if (!userId && isDashboardRoute(request.nextUrl)) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

---

## User Data Access

### Getting User Information
```typescript
// Server Component
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function Page() {
  const { userId } = await auth();
  const user = await currentUser();
  
  console.log(user?.emailAddresses[0]?.emailAddress);
  console.log(user?.firstName);
  console.log(user?.lastName);
}
```

```typescript
// Client Component
"use client";

import { useUser } from '@clerk/nextjs';

export default function Component() {
  const { user } = useUser();
  
  return <div>{user?.emailAddresses[0]?.emailAddress}</div>;
}
```

### Using User ID for Database Operations
Always associate user-generated data with the authenticated user's ID.

```typescript
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { links } from '@/db/schema';

export default async function getUserLinks() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  return await db.select()
    .from(links)
    .where(eq(links.userId, userId));
}
```

---

## Security Best Practices

### ✅ DO
- Always check authentication status before accessing protected resources
- Use `auth()` in Server Components and Server Actions
- Store the Clerk user ID with user-generated data in the database
- Validate user permissions before data operations
- Use Clerk's built-in security features (rate limiting, session management, etc.)
- Redirect unauthenticated users to `/sign-in`
- Redirect authenticated users from the home route (`/`) to `/dashboard`

### ❌ DON'T
- Don't bypass Clerk's authentication
- Don't implement custom session management
- Don't store passwords or sensitive auth data
- Don't trust client-side auth state for security decisions
- Don't expose user data to unauthorized users
- Don't use localStorage or cookies for auth tokens (Clerk handles this)

---

## Environment Variables

Ensure these Clerk environment variables are configured:

```env
# Public key (safe to expose to client)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Secret key (server-side only)
CLERK_SECRET_KEY=sk_test_...

# Optional: Customize URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

---

## Testing Authentication

### Manual Testing Checklist
- [ ] Unauthenticated user cannot access `/dashboard`
- [ ] Unauthenticated user is redirected to `/sign-in` when accessing protected routes
- [ ] Unauthenticated user CAN access the home route `/`
- [ ] Authenticated user is redirected to `/dashboard` when accessing `/`
- [ ] Sign-in displays as a modal, not a full page
- [ ] Sign-up displays as a modal, not a full page
- [ ] User can successfully sign in and access dashboard
- [ ] User can successfully sign out
- [ ] Server Actions reject requests from unauthenticated users

---

## Common Mistakes to Avoid

### ❌ Mistake: Using Next.js API routes for auth
```typescript
// DON'T DO THIS
export async function POST(request: Request) {
  const { email, password } = await request.json();
  // Custom auth logic ❌
}
```

### ✅ Correct: Use Clerk
```typescript
// Use Clerk's built-in components and APIs
import { SignIn } from '@clerk/nextjs';
```

---

### ❌ Mistake: Client-side only protection
```typescript
// DON'T DO THIS - Client-side checks can be bypassed
"use client";

export default function Dashboard() {
  const { isSignedIn } = useUser();
  
  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }
  
  // This is not secure! ❌
}
```

### ✅ Correct: Server-side protection
```typescript
// Server Component with auth check
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  // Protected content ✅
}
```

---

## Quick Reference

| Task | Server Component | Client Component |
|------|-----------------|------------------|
| Check if authenticated | `const { userId } = await auth()` | `const { isSignedIn } = useUser()` |
| Get user object | `const user = await currentUser()` | `const { user } = useUser()` |
| Get user ID | `const { userId } = await auth()` | `const { user } = useUser()` <br/> `user?.id` |
| Sign out | N/A | `const { signOut } = useAuth()` <br/> `signOut()` |
| Redirect if not authenticated | `if (!userId) redirect('/sign-in')` | Use server-side protection |

---

## Support and Documentation

For detailed Clerk documentation, refer to:
- [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Components](https://clerk.com/docs/components/overview)
- [Clerk Middleware](https://clerk.com/docs/references/nextjs/clerk-middleware)

**Remember**: When in doubt, consult the official Clerk documentation and always prioritize security.
