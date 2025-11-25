# Design System Guide for Couples Timer

## Color Palette

### Primary Colors
- **Primary 500**: `#0ea5e9` - Main brand color
- **Primary 600**: `#0284c7` - For hover states and emphasis

### Speaker Colors
- **Speaker A**: Red shades (for the first speaker)
  - 500: `#ef4444`
  - 600: `#dc2626`
- **Speaker B**: Blue shades (for the second speaker) 
  - 500: `#0ea5e9`
  - 600: `#0284c7`

### Therapeutic Colors
- **Light**: `#f8fafc` - Backgrounds
- **Medium**: `#e2e8f0` - Borders and dividers
- **Dark**: `#94a3b8` - Subtle text and icons

## Typography
- **Font Family**: Inter (with system fallbacks)
- **Scale**: Using Tailwind's default scale with emphasis on readability

## Spacing
- Using Tailwind's default spacing scale (4px base)
- Consistent use of `p-*`, `m-*`, `gap-*` utilities

## Animations
- `pulse-slow`: 3-second pulse for subtle emphasis
- `breathing`: 8-second opacity cycle for calming effect

## Component Guidelines

### Timer Display
- Large, highly readable numbers
- Circular progress visualization
- Smooth transitions between phases

### Phase Indicators
- Clear differentiation between phase types
- Visual feedback for active phase
- Consistent styling with therapeutic aesthetic

### Buttons
- Rounded corners (using `rounded-lg`)
- Consistent sizing and padding
- Clear visual feedback on interaction