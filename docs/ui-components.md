# UI Components Guidelines

## Overview
This application uses **shadcn/ui** exclusively for all UI components. Custom components should **NOT** be created. Always use existing shadcn/ui components or add new ones from the shadcn/ui library as needed.

---

## Core Principle

> **CRITICAL**: Never create custom UI components. Always use shadcn/ui components.

This ensures:
- Consistent design language across the application
- Accessible, production-ready components
- Reduced maintenance overhead
- Better testing and reliability

---

## Available Components

All shadcn/ui components are located in:
```
components/ui/
```

### Currently Installed
- **Button** (`components/ui/button.tsx`)

### Adding New Components

When you need a component that doesn't exist yet, add it from shadcn/ui:

```bash
npx shadcn@latest add [component-name]
```

**Examples:**
```bash
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add table
```

---

## Component Usage Patterns

### Importing Components
Always import from the `@/components/ui/` directory:

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
```

### Basic Usage
```typescript
// Button example
<Button variant="default" size="lg">
  Click Me
</Button>

// Card example
<Card>
  <CardHeader>
    <CardTitle>Link Statistics</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Your content here</p>
  </CardContent>
</Card>
```

---

## Customization Guidelines

### ✅ Allowed Customizations

1. **Styling via className**
   ```typescript
   <Button className="w-full bg-blue-600 hover:bg-blue-700">
     Submit
   </Button>
   ```

2. **Component Composition**
   ```typescript
   export default function LinkCard({ link }) {
     return (
       <Card className="hover:shadow-lg transition-shadow">
         <CardHeader>
           <CardTitle>{link.title}</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="flex items-center gap-2">
             <Button size="sm">Copy</Button>
             <Button size="sm" variant="outline">Edit</Button>
           </div>
         </CardContent>
       </Card>
     );
   }
   ```

3. **Variants and Props**
   ```typescript
   // Using built-in variants
   <Button variant="default">Primary</Button>
   <Button variant="secondary">Secondary</Button>
   <Button variant="destructive">Delete</Button>
   <Button variant="outline">Outline</Button>
   <Button variant="ghost">Ghost</Button>
   <Button variant="link">Link</Button>
   ```

### ❌ Prohibited Actions

1. **Creating custom button components**
   ```typescript
   // ❌ WRONG
   export function CustomButton({ children }) {
     return <button className="...">{children}</button>;
   }
   
   // ✅ CORRECT
   import { Button } from '@/components/ui/button';
   <Button className="...">Click Me</Button>
   ```

2. **Creating custom card components**
   ```typescript
   // ❌ WRONG
   export function CustomCard({ children }) {
     return <div className="rounded border p-4">{children}</div>;
   }
   
   // ✅ CORRECT
   import { Card, CardContent } from '@/components/ui/card';
   <Card>
     <CardContent>{children}</CardContent>
   </Card>
   ```

3. **Creating custom input components**
   ```typescript
   // ❌ WRONG
   export function CustomInput({ ...props }) {
     return <input className="..." {...props} />;
   }
   
   // ✅ CORRECT
   import { Input } from '@/components/ui/input';
   <Input {...props} />
   ```

---

## Common Component Patterns

### Forms
```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<form action={handleSubmit}>
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="url">URL</Label>
      <Input 
        id="url"
        name="url" 
        type="url" 
        placeholder="https://example.com"
        required 
      />
    </div>
    <Button type="submit" className="w-full">
      Shorten Link
    </Button>
  </div>
</form>
```

### Data Display
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Link Title</CardTitle>
      <Badge variant="secondary">Active</Badge>
    </div>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Created: {formatDate(link.createdAt)}
      </p>
      <p className="text-sm font-medium">
        Clicks: {link.clicks}
      </p>
    </div>
  </CardContent>
</Card>
```

### Dialogs and Modals
```typescript
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Edit Link</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Link Details</DialogTitle>
    </DialogHeader>
    {/* Form content here */}
  </DialogContent>
</Dialog>
```

### Loading States
```typescript
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? 'Creating...' : 'Create Link'}
</Button>
```

---

## Styling with Tailwind CSS

### Design Tokens
shadcn/ui components use CSS variables defined in `app/globals.css`. These ensure consistent theming:

```css
--background
--foreground
--primary
--secondary
--muted
--accent
--destructive
--border
--input
--ring
```

### Using Design Tokens
```typescript
<div className="bg-background text-foreground border-border">
  <Card className="bg-card text-card-foreground">
    {/* Content */}
  </Card>
</div>
```

### Responsive Design
```typescript
<Button className="w-full md:w-auto">
  Click Me
</Button>

<Card className="p-4 md:p-6 lg:p-8">
  {/* Content scales with viewport */}
</Card>
```

---

## Component Discovery

### Finding Components
1. **Check shadcn/ui documentation**: https://ui.shadcn.com/
2. **Browse the components/ui/ directory**: See what's already installed
3. **Search for examples**: Look for similar patterns in existing code

### Commonly Used Components
- **Button** - Actions, navigation
- **Card** - Content containers
- **Input** - Form fields
- **Label** - Form labels
- **Dialog** - Modals and popups
- **Badge** - Status indicators
- **Table** - Data tables
- **Form** - Complex forms with validation
- **Select** - Dropdown selections
- **Textarea** - Multi-line input
- **Checkbox** - Toggle options
- **RadioGroup** - Single selection
- **Switch** - Binary toggles
- **Tabs** - Content organization
- **Accordion** - Collapsible content
- **Alert** - Notifications
- **Tooltip** - Contextual help
- **Dropdown Menu** - Action menus
- **Popover** - Contextual content

---

## Accessibility

shadcn/ui components are built with accessibility in mind:
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management

**When composing components, maintain accessibility:**
```typescript
// ✅ Good - maintains accessibility
<Button aria-label="Delete link" variant="destructive">
  <Trash className="h-4 w-4" />
</Button>

<Label htmlFor="email">Email Address</Label>
<Input id="email" name="email" type="email" />
```

---

## Dark Mode Support

All shadcn/ui components support dark mode automatically through Tailwind's `dark:` variants:

```typescript
// No special handling needed - it just works!
<Card className="bg-card text-card-foreground">
  {/* Automatically adapts to light/dark mode */}
</Card>
```

---

## Troubleshooting

### Component Not Found
**Error**: Cannot find module '@/components/ui/xxx'

**Solution**: Install the component
```bash
npx shadcn@latest add xxx
```

### Styling Not Applied
**Issue**: Custom styles not working

**Solution**: Check Tailwind configuration and use proper className prop
```typescript
// ✅ Correct
<Button className="bg-blue-600 hover:bg-blue-700">

// ❌ Wrong
<Button style={{ backgroundColor: 'blue' }}>
```

### Type Errors
**Issue**: TypeScript errors with component props

**Solution**: Check shadcn/ui documentation for correct prop types. Import type definitions if needed:
```typescript
import { type ButtonProps } from '@/components/ui/button';
```

---

## Best Practices

1. **Browse Before Building**: Always check if a shadcn/ui component exists before considering alternatives
2. **Compose Don't Create**: Build complex UIs by composing existing components
3. **Use Variants**: Leverage built-in variants before adding custom styles
4. **Maintain Consistency**: Use the same component variants throughout the app
5. **Keep It Simple**: Don't over-customize; trust the design system
6. **Document Usage**: When using complex component patterns, add code comments
7. **Test Accessibility**: Verify keyboard navigation and screen reader compatibility

---

## Quick Reference

### Installation Command
```bash
npx shadcn@latest add <component-name>
```

### Import Pattern
```typescript
import { ComponentName } from '@/components/ui/component-name';
```

### Customization Method
```typescript
<ComponentName className="tailwind classes here" />
```

### Getting Help
- shadcn/ui docs: https://ui.shadcn.com/
- Tailwind CSS docs: https://tailwindcss.com/
- Check `components/ui/` for installed components
- Search codebase for usage examples

---

## Summary

**Remember**: This project uses **shadcn/ui exclusively**. Never create custom UI components. If you need functionality that doesn't exist, either:
1. Install the appropriate shadcn/ui component
2. Compose existing components creatively
3. Use Tailwind utilities for styling customization

By following these guidelines, we maintain a consistent, accessible, and maintainable UI across the entire application.
