# 🎨 Dynamic Theme System

A comprehensive theme system with full light/dark mode support and easy customization.

## Features

- ✅ **Light & Dark Modes** - Full support for both themes
- ✅ **System Preference** - Automatically detect user's system theme
- ✅ **Persistent** - Theme preference saved in localStorage
- ✅ **CSS Variables** - All colors defined as CSS custom properties
- ✅ **Smooth Transitions** - Animated theme switching
- ✅ **No Color Mismatches** - Centralized color management
- ✅ **Easy to Customize** - Change colors in one place

## Quick Start

### 1. Use Theme Switcher Component

Add the theme switcher to your header/navbar:

```tsx
import { ThemeSwitcher, ThemeToggle } from '@/components/ThemeSwitcher';

// Full switcher with Light/Dark/System options
<ThemeSwitcher />

// Compact toggle button (Light/Dark only)
<ThemeToggle />
```

### 2. Use Theme Hook

Access theme state in any component:

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {actualTheme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

## Color System

### Using CSS Variables

All colors are available as CSS variables:

```css
/* Primary Colors */
background: rgb(var(--primary-500));
color: rgb(var(--text-primary));
border: 1px solid rgb(var(--border-default));

/* Semantic Colors */
background: rgb(var(--success));
background: rgb(var(--error));
background: rgb(var(--warning));
background: rgb(var(--info));
```

### Using Tailwind Classes

```tsx
// Background colors
<div className="bg-[rgb(var(--bg-primary))]">
<div className="bg-[rgb(var(--bg-secondary))]">

// Text colors
<p className="text-[rgb(var(--text-primary))]">
<p className="text-[rgb(var(--text-secondary))]">

// Border colors
<div className="border-[rgb(var(--border-default))]">
```

### Predefined Gradients

```tsx
// Available gradient classes
<div className="gradient-primary">
<div className="gradient-secondary">
<div className="gradient-accent">
<div className="gradient-ocean">
<div className="gradient-sunset">
<div className="gradient-vibrant">

// Gradient text
<h1 className="gradient-text">
```

## Customizing Colors

### Method 1: Edit CSS Variables (Recommended)

Edit `app/globals.css`:

```css
:root {
  /* Change primary color for light mode */
  --primary-500: 14 165 233;  /* Sky blue */

  /* Change primary color for dark mode */
}

[data-theme="dark"] {
  --primary-500: 56 189 248;  /* Lighter sky blue */
}
```

### Method 2: Edit Theme Config

Edit `lib/theme/colors.ts`:

```typescript
export const themes = {
  light: {
    primary: {
      500: '#0ea5e9',  // Main primary color
    },
  },
  dark: {
    primary: {
      500: '#38bdf8',  // Main primary color
    },
  },
};
```

## Color Palette

### Primary Colors (Blue)
- Light: `#0ea5e9`
- Dark: `#38bdf8`

### Secondary Colors (Green)
- Light: `#34d399`
- Dark: `#4ade80`

### Accent Colors (Yellow/Gold)
- Light: `#fbbf24`
- Dark: `#fbbf24`

### Semantic Colors
- Success: `#10b981` (Green)
- Error: `#ef4444` (Red)
- Warning: `#f59e0b` (Orange)
- Info: `#3b82f6` (Blue)

## Adding Custom Themes

### 1. Add New Theme Mode

Edit `contexts/ThemeContext.tsx`:

```typescript
export type ThemeMode = 'light' | 'dark' | 'system' | 'brand';  // Add 'brand'
```

### 2. Add Theme Styles

Edit `app/globals.css`:

```css
[data-theme="brand"] {
  --primary-500: 255 0 128;  /* Brand pink */
  --secondary-500: 128 0 255; /* Brand purple */
  /* ... other colors */
}
```

### 3. Update Theme Switcher

Edit `components/ThemeSwitcher.tsx`:

```tsx
const themes = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'brand', icon: Sparkles, label: 'Brand' }, // Add this
  { value: 'system', icon: Monitor, label: 'System' },
];
```

## Best Practices

### ✅ Do's

1. **Use CSS Variables** for all colors
2. **Test both themes** when adding new components
3. **Use semantic color names** (primary, secondary, etc.)
4. **Provide sufficient contrast** for accessibility
5. **Use gradients** for visual appeal

### ❌ Don'ts

1. **Don't hardcode colors** (e.g., `bg-blue-500`)
2. **Don't use opacity** on gradient backgrounds
3. **Don't forget dark mode** when styling
4. **Don't mix color systems** (stick to CSS variables)

## Component Examples

### Card with Theme Support

```tsx
<div className="card-dark">
  <h3 className="text-[rgb(var(--text-primary))]">Card Title</h3>
  <p className="text-[rgb(var(--text-secondary))]">Card content</p>
</div>
```

### Button with Theme Support

```tsx
<button className="btn-primary">
  Click Me
</button>
```

### Gradient Background

```tsx
<section className="gradient-ocean text-white">
  <h1>Hero Section</h1>
  <p>Content with white text</p>
</section>
```

## Troubleshooting

### Theme not applying?
- Check if ThemeProvider is wrapping your app
- Verify `data-theme` attribute is on `<html>` element
- Clear localStorage and refresh

### Colors look wrong?
- Ensure you're using `rgb(var(--color))` format
- Check if CSS variables are defined in globals.css
- Verify theme-specific overrides in `[data-theme="dark"]`

### Transitions too slow/fast?
Edit `app/globals.css`:
```css
* {
  transition-duration: 0.2s; /* Adjust this */
}
```

## Future Enhancements

- [ ] Multiple brand themes (e.g., seasonal themes)
- [ ] Custom color picker
- [ ] Theme presets
- [ ] Animation preferences
- [ ] High contrast mode
- [ ] Color blind modes

---

**Need Help?** Check the examples in existing components or refer to `lib/theme/colors.ts` for the complete color system.
