import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  MagnifyingGlass, Plus, Trash, Star, Bell, Gear,
  Lightning, Check, X, Eye, User, Calendar, Palette,
  CaretDown, CaretRight, Play, Tray, ChatCircle, Warning, ArrowUp,
  Sun, Moon, CircleHalf, Plugs, GitBranch, Robot,
  Heart, Fire, Sparkle, PaperPlaneTilt, FunnelSimple,
  PencilSimple, Copy, Download, Upload, House, ChartBar,
  ListBullets, Columns, Clock, CheckCircle, XCircle,
  ListChecks, Spinner, ClockCounterClockwise, UserCircle,
  FolderOpen, Paperclip, Users, Terminal,
} from '@phosphor-icons/react';

// Import from individual component files to avoid pulling in app-specific composites
import { Button } from '@ui-kit/components/Button.jsx';
import { Input } from '@ui-kit/components/Input.jsx';
import { Checkbox } from '@ui-kit/components/Checkbox.jsx';
import { Badge } from '@ui-kit/components/Badge.jsx';
import { Tooltip } from '@ui-kit/components/Tooltip.jsx';
import { ProgressBar } from '@ui-kit/components/ProgressBar.jsx';
import { Loader } from '@ui-kit/components/Loader.jsx';
import { CustomSelect } from '@ui-kit/components/CustomSelect.jsx';
import { ColorPicker } from '@ui-kit/components/ColorPicker.jsx';
import { CalendarPicker } from '@ui-kit/components/CalendarPicker.jsx';
import { Card, CardHeader, CardContent, CardFooter } from '@ui-kit/components/Card.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@ui-kit/components/Table.jsx';
import { Tabs, Tab } from '@ui-kit/components/Tabs.jsx';
import { Modal, ModalFooter } from '@ui-kit/components/Modal.jsx';
import { ConfirmModal } from '@ui-kit/components/ConfirmModal.jsx';
import { EmptyState } from '@ui-kit/components/EmptyState.jsx';
import { AnimatedList, AnimatedItem } from '@ui-kit/components/AnimatedList.jsx';
import { ToastProvider } from '@ui-kit/components/Toast.jsx';
import { Skeleton } from '@ui-kit/components/Skeleton.jsx';
import { ConfirmSlider } from '@ui-kit/components/ConfirmSlider.jsx';
import { Graphic } from '@ui-kit/components/Graphic.jsx';
import { NotificationPanel } from '@ui-kit/components/NotificationPanel.jsx';
import { ProfileMenu } from '@ui-kit/components/ProfileMenu.jsx';
import { SubtaskTimeline } from '@ui-kit/composites/SubtaskTimeline.jsx';
import { ThemeProvider, useTheme, THEMES } from '@ui-kit/themes/ThemeContext.jsx';
import { useSquircle } from '@ui-kit/hooks/useSquircle.js';

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
function Section({ id, title, description, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-text-primary tracking-tight">{title}</h2>
        {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function DemoCard({ title, children, className = '' }) {
  return (
    <div className={`rounded-2xl bg-surface-raised/60 p-4 space-y-4 ${className}`}>
      {title && <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">{title}</h3>}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NAV                                                                */
/* ------------------------------------------------------------------ */
const NAV = [
  { id: 'buttons', label: 'Buttons', icon: Lightning },
  { id: 'inputs', label: 'Inputs', icon: PencilSimple },
  { id: 'selects', label: 'Selects', icon: CaretDown },
  { id: 'checkboxes', label: 'Checkboxes', icon: Check },
  { id: 'badges', label: 'Badges', icon: Star },
  { id: 'tooltips', label: 'Tooltips', icon: ChatCircle },
  { id: 'progress', label: 'Progress', icon: ChartBar },
  { id: 'loaders', label: 'Loaders', icon: Clock },
  { id: 'stats', label: 'Stats', icon: ListChecks },
  { id: 'colorpicker', label: 'Color Picker', icon: Palette },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'cards', label: 'Cards', icon: Copy },
  { id: 'squircle', label: 'Squircle', icon: House },
  { id: 'tables', label: 'Tables', icon: ListBullets },
  { id: 'tabs', label: 'Tabs', icon: Columns },
  { id: 'modals', label: 'Modals', icon: Eye },
  { id: 'empty', label: 'Empty States', icon: Tray },
  { id: 'toasts', label: 'Toasts', icon: Bell },
  { id: 'skeletons', label: 'Skeletons', icon: House },
  { id: 'subtasks', label: 'Subtasks', icon: ListBullets },
  { id: 'projectcard', label: 'Project Card', icon: FolderOpen },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile Menu', icon: UserCircle },
  { id: 'slider', label: 'Confirm Slider', icon: ArrowUp },
  { id: 'graphic', label: 'Graphic', icon: ChartBar },
  { id: 'themes', label: 'Themes', icon: Sun },
];

/* ------------------------------------------------------------------ */
/*  CONTENT                                                            */
/* ------------------------------------------------------------------ */
function PlaygroundContent() {
  const { themeId, setTheme, themes } = useTheme();
  const [activeSection, setActiveSection] = useState('buttons');

  // Demo state
  const [inputVal, setInputVal] = useState('');
  const [selectVal, setSelectVal] = useState('');
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [color, setColor] = useState('#ff6b35');
  const [date, setDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [settingsTab, setSettingsTab] = useState('general');
  const [progress, setProgress] = useState(65);

  // Notification demo
  const [demoNotifs, setDemoNotifs] = useState([
    { id: 1, type: 'task', title: 'Task updated', detail: 'Auth flow moved to in_progress', time: new Date(Date.now() - 120000).toISOString() },
    { id: 2, type: 'success', title: 'QA passed', detail: 'All 12 tests passed', time: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, type: 'warning', title: 'Budget alert', detail: 'GPU budget at 85%', time: new Date(Date.now() - 7200000).toISOString() },
    { id: 4, type: 'error', title: 'Deploy failed', detail: 'Exit code 1 on build step', time: new Date(Date.now() - 18000000).toISOString() },
    { id: 5, type: 'agent', title: 'Codex agent started', detail: 'Processing auth-refactor task', time: new Date(Date.now() - 36000000).toISOString() },
  ]);

  // Squircle demo
  const [sqRef, sqStyle] = useSquircle(28);

  // Track if user clicked a nav item recently -- suppress observer override
  const justClicked = useRef(false);
  const navRef = useRef(null);

  // Auto-scroll sidebar nav to keep active item visible
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const btn = nav.querySelector(`[data-nav="${activeSection}"]`);
    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeSection]);

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (justClicked.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0.1 }
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Scroll to section on click -- step the highlight through each tab sequentially
  const stepping = useRef(false);
  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    justClicked.current = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const fromIdx = NAV.findIndex(n => n.id === activeSection);
    const toIdx = NAV.findIndex(n => n.id === id);

    // If already there or adjacent, just jump
    if (fromIdx === toIdx || Math.abs(fromIdx - toIdx) <= 1 || fromIdx < 0) {
      setActiveSection(id);
      setTimeout(() => { justClicked.current = false; }, 800);
      return;
    }

    // Step through each intermediate tab
    if (stepping.current) {
      // If already stepping, cancel and jump
      setActiveSection(id);
      setTimeout(() => { justClicked.current = false; }, 800);
      return;
    }
    stepping.current = true;
    const dir = toIdx > fromIdx ? 1 : -1;
    const stepDelay = Math.min(60, 400 / Math.abs(toIdx - fromIdx));
    let cur = fromIdx;

    function step() {
      cur += dir;
      setActiveSection(NAV[cur].id);
      if (cur !== toIdx) {
        setTimeout(step, stepDelay);
      } else {
        stepping.current = false;
        setTimeout(() => { justClicked.current = false; }, 600);
      }
    }
    setTimeout(step, stepDelay);
  }, [activeSection]);

  // Set graphite as default theme on first mount
  useEffect(() => {
    if (themeId === 'midnight' && !localStorage.getItem('alexbot-theme')) {
      setTheme('graphite');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Sidebar ────────────────────────────────────── */}
      <aside className="hidden lg:flex fixed top-0 left-0 w-52 h-screen flex-col border-r border-border-subtle bg-surface-raised/50 z-40">
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-base font-bold text-text-primary tracking-tight">
            <span className="text-accent">alex</span> uikit
          </h1>
          <p className="text-[9px] text-text-muted mt-0.5 font-mono uppercase tracking-widest">Component Playground</p>
        </div>
        <nav ref={navRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-none px-2 pb-2 space-y-px">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              data-nav={id}
              onClick={() => scrollTo(id)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors text-left ${
                activeSection === id
                  ? 'bg-surface-overlay text-text-primary'
                  : 'text-text-muted hover:text-text-secondary hover:bg-surface-overlay/50'
              }`}
            >
              <Icon size={13} weight={activeSection === id ? 'fill' : 'regular'} className="shrink-0" />
              {label}
            </button>
          ))}
        </nav>
        {/* Theme quick-switch -- bottom left */}
        <div className="px-3 py-3 border-t border-border-subtle shrink-0">
          <p className="text-[9px] text-text-muted uppercase tracking-wider mb-2 px-1">Theme</p>
          <div className="grid grid-cols-4 gap-1.5">
            {Object.values(themes).filter(t => !t.isCustom).slice(0, 8).map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                title={t.name}
                className={`w-full aspect-square rounded-lg transition-all ${
                  t.id === themeId ? 'ring-2 ring-accent ring-offset-1 ring-offset-surface-raised scale-105' : 'hover:scale-105'
                }`}
                style={{ background: t.vars?.['--color-surface'] || '#0c0c10' }}
              >
                <div className="w-full h-full rounded-lg flex items-center justify-center gap-[2px]">
                  <span className="w-[6px] h-[6px] rounded-full" style={{ background: t.vars?.['--color-accent'] || '#ff6b35' }} />
                  <span className="w-[6px] h-[6px] rounded-full" style={{ background: t.vars?.['--color-text-primary'] || '#ececf2' }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────── */}
      <div className="lg:pl-52">
        <main className="mx-auto max-w-3xl px-5 sm:px-8 py-10 space-y-14">
          {/* Hero */}
          <header className="text-center py-6">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              <span className="text-accent">alex</span> uikit
            </h1>
            <p className="text-sm text-text-secondary mt-1.5 max-w-md mx-auto">
              Theme-aware React component library. Dark-mode-first, built with Tailwind CSS v4 and Phosphor Icons.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent">React 18+</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-info/10 text-info">Tailwind v4</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple/10 text-purple">Phosphor Icons</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-success/10 text-success">{Object.keys(themes).length} Themes</span>
            </div>
          </header>

          {/* ── BUTTONS ─────────────────────────────────── */}
          <Section id="buttons" title="Buttons" description="Multi-variant button with icons, loading, and size support.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <DemoCard title="Variants">
                <div className="flex flex-wrap items-center gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </DemoCard>
              <DemoCard title="Sizes">
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" icon={Plus}>Small</Button>
                  <Button size="md" icon={Star}>Medium</Button>
                  <Button size="lg" icon={Lightning}>Large</Button>
                </div>
              </DemoCard>
              <DemoCard title="States">
                <div className="flex flex-wrap items-center gap-2">
                  <Button loading>Saving...</Button>
                  <Button disabled>Disabled</Button>
                  <Button icon={Trash} variant="ghost" size="sm" className="text-danger hover:text-danger">Delete</Button>
                </div>
              </DemoCard>
            </div>
          </Section>

          {/* ── INPUTS ──────────────────────────────────── */}
          <Section id="inputs" title="Inputs" description="Text inputs with icons, labels, clear buttons, and error states.">
            <DemoCard>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input placeholder="Default input..." value={inputVal} onChange={(e) => setInputVal(e.target.value)} clearable />
                <Input icon={MagnifyingGlass} placeholder="Search..." value="" onChange={() => {}} clearable />
                <Input label="Email" type="email" placeholder="you@example.com" value="test@example.com" onChange={() => {}} clearable />
                <Input label="Error State" error placeholder="Something went wrong" value="" onChange={() => {}} />
              </div>
            </DemoCard>
          </Section>

          {/* ── SELECTS ─────────────────────────────────── */}
          <Section id="selects" title="Custom Select" description="Portal-based dropdown that works inside modals and scroll containers.">
            <DemoCard>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CustomSelect
                  value={selectVal}
                  onChange={setSelectVal}
                  options={[
                    { value: 'react', label: 'React' },
                    { value: 'vue', label: 'Vue' },
                    { value: 'svelte', label: 'Svelte' },
                    { value: 'angular', label: 'Angular' },
                  ]}
                  placeholder="Select a framework..."
                />
                <CustomSelect
                  value=""
                  onChange={() => {}}
                  options={[
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' },
                  ]}
                  placeholder="Select size..."
                  size="sm"
                />
              </div>
            </DemoCard>
          </Section>

          {/* ── CHECKBOXES ──────────────────────────────── */}
          <Section id="checkboxes" title="Checkboxes" description="Animated checkboxes with multiple sizes.">
            <DemoCard>
              <div className="flex items-center gap-6 flex-wrap">
                <Checkbox checked={checked1} onChange={setChecked1} label="Default" />
                <Checkbox checked={checked2} onChange={setChecked2} label="Checked" />
                <Checkbox checked={false} onChange={() => {}} label="Small" size="sm" />
                <Checkbox checked={true} onChange={() => {}} label="Large" size="lg" />
                <Checkbox checked={false} onChange={() => {}} label="Disabled" disabled />
              </div>
            </DemoCard>
          </Section>

          {/* ── BADGES ──────────────────────────────────── */}
          <Section id="badges" title="Badges" description="Status indicator badges with theme-aware colors.">
            <DemoCard>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge status="completed">Completed</Badge>
                <Badge status="in_progress" dot>In Progress</Badge>
                <Badge status="pending">Pending</Badge>
                <Badge status="failed">Failed</Badge>
                <Badge status="review">Review</Badge>
                <Badge status="backlog">Backlog</Badge>
                <Badge status="validated" dot>Validated</Badge>
              </div>
            </DemoCard>
          </Section>

          {/* ── TOOLTIPS ────────────────────────────────── */}
          <Section id="tooltips" title="Tooltips" description="Hover tooltips with configurable position.">
            <DemoCard>
              <div className="flex items-center justify-center gap-6 flex-wrap py-4">
                <Tooltip content="Tooltip on top" position="top">
                  <Button variant="secondary" size="sm">Top</Button>
                </Tooltip>
                <Tooltip content="Tooltip on bottom" position="bottom">
                  <Button variant="secondary" size="sm">Bottom</Button>
                </Tooltip>
                <Tooltip content="Tooltip on left" position="left">
                  <Button variant="secondary" size="sm">Left</Button>
                </Tooltip>
                <Tooltip content="Tooltip on right" position="right">
                  <Button variant="secondary" size="sm">Right</Button>
                </Tooltip>
              </div>
            </DemoCard>
          </Section>

          {/* ── PROGRESS ────────────────────────────────── */}
          <Section id="progress" title="Progress Bars" description="Animated progress indicators.">
            <DemoCard>
              <div className="space-y-3">
                <ProgressBar value={progress} />
                <ProgressBar value={100} />
                <ProgressBar value={30} />
                <div className="flex items-center justify-center gap-3 pt-1">
                  <Button size="sm" variant="ghost" onClick={() => setProgress((p) => Math.max(0, p - 10))}>-10</Button>
                  <span className="text-xs font-mono text-text-muted tabular-nums w-10 text-center">{progress}%</span>
                  <Button size="sm" variant="ghost" onClick={() => setProgress((p) => Math.min(100, p + 10))}>+10</Button>
                </div>
              </div>
            </DemoCard>
          </Section>

          {/* ── LOADERS ─────────────────────────────────── */}
          <Section id="loaders" title="Loaders" description="Loading spinners with optional labels.">
            <DemoCard>
              <div className="flex items-center justify-center gap-10 py-4">
                <Loader />
                <Loader label="Loading data..." />
              </div>
            </DemoCard>
          </Section>

          {/* ── STATS ───────────────────────────────────── */}
          <Section id="stats" title="Stats Row" description="Dashboard-style stat blocks with icon separators. Used on project dashboards and global views.">
            <DemoCard title="Project Stats">
              <div className="grid grid-cols-3 sm:grid-cols-4 rounded-xl overflow-hidden bg-surface-overlay">
                {[
                  { icon: ListChecks, value: '128', label: 'Total Tasks' },
                  { icon: Spinner, value: '14', label: 'In Progress' },
                  { icon: ClockCounterClockwise, value: '6', label: 'Pending' },
                  { icon: UserCircle, value: '3', label: 'Assignees', hideMobile: true },
                ].map((stat, i) => (
                  <div key={stat.label} className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 ${i > 0 ? 'border-l border-border-subtle' : ''} ${stat.hideMobile ? 'hidden sm:flex' : ''}`}>
                    <stat.icon size={18} weight="duotone" className="text-accent shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-base sm:text-lg font-bold text-text-primary tabular-nums leading-none">{stat.value}</span>
                      <span className="text-[9px] sm:text-[10px] text-text-muted mt-0.5 truncate">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </DemoCard>
          </Section>

          {/* ── COLOR PICKER ────────────────────────────── */}
          <Section id="colorpicker" title="Color Picker" description="Preset palette with hue slider and custom hex input.">
            <DemoCard>
              <div className="flex items-center gap-4">
                <ColorPicker value={color} onChange={setColor} />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg border border-border-subtle" style={{ background: color }} />
                  <span className="text-xs font-mono text-text-secondary">{color}</span>
                </div>
              </div>
            </DemoCard>
          </Section>

          {/* ── CALENDAR ────────────────────────────────── */}
          <Section id="calendar" title="Calendar Picker" description="Full calendar with month/year quick-select and today shortcut.">
            <DemoCard>
              <div className="max-w-xs">
                <CalendarPicker
                  value={date}
                  onChange={setDate}
                  label="Due Date"
                  placeholder="Pick a date..."
                  clearable
                />
                {date && <p className="text-xs text-text-muted mt-2 font-mono">{date.toLocaleDateString()}</p>}
              </div>
            </DemoCard>
          </Section>

          {/* ── CARDS ───────────────────────────────────── */}
          <Section id="cards" title="Cards" description="Card container with header, content, and footer slots.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader>Project Alpha</CardHeader>
                <CardContent>
                  <p className="text-xs text-text-secondary">A sample project card showing the card component structure.</p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="ghost">View</Button>
                  <Button size="sm">Open</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>Metrics</CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent">128</p>
                      <p className="text-[10px] text-text-muted uppercase">Tasks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">94%</p>
                      <p className="text-[10px] text-text-muted uppercase">Pass Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* ── SQUIRCLE ────────────────────────────────── */}
          <Section id="squircle" title="Squircle Panels" description="Continuous curvature corners via superellipse clip-paths. Used on modals, cards, and panels.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                ref={sqRef}
                style={sqStyle}
                className="bg-surface-raised p-6 space-y-3 rounded-2xl"
              >
                <h3 className="text-sm font-semibold text-text-primary">Squircle Panel</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Corners follow a superellipse curve instead of circular arcs. The result looks smoother, especially at larger radii. Applied via clip-path so no borders are needed.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Button size="sm">Action</Button>
                  <Button size="sm" variant="ghost">Cancel</Button>
                </div>
              </div>
              <SquircleCard />
            </div>
          </Section>

          {/* ── TABLES ──────────────────────────────────── */}
          <Section id="tables" title="Tables" description="Structured data table with theme-aware styling.">
            <DemoCard>
              <div className="overflow-x-auto -mx-4 px-4 scrollbar-none">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: 'Auth module', status: 'completed', updated: '2 hours ago', priority: 'High' },
                    { name: 'Dashboard UI', status: 'in_progress', updated: '30 min ago', priority: 'Medium' },
                    { name: 'API endpoints', status: 'pending', updated: '1 day ago', priority: 'Low' },
                    { name: 'Unit tests', status: 'failed', updated: '4 hours ago', priority: 'High' },
                  ].map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell><Badge status={row.status} dot>{row.status.replace('_', ' ')}</Badge></TableCell>
                      <TableCell className="text-text-muted">{row.updated}</TableCell>
                      <TableCell>{row.priority}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </DemoCard>
          </Section>

          {/* ── TABS ────────────────────────────────────── */}
          <Section id="tabs" title="Tabs" description="Horizontally scrollable tab navigation.">
            <DemoCard>
              <Tabs>
                <Tab active={settingsTab === 'general'} icon={Gear} onClick={() => setSettingsTab('general')}>General</Tab>
                <Tab active={settingsTab === 'integrations'} icon={Plugs} onClick={() => setSettingsTab('integrations')}>Integrations</Tab>
                <Tab active={settingsTab === 'theme'} icon={Palette} onClick={() => setSettingsTab('theme')}>Theme</Tab>
                <Tab active={settingsTab === 'billing'} icon={ChartBar} onClick={() => setSettingsTab('billing')}>Billing</Tab>
                <Tab active={settingsTab === 'danger'} icon={Warning} onClick={() => setSettingsTab('danger')}>Danger Zone</Tab>
              </Tabs>
              <div className="p-4 rounded-xl bg-surface-overlay/50 text-sm text-text-secondary mt-3 text-center">
                Active tab: <span className="text-accent font-medium">{settingsTab}</span>
              </div>
            </DemoCard>
          </Section>

          {/* ── MODALS ──────────────────────────────────── */}
          <Section id="modals" title="Modals" description="Animated modal dialogs with confirmation variant.">
            <DemoCard>
              <div className="flex items-center justify-center gap-3">
                <Button onClick={() => setShowModal(true)}>Open Modal</Button>
                <Button variant="danger" onClick={() => setShowConfirm(true)}>Confirm Delete</Button>
              </div>

              <Modal open={showModal} onClose={() => setShowModal(false)} title="Example Modal" description="This is a demo of the modal component." size="md">
                <div className="space-y-3">
                  <Input label="Task Name" placeholder="Enter task name..." value="" onChange={() => {}} />
                  <CustomSelect
                    value=""
                    onChange={() => {}}
                    options={[
                      { value: 'low', label: 'Low Priority' },
                      { value: 'medium', label: 'Medium Priority' },
                      { value: 'high', label: 'High Priority' },
                    ]}
                    placeholder="Select priority..."
                  />
                </div>
                <ModalFooter>
                  <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button onClick={() => { setShowModal(false); toast.success('Task created!'); }}>Create</Button>
                </ModalFooter>
              </Modal>

              <ConfirmModal
                open={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={() => { setShowConfirm(false); toast.error('Deleted!'); }}
                title="Delete Project"
                message="This action cannot be undone. All data will be permanently removed."
                variant="danger"
                confirmLabel="Delete Forever"
              />
            </DemoCard>
          </Section>

          {/* ── EMPTY STATES ────────────────────────────── */}
          <Section id="empty" title="Empty States" description="Placeholder UI for empty content areas.">
            <DemoCard>
              <EmptyState
                icon={Tray}
                title="No tasks found"
                description="Get started by creating your first task."
                action={<Button size="sm" icon={Plus}>Create Task</Button>}
                centered
              />
            </DemoCard>
          </Section>

          {/* ── TOASTS ──────────────────────────────────── */}
          <Section id="toasts" title="Toasts" description="Theme-aware toast notifications powered by Sonner.">
            <DemoCard>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Button size="sm" onClick={() => toast.success('Changes saved successfully')}>Success</Button>
                <Button size="sm" variant="danger" onClick={() => toast.error('Something went wrong')}>Error</Button>
                <Button size="sm" variant="secondary" onClick={() => toast.info('New update available')}>Info</Button>
                <Button size="sm" variant="ghost" onClick={() => toast('Neutral toast message')}>Default</Button>
              </div>
            </DemoCard>
          </Section>

          {/* ── SKELETONS ───────────────────────────────── */}
          <Section id="skeletons" title="Skeletons" description="Shimmer loading placeholders.">
            <DemoCard>
              <div className="space-y-3">
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton className="h-3 w-72 rounded" />
                <Skeleton className="h-3 w-56 rounded" />
                <div className="flex items-center gap-3 mt-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-32 rounded" />
                    <Skeleton className="h-2 w-48 rounded" />
                  </div>
                </div>
              </div>
            </DemoCard>
          </Section>

          {/* ── SUBTASK TIMELINE ────────────────────────── */}
          <Section id="subtasks" title="Subtask Timeline" description="Collapsible subtask list with progress and status indicators.">
            <DemoCard>
              <SubtaskTimeline
                subtasks={[
                  { id: '1', title: 'Setup database schema', status: 'completed', description: 'Create tables for users, projects, and tasks' },
                  { id: '2', title: 'Build REST API endpoints', status: 'completed' },
                  { id: '3', title: 'Implement authentication', status: 'in_progress', description: 'JWT tokens with refresh flow' },
                  { id: '4', title: 'Create dashboard UI', status: 'pending' },
                  { id: '5', title: 'Write integration tests', status: 'pending', description: 'Cover all critical paths' },
                ]}
                defaultOpen={false}
              />
            </DemoCard>
          </Section>

          {/* ── PROJECT CARD ─────────────────────────────── */}
          <Section id="projectcard" title="Project Card" description="Cards used on the projects list page. Gradient background, animated folder icon, task stats, and team counts.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ProjectCardDemo
                name="alexbot"
                status="active"
                description="AI-powered project management platform"
                path="/Users/alex/projects/alexbot"
                totalTasks={42}
                activeTasks={7}
                pendingTasks={3}
                members={4}
                agents={2}
              />
              <ProjectCardDemo
                name="design-system"
                status="active"
                description="Shared component library and tokens"
                path="/Users/alex/projects/design-system"
                totalTasks={18}
                activeTasks={0}
                pendingTasks={5}
                members={2}
                agents={0}
              />
            </div>
          </Section>

          {/* ── NOTIFICATIONS ───────────────────────────── */}
          <Section id="notifications" title="Notification Panel" description="Bell trigger with unread badge and dropdown panel. Supports task, success, error, warning, and agent notification types.">
            <DemoCard title="With Notifications">
              <div className="flex items-center gap-6">
                <NotificationPanel
                  notifications={demoNotifs}
                  onDismiss={(id) => setDemoNotifs(prev => prev.filter(n => n.id !== id))}
                  onClearAll={() => setDemoNotifs([])}
                />
                <span className="text-[10px] text-text-muted">Click the bell to open</span>
              </div>
            </DemoCard>
            <DemoCard title="Empty State">
              <div className="flex items-center gap-6">
                <NotificationPanel notifications={[]} />
                <span className="text-[10px] text-text-muted">No notifications</span>
              </div>
            </DemoCard>
          </Section>

          {/* ── PROFILE MENU ─────────────────────────────── */}
          <Section id="profile" title="Profile Menu" description="Account dropdown with avatar, user info, and action links. Accepts user object and click handlers.">
            <DemoCard title="With Avatar">
              <div className="flex items-center gap-6">
                <ProfileMenu
                  user={{ name: 'Alex K.', email: 'alex@alexbot.dev' }}
                  onEditProfile={() => toast('Edit profile clicked')}
                  onSettings={() => toast('Settings clicked')}
                  onSignOut={() => toast('Sign out clicked')}
                />
                <span className="text-[10px] text-text-muted">Click to open</span>
              </div>
            </DemoCard>
          </Section>

          {/* ── CONFIRM SLIDER ──────────────────────────── */}
          <Section id="slider" title="Confirm Slider" description="Slide-to-confirm interaction. Drag past 80% to trigger. Fill edge blurs under the knob. Resets on release.">
            <DemoCard title="Accent Variant">
              <ConfirmSlider label="Slide to confirm" onConfirm={() => toast.success('Confirmed')} />
            </DemoCard>
            <DemoCard title="Danger Variant">
              <ConfirmSlider label="Slide to delete" variant="danger" onConfirm={() => toast.error('Deleted')} />
            </DemoCard>
            <DemoCard title="Disabled">
              <ConfirmSlider label="Disabled slider" disabled />
            </DemoCard>
          </Section>

          {/* ── GRAPHIC ──────────────────────────────────── */}
          <Section id="graphic" title="Graphic" description="Sparkline and area charts with bottom fade. Minimal, theme-aware, pure SVG with no dependencies.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DemoCard title="Area Chart">
                <Graphic
                  data={[12, 18, 14, 22, 19, 28, 25, 32, 30, 38, 35, 42]}
                  value="42"
                  label="Active users"
                  trend="+18%"
                  trendUp
                  height={90}
                  showGrid
                />
              </DemoCard>
              <DemoCard title="Danger Trend">
                <Graphic
                  data={[40, 38, 35, 37, 30, 28, 25, 22, 20, 18, 15, 12]}
                  value="12ms"
                  label="Response time"
                  trend="-70%"
                  trendUp={false}
                  color="danger"
                  height={90}
                  showGrid
                />
              </DemoCard>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <DemoCard title="Success">
                <Graphic data={[5, 8, 6, 12, 10, 18, 15, 20]} color="success" height={50} />
              </DemoCard>
              <DemoCard title="Info with Dots">
                <Graphic data={[20, 15, 22, 18, 25, 20, 28]} color="info" height={50} showDots />
              </DemoCard>
              <DemoCard title="Accent Minimal">
                <Graphic data={[3, 7, 5, 11, 9, 14, 12, 16]} height={50} showArea={false} />
              </DemoCard>
            </div>
          </Section>

          {/* ── THEMES ──────────────────────────────────── */}
          <Section id="themes" title="Theme System" description="7 built-in themes with custom theme support via CSS variables.">
            <DemoCard title="Switch Theme">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.values(themes).filter(t => !t.isCustom).map((t) => {
                  const isActive = t.id === themeId;
                  const surface = t.vars?.['--color-surface'] || '#0c0c10';
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`relative rounded-xl p-3 text-left transition-all border ${
                        isActive
                          ? 'border-accent ring-1 ring-accent/30'
                          : 'border-border-subtle hover:border-accent/30'
                      }`}
                      style={{ background: surface }}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ background: t.vars?.['--color-accent'] || '#ff6b35' }} />
                        <div className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ background: t.vars?.['--color-text-primary'] || '#ececf2' }} />
                      </div>
                      <p className="text-xs font-medium" style={{ color: t.vars?.['--color-text-primary'] || '#ececf2' }}>
                        {t.name}
                      </p>
                      {isActive && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: t.vars?.['--color-accent'] || '#ff6b35' }}>
                          <Check size={9} weight="bold" className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </DemoCard>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DemoCard title="Color Tokens">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Surface', cls: 'bg-surface' },
                    { label: 'Raised', cls: 'bg-surface-raised' },
                    { label: 'Overlay', cls: 'bg-surface-overlay' },
                    { label: 'Accent', cls: 'bg-accent' },
                    { label: 'Success', cls: 'bg-success' },
                    { label: 'Warning', cls: 'bg-warning' },
                    { label: 'Danger', cls: 'bg-danger' },
                    { label: 'Info', cls: 'bg-info' },
                  ].map((t) => (
                    <div key={t.label} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-md ${t.cls} border border-border-subtle`} />
                      <span className="text-[10px] text-text-muted font-mono">{t.label}</span>
                    </div>
                  ))}
                </div>
              </DemoCard>
              <DemoCard title="Typography">
                <div className="space-y-3">
                  <div>
                    <p className="text-lg font-bold text-text-primary">Plus Jakarta Sans</p>
                    <p className="text-xs text-text-muted font-sans">The quick brown fox jumps over the lazy dog</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary font-mono">JetBrains Mono</p>
                    <p className="text-[11px] text-text-muted font-mono">const res = await fetch('/api');</p>
                  </div>
                </div>
              </DemoCard>
            </div>
          </Section>

          {/* Footer */}
          <footer className="border-t border-border-subtle pt-6 pb-12 text-center">
            <p className="text-xs text-text-muted">
              <span className="text-accent font-semibold">alex</span> uikit
            </p>
            <p className="text-[9px] text-text-muted/60 mt-1 font-mono">Tailwind CSS v4 &middot; Phosphor Icons &middot; Plus Jakarta Sans &middot; JetBrains Mono</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Project Card demo                                                  */
/* ------------------------------------------------------------------ */
function AnimatedFolderMini({ size = 0.3, open = false }) {
  const accent = 'var(--color-accent)';
  const accentBack = 'color-mix(in srgb, var(--color-accent) 85%, black)';
  return (
    <div className="shrink-0 w-9 h-8 flex items-center justify-center">
      <div style={{ transform: `scale(${size})`, transformOrigin: 'center' }}>
        <div className="relative transition-transform duration-200 ease-in" style={{ transform: open ? 'translateY(-4px)' : 'none' }}>
          <div className="relative w-[100px] h-[80px]" style={{ backgroundColor: accentBack, borderRadius: '0 10px 10px 10px' }}>
            <span className="absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px]" style={{ backgroundColor: accentBack, borderRadius: '5px 5px 0 0' }} />
            {['#e0e0e0', '#efefef', '#ffffff'].map((bg, i) => (
              <div key={i} className="absolute z-20 bottom-[10%] left-1/2 transition-all duration-300 ease-in-out -translate-x-1/2"
                style={{ backgroundColor: bg, borderRadius: '10px', width: ['70%', '80%', '90%'][i], height: ['80%', '70%', '60%'][i], transform: `translateX(-50%) translateY(${open ? '0%' : '10%'})` }} />
            ))}
            <div className="absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out" style={{ backgroundColor: accent, borderRadius: '5px 10px 10px 10px', transform: open ? 'skew(15deg) scaleY(0.6)' : 'none' }} />
            <div className="absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out" style={{ backgroundColor: accent, borderRadius: '5px 10px 10px 10px', transform: open ? 'skew(-15deg) scaleY(0.6)' : 'none' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCardDemo({ name, status = 'active', description, path, totalTasks = 0, activeTasks = 0, pendingTasks = 0, members = 0, agents = 0 }) {
  const truncPath = path && path.length > 35 ? '...' + path.slice(-32) : path;
  const [folderOpen, setFolderOpen] = useState(false);
  return (
    <div
      className="relative text-left rounded-2xl bg-linear-to-br from-surface-raised to-surface-raised/90 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
      onClick={() => setFolderOpen(v => !v)}
    >

      <div className="p-3.5 flex flex-col flex-1">
        <div className="flex items-start gap-2.5">
          <AnimatedFolderMini open={folderOpen} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold truncate text-[15px] text-text-primary group-hover:text-accent transition-colors">{name}</h3>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider bg-accent/10 text-accent">{status}</span>
            </div>
            {truncPath && <p className="text-[10px] text-text-muted font-mono truncate">{truncPath}</p>}
            <p className="text-[11px] text-text-secondary mt-1 truncate leading-relaxed min-h-5">
              {description || <span className="text-text-muted/30 italic">No description</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2.5 mt-auto border-t border-border-subtle/60">
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
            <span className="font-semibold text-text-secondary tabular-nums">{totalTasks}</span>
            <span>tasks</span>
          </div>
          {activeTasks > 0 && (
            <div className="flex items-center gap-1 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-accent font-medium">{activeTasks}</span>
            </div>
          )}
          {pendingTasks > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
              <span>{pendingTasks}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 ml-auto">
            <div className="flex items-center gap-1 text-[10px] text-text-muted" title="Team members">
              <Users size={11} weight="bold" />
              <span className="tabular-nums">{members}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-text-muted" title="AI Agents">
              <Terminal size={11} weight="bold" />
              <span className="tabular-nums">{agents}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Squircle Card demo                                                 */
/* ------------------------------------------------------------------ */
function SquircleCard() {
  const [ref, style] = useSquircle(24, 0.6);
  return (
    <div
      ref={ref}
      style={style}
      className="bg-accent/10 p-6 space-y-3 rounded-2xl"
    >
      <h3 className="text-sm font-semibold text-accent">Custom Radius</h3>
      <p className="text-xs text-text-secondary leading-relaxed">
        Configurable radius and smoothing. Works with any fill.
      </p>
      <div className="flex gap-1.5">
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent/15 text-accent font-mono">r=24</span>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent/15 text-accent font-mono">s=0.6</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ROOT                                                               */
/* ------------------------------------------------------------------ */
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-4 text-center">
      <p className="text-[100px] font-black leading-none tracking-tighter text-accent/10 select-none">404</p>
      <h1 className="text-lg font-bold text-text-primary mt-2">Page not found</h1>
      <a
        href="/"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Back to Playground
      </a>
    </div>
  );
}

export default function App() {
  const isRoot = window.location.pathname === '/' || window.location.pathname === '/index.html';
  return (
    <ThemeProvider>
      <ToastProvider />
      {isRoot ? <PlaygroundContent /> : <NotFound />}
    </ThemeProvider>
  );
}
