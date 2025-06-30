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

### Geocoding
The application uses the Photon geocoding service by Komoot to provide a location search functionality. This service allows users to search for locations and retrieve detailed geographical information.

- **Service Integration**: The `searchLocations` method in `geocodingService.ts` is used to interact with the Photon API. It takes a query string and returns an array of `PhotonFeature` objects. The Photon features are based on the [GeocodeJson Format](https://github.com/geocoders/geocodejson-spec/tree/master/draft).

- **Usage**: To use the geocoding service, import the `searchLocations` method from `geocodingService.ts`. This method handles the API call and data retrieval, making it easy to integrate location search into any component.

- **Example**:
```ts
import { searchLocations, PhotonFeature } from "@/services/geocodingService";

const results = await searchLocations("Berlin");
results.forEach((result: PhotonFeature) => {
  console.log(`Location: ${result.properties.name}, Coordinates: ${result.geometry.coordinates}`);
});
```

- **SearchBar Component**: The `SearchBar` component in the UI leverages this service to provide a user-friendly search interface. It displays search results and allows users to select a location, which then updates the map view and flys the user to the selected location.