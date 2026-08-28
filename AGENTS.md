<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# LLM Coding Standards & Instructions

## Project Overview
This is a Next.js link shortener application using:
- **Next.js** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Clerk** for authentication
- **Drizzle ORM** for database interactions

## Core Principles
1. **Type Safety First**: Always use TypeScript. No `any` types unless absolutely necessary with documented justification.
2. **Server Components by Default**: Use React Server Components unless client interactivity is required.
3. **Database-First Thinking**: Keep database queries close to where data is used; prefer server-side data fetching.
4. **Security by Default**: Never expose sensitive data to the client; validate all inputs.

---

## TypeScript Standards

### Type Definitions
- Define types and interfaces in the same file when used locally
- Create shared types in `types/` directory for cross-file usage
- Use `interface` for object shapes that may be extended
- Use `type` for unions, intersections, and utility types
- Always export types that cross file boundaries

```typescript
// Good
interface User {
  id: string;
  email: string;
  createdAt: Date;
}

type UserRole = 'admin' | 'user' | 'guest';
```

### Type Imports
```typescript
import type { User } from '@/types/user';
```

### Async/Await
- Always use `async/await` over raw Promises
- Handle errors explicitly with try-catch blocks
- Type error objects appropriately

---

## Next.js App Router Conventions

### File Structure
- `app/` - Application routes and layouts
- `components/` - Reusable React components
- `components/ui/` - shadcn/ui components
- `lib/` - Utility functions and helpers
- `db/` - Database schema and connections
- `types/` - Shared TypeScript types
- `actions/` - Server Actions
- `hooks/` - Custom React hooks

### Component Naming
- Use PascalCase for component files: `LinkCard.tsx`
- Use kebab-case for route folders: `sign-in/`
- Prefix client components with `"use client"` directive
- Prefix server actions with `"use server"` directive

### Server vs Client Components

**Use Server Components (default) for:**
- Data fetching
- Direct database access
- Accessing backend resources
- Static content
- SEO-critical content

**Use Client Components (`"use client"`) for:**
- Event handlers (onClick, onChange, etc.)
- State management (useState, useReducer)
- Effects (useEffect)
- Browser APIs (localStorage, window, etc.)
- Clerk hooks (useUser, useAuth, etc.)

```typescript
// Server Component (default)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Component
"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

## Database Patterns (Drizzle ORM)

### Schema Definition
- Define schemas in `db/schema.ts`
- Use proper types for columns
- Add indexes for frequently queried fields
- Include timestamps (createdAt, updatedAt)

### Query Patterns
- Import db instance from `@/db`
- Use prepared statements for repeated queries
- Always handle query errors
- Use transactions for multi-step operations

```typescript
import { db } from '@/db';
import { links } from '@/db/schema';

// Good: Server-side query
const userLinks = await db.select()
  .from(links)
  .where(eq(links.userId, userId))
  .orderBy(desc(links.createdAt));
```

### Never expose raw queries to client
- Always wrap database operations in Server Actions or API routes
- Validate and sanitize all inputs
- Use Clerk's auth() for user context

---

## Authentication with Clerk

### Server-Side Auth
```typescript
import { auth } from '@clerk/nextjs/server';

export default async function Page() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  // ... authenticated content
}
```

### Client-Side Auth
```typescript
"use client";
import { useUser } from '@clerk/nextjs';

export default function Component() {
  const { user, isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Not signed in</div>;
  return <div>Hello {user.firstName}</div>;
}
```

### Protected Routes
- Use middleware for route protection when appropriate
- Check auth status in layouts for nested protection
- Redirect unauthenticated users to sign-in

---

## UI Component Standards (shadcn/ui)

### Component Usage
- Import from `@/components/ui/`
- Customize via className prop
- Use Tailwind utilities for styling
- Maintain accessibility attributes

### Form Patterns
- Use React Hook Form for complex forms
- Implement proper validation
- Show loading states during submission
- Display clear error messages

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

<form action={handleSubmit}>
  <Input name="url" placeholder="Enter URL" required />
  <Button type="submit">Shorten</Button>
</form>
```

---

## Styling Guidelines

### Tailwind CSS
- Use Tailwind utilities first
- Create custom classes only when utilities are insufficient
- Keep responsive design in mind (mobile-first)
- Use design tokens from tailwind.config

### Class Organization
```typescript
// Good: Organized by category
<div className="flex items-center justify-between p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
```

### Dark Mode
- Support dark mode using Tailwind's `dark:` variant
- Test UI in both light and dark modes

---

## Error Handling

### Server Components & Actions
```typescript
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  console.error('Operation failed:', error);
  return { success: false, error: 'Operation failed' };
}
```

### Client Components
```typescript
"use client";

export default function Component() {
  const [error, setError] = useState<string | null>(null);
  
  const handleAction = async () => {
    try {
      setError(null);
      await performAction();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };
}
```

---

## Server Actions

### Action Location
- Place in `actions/` directory
- Group by feature (e.g., `actions/links.ts`)
- Export named functions

### Action Pattern
```typescript
"use server";

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function createLink(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  
  const url = formData.get('url') as string;
  if (!url) throw new Error('URL is required');
  
  // Validate and create link
  const link = await db.insert(links).values({
    userId,
    originalUrl: url,
    // ...
  });
  
  revalidatePath('/dashboard');
  return link;
}
```

### Action Guidelines
- Always validate user authentication
- Validate and sanitize all inputs
- Return serializable data only
- Revalidate relevant paths after mutations
- Use proper error handling

---

## Performance Best Practices

### Data Fetching
- Fetch data as close as possible to where it's used
- Use React Suspense boundaries for loading states
- Implement proper caching strategies
- Minimize client-side data fetching

### Images
- Use Next.js Image component for optimization
- Specify width and height to prevent layout shift
- Use appropriate formats (WebP with fallbacks)

### Bundle Size
- Import only what you need
- Use dynamic imports for heavy components
- Analyze bundle with `npm run build`

---

## Code Quality

### Formatting
- Run Prettier before committing
- Follow ESLint rules
- Use consistent import ordering

### Import Order
1. React imports
2. Third-party libraries
3. Internal utilities/types
4. Components
5. Styles

```typescript
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Link } from '@/types/link';
```

### Comments
- Write self-documenting code
- Add comments for complex logic only
- Use JSDoc for public functions
- Keep comments up-to-date

---

## Testing Considerations

### Unit Tests
- Test utility functions
- Test data transformations
- Mock external dependencies

### Integration Tests
- Test Server Actions
- Test API routes
- Test database operations

### E2E Tests
- Test critical user flows
- Test authentication flows
- Test link creation and management

---

## Security Checklist

- ✅ Validate all user inputs
- ✅ Sanitize data before database insertion
- ✅ Use parameterized queries (Drizzle handles this)
- ✅ Verify authentication before sensitive operations
- ✅ Never expose API keys or secrets to client
- ✅ Implement rate limiting for public endpoints
- ✅ Use HTTPS in production
- ✅ Set proper CORS policies
- ✅ Validate and sanitize URLs before shortening
- ✅ Implement proper session management (Clerk handles this)

---

## Git Commit Standards

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(links): add link analytics tracking
fix(auth): resolve redirect loop on sign-in
docs(readme): update setup instructions
```

---

## Environment Variables

### Required Variables
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`
- Any API keys for external services

### Best Practices
- Never commit `.env` files
- Document all required variables in `.env.example`
- Use `NEXT_PUBLIC_` prefix only for client-exposed variables
- Validate environment variables at startup

---

## Deployment Checklist

- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Build succeeds locally
- [ ] Performance tested
- [ ] Security review completed
- [ ] Error monitoring configured
- [ ] Analytics configured (if applicable)

---

## Additional Resources

For specialized instructions, ALWAYS refer to agent-specific documentation relating to the topic in `/docs`. ALWAYS refer to the relevant .md markdown file before generating any code.

### Available Documentation
- **[/docs/authentication.md](docs/authentication.md)** - Complete authentication guidelines using Clerk. Covers protected routes, modal-based auth, authenticated user redirects, server/client patterns, and security best practices.
- **[/docs/ui-components.md](docs/ui-components.md)** - Comprehensive shadcn/ui component guidelines. **CRITICAL**: Never create custom UI components; always use shadcn/ui components. Covers component installation, usage patterns, customization, accessibility, and best practices.

**Note**: Always check Next.js documentation in `node_modules/next/dist/docs/` for the latest API changes and conventions specific to this version.
