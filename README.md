# alexbot UI Kit

A complete, theme-aware React component library extracted from the alexbot platform. Designed for building dark-mode-first dashboards, task management UIs, and developer tooling interfaces.

## Quick Start

### Prerequisites

- React 18+
- Tailwind CSS v4
- `@phosphor-icons/react`
- `clsx`
- `sonner` (for toasts)
- `Plus Jakarta Sans` and `JetBrains Mono` fonts

### Installation

```bash
# Copy the ui-kit folder into your project
cp -r ui-kit/ your-project/src/ui-kit/

# Install peer dependencies
npm install @phosphor-icons/react clsx sonner
```

### Setup

1. **Add fonts to your HTML `<head>`** (required for proper typography):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=JetBrains+Mono:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

The kit uses **Plus Jakarta Sans** as the primary sans-serif font and **JetBrains Mono** for code/monospace elements.

2. **Import the global styles** in your CSS entry point:

```css
@import "./ui-kit/styles/globals.css";
```

3. **Icons**: The kit uses [Phosphor Icons](https://phosphoricons.com/) exclusively. Install the React package:

```bash
npm install @phosphor-icons/react
```

Common icons used throughout the kit:

```jsx
import {
  // Navigation & actions
  Plus, X, Check, ArrowLeft, ArrowRight, ArrowUp,
  MagnifyingGlass, PencilSimple, Trash, Copy,
  // Status & feedback
  Spinner, CheckCircle, XCircle, Warning, Info,
  // Content
  FolderOpen, ClipboardText, Terminal, Tray,
  BookOpen, SlidersHorizontal, Gauge, Kanban,
  // People
  User, UsersThree, UserCircle,
  // Misc
  CalendarBlank, Tag, ChatCircle, Megaphone,
  Compass, Sparkle, Palette, GitBranch,
} from '@phosphor-icons/react';
```

4. **Wrap your app with the ThemeProvider**:

```jsx
import { ThemeProvider, ToastProvider } from './ui-kit';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider />
      {/* Your app */}
    </ThemeProvider>
  );
}
```

5. **Use components**:

```jsx
import { Button, Modal, CalendarPicker, Badge } from './ui-kit';
```

---

## Theming

The kit ships with 7 built-in themes and supports unlimited custom themes.

### Built-in Themes

| Theme | Description | Surface | Accent |
|-------|-------------|---------|--------|
| **Midnight** | Dark charcoal | `#0c0c10` | `#ff6b35` (burnt orange) |
| **Sand** | Warm beige (light) | `#f5f0e8` | `#c27040` (terracotta) |
| **Graphite** | Cool slate | `#101215` | `#4d9ecf` (steel blue) |
| **Ash** | Warm gray | `#141210` | `#c99435` (muted amber) |
| **Noir** | True black | `#000000` | `#22c55e` (neon green) |
| **Aurora** | Deep indigo | `#07080f` | `#7c3aed` (polar glow) |
| **Parchment** | Light cream | `#f8f6f1` | `#1a8068` (forest teal) |

### Using Themes

```jsx
import { useTheme } from './ui-kit';

function ThemeSwitcher() {
  const { themeId, setTheme, themes } = useTheme();

  return (
    <div>
      {Object.values(themes).map(t => (
        <button key={t.id} onClick={() => setTheme(t.id)}>
          {t.name}
        </button>
      ))}
    </div>
  );
}
```

### Custom Themes

```jsx
const { saveCustomTheme, deleteCustomTheme, exportTheme, importTheme } = useTheme();

// Create a custom theme
saveCustomTheme({
  name: 'My Theme',
  description: 'Custom dark theme',
  vars: {
    '--color-surface': '#0a0a12',
    '--color-surface-raised': '#12121a',
    '--color-accent': '#e040fb',
    // ... all CSS variables
  },
  bgImage: 'https://example.com/bg.jpg', // optional
});

// Export/import as JSON
const json = exportTheme('my-theme-id');
importTheme(json);
```

### CSS Variables Reference

All components use these CSS custom properties, which are set by the ThemeProvider:

```
Surfaces:          --color-surface, --color-surface-raised, --color-surface-overlay, --color-surface-hover
Borders:           --color-border, --color-border-subtle, --color-border-accent
Text:              --color-text-primary, --color-text-secondary, --color-text-muted
Accent:            --color-accent, --color-accent-hover, --color-accent-muted, --color-accent-dim
Status:            --color-success, --color-warning, --color-danger, --color-info, --color-purple
Typography:        --font-sans, --font-mono
Spacing:           --spacing-sidebar (240px)
Radii:             --radius-xs through --radius-4xl
Background:        --bg-pattern-primary, --bg-pattern-secondary
```

---

## Components

### Primitives

#### Button
Multi-variant button with icon support.

```jsx
import { Button } from './ui-kit';
import { Plus, Trash } from '@phosphor-icons/react';

<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button size="sm" icon={Plus}>Small with Icon</Button>
<Button size="lg" loading>Loading...</Button>
<Button disabled>Disabled</Button>
```

**Props**: `variant` (`primary` | `secondary` | `ghost` | `danger`), `size` (`sm` | `md` | `lg`), `icon`, `loading`, `disabled`, `className`, `onClick`, `type`

#### Input
Text input with optional icon and label.

```jsx
import { Input } from './ui-kit';
import { MagnifyingGlass } from '@phosphor-icons/react';

<Input placeholder="Search..." icon={MagnifyingGlass} />
<Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
```

**Props**: `label`, `icon`, `className`, and all standard `<input>` props

#### Checkbox
Animated checkbox with multiple sizes.

```jsx
import { Checkbox } from './ui-kit';

<Checkbox checked={val} onChange={setVal} />
<Checkbox size="sm" />
<Checkbox size="lg" indeterminate />
<Checkbox disabled />
```

**Props**: `checked`, `onChange`, `size` (`sm` | `md` | `lg`), `indeterminate`, `disabled`, `label`

#### Badge
Status indicator badges.

```jsx
import { Badge } from './ui-kit';

<Badge status="completed">Done</Badge>
<Badge status="in_progress" dot>Running</Badge>
<Badge status="failed">Error</Badge>
<Badge status="pending">Waiting</Badge>
```

**Props**: `status` (maps to theme colors), `dot` (show status dot), `className`, `children`

#### Tooltip
Hover tooltip with configurable position.

```jsx
import { Tooltip } from './ui-kit';

<Tooltip content="More info" position="top">
  <span>Hover me</span>
</Tooltip>
```

**Props**: `content`, `position` (`top` | `bottom` | `left` | `right`), `children`

#### ProgressBar
Animated progress indicator.

```jsx
import { ProgressBar } from './ui-kit';

<ProgressBar value={65} />
<ProgressBar value={100} variant="success" />
```

**Props**: `value` (0-100), `variant`, `className`

#### Loader
Loading spinner with optional label.

```jsx
import { Loader } from './ui-kit';

<Loader />
<Loader label="Loading data..." />
```

**Props**: `label`, `className`

---

### Form Controls

#### CustomSelect
Portal-based dropdown select that works inside modals.

```jsx
import { CustomSelect } from './ui-kit';

<CustomSelect
  value={selected}
  onChange={setSelected}
  options={[
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
  ]}
  placeholder="Choose..."
  size="sm"
/>
```

**Props**: `value`, `onChange`, `options` (`{ value, label }[]`), `placeholder`, `size` (`sm` | `md`), `className`

#### ColorPicker
Color picker with presets, grayscale palette, and hue slider.

```jsx
import { ColorPicker } from './ui-kit';

<ColorPicker value="#ff6b35" onChange={setColor} />
```

**Props**: `value` (hex string), `onChange` (receives hex string), `className`

#### CalendarPicker
Full calendar date picker with month/year quick select.

```jsx
import { CalendarPicker } from './ui-kit';

<CalendarPicker
  value={selectedDate}
  onChange={(date) => console.log(date)} // Date object or null
  label="Due Date"
  placeholder="Pick a date..."
  clearable
/>
```

**Props**: `value` (Date | ISO string | null), `onChange` (receives Date | null), `label`, `placeholder`, `clearable`, `className`

**Features**:
- Click month/year header to switch to month picker, then year picker
- 12-year grid for fast year navigation
- Today shortcut button
- Portal-based popup (works inside modals)

#### PathInput
File path input with autocomplete.

```jsx
import { PathInput } from './ui-kit';

<PathInput value={path} onChange={setPath} />
```

**Props**: `value`, `onChange`, `placeholder`, `className`

---

### Layout

#### Card

```jsx
import { Card, CardHeader, CardContent, CardFooter } from './ui-kit';

<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Body content</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

#### Table

```jsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui-kit';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Task 1</TableCell>
      <TableCell><Badge status="completed">Done</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### Tabs

```jsx
import { Tabs, Tab } from './ui-kit';

<Tabs>
  <Tab label="General" active />
  <Tab label="Advanced" />
  <Tab label="Danger Zone" />
</Tabs>
```

#### Modal

```jsx
import { Modal, ModalFooter, Button } from './ui-kit';

<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Confirm" description="Are you sure?">
  <p>Modal content here</p>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </ModalFooter>
</Modal>
```

**Props**: `open`, `onClose`, `title`, `description`, `size` (`sm` | `md` | `lg` | `xl`), `hideClose` (hides the X button), `children`

#### ConfirmModal
Pre-built confirmation dialog.

```jsx
import { ConfirmModal } from './ui-kit';

<ConfirmModal
  open={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Item"
  message="This cannot be undone."
  variant="danger"
  confirmLabel="Delete"
/>
```

**Props**: `open`, `onClose`, `onConfirm`, `title`, `message`, `variant` (`danger` | `warning` | `default`), `confirmLabel`, `cancelLabel`

#### EmptyState

```jsx
import { EmptyState } from './ui-kit';
import { Tray } from '@phosphor-icons/react';

<EmptyState
  icon={Tray}
  title="No items"
  description="Get started by creating your first item."
  centered
  action={<Button>Create</Button>}
/>
```

**Props**: `icon`, `title`, `description`, `action`, `centered`, `className`

#### AnimatedList
Staggered animation wrapper for lists.

```jsx
import { AnimatedList, AnimatedItem } from './ui-kit';

<AnimatedList>
  {items.map(item => (
    <AnimatedItem key={item.id}>
      <div>{item.name}</div>
    </AnimatedItem>
  ))}
</AnimatedList>
```

---

### Feedback

#### ToastProvider
Theme-aware toast notifications powered by Sonner.

```jsx
import { ToastProvider } from './ui-kit';
import { toast } from 'sonner';

// In your app root:
<ToastProvider />

// Anywhere in your app:
toast.success('Saved!');
toast.error('Something went wrong');
toast.info('New update available');
toast('Neutral message');
```

---

### Skeleton Loaders

Pre-built skeleton layouts for every page type:

```jsx
import {
  DashboardSkeleton,
  TaskListSkeleton,
  TaskDetailSkeleton,
  SessionListSkeleton,
  AgentListSkeleton,
  SettingsSkeleton,
  ProjectsSkeleton,
} from './ui-kit';

// Use while loading:
if (loading) return <DashboardSkeleton />;
```

Available skeletons: `Skeleton`, `DashboardSkeleton`, `TaskListSkeleton`, `TaskDetailSkeleton`, `SessionListSkeleton`, `SessionDetailSkeleton`, `AgentListSkeleton`, `ActivitySkeleton`, `ExpensesSkeleton`, `PeopleSkeleton`, `AlertsSkeleton`, `AISkeleton`, `KnowledgeSkeleton`, `SettingsSkeleton`, `GlobalSettingsSkeleton`, `ProjectsSkeleton`, `GlobalTasksSkeleton`, `DocumentationSkeleton`, `QueueSkeleton`

---

### Composite Components

#### SubtaskTimeline
Collapsible subtask list with status indicators.

```jsx
import { SubtaskTimeline } from './ui-kit';

<SubtaskTimeline
  subtasks={[
    { id: '1', title: 'Setup database', status: 'completed', description: 'Install Postgres' },
    { id: '2', title: 'Create API', status: 'in_progress' },
    { id: '3', title: 'Write tests', status: 'pending' },
  ]}
  defaultOpen={true}
/>
```

**Statuses**: `pending`, `in_progress`, `code_complete`, `tests_passing`, `validated`, `completed`, `rework`, `failed`

#### ThemeGrid
Visual theme selector grid.

```jsx
import { ThemeGrid } from './ui-kit';

<ThemeGrid
  themes={allThemes}
  activeId={currentThemeId}
  onSelect={setTheme}
  onDelete={deleteCustomTheme}
/>
```

#### ActivityFeed
Event timeline for task/project activity.

---

### Navigation

#### Sidebar
Responsive sidebar with icon-based navigation.

#### TopBar
Top navigation bar with search, notifications, profile menu, and connection status.

---

## Global Styles

The `styles/globals.css` file includes:

- **Tailwind v4** theme configuration with all CSS variables
- **Paper grain texture** overlay (subtle noise effect via SVG)
- **Custom scrollbars** (thin, theme-aware)
- **Focus ring removal** on all buttons
- **Selection color** using accent
- **Animation keyframes**: `fade-in`, `slide-in-from-top-2`, `slide-in-from-bottom-4`, `dropdown-in`, `skeleton-pulse`, `spin-once`
- **Fonts**: Plus Jakarta Sans (sans), JetBrains Mono (mono)

---

## File Structure

```
ui-kit/
  index.js              # Main entry point - all exports
  README.md             # This file
  COMPONENTS.md         # Detailed component API docs
  components/           # Base UI primitives
    Button.jsx
    Input.jsx
    Badge.jsx
    Card.jsx
    Checkbox.jsx
    CalendarPicker.jsx
    ColorPicker.jsx
    ConfirmModal.jsx
    CustomSelect.jsx
    EmptyState.jsx
    Loader.jsx
    Modal.jsx
    PathInput.jsx
    ProgressBar.jsx
    Sidebar.jsx
    Skeleton.jsx
    Table.jsx
    Tabs.jsx
    Toast.jsx
    TopBar.jsx
    Tooltip.jsx
    AnimatedList.jsx
    index.js
  composites/           # Higher-level composed components
    SubtaskTimeline.jsx
    ThemeGrid.jsx
    WelcomeModal.jsx
    ActivityFeed.jsx
    ApprovalButton.jsx
    GuidedTour.jsx
    LiveOutputBar.jsx
    GitHubImportModal.jsx
    ProjectSidebar.jsx
    CliStreamPanel.jsx
  hooks/                # Utility hooks
    useSquircle.js
  themes/               # Theme system
    ThemeContext.jsx
  styles/               # Global CSS
    globals.css
  playground/           # Interactive component gallery (Vite app)
    package.json
    vite.config.js
    src/App.jsx
```

## Playground

The UI Kit includes an interactive playground app for previewing and testing all components:

```bash
cd ui-kit/playground
npm install
npm run dev
```

This starts a Vite dev server at `http://localhost:5173` with a full component gallery, live theme switching, and usage examples for every component.

---

## Design Philosophy

- **Theme-first**: Every color references a CSS variable. No hardcoded colors.
- **Portal-based popups**: All dropdowns, calendars, and pickers render via `createPortal` to avoid clipping inside modals or scroll containers.
- **Accessible**: Keyboard navigation, ARIA attributes, focus management.
- **Responsive**: Mobile-first with breakpoint-aware layouts.
- **Performant**: CSS-only animations, no runtime animation libraries for base components.
- **Consistent**: Unified border radii (`rounded-xl`, `rounded-2xl`), spacing, and typography scales.

## License

Part of the alexbot project. See root LICENSE for details.
