# Quikkred Style Guide

## 🎨 Visual Design System

### Color Usage Guidelines

#### Primary Palette
```css
/* Royal Blue - Trust & Professionalism */
--royal-blue: #2563EB;
/* Use for: Primary buttons, headers, links, trust elements */

/* Emerald Green - Growth & Prosperity */
--emerald-green: #10B981;
/* Use for: Success states, positive actions, CTAs, approvals */

/* Gold - Premium & Achievement */
--gold: #F59E0B;
/* Use for: Highlights, badges, premium features, rewards */
```

#### Color Combinations
- **Primary Action:** Royal Blue background with white text
- **Success Action:** Emerald Green background with white text
- **Premium Feature:** Gold accents on white/dark background
- **Gradients:** Always flow from darker to lighter shades

### Typography Rules

#### Font Hierarchy
```css
/* Hero Headlines */
.hero-title {
  font-family: 'Sora', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 700;
  line-height: 1.1;
}

/* Section Headers */
.section-header {
  font-family: 'Sora', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
}

/* Body Text */
.body-text {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
}
```

### Component Patterns

#### Cards
```tsx
<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
  {/* Card content */}
</div>
```

#### Buttons
```tsx
/* Primary Button */
<button className="px-8 py-4 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
  Apply Now
</button>

/* Secondary Button */
<button className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border-2 border-gray-200 hover:border-[var(--emerald-green)] transition-all">
  Learn More
</button>
```

#### Forms
```tsx
<input
  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--emerald-green)] focus:border-transparent dark:bg-gray-700"
  placeholder="Enter details..."
/>
```

### Animation Guidelines

#### Micro-interactions
```tsx
/* Hover Effects */
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}

/* Page Transitions */
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}

/* Stagger Children */
transition={{ delay: index * 0.1 }}
```

### Icon Usage
- **Size:** 20px (w-5 h-5) for inline, 24px (w-6 h-6) for buttons
- **Style:** Lucide React icons only
- **Color:** Inherit from parent text color
- **Stroke Width:** Default (2px)

---

## ✍️ Content Writing Guidelines

### Voice & Tone

#### Professional Yet Friendly
- ✅ "Get your salary advance in just 30 seconds"
- ❌ "Hey! Need cash super fast???"

#### Clear & Direct
- ✅ "Apply now with 3 simple steps"
- ❌ "Begin your journey towards financial freedom by initiating the application process"

#### Empowering & Supportive
- ✅ "We're here to help when you need it most"
- ❌ "Apply only if you really need money"

### Messaging Framework

#### Headlines
- **Format:** Benefit + Action
- **Length:** 5-8 words
- **Example:** "Get Instant Salary Advance Today"

#### Subheadings
- **Format:** Elaboration of benefit
- **Length:** 10-15 words
- **Example:** "Approved in 30 seconds, money in bank in 5 minutes"

#### Body Copy
- **Format:** Feature + Benefit + Proof
- **Length:** 2-3 sentences max
- **Example:** "Our AI-powered system analyzes your profile instantly. Get approved without any paperwork. Join 50,000+ satisfied customers."

#### CTAs
- **Primary:** "Get Salary Advance"
- **Secondary:** "Check Eligibility"
- **Support:** "Calculate EMI"
- **Trust:** "Read Success Stories"

### Content Patterns

#### Feature Description
```
[Icon] [Feature Name]
[One-line benefit]
[Optional: proof point]
```

#### Testimonial Format
```
"[Customer quote about specific benefit]"
- [Name], [Designation]
[Company Name]
```

#### Process Steps
```
Step [Number]
[Action Verb] [Object]
[Brief description in 10 words or less]
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large screens */
2xl: 1536px /* Extra large */
```

### Mobile Considerations
- **Touch Targets:** Minimum 44x44px
- **Font Sizes:** Minimum 16px for body
- **Spacing:** Increased padding on mobile
- **Navigation:** Hamburger menu below lg breakpoint

### Grid System
```tsx
/* Desktop: 3 columns, Tablet: 2 columns, Mobile: 1 column */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

---

## 🌐 Internationalization

### Text Guidelines
- **Character Limits:** Allow 30% extra space for translations
- **Avoid Idioms:** Use universal concepts
- **Number Formats:** Use locale-specific formatting
- **Date Formats:** DD/MM/YYYY for India

### RTL Support (Urdu)
```css
[dir="rtl"] {
  text-align: right;
  direction: rtl;
}
```

---

## ♿ Accessibility

### Standards
- **WCAG 2.1 Level AA** compliance
- **Keyboard Navigation:** All interactive elements
- **Screen Readers:** Proper ARIA labels
- **Color Contrast:** 4.5:1 minimum for text

### Best Practices
```tsx
/* Accessible Button */
<button
  aria-label="Apply for salary advance"
  role="button"
  tabIndex={0}
>
  Apply Now
</button>

/* Form Labels */
<label htmlFor="email" className="sr-only">
  Email Address
</label>
<input id="email" aria-required="true" />
```

---

## 🖼️ Image Guidelines

### Specifications
- **Format:** WebP with JPG fallback
- **Hero Images:** 1920x1080px
- **Thumbnails:** 400x300px
- **Icons:** SVG preferred
- **File Size:** Max 200KB for web

### Alt Text
- Descriptive and concise
- Include relevant keywords
- Avoid "Image of" or "Picture of"

---

## 📊 Data Visualization

### Charts
- **Colors:** Use brand palette
- **Style:** Flat, no 3D effects
- **Labels:** Clear and readable
- **Mobile:** Responsive sizing

### Tables
```tsx
<table className="w-full border-collapse">
  <thead className="bg-gray-50 dark:bg-gray-900">
    <tr>
      <th className="px-4 py-3 text-left">Header</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">Data</td>
    </tr>
  </tbody>
</table>
```

---

## 🚫 Don'ts

### Visual Design
- ❌ Don't use gradients on text (except for decorative headlines)
- ❌ Don't mix more than 3 colors in one component
- ❌ Don't use drop shadows on dark backgrounds
- ❌ Don't use system fonts

### Content
- ❌ Don't use financial jargon without explanation
- ❌ Don't make promises we can't keep
- ❌ Don't use ALL CAPS except for acronyms
- ❌ Don't use more than one exclamation mark

### UX
- ❌ Don't auto-play videos or audio
- ❌ Don't hide important information
- ❌ Don't use pop-ups on mobile
- ❌ Don't disable zoom on mobile

---

## ✅ Checklist

Before deploying any design:
- [ ] Colors match brand palette
- [ ] Typography follows hierarchy
- [ ] Mobile responsive
- [ ] Accessibility tested
- [ ] Content reviewed for tone
- [ ] Loading states implemented
- [ ] Error states designed
- [ ] Dark mode supported
- [ ] Cross-browser tested
- [ ] Performance optimized

---

Last Updated: January 2025
Version: 1.0