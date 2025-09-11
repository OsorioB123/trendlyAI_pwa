# TrendlyAI Design System

## Color Palette

### Primary Brand Colors
```css
:root {
  --brand-yellow: #efd135;
  --brand-yellow-light: #f3da56; 
  --brand-yellow-dark: #d4b929;
}
```

### Neutral Colors (7-Step Gray Scale)
```css
:root {
  --gray-50: #fafafa;
  --gray-100: #f4f4f5;
  --gray-200: #e4e4e7;
  --gray-300: #d4d4d8;
  --gray-400: #a1a1aa;
  --gray-500: #71717a;
  --gray-600: #52525b;
  --gray-700: #3f3f46;
  --gray-800: #27272a;
  --gray-900: #18181b;
}
```

### Semantic Colors
```css
:root {
  --success: #10b981;
  --success-light: #34d399;
  --success-dark: #059669;
  
  --error: #ef4444;
  --error-light: #f87171;
  --error-dark: #dc2626;
  
  --warning: #f59e0b;
  --warning-light: #fbbf24;
  --warning-dark: #d97706;
  
  --info: #3b82f6;
  --info-light: #60a5fa;
  --info-dark: #2563eb;
}
```

### Background Colors
```css
:root {
  --bg-primary: #000000;
  --bg-secondary: #0a0a0a;
  --bg-tertiary: #1a1a1a;
  --bg-card: rgba(255, 255, 255, 0.05);
  --bg-glass: rgba(255, 255, 255, 0.1);
}
```

### Dark Mode Support
```css
[data-theme="dark"] {
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-tertiary: rgba(255, 255, 255, 0.5);
  --border-primary: rgba(255, 255, 255, 0.1);
  --border-secondary: rgba(255, 255, 255, 0.05);
}
```

## Typography System

### Font Families
```css
:root {
  --font-primary: 'Inter', system-ui, -apple-system, sans-serif;
  --font-secondary: 'Geist Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### Typography Scale (Modular 1.25 Ratio)
```css
:root {
  /* Headings */
  --text-h1: 2rem;      /* 32px */
  --text-h2: 1.5rem;    /* 24px */
  --text-h3: 1.25rem;   /* 20px */
  --text-h4: 1.125rem;  /* 18px */
  
  /* Body Text */
  --text-lg: 1rem;      /* 16px */
  --text-base: 0.875rem; /* 14px */
  --text-sm: 0.75rem;   /* 12px */
  --text-xs: 0.6875rem; /* 11px */
}
```

### Line Heights
```css
:root {
  --leading-h1: 2.5rem;   /* 40px */
  --leading-h2: 2rem;     /* 32px */
  --leading-h3: 1.75rem;  /* 28px */
  --leading-h4: 1.75rem;  /* 28px */
  --leading-lg: 1.5rem;   /* 24px */
  --leading-base: 1.25rem; /* 20px */
  --leading-sm: 1rem;     /* 16px */
}
```

### Font Weights
```css
:root {
  --font-light: 300;
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

## Spacing System

### Base Unit: 8px (0.5rem)
```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
  --space-24: 6rem;    /* 96px */
}
```

## Border Radius System
```css
:root {
  --radius-sm: 0.25rem;  /* 4px */
  --radius-md: 0.5rem;   /* 8px */
  --radius-lg: 0.75rem;  /* 12px */
  --radius-xl: 1rem;     /* 16px */
  --radius-2xl: 1.5rem;  /* 24px */
  --radius-full: 9999px;
}
```

## Shadow System
```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-glow: 0 0 20px rgba(239, 209, 53, 0.3);
  --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

## Component Design Patterns

### Tool Card Design
```css
.tool-card {
  border-radius: var(--radius-xl);
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-primary);
  transition: all 0.25s ease;
  padding: var(--space-6);
  position: relative;
}

.tool-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--brand-yellow);
}

.tool-card-category {
  background: var(--brand-yellow);
  color: var(--gray-900);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.tool-card-favorite {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-full);
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-card-premium-lock {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}
```

### Track Card Design
```css
.track-card {
  border-radius: var(--radius-2xl);
  overflow: hidden;
  position: relative;
  height: 16rem;
  background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
}

.track-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.track-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--space-6);
}

.track-card-progress {
  width: 100%;
  height: 0.25rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-3);
}

.track-card-progress-fill {
  height: 100%;
  background: var(--brand-yellow);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}
```

### Chat Interface Design
```css
.chat-container {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-primary);
  height: 600px;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border-primary);
  background: var(--bg-secondary);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.chat-message-user {
  background: var(--brand-yellow);
  color: var(--gray-900);
  border-radius: var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  align-self: flex-end;
  max-width: 70%;
}

.chat-message-assistant {
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  align-self: flex-start;
  max-width: 70%;
}

.chat-input {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border-primary);
  background: var(--bg-secondary);
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}
```

### Button System
```css
.btn-primary {
  background: var(--brand-yellow);
  color: var(--gray-900);
  border: none;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--brand-yellow-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--bg-glass);
  border-color: var(--brand-yellow);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: none;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: var(--bg-glass);
  color: var(--text-primary);
}
```

## Animation & Transitions

### Timing Functions
```css
:root {
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Duration Scale
```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --duration-slower: 500ms;
}
```

### Common Animations
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(239, 209, 53, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(239, 209, 53, 0.5);
  }
}

.animate-fade-in-up {
  animation: fadeInUp var(--duration-slow) var(--ease-out);
}

.animate-glow {
  animation: glow 2s var(--ease-in-out) infinite;
}
```

## Responsive Breakpoints
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

## Accessibility Features

### Focus States
```css
.focus-visible {
  outline: 2px solid var(--brand-yellow);
  outline-offset: 2px;
}
```

### Color Contrast Compliance
- All text meets WCAG AA standards (4.5:1 ratio minimum)
- Interactive elements have minimum 3:1 contrast
- Focus indicators exceed 3:1 contrast requirement

### Touch Targets
- Minimum 44px (2.75rem) for all interactive elements
- Adequate spacing between touch targets (8px minimum)