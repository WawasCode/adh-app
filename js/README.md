# UI Components and Tailwind Setup

This project includes the following reusable UI components, implemented as named function exports with JSDoc comments:

- **Card**: A styled container for content, with subcomponents for header, title, description, content, and footer. See `src/components/ui/Card.tsx`.
- **Input**: A styled input field for forms. See `src/components/ui/Input.tsx`.
- **Button**: A styled button supporting variants and sizes. See `src/components/ui/Button.tsx`.

All components use Tailwind CSS utility classes and are designed to work with the local Inter font (see `src/index.css`). Path aliasing is set up (`@/*` for `src/*` and `~/*` for the project root `/js/*`).

### Usage Example

Import the components you need (example from a file within `src`):

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '~/lib/utils';
```

### Tailwind and Fonts
- Tailwind CSS is configured in `tailwind.config.js` and styles are in `src/index.css`.
- The Inter font is loaded locally from `src/assets/fonts` and applied globally.

### Main View
The application renders a responsive mapping experience managed by `MobileLayout` in `src/MobileUI.tsx`.
- On **Desktop (≥ 769 px)**, it shows only the `<RemoteMapView />` (from `src/map/RemoteMapView.tsx`).
- On **Mobile (≤ 768 px)**, it overlays search, filters, map controls, bottom navigation, and a separate navigation planner panel over the map.
