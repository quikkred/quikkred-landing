# 🎨 Color Migration Guide

Guide for migrating hardcoded colors to the dynamic theme system.

## Why Migrate?

❌ **Before (Hardcoded):**
- Theme switching doesn't work
- Colors look wrong in dark mode
- Need to update every component manually
- Inconsistent color usage

✅ **After (Theme-Aware):**
- Automatic theme switching
- Perfect dark mode support
- Update colors in one place
- Consistent branding

## Automatic Override System

**Good News!** You don't need to change existing components immediately. The system automatically overrides hardcoded Tailwind colors:

### Automatically Converted:

```tsx
// These automatically work with themes (no changes needed):
<div className="bg-blue-500 text-white">  // ✅ Auto-converted
<button className="bg-green-600">         // ✅ Auto-converted
<span className="text-red-400">           // ✅ Auto-converted
<div className="bg-yellow-50">            // ✅ Auto-converted
```

The CSS in `globals.css` has `!important` rules that override these classes with CSS variables.

## Migration Patterns

### Pattern 1: Text Colors

**Before:**
```tsx
<p className="text-blue-500">Primary text</p>
<p className="text-green-600">Success text</p>
<p className="text-red-500">Error text</p>
```

**After (Recommended):**
```tsx
import { themeColors } from '@/lib/theme/themeUtils';

<p className={themeColors.primary.text}>Primary text</p>
<p className={themeColors.success.text}>Success text</p>
<p className={themeColors.error.text}>Error text</p>
```

### Pattern 2: Background Colors

**Before:**
```tsx
<div className="bg-blue-600">
<button className="bg-green-500 hover:bg-green-600">
```

**After:**
```tsx
<div className={themeColors.primary.bg}>
<button className={`${themeColors.success.bg} ${themeColors.success.bgHover}`}>
```

### Pattern 3: Status/Semantic Colors

**Before:**
```tsx
{status === 'success' && <span className="text-green-600">Success</span>}
{status === 'error' && <span className="text-red-600">Error</span>}
{status === 'warning' && <span className="text-yellow-600">Warning</span>}
```

**After:**
```tsx
import { getStatusColor } from '@/lib/theme/themeUtils';

const statusColor = getStatusColor(status);
<span className={statusColor.text}>
```

### Pattern 4: Conditional Colors

**Before:**
```tsx
<div className={isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}>
```

**After:**
```tsx
<div className={isActive
  ? `${themeColors.primary.bg} text-white`
  : `${themeColors.background.secondary} ${themeColors.text.secondary}`
}>
```

### Pattern 5: Action Colors (Audit Logs, etc.)

**Before:**
```tsx
const getActionColor = (action: string) => {
  if (action.includes('Create')) return 'text-green-400';
  if (action.includes('Update')) return 'text-blue-400';
  if (action.includes('Delete')) return 'text-red-400';
  return 'text-slate-400';
};
```

**After:**
```tsx
import { getActionColor } from '@/lib/theme/themeUtils';

const color = getActionColor(action);  // Returns theme-aware class
```

### Pattern 6: Opacity Backgrounds (Badges, Alerts)

**Before:**
```tsx
<span className="bg-blue-500/20 text-blue-400">
<span className="bg-green-500/10 text-green-600">
```

**After:**
```tsx
<span className={`${themeColors.primary.bgMedium} ${themeColors.primary.text}`}>
<span className={`${themeColors.success.bgLight} ${themeColors.success.text}`}>
```

## Helper Functions

### 1. getStatusColor()

```tsx
import { getStatusColor } from '@/lib/theme/themeUtils';

const statusColor = getStatusColor('success');
// Returns: { text, bg, bgLight, bgMedium, border }

<span className={statusColor.text}>Success!</span>
<div className={statusColor.bgLight}>Success alert</div>
```

### 2. getActionColor()

```tsx
import { getActionColor } from '@/lib/theme/themeUtils';

const color = getActionColor('Create User');
<span className={color}>Create User</span>
```

### 3. getPriorityColor()

```tsx
import { getPriorityColor } from '@/lib/theme/themeUtils';

const priorityColor = getPriorityColor('high');
<div className={priorityColor.bg}>High Priority</div>
```

### 4. getRoleColor()

```tsx
import { getRoleColor } from '@/lib/theme/themeUtils';

const roleColor = getRoleColor('SUPER_ADMIN');
<span className={roleColor.text}>Super Admin</span>
```

## Inline Styles (Avoid)

**Before (Bad):**
```tsx
<div style={{ color: '#3b82f6', backgroundColor: '#eff6ff' }}>
```

**After (Good):**
```tsx
<div className={`${themeColors.primary.text} ${themeColors.primary.bgLight}`}>
```

**Note:** Inline styles with hex colors are automatically overridden by the CSS, but it's better to use Tailwind classes.

## Common Color Mappings

| Hardcoded | Theme Variable | Semantic |
|-----------|---------------|----------|
| `text-blue-500` | `text-[rgb(var(--primary-500))]` | Primary |
| `text-green-600` | `text-[rgb(var(--success))]` | Success |
| `text-red-600` | `text-[rgb(var(--error))]` | Error |
| `text-yellow-600` | `text-[rgb(var(--warning))]` | Warning |
| `text-purple-600` | `text-[rgb(var(--accent-500))]` | Accent |
| `bg-slate-50` | `bg-[rgb(var(--bg-secondary))]` | Background |
| `text-slate-900` | `text-[rgb(var(--text-primary))]` | Text |

## Quick Migration Script

Find all hardcoded colors in a component:

```bash
# Find text colors
grep -n "text-\(blue\|red\|green\|yellow\|purple\)" your-component.tsx

# Find background colors
grep -n "bg-\(blue\|red\|green\|yellow\|purple\)" your-component.tsx
```

## Testing Checklist

After migrating a component, test:

- [ ] Component looks correct in light mode
- [ ] Component looks correct in dark mode
- [ ] Colors have proper contrast
- [ ] Hover states work correctly
- [ ] Active/focused states are visible
- [ ] All interactive elements are accessible

## Example: Complete Migration

**Before:**
```tsx
export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`
      px-3 py-1 rounded-full text-sm font-medium
      ${status === 'active' ? 'bg-green-100 text-green-800' : ''}
      ${status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
      ${status === 'inactive' ? 'bg-red-100 text-red-800' : ''}
    `}>
      {status}
    </span>
  );
}
```

**After:**
```tsx
import { getStatusColor } from '@/lib/theme/themeUtils';

export function StatusBadge({ status }: { status: 'active' | 'pending' | 'inactive' }) {
  const colors = getStatusColor(status);

  return (
    <span className={`
      px-3 py-1 rounded-full text-sm font-medium
      ${colors.bgLight} ${colors.text}
    `}>
      {status}
    </span>
  );
}
```

## Priority Components to Migrate

1. **Shared Components** (buttons, badges, cards)
2. **Dashboard Components** (stats, charts)
3. **Form Components** (inputs, selects)
4. **Navigation Components** (header, sidebar)
5. **Page-specific Components**

## Need Help?

- Check `lib/theme/themeUtils.ts` for all helper functions
- See `lib/theme/colors.ts` for available colors
- Look at `app/globals.css` for CSS variable names
- Review `docs/THEME_SYSTEM.md` for theme system overview

---

**Remember:** The automatic override system means you don't need to migrate everything immediately. Migrate components as you work on them!
