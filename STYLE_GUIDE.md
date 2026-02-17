# ElderSafe Style Guide

## Overview

This guide documents the ElderSafe design system implementation and provides guidelines for maintaining consistent styling across the application.

## Design System Architecture

### Core Files

- **`styles/theme.js`** - Central design tokens (colors, typography, spacing, shadows, etc.)
- **`styles/scaling.js`** - Responsive scaling utilities for cross-device support
- **`styles/buttonStyles.js`** - Interactive button states and utilities
- **`styles/formStyles.js`** - Form input states and validation styling
- **`styles/typography.js`** - Text style utilities and helpers
- **`styles/Styles.js`** - Main application styles (refactored to use theme)
- **`styles/WelcomeStyles.js`** - Onboarding/welcome screen styles (refactored to use theme)

## Color System

### Usage

```javascript
import { colors } from '../styles/theme';

// Background colors
backgroundColor: colors.background.primary    // #1C1C1E - Main background
backgroundColor: colors.background.secondary  // #2C2C2E - Cards, elevated elements
backgroundColor: colors.background.tertiary   // #1E1E1E - Alternative card bg

// Text colors
color: colors.text.primary     // #FFFFFF - Main text
color: colors.text.secondary   // #A0A0A0 - Muted text
color: colors.text.disabled    // #666666 - Disabled text

// Accent colors
color: colors.accent.primary   // #24a0ed - Main brand color
color: colors.accent.secondary // #87CEEB - Light blue

// Interactive states
backgroundColor: colors.interactive.pressed  // Pressed overlay
borderColor: colors.interactive.focus        // Focus state

// Status colors
color: colors.status.success   // #4CAF50 - Success indicators
color: colors.status.warning   // #FF9800 - Warnings
color: colors.status.error     // #F44336 - Errors

// Borders
borderColor: colors.border.primary  // #FFFFFF - Main borders
borderColor: colors.border.accent   // #24a0ed - Accent borders
borderColor: colors.border.error    // #F44336 - Error borders
```

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `colors.background.primary` | #1C1C1E | Main app background |
| `colors.background.secondary` | #2C2C2E | Cards, buttons |
| `colors.background.tertiary` | #1E1E1E | Room cards |
| `colors.accent.primary` | #24a0ed | Brand color, links, focus states |
| `colors.accent.secondary` | #87CEEB | Light blue accents |
| `colors.text.primary` | #FFFFFF | Main text |
| `colors.text.secondary` | #A0A0A0 | Muted text |
| `colors.status.error` | #F44336 | Error messages, validation |
| `colors.status.success` | #4CAF50 | Success messages |

## Typography

### Usage

```javascript
import { typography } from '../styles/theme';
// Or import specific utilities
import { scaledHeadingLarge, scaledBodyText, scaledCaptionText } from '../styles/typography';

// Using theme directly
fontSize: typography.h1.fontSize,      // 35
fontWeight: typography.h1.fontWeight,  // 'bold'
lineHeight: typography.h1.lineHeight,  // 42

// Using typography utilities (pre-styled)
<Text style={scaledHeadingLarge}>Large Heading</Text>
<Text style={scaledBodyText}>Body text content</Text>
<Text style={scaledCaptionText}>Small caption text</Text>
```

### Typography Scale

| Style | Font Size | Font Weight | Usage |
|-------|-----------|-------------|-------|
| `typography.h1` | 35 | bold | Page titles |
| `typography.h2` | 28 | bold | Section headings |
| `typography.h3` | 25 | bold | Subsection headings |
| `typography.body` | 20 | normal | Main content |
| `typography.bodySmall` | 18 | normal | Secondary content |
| `typography.caption` | 15 | normal | Captions, helper text |
| `typography.button` | 20 | bold | Button labels |
| `typography.display` | 50 | bold | Large numbers, scores |

## Spacing System

### Usage

```javascript
import { spacing, layoutSpacing } from '../styles/theme';

// Base spacing (8px grid)
margin: spacing.xs,    // 4px
margin: spacing.sm,    // 8px
margin: spacing.md,    // 16px
margin: spacing.lg,    // 24px
margin: spacing.xl,    // 32px
margin: spacing.xxl,   // 48px

// Semantic spacing
padding: layoutSpacing.screenPadding,  // 24px - screen edges
padding: layoutSpacing.cardPadding,    // 16px - inside cards
gap: layoutSpacing.itemGap,            // 16px - between items
```

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `spacing.xs` | 4 | Tight spacing |
| `spacing.sm` | 8 | Small spacing |
| `spacing.md` | 16 | Medium spacing |
| `spacing.lg` | 24 | Large spacing |
| `spacing.xl` | 32 | Extra large spacing |
| `spacing.xxl` | 48 | Section spacing |

## Responsive Scaling

### Usage

```javascript
import { horizontalScale, verticalScale, moderateScale, wp, hp } from '../styles/scaling';

// Scale based on screen width
width: horizontalScale(20),        // Scales with screen width
marginLeft: horizontalScale(10),

// Scale based on screen height
height: verticalScale(40),
marginTop: verticalScale(20),

// Moderate scale (reduced factor for proportional sizing)
fontSize: moderateScale(20),       // Balanced scaling

// Percentage-based
width: wp(80),  // 80% of screen width
height: hp(50), // 50% of screen height
```

### Guidelines

- Use `moderateScale()` for font sizes to prevent text from becoming too large on larger screens
- Use `horizontalScale()` for widths and horizontal margins/padding
- Use `verticalScale()` for heights and vertical margins/padding
- Consider using percentage-based sizing (`wp`, `hp`) for large containers

## Interactive States

### Pressable Components

```javascript
import { Pressable } from 'react-native';
import { primaryButton, dashboardCard, getButtonStyle } from '../styles/buttonStyles';

// Using style function
<Pressable
  style={({ pressed }) => [
    styles.myButton,
    pressed && { opacity: 0.7 }
  ]}
  onPress={handlePress}
  accessibilityLabel="Button description"
  accessibilityRole="button"
>
  <Text>Press Me</Text>
</Pressable>

// Using button style utilities
<Pressable
  style={({ pressed, focused }) =>
    getButtonStyle(primaryButton, pressed, false, focused)
  }
  onPress={handlePress}
>
  <Text style={primaryButtonText.default}>Submit</Text>
</Pressable>
```

### Button Styles

Available button styles in `buttonStyles.js`:

- **`primaryButton`** - Default outlined button
- **`secondaryButton`** - Card-style button with background
- **`accentButton`** - Highlighted action button
- **`dashboardCard`** - Dashboard card with press state
- **`cardTouchable`** - General touchable card
- **`iconButton`** - Icon-only button

Each style has:
- `default` - Base state
- `pressed` - Active press state
- `disabled` - Disabled state
- `focus` - Keyboard focus state

## Form Inputs

### Input States

```javascript
import { getInputContainerStyle, errorMessage } from '../styles/formStyles';

const [focused, setFocused] = useState(false);
const [error, setError] = useState(null);

<View style={getInputContainerStyle(focused, !!error, false, false)}>
  <TextInput
    style={formStyles.textInputDefault}
    onFocus={() => setFocused(true)}
    onBlur={() => setFocused(false)}
    placeholderTextColor={colors.text.secondary}
  />
</View>

{error && (
  <View style={errorMessage.container}>
    <Text style={errorMessage.text}>{error}</Text>
  </View>
)}
```

### Form Validation

- **Default state** - `borderColor: colors.border.secondary`
- **Focus state** - `borderColor: colors.border.focus`, `borderWidth: 2`
- **Error state** - `borderColor: colors.border.error`, `borderWidth: 2`
- **Success state** - `borderColor: colors.status.success`, `borderWidth: 2`

## Shadows

### Usage

```javascript
import { shadows } from '../styles/theme';

// Apply shadow spread
...shadows.sm,  // Subtle shadow
...shadows.md,  // Standard shadow
...shadows.lg,  // Prominent shadow
```

### Shadow Definitions

| Size | Offset | Opacity | Radius | Elevation (Android) |
|------|--------|---------|--------|---------------------|
| sm | (0, 2) | 0.1 | 3 | 2 |
| md | (0, 4) | 0.2 | 5 | 5 |
| lg | (0, 6) | 0.3 | 8 | 8 |

## Accessibility

### Minimum Standards

- **Tap Targets**: Minimum 44x44px (iOS) or 48x48dp (Android)
- **Text Size**: Minimum 16px for body text
- **Color Contrast**: WCAG AA compliant (4.5:1 for normal text, 3:1 for large text)

### Implementation

```javascript
import { accessibility } from '../styles/theme';

// Ensure minimum tap target
<Pressable
  style={{
    minWidth: accessibility.minTapTarget.width,
    minHeight: accessibility.minTapTarget.height,
  }}
  accessibilityLabel="Descriptive label"
  accessibilityRole="button"
  accessibilityHint="What happens when pressed"
  accessibilityState={{ disabled: false }}
>
  {/* Button content */}
</Pressable>
```

### Accessibility Props

Always include these props on interactive elements:

- `accessibilityLabel` - Describes the element
- `accessibilityRole` - Element type (button, link, checkbox, etc.)
- `accessibilityHint` - What happens when interacted with
- `accessibilityState` - Current state (checked, disabled, etc.)

## Border Radius

```javascript
import { borderRadius } from '../styles/theme';

borderRadius: borderRadius.sm,    // 5 - small radius
borderRadius: borderRadius.md,    // 8 - medium radius
borderRadius: borderRadius.lg,    // 10 - large radius
borderRadius: borderRadius.xl,    // 20 - extra large radius
borderRadius: borderRadius.round, // 100 - circular elements
```

## Common Patterns

### Card Component

```javascript
<View style={[
  {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: horizontalScale(spacing.md),
    marginBottom: verticalScale(spacing.md),
  },
  shadows.md
]}>
  <Text style={scaledBodyText}>Card content</Text>
</View>
```

### Interactive Button

```javascript
<Pressable
  style={({ pressed }) => [
    primaryButton.default,
    pressed && primaryButton.pressed
  ]}
  onPress={handlePress}
  accessibilityLabel="Action button"
  accessibilityRole="button"
>
  <Text style={primaryButtonText.default}>Submit</Text>
</Pressable>
```

### Form Input with Validation

```javascript
const [value, setValue] = useState('');
const [focused, setFocused] = useState(false);
const [error, setError] = useState(null);

<View>
  <Text style={[
    formStyles.labelDefault,
    error && formStyles.labelError
  ]}>
    Field Label
  </Text>

  <TextInput
    style={getInputContainerStyle(focused, !!error, false, false)}
    value={value}
    onChangeText={(text) => {
      setValue(text);
      if (text) setError(null);
    }}
    onFocus={() => setFocused(true)}
    onBlur={() => setFocused(false)}
    placeholderTextColor={colors.text.secondary}
  />

  {error && (
    <View style={errorMessage.container}>
      <Text style={errorMessage.text}>{error}</Text>
    </View>
  )}
</View>
```

## Best Practices

### DO

✅ Import theme constants instead of hardcoding values
✅ Use Pressable instead of TouchableOpacity for better control
✅ Include accessibility props on all interactive elements
✅ Use semantic color names (e.g., `colors.status.error` not `colors.red`)
✅ Apply consistent spacing using the spacing scale
✅ Use moderateScale for font sizes
✅ Test on multiple screen sizes

### DON'T

❌ Hardcode hex color values
❌ Use inline styles for colors (use theme)
❌ Skip accessibility labels
❌ Use TouchableOpacity without press state feedback
❌ Set font sizes smaller than 16px for body text
❌ Create custom spacing values outside the scale
❌ Forget to test with screen readers

## Migration Guide

### Replacing Hardcoded Colors

**Before:**
```javascript
backgroundColor: '#1C1C1E',
color: 'white',
borderColor: '#24a0ed',
```

**After:**
```javascript
import { colors } from '../styles/theme';

backgroundColor: colors.background.primary,
color: colors.text.primary,
borderColor: colors.accent.primary,
```

### Replacing TouchableOpacity

**Before:**
```javascript
<TouchableOpacity onPress={handlePress}>
  <Text>Press Me</Text>
</TouchableOpacity>
```

**After:**
```javascript
<Pressable
  style={({ pressed }) => [
    styles.button,
    pressed && { opacity: 0.7 }
  ]}
  onPress={handlePress}
  accessibilityLabel="Descriptive label"
  accessibilityRole="button"
>
  <Text>Press Me</Text>
</Pressable>
```

## File Structure

```
eldersafe/
├── styles/
│   ├── theme.js              # Central design tokens
│   ├── scaling.js            # Responsive scaling utilities
│   ├── buttonStyles.js       # Button states and utilities
│   ├── formStyles.js         # Form input styles
│   ├── typography.js         # Text style utilities
│   ├── Styles.js            # Main app styles (refactored)
│   └── WelcomeStyles.js     # Welcome screen styles (refactored)
├── pages/                    # Page components (updated to use theme)
│   ├── Home.js              # ✅ Updated with Pressable & theme
│   ├── FirstLoad.js         # ✅ Updated with forms & theme
│   ├── Rooms.js
│   ├── Tips.js
│   └── Settings.js
├── App.js                    # ✅ Updated with navigation theme
└── STYLE_GUIDE.md           # This file
```

## Implementation Status

### ✅ Completed

- Theme system foundation (colors, typography, spacing, shadows)
- Scaling utilities (horizontal, vertical, moderate)
- Button state styles (primary, secondary, accent, card)
- Form input styles (default, focus, error, success states)
- Typography utilities (headings, body, captions)
- Navigation theme integration (App.js)
- Core style files refactored (Styles.js, WelcomeStyles.js)
- Home page with interactive states
- FirstLoad page with forms and validation

### 🟡 Partially Complete

- Interactive states on remaining pages (Rooms, Tips, Settings)
- Consistent spacing application across all pages
- Full accessibility implementation

## Support

For questions or issues with the design system, refer to this guide or check the inline documentation in each style file.

**Last Updated:** February 2026
