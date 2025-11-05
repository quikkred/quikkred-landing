# Responsive Design Pattern Guide

## 🎯 Applied Responsive Patterns

All header navigation pages have been optimized with these consistent responsive patterns:

### 📱 Container & Padding
```tsx
// Before
<div className="container mx-auto px-4">

// After
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
```

### 📏 Section Spacing
```tsx
// Before
<section className="py-20">

// After
<section className="py-12 sm:py-16 lg:py-20">
```

### 🔤 Typography Scaling
```tsx
// Headings
text-3xl sm:text-4xl lg:text-5xl xl:text-6xl  // Hero H1
text-2xl sm:text-3xl lg:text-4xl             // Section H2
text-xl sm:text-2xl lg:text-3xl               // Subsection H3

// Body Text
text-base sm:text-lg lg:text-xl              // Lead paragraph
text-sm sm:text-base                         // Regular text
text-xs sm:text-sm                           // Small text
```

### 📐 Grid Layouts
```tsx
// 2-Column → 4-Column
grid grid-cols-2 md:grid-cols-4

// 1-Column → 2-Column → 3-Column
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3

// 1-Column → 2-Column → 4-Column
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

// 2-Column → 4-Column (for stats/badges)
grid grid-cols-2 lg:grid-cols-4
```

### 🎨 Component Sizing
```tsx
// Icons
w-4 h-4 sm:w-5 sm:h-5              // Small icons
w-6 h-6 sm:w-8 sm:h-8              // Medium icons
w-12 h-12 sm:w-14 sm:h-14          // Large icons

// Buttons
px-6 sm:px-8 py-3 sm:py-4          // Standard button
text-base sm:text-lg               // Button text

// Cards/Boxes
p-5 sm:p-6 lg:p-8                  // Card padding
rounded-lg sm:rounded-xl           // Border radius
```

### 📦 Spacing & Gaps
```tsx
// Margins
mb-6 sm:mb-8 lg:mb-12             // Bottom margin
mb-3 sm:mb-4                       // Small margins
mt-8 sm:mt-12                      // Top margin

// Gaps
gap-4 sm:gap-5 lg:gap-6           // Grid gaps
gap-3 sm:gap-4                     // Small gaps
space-y-3 sm:space-y-4            // Vertical spacing
```

### 🔘 Buttons & CTAs
```tsx
// Full-width mobile, auto desktop
<Link href="/apply" className="w-full sm:w-auto">
  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4">

// Stacked mobile, horizontal desktop
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
```

### 🎯 Hero Section Pattern
```tsx
<section className="relative bg-gradient-to-br from-[#006837] via-[#FFC107] to-[#006837] text-white">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
    {/* Breadcrumb */}
    <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm mb-4 sm:mb-6">

    {/* Hero Content */}
    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
    <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8">
```

### 📊 Stats/Badge Pattern
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
  <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4">
    <p className="text-2xl sm:text-3xl font-bold">Value</p>
    <p className="text-xs sm:text-sm opacity-80">Label</p>
  </div>
</div>
```

### 🎴 Card Grid Pattern
```tsx
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
  <motion.div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 lg:p-8">
    {/* Card content */}
  </motion.div>
</div>
```

### 🎯 CTA Section Pattern
```tsx
<section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-[#006837] to-[#FFC107] text-white">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-4">
    <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 px-4">
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto">
```

## ✅ Pages Optimized

### ✅ Home Page (`/`)
- Hero section with responsive form
- Trust badges: 2 → 4 columns
- Features grid: 1 → 2 → 4 columns
- Loan products: 1 → 2 → 4 columns
- Calculator section: stacked → side-by-side
- Steps: 1 → 2 → 3 columns
- Testimonials: 1 → 2 → 3 columns
- FAQ: responsive accordion
- CTA: stacked → horizontal buttons

### ✅ Products Page (`/products`)
- Hero with stats grid: 2 → 4 columns
- Featured product: stacked → 2 columns
- Product grid: 1 → 2 → 3 columns
- Why choose: 2 → 4 columns
- CTA section: fully responsive

## 🎨 Breakpoint Reference

```tsx
// Tailwind Breakpoints
sm:  640px  - Mobile landscape, small tablets
md:  768px  - Tablets
lg:  1024px - Desktop
xl:  1280px - Large desktop
2xl: 1536px - Extra large desktop
```

## 📱 Mobile-First Approach

Always start with mobile styles, then add larger breakpoints:

```tsx
// ❌ Wrong - Desktop first
<div className="px-8 sm:px-4">

// ✅ Correct - Mobile first
<div className="px-4 sm:px-6 lg:px-8">
```

## 🎯 Common Patterns

### Hero Section
- `pt-20 sm:pt-24` - Top padding
- Text: `text-3xl sm:text-4xl lg:text-5xl xl:text-6xl`
- Container: `px-4 sm:px-6 lg:px-8`

### Content Section
- Padding: `py-12 sm:py-16 lg:py-20`
- Heading margin: `mb-8 sm:mb-10 lg:mb-12`
- Add horizontal padding to text: `px-4`

### Grid Section
- Start with `grid-cols-1` or `grid-cols-2`
- Add `sm:grid-cols-2` for tablets
- Add `lg:grid-cols-3` or `lg:grid-cols-4` for desktop
- Gaps: `gap-4 sm:gap-5 lg:gap-6`

### Buttons
- Mobile: `w-full` in container with `w-full sm:w-auto`
- Padding: `px-6 sm:px-8 py-3 sm:py-4`
- Text: `text-base sm:text-lg`
- Icons: `w-4 h-4 sm:w-5 sm:h-5`

## 🚀 Quick Reference Checklist

For every page section:

- [ ] Container: `px-4 sm:px-6 lg:px-8`
- [ ] Vertical spacing: `py-12 sm:py-16 lg:py-20`
- [ ] H1: `text-3xl sm:text-4xl lg:text-5xl xl:text-6xl`
- [ ] H2: `text-2xl sm:text-3xl lg:text-4xl`
- [ ] H3: `text-xl sm:text-2xl lg:text-3xl`
- [ ] Body: `text-base sm:text-lg lg:text-xl`
- [ ] Grid: appropriate column breakpoints
- [ ] Buttons: `w-full sm:w-auto` on mobile
- [ ] Icons: scale appropriately
- [ ] Add `px-4` to centered text elements
- [ ] Margins: `mb-6 sm:mb-8 lg:mb-12` for sections

## 💡 Pro Tips

1. **Always test at 375px** (iPhone SE) - smallest common mobile device
2. **Use `max-w-` classes** for content width: `max-w-7xl mx-auto`
3. **Add horizontal padding** to text in hero sections: `px-4`
4. **Stack buttons** on mobile with `flex-col sm:flex-row`
5. **Use `line-clamp-`** for text truncation on mobile
6. **Hide decorative elements** on mobile: `hidden md:block`
7. **Scale everything proportionally** - if padding increases, so should text
8. **Use `flex-shrink-0`** for icons to prevent squishing
9. **Add `truncate`** to long text that might overflow
10. **Test touch targets** - minimum 44x44px for buttons

## 🎯 Common Issues & Fixes

### Text overflow
```tsx
// Add
className="px-4 max-w-2xl mx-auto"
```

### Small buttons on mobile
```tsx
// Use
py-3 sm:py-4 text-base sm:text-lg
```

### Crowded layout
```tsx
// Increase spacing
gap-4 sm:gap-6 lg:gap-8
py-12 sm:py-16 lg:py-20
```

### Unreadable text
```tsx
// Scale typography
text-xs sm:text-sm
text-sm sm:text-base
text-base sm:text-lg
```

---

**All patterns are mobile-first and scale beautifully across all devices!** 🎉
