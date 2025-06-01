# Tailwind CSS Setup

This document describes the Tailwind CSS configuration for the Remote Map application.

## 🚀 Setup Complete

✅ Tailwind CSS v4.1.8 installed  
✅ PostCSS and Autoprefixer configured  
✅ Custom color system with CSS variables  
✅ Utility components created  
✅ Design system documented  

## 📁 File Structure

```
js/
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── src/
│   ├── index.css               # Global styles with Tailwind directives
│   └── App.css                 # App-specific styles
├── components/
│   └── ui/                     # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Sidebar.tsx
│       ├── MapControls.tsx
│       └── index.ts
├── lib/
│   └── utils.ts               # Utility functions (cn for className merging)
└── styles/
    └── theme.ts               # Design system configuration
```

## 🎨 Design System

### Colors
- **Primary**: Blue color scheme for main actions
- **Secondary**: Gray color scheme for secondary elements
- **Background**: Light gray (#f9fafb) for the main background
- **Card**: White backgrounds with subtle shadows

### Components
- **Sidebar**: 320px width with white background and shadow
- **Cards**: Rounded corners with borders and shadows
- **Buttons**: Multiple variants (default, outline, secondary, ghost)
- **Map Controls**: Floating controls with backdrop blur

### Typography
- **Font Family**: Inter (from Google Fonts)
- **Headings**: Bold weights for titles
- **Body**: Regular weight for content

## 🛠️ Usage

### Basic Components
```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '../components/ui'

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="primary">Click me</Button>
      </CardContent>
    </Card>
  )
}
```

### Utility Classes
```tsx
// Layout
<div className="flex h-screen w-screen">
  <aside className="w-80 bg-white shadow-lg">
    {/* Sidebar content */}
  </aside>
  <main className="flex-1">
    {/* Main content */}
  </main>
</div>

// Spacing and Typography
<div className="p-6 space-y-4">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
  <p className="text-sm text-gray-600">Description</p>
</div>
```

## 📱 Responsive Design

The layout is designed to be responsive:
- **Desktop**: Full sidebar + map layout
- **Tablet**: Collapsible sidebar 
- **Mobile**: Overlay sidebar with full-width map

## 🔧 Customization

### Adding New Colors
Edit `tailwind.config.js` and `index.css` to add new color variables:

```js
// tailwind.config.js
colors: {
  custom: {
    DEFAULT: "hsl(var(--custom))",
    foreground: "hsl(var(--custom-foreground))",
  }
}
```

```css
/* index.css */
:root {
  --custom: 120 100% 50%;
  --custom-foreground: 0 0% 100%;
}
```

### Creating New Components
Follow the pattern in `components/ui/` for consistent styling and TypeScript support.

## 🌙 Dark Mode

The color system is prepared for dark mode with CSS variables. To enable:

1. Add dark mode variants to components
2. Toggle the `dark` class on the root element
3. Ensure proper contrast ratios

## 📦 Dependencies

```json
{
  "tailwindcss": "^4.1.8",
  "autoprefixer": "^10.4.21",
  "postcss": "^8.5.4",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.3.0"
}
```

## 🎯 Next Steps

1. Add animations and transitions
2. Implement dark mode toggle
3. Add more specialized map components
4. Create responsive breakpoints for mobile
5. Add accessibility features (focus states, ARIA labels)
