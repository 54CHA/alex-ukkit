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
  TrendUp, TrendDown, ShoppingBag, Trophy, Gift,
  CurrencyDollar, GameController, Sliders,
  Wallet, CreditCard, Package, Crosshair, List,
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

// SwiftGifts-specific components
import { LineChart } from '@ui-kit/components/swift/LineChart.jsx';
import { BarChart } from '@ui-kit/components/swift/BarChart.jsx';
import { WhaleFlowChart } from '@ui-kit/components/swift/WhaleFlowChart.jsx';
import { HealthScoreGauge } from '@ui-kit/components/swift/HealthScoreGauge.jsx';
import { SlidingTable } from '@ui-kit/components/swift/SlidingTable.jsx';
import { TransactionTable } from '@ui-kit/components/swift/TransactionTable.jsx';
import { TransactionHistory } from '@ui-kit/components/swift/TransactionHistory.jsx';
import { Heatmap } from '@ui-kit/components/swift/Heatmap.jsx';
import { GiftCard } from '@ui-kit/components/swift/GiftCard.jsx';
import { ItemCard } from '@ui-kit/components/swift/ItemCard.jsx';
import { OrderCard } from '@ui-kit/components/swift/OrderCard.jsx';
import { AchievementCard } from '@ui-kit/components/swift/AchievementCard.jsx';
import { AchievementsModal } from '@ui-kit/components/swift/AchievementsModal.jsx';
import { CheckInBonus } from '@ui-kit/components/swift/CheckInBonus.jsx';
import { ReferralCard } from '@ui-kit/components/swift/ReferralCard.jsx';
import { BatteryIndicator } from '@ui-kit/components/swift/BatteryIndicator.jsx';
import { CurrencyBadge } from '@ui-kit/components/swift/CurrencyBadge.jsx';
import { StatsTriplet } from '@ui-kit/components/swift/StatsTriplet.jsx';
import { DegenModeCard } from '@ui-kit/components/swift/DegenModeCard.jsx';
import { TimeframeControl } from '@ui-kit/components/swift/TimeframeControl.jsx';
import { SegmentedControl } from '@ui-kit/components/swift/SegmentedControl.jsx';
import { FilterDropdown } from '@ui-kit/components/swift/FilterDropdown.jsx';
import { TonIcon, GemIcon, PresentIcon } from '@ui-kit/components/swift/SwiftIcons.jsx';

/* ------------------------------------------------------------------ */
/*  STATIC DATA (avoids re-generating on every render)                 */
/* ------------------------------------------------------------------ */
// Triple the bar count for dense whale flow charts
const _w1 = [18,32,45,12,28,55,40,22,35,50,15,38,42,30,25,48,33,20,44,36,52,27,41,19];
const _v1 = [45,82,120,30,67,145,98,55,88,130,38,95,110,75,60,125,85,50,115,90,135,65,105,48];
const WHALE_BARS_1H = Array.from({ length: 72 }, (_, i) => ({
  count: _w1[i % 24] + ((i * 7) % 13) - 6,
  volume: _v1[i % 24] + ((i * 11) % 29) - 14,
  label: `${i}m`,
}));
const _w6 = [25,48,62,35,52,78,55,40,65,82,30,58,70,45,38,72,50,34,68,56,85,42,60,32,75,53,44,66,38,80,47,58,70,28,63,50];
const _v6 = [65,125,180,90,140,210,155,105,175,225,80,150,195,120,100,200,135,85,185,145,235,110,170,82,205,142,115,178,95,220,128,158,192,72,168,132];
const WHALE_BARS_6H = Array.from({ length: 108 }, (_, i) => ({
  count: _w6[i % 36] + ((i * 7) % 17) - 8,
  volume: _v6[i % 36] + ((i * 13) % 37) - 18,
  label: `${i * 10}m`,
}));
const _wd = [30,55,75,42,68,95,70,50,80,100,38,72,85,58,45,88,62,40,82,65,105,52,78,35,92,60,48,80,43,98,55,70,88,33,76,58,110,65,82,48,95,72,60,85,40,78,52,68];
const _vd = [80,160,250,110,185,300,200,140,230,290,95,195,245,155,120,265,170,105,240,180,310,135,215,88,275,165,125,225,108,285,148,195,255,85,205,152,320,175,238,118,270,190,158,242,100,218,138,185];
const WHALE_BARS_1D = Array.from({ length: 144 }, (_, i) => ({
  count: _wd[i % 48] + ((i * 7) % 21) - 10,
  volume: _vd[i % 48] + ((i * 11) % 43) - 21,
  label: `${i * 30}m`,
}));

const HEATMAP_DATA = {
  '12h': [
    { id: 'btc', name: 'BTC', change: 3.2, price: 43250, volume: '2.4B', mcap: '845B' },
    { id: 'eth', name: 'ETH', change: -1.8, price: 2280, volume: '1.1B', mcap: '274B' },
    { id: 'ton', name: 'TON', change: 8.5, price: 2.45, volume: '890M', mcap: '8.4B' },
    { id: 'sol', name: 'SOL', change: -4.2, price: 98, volume: '780M', mcap: '42B' },
    { id: 'bnb', name: 'BNB', change: 1.1, price: 312, volume: '520M', mcap: '47B' },
    { id: 'xrp', name: 'XRP', change: -0.5, price: 0.62, volume: '450M', mcap: '33B' },
    { id: 'ada', name: 'ADA', change: 2.8, price: 0.58, volume: '320M', mcap: '20B' },
    { id: 'doge', name: 'DOGE', change: -6.1, price: 0.08, volume: '280M', mcap: '11B' },
    { id: 'avax', name: 'AVAX', change: 4.7, price: 35, volume: '210M', mcap: '13B' },
    { id: 'matic', name: 'MATIC', change: -2.3, price: 0.82, volume: '180M', mcap: '7.6B' },
    { id: 'dot', name: 'DOT', change: 1.9, price: 7.2, volume: '150M', mcap: '9.2B' },
    { id: 'link', name: 'LINK', change: 5.4, price: 14.5, volume: '130M', mcap: '8.1B' },
  ],
  '24h': [
    { id: 'btc', name: 'BTC', change: 5.1, price: 43250, volume: '4.8B', mcap: '845B' },
    { id: 'eth', name: 'ETH', change: 2.4, price: 2280, volume: '2.2B', mcap: '274B' },
    { id: 'ton', name: 'TON', change: 12.3, price: 2.45, volume: '1.8B', mcap: '8.4B' },
    { id: 'sol', name: 'SOL', change: -2.1, price: 98, volume: '1.5B', mcap: '42B' },
    { id: 'bnb', name: 'BNB', change: 3.8, price: 312, volume: '1.0B', mcap: '47B' },
    { id: 'xrp', name: 'XRP', change: -1.2, price: 0.62, volume: '900M', mcap: '33B' },
    { id: 'ada', name: 'ADA', change: 4.5, price: 0.58, volume: '640M', mcap: '20B' },
    { id: 'doge', name: 'DOGE', change: -8.3, price: 0.08, volume: '560M', mcap: '11B' },
    { id: 'avax', name: 'AVAX', change: 7.2, price: 35, volume: '420M', mcap: '13B' },
    { id: 'matic', name: 'MATIC', change: -3.6, price: 0.82, volume: '360M', mcap: '7.6B' },
  ],
  '3d': [
    { id: 'btc', name: 'BTC', change: 8.2, price: 43250, volume: '14B', mcap: '845B' },
    { id: 'ton', name: 'TON', change: 18.5, price: 2.45, volume: '5.4B', mcap: '8.4B' },
    { id: 'eth', name: 'ETH', change: 5.1, price: 2280, volume: '6.6B', mcap: '274B' },
    { id: 'doge', name: 'DOGE', change: -12.0, price: 0.08, volume: '1.7B', mcap: '11B' },
    { id: 'sol', name: 'SOL', change: -5.8, price: 98, volume: '4.5B', mcap: '42B' },
    { id: 'avax', name: 'AVAX', change: 11.3, price: 35, volume: '1.3B', mcap: '13B' },
  ],
  '7d': [
    { id: 'ton', name: 'TON', change: 25.1, price: 2.45, volume: '12.6B', mcap: '8.4B' },
    { id: 'btc', name: 'BTC', change: 12.5, price: 43250, volume: '34B', mcap: '845B' },
    { id: 'doge', name: 'DOGE', change: -18.2, price: 0.08, volume: '3.9B', mcap: '11B' },
    { id: 'avax', name: 'AVAX', change: 15.8, price: 35, volume: '3.1B', mcap: '13B' },
    { id: 'eth', name: 'ETH', change: 8.3, price: 2280, volume: '15B', mcap: '274B' },
  ],
};

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
    <div className={`rounded-2xl bg-surface-raised/60 p-4 space-y-4 relative ${className}`}>
      {/* Subtle accent gradient -- clipped to card bounds without overflow-hidden */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ clipPath: 'inset(0 round 1rem)' }}>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-accent/3 blur-2xl" />
      </div>
      <div className="relative">
        {title && <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-4">{title}</h3>}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NAV                                                                */
/* ------------------------------------------------------------------ */
const NAV = [
  // SwiftGifts components first
  { id: 'sg-divider', label: 'SwiftGifts', icon: Gift, divider: true },
  { id: 'sg-charts', label: 'Charts', icon: TrendUp },
  { id: 'sg-heatmap', label: 'Heatmap', icon: Fire },
  { id: 'sg-analytics', label: 'Analytics Tables', icon: ListBullets },
  { id: 'sg-gifts', label: 'Gift Cards', icon: Gift },
  { id: 'sg-markets', label: 'Markets', icon: ShoppingBag },
  { id: 'sg-achievements', label: 'Achievements', icon: Trophy },
  { id: 'sg-gamification', label: 'Gamification', icon: GameController },
  { id: 'sg-profile', label: 'Profile Widgets', icon: Wallet },
  { id: 'sg-controls', label: 'Controls', icon: Sliders },
  // Common components
  { id: 'common-divider', label: 'Common', icon: Lightning, divider: true },
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
  const [activeSection, setActiveSection] = useState('sg-charts');

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

  // SwiftGifts demo state
  const [cartItems, setCartItems] = useState(new Set());
  const [showAchievements, setShowAchievements] = useState(false);
  const [checkedDays, setCheckedDays] = useState([true, true, false, false, false, false, false]);
  const [filterVal, setFilterVal] = useState('all');
  const [segmentVal, setSegmentVal] = useState('overview');
  const [tfVal, setTfVal] = useState('1d');

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

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mobile header visibility -- hide on scroll down, show on scroll up
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 60) { setHeaderVisible(true); }
        else if (y > lastScrollY.current + 8) { setHeaderVisible(false); setMobileMenuOpen(false); }
        else if (y < lastScrollY.current - 8) { setHeaderVisible(true); }
        lastScrollY.current = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on ESC
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e) => { if (e.key === 'Escape') setMobileMenuOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mobileMenuOpen]);

  // Auto-scroll sidebar nav to keep active item visible
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const btn = nav.querySelector(`[data-nav="${activeSection}"]`);
    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeSection]);

  // Scroll spy -- pick topmost visible section
  // Uses a Set of visible IDs and re-checks DOM positions on every callback
  // to avoid stale boundingClientRect.top values
  useEffect(() => {
    const sectionIds = NAV.filter(n => !n.divider).map(n => n.id);
    const visibleSet = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        if (justClicked.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) visibleSet.add(entry.target.id);
          else visibleSet.delete(entry.target.id);
        }
        // Re-read live positions for all visible sections
        let best = null;
        let bestTop = Infinity;
        for (const id of visibleSet) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          if (top < bestTop) { bestTop = top; best = id; }
        }
        if (best) setActiveSection(best);
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.05 }
    );
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Scroll to section on click -- step the highlight through each non-divider tab sequentially
  const stepping = useRef(false);
  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    setMobileMenuOpen(false);
    justClicked.current = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Work with only non-divider items for stepping
    const navItems = NAV.filter(n => !n.divider);
    const fromIdx = navItems.findIndex(n => n.id === activeSection);
    const toIdx = navItems.findIndex(n => n.id === id);

    // If already there or adjacent, just jump
    if (fromIdx === toIdx || Math.abs(fromIdx - toIdx) <= 1 || fromIdx < 0) {
      setActiveSection(id);
      setTimeout(() => { justClicked.current = false; }, 800);
      return;
    }

    // Step through each intermediate tab
    if (stepping.current) {
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
      setActiveSection(navItems[cur].id);
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
    <div className="min-h-screen bg-surface relative">
      {/* Global ambient gradient -- bottom-right corner */}
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] pointer-events-none z-0" style={{ background: 'radial-gradient(circle at bottom right, var(--color-accent) 0%, transparent 70%)', opacity: 0.04 }} />
      {/* ── Mobile Header ────────────────────────────── */}
      <header
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center justify-end px-4 py-3 bg-surface/90 backdrop-blur-lg border-b border-border-subtle">
          <button
            onClick={() => setMobileMenuOpen(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        </div>

        {/* Mobile dropdown nav */}
        {mobileMenuOpen && (
          <nav className="bg-surface/95 backdrop-blur-xl border-b border-border-subtle max-h-[70vh] overflow-y-auto overscroll-contain scrollbar-none px-3 py-2 space-y-px">
            {/* Theme previews at top */}
            <div className="pb-2 mb-1 border-b border-border-subtle/50">
              <p className="text-[9px] text-text-muted uppercase tracking-wider mb-2 px-1">Theme</p>
              <div className="grid grid-cols-8 gap-1.5 px-1">
                {Object.values(themes).filter(t => !t.isCustom).slice(0, 8).map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    title={t.name}
                    className={`w-full aspect-square rounded-lg transition-all ${
                      t.id === themeId ? 'ring-2 ring-accent ring-offset-1 ring-offset-surface scale-110' : ''
                    }`}
                    style={{ background: t.vars?.['--color-surface'] || '#0c0c10' }}
                  >
                    <div className="w-full h-full rounded-lg flex items-center justify-center gap-[2px]">
                      <span className="w-[5px] h-[5px] rounded-full" style={{ background: t.vars?.['--color-accent'] || '#ff6b35' }} />
                      <span className="w-[5px] h-[5px] rounded-full" style={{ background: t.vars?.['--color-text-primary'] || '#ececf2' }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {NAV.map(({ id, label, icon: Icon, divider }) => divider ? (
              <div key={id} className="pt-3 pb-1 px-1">
                <p className="text-[9px] font-bold text-accent uppercase tracking-widest flex items-center gap-1.5">
                  <Icon size={10} weight="bold" />
                  {label}
                </p>
              </div>
            ) : (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                  activeSection === id
                    ? 'bg-surface-overlay text-text-primary'
                    : 'text-text-muted hover:text-text-secondary hover:bg-surface-overlay/50'
                }`}
              >
                <Icon size={14} weight={activeSection === id ? 'fill' : 'regular'} className="shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ── Sidebar (desktop) ────────────────────────── */}
      <aside className="hidden lg:flex fixed top-0 left-0 w-52 h-screen flex-col border-r border-border-subtle bg-surface-raised/50 z-40">
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-base font-bold text-text-primary tracking-tight">
            <span className="text-accent">swiftgifts</span> uikit
          </h1>
          <p className="text-[9px] text-text-muted mt-0.5 font-mono uppercase tracking-widest">Component Playground</p>
        </div>
        <nav ref={navRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-none px-2 pb-2 space-y-px">
          {NAV.map(({ id, label, icon: Icon, divider }) => divider ? (
            <div key={id} className="pt-3 pb-1 px-1">
              <p className="text-[8px] font-bold text-accent uppercase tracking-widest flex items-center gap-1.5">
                <Icon size={10} weight="bold" />
                {label}
              </p>
            </div>
          ) : (
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
        {/* Theme quick-switch */}
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
        {/* Sidebar footer / branding */}
        <div className="px-3 py-3 border-t border-border-subtle shrink-0">
          <p className="text-[9px] text-text-muted/60 font-mono leading-relaxed">
            v0.1.0 &middot; alexbot
          </p>
          <p className="text-[8px] text-text-muted/40 font-mono mt-0.5">
            Built with React &amp; Tailwind
          </p>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────── */}
      <div className="lg:pl-52">
        <main className="mx-auto max-w-3xl px-5 sm:px-8 pt-16 lg:pt-10 pb-10 space-y-14">
          {/* Hero */}
          <header className="text-center py-6">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              <span className="text-accent">swiftgifts</span> uikit
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

          {/* ═══════════════════════════════════════════════ */}
          {/*  SWIFTGIFTS COMPONENTS                          */}
          {/* ═══════════════════════════════════════════════ */}

          {/* ── CHARTS ───────────────────────────────────── */}
          <Section id="sg-charts" title="Charts" description="Interactive SVG charts with timeframe selectors. LineChart, BarChart, WhaleFlowChart, and HealthScoreGauge.">
            <LineChart
              title="Market Cap"
              timeframes={['1d', '1w', '1m', '3m']}
              data={{
                '1d': { labels: ['00:00','04:00','08:00','12:00','16:00','20:00','23:59'], values: [2.4e9, 2.38e9, 2.45e9, 2.52e9, 2.48e9, 2.55e9, 2.6e9] },
                '1w': { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], values: [2.1e9, 2.25e9, 2.18e9, 2.4e9, 2.35e9, 2.5e9, 2.6e9] },
                '1m': { labels: ['Week 1','Week 2','Week 3','Week 4'], values: [1.8e9, 2.1e9, 2.3e9, 2.6e9] },
                '3m': { labels: ['Jan','Feb','Mar'], values: [1.2e9, 1.8e9, 2.6e9] },
              }}
              height={240}
            />
            <BarChart
              title="Volume"
              modes={['Revenue', 'Sales']}
              timeframes={['1d', '1w', '1m']}
              height={240}
              data={{
                '1d': { labels: ['00','04','08','12','16','20'], primary: [120, 340, 280, 520, 380, 450], secondary: [80, 220, 160, 380, 240, 300] },
                '1w': { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], primary: [1200, 1800, 1500, 2200, 1900, 2400, 2100], secondary: [800, 1200, 1000, 1600, 1300, 1800, 1500] },
                '1m': { labels: ['W1','W2','W3','W4'], primary: [8000, 12000, 10000, 15000], secondary: [5000, 8000, 7000, 11000] },
              }}
            />
            <WhaleFlowChart
              title="Whale Net Flow"
              timeframes={['1h', '6h', '1d']}
              data={{
                '1h': { bars: WHALE_BARS_1H },
                '6h': { bars: WHALE_BARS_6H },
                '1d': { bars: WHALE_BARS_1D },
              }}
            />
            <DemoCard title="Health Score Gauges">
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="text-center">
                  <HealthScoreGauge value={25} size={90} />
                  <p className="text-[10px] text-text-muted mt-1">Critical</p>
                </div>
                <div className="text-center">
                  <HealthScoreGauge value={55} size={90} />
                  <p className="text-[10px] text-text-muted mt-1">Warning</p>
                </div>
                <div className="text-center">
                  <HealthScoreGauge value={88} size={90} />
                  <p className="text-[10px] text-text-muted mt-1">Healthy</p>
                </div>
              </div>
            </DemoCard>
          </Section>

          {/* ── HEATMAP ──────────────────────────────────── */}
          <Section id="sg-heatmap" title="Heatmap" description="Treemap-style heatmap with on-click detail card. Block size encodes absolute change.">
            <Heatmap
              title="Gift Market"
              timeframes={['12h', '24h', '3d', '7d']}
              data={HEATMAP_DATA}
            />
          </Section>

          {/* ── ANALYTICS TABLES ─────────────────────────── */}
          <Section id="sg-analytics" title="Analytics Tables" description="Scrollable data tables for market and transaction data.">
            <DemoCard title="Collection Rankings" className="px-2">
              <SlidingTable data={[
                { rank: 1, name: 'TON Diamonds', price: 2.8, change: 25.6, volume: 8900, holders: 12000, floor: 2.1 },
                { rank: 2, name: 'Getgems OG', price: 34.5, change: 12.3, volume: 2450, holders: 6200, floor: 32.1 },
                { rank: 3, name: 'TON Punks', price: 48.2, change: -3.1, volume: 1890, holders: 3400, floor: 45.0 },
                { rank: 4, name: 'Toncoin Whales', price: 8.4, change: -1.2, volume: 1200, holders: 5100, floor: 7.8 },
                { rank: 5, name: 'Animals Red', price: 3.2, change: 5.8, volume: 890, holders: 4800, floor: 2.9 },
              ]} />
            </DemoCard>
            <DemoCard title="Whale Transactions" className="px-2">
              <TransactionTable
                title="Live Feed"
                data={[
                  { address: 'UQBx...3kF', amount: 1250.5, side: 'buy', collection: 'TON Diamonds', time: '2m ago' },
                  { address: 'EQDr...9pL', amount: 890.0, side: 'sell', collection: 'Getgems OG', time: '5m ago' },
                  { address: 'UQAf...2mK', amount: 2100.3, side: 'buy', collection: 'TON Punks', time: '8m ago' },
                  { address: 'EQBn...7wQ', amount: 450.0, side: 'sell', collection: 'Animals Red', time: '12m ago' },
                  { address: 'UQCk...1jR', amount: 3200.8, side: 'buy', collection: 'TON Diamonds', time: '15m ago' },
                ]}
                hasMore
                onShowMore={() => toast('Loading more...')}
              />
            </DemoCard>
            <DemoCard title="Transaction History" className="px-2">
              <TransactionHistory groups={[
                { date: 'Today', items: [
                  { id: '1', title: 'Gift Purchase', txId: 'tx_8f3k...2mn', status: 'success' },
                  { id: '2', title: 'Spin Reward', txId: 'tx_9a2l...4jp', status: 'success' },
                  { id: '3', title: 'NFT Transfer', txId: 'tx_1b5m...8kq', status: 'pending' },
                ]},
                { date: 'Yesterday', items: [
                  { id: '4', title: 'TON Withdrawal', txId: 'tx_3c7n...1wr', status: 'success' },
                  { id: '5', title: 'Refund', txId: 'tx_5d9p...6ts', status: 'rejected' },
                ]},
              ]} />
            </DemoCard>
          </Section>

          {/* ── GIFT CARDS ───────────────────────────────── */}
          <Section id="sg-gifts" title="Gift Cards" description="Telegram-style web3 gift catalog with NFT items and order summary.">
            <DemoCard title="Gift Catalog">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'g1', name: 'Crystal Ball', provider: 'Getgems', priceTon: 2.5, priceUsd: 8.50, img: '/swift-assets/img/crystal_ball.webp' },
                  { id: 'g2', name: 'Stellar Rocket', provider: 'Fragment', priceTon: 5.2, priceUsd: 17.50, img: '/swift-assets/img/stellar_rocket.webp' },
                  { id: 'g3', name: 'Eternal Rose', provider: 'MRKT', priceTon: 1.8, priceUsd: 6.20, img: '/swift-assets/img/eternal_rose.webp' },
                  { id: 'g4', name: 'Diamond Ring', provider: 'Getgems', priceTon: 12.0, priceUsd: 41.00, img: '/swift-assets/img/diamond_ring.webp' },
                  { id: 'g5', name: 'Skull Flower', provider: 'Fragment', priceTon: 3.4, priceUsd: 11.50, img: '/swift-assets/img/skull_flower.webp' },
                  { id: 'g6', name: 'Electric Skull', provider: 'Tonnel', priceTon: 7.8, priceUsd: 26.50, img: '/swift-assets/img/electric_skull.webp' },
                ].map(g => (
                  <GiftCard
                    key={g.id}
                    name={g.name}
                    provider={g.provider}
                    priceTon={g.priceTon}
                    priceUsd={g.priceUsd}
                    image={g.img}
                    inCart={cartItems.has(g.id)}
                    onToggleCart={() => setCartItems(prev => {
                      const next = new Set(prev);
                      next.has(g.id) ? next.delete(g.id) : next.add(g.id);
                      return next;
                    })}
                  />
                ))}
              </div>
            </DemoCard>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DemoCard title="Item Cards">
                <div className="grid grid-cols-2 gap-2">
                  <ItemCard name="Jester Hat" provider="Getgems" price={0.5} image="/swift-assets/img/jester_hat.webp" onAdd={() => toast('Added')} />
                  <ItemCard name="Kissed Frog" provider="MRKT" price={1.2} image="/swift-assets/img/kissed_frog.webp" onAdd={() => toast('Added')} />
                  <ItemCard name="Signet Ring" provider="Fragment" price={3.0} image="/swift-assets/img/signet_ring.webp" soldOut />
                  <ItemCard name="Berry Box" provider="Tonnel" price={0.3} image="/swift-assets/img/berry_box.webp" onAdd={() => toast('Added')} />
                </div>
              </DemoCard>
              <DemoCard title="Order Summary">
                <OrderCard
                  item={{ name: 'Crystal Ball', provider: 'Getgems', price: 2.5, image: '/swift-assets/img/crystal_ball.webp' }}
                  fees={[
                    { label: 'Market fee', value: 0.025 },
                    { label: 'Service fee', value: 0.01 },
                    { label: 'Network fee', value: 0.005 },
                  ]}
                  total={2.54}
                  onBuy={() => toast.success('Purchase confirmed')}
                  onAddToCart={() => toast('Added to cart')}
                />
              </DemoCard>
            </div>
          </Section>

          {/* ── MARKETS ──────────────────────────────────── */}
          <Section id="sg-markets" title="Markets" description="Marketplace logos and jetton tokens from the TON ecosystem.">
            <DemoCard title="Marketplaces">
              <div className="flex items-center gap-4 overflow-x-auto scrollbar-none py-1">
                {[
                  { name: 'Getgems', img: '/swift-assets/img/getgems.jpeg' },
                  { name: 'Fragment', img: '/swift-assets/img/fragment.jpeg' },
                  { name: 'MRKT', img: '/swift-assets/img/mrkt.jpeg' },
                  { name: 'Tonnel', img: '/swift-assets/img/tonnel.jpeg' },
                  { name: 'Portals', img: '/swift-assets/img/portals.jpeg' },
                  { name: 'MarketApp', img: '/swift-assets/img/marketapp.jpeg' },
                ].map(m => (
                  <div key={m.name} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
                    <img src={m.img} alt={m.name} className="w-14 h-14 rounded-2xl object-cover bg-surface-raised group-hover:scale-105 transition-transform" />
                    <span className="text-[10px] text-text-muted font-medium">{m.name}</span>
                  </div>
                ))}
              </div>
            </DemoCard>
            <DemoCard title="Jettons">
              <div className="flex items-center gap-4 overflow-x-auto scrollbar-none py-1">
                {[
                  { name: 'TON', img: '/swift-assets/img/ton.webp' },
                  { name: 'USDT', img: '/swift-assets/img/usdt.webp' },
                  { name: 'STON', img: '/swift-assets/img/ston.webp' },
                  { name: 'BOLT', img: '/swift-assets/img/bolt.webp' },
                  { name: 'DUST', img: '/swift-assets/img/dust.webp' },
                  { name: 'Web3', img: '/swift-assets/img/web3.webp' },
                  { name: 'DaoLama', img: '/swift-assets/img/daolama.jpeg' },
                ].map(j => (
                  <div key={j.name} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
                    <img src={j.img} alt={j.name} className="w-12 h-12 rounded-full object-cover bg-surface-raised group-hover:scale-105 transition-transform" />
                    <span className="text-[10px] text-text-muted font-medium">{j.name}</span>
                  </div>
                ))}
              </div>
            </DemoCard>
          </Section>

          {/* ── ACHIEVEMENTS ─────────────────────────────── */}
          <Section id="sg-achievements" title="Achievements" description="Achievement tiles with completed/locked states, pin support, and a tabbed modal.">
            <DemoCard title="Achievement Grid">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {[
                  { id: 'a1', title: 'First Purchase', subtitle: 'Buy your first gift', completed: true, pinned: true, iconIndex: 7, category: 'activity' },
                  { id: 'a2', title: 'Gift Master', subtitle: 'Send 10 gifts', completed: true, pinned: false, iconIndex: 0, category: 'milestones' },
                  { id: 'a3', title: 'Social Butterfly', subtitle: 'Invite 5 friends', completed: true, pinned: true, iconIndex: 1, category: 'friends' },
                  { id: 'a4', title: 'Diamond Hands', subtitle: 'Hold 100 gems', completed: false, iconIndex: 3, category: 'crystals' },
                  { id: 'a5', title: 'Whale Alert', subtitle: 'Spend 50 TON', completed: false, iconIndex: 2, category: 'milestones' },
                  { id: 'a6', title: 'Early Bird', subtitle: 'Join in first week', completed: true, pinned: false, iconIndex: 6, category: 'activity' },
                  { id: 'a7', title: 'Streak King', subtitle: '7-day check-in', completed: false, iconIndex: 5, category: 'milestones' },
                  { id: 'a8', title: 'Collector', subtitle: 'Own 20 items', completed: true, iconIndex: 4, category: 'activity' },
                ].map(a => (
                  <AchievementCard
                    key={a.id}
                    title={a.title}
                    subtitle={a.subtitle}
                    iconIndex={a.iconIndex}
                    completed={a.completed}
                    pinned={a.pinned}
                    onPin={a.completed ? () => toast(`Toggled pin for ${a.title}`) : undefined}
                  />
                ))}
              </div>
            </DemoCard>
            <DemoCard title="Modal">
              <Button icon={Trophy} onClick={() => setShowAchievements(true)}>View All Achievements</Button>
              <AchievementsModal
                open={showAchievements}
                onClose={() => setShowAchievements(false)}
                achievements={[
                  { id: 'a1', title: 'First Purchase', subtitle: 'Buy your first gift', completed: true, pinned: true, category: 'activity' },
                  { id: 'a2', title: 'Gift Master', subtitle: 'Send 10 gifts', completed: true, pinned: false, category: 'milestones' },
                  { id: 'a3', title: 'Social Butterfly', subtitle: 'Invite 5 friends', completed: true, pinned: true, category: 'friends' },
                  { id: 'a6', title: 'Early Bird', subtitle: 'Join in first week', completed: true, pinned: false, category: 'activity' },
                  { id: 'a8', title: 'Collector', subtitle: 'Own 20 items', completed: true, pinned: true, category: 'activity' },
                  { id: 'a9', title: '100 Gems', subtitle: 'Earn 100 gems total', completed: true, pinned: false, category: 'crystals' },
                  { id: 'a10', title: 'Lucky Spin', subtitle: 'Win from the wheel', completed: false, category: 'activity' },
                  { id: 'a11', title: 'Team Player', subtitle: 'Join a group', completed: false, category: 'friends' },
                ]}
                onPin={(id) => toast(`Pinned: ${id}`)}
              />
            </DemoCard>
          </Section>

          {/* ── GAMIFICATION ─────────────────────────────── */}
          <Section id="sg-gamification" title="Gamification" description="Daily check-in and referral program.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CheckInBonus
                currentDay={2}
                rewards={[10, 20, 30, 50, 75, 100, 200]}
                claimed={checkedDays}
                onClaim={() => {
                  setCheckedDays(prev => {
                    const next = [...prev];
                    next[2] = true;
                    return next;
                  });
                  toast.success('Day 3 reward claimed!');
                }}
              />
              <ReferralCard
                earnedTon={12.5}
                earnedDiamonds={340}
                invitedCount={8}
                badgeProgress={0.65}
                referralCode="SWIFT-K8F2"
                onInvite={() => toast('Invite link shared')}
                onCopy={() => { navigator.clipboard?.writeText('SWIFT-K8F2'); toast.success('Code copied'); }}
              />
            </div>
          </Section>

          {/* ── PROFILE WIDGETS ──────────────────────────── */}
          <Section id="sg-profile" title="Profile Widgets" description="Battery indicator, currency badges, stat triplets, and degen mode card.">
            <DemoCard title="Battery States">
              <div className="flex items-center gap-6 flex-wrap">
                <BatteryIndicator state="full" />
                <BatteryIndicator state="half" />
                <BatteryIndicator state="low" />
                <BatteryIndicator state="none" />
              </div>
            </DemoCard>
            <DemoCard title="Currency Badges">
              <div className="flex items-center gap-4 flex-wrap">
                <CurrencyBadge currency="ton" value="12.5" />
                <CurrencyBadge currency="gem" value="340" />
                <CurrencyBadge currency="usdt" value="45.20" />
                <CurrencyBadge currency="ston" value="128" />
                <CurrencyBadge currency="dust" value="2,180" />
                <CurrencyBadge currency="web3" value="890" />
                <CurrencyBadge currency="daolama" value="5.4" />
              </div>
            </DemoCard>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatsTriplet stats={[
                { label: 'Earned', value: '12.5', icon: TrendUp },
                { label: 'Volume', value: '48.2', icon: ChartBar },
                { label: 'Orders', value: '23', icon: Package },
              ]} />
              <DegenModeCard
                title="Degen Mode"
                isActive={false}
                description="Unlock advanced trading features"
                onClick={() => toast('Degen mode toggle')}
              />
            </div>
            <DegenModeCard
              title="Degen Mode"
              isActive={true}
              expiresAt="Mar 15, 2026"
              onClick={() => toast('View subscription')}
            />
          </Section>

          {/* ── CONTROLS ─────────────────────────────────── */}
          <Section id="sg-controls" title="Controls" description="Timeframe selector, segmented tabs, and filter dropdown.">
            <DemoCard title="Timeframe Control">
              <TimeframeControl
                options={['1h', '6h', '1d', '3d', '1w', '1m']}
                value={tfVal}
                onChange={setTfVal}
              />
            </DemoCard>
            <DemoCard title="Segmented Control">
              <SegmentedControl
                segments={[
                  { id: 'overview', label: 'Overview' },
                  { id: 'collections', label: 'Collections' },
                  { id: 'whales', label: 'Whales' },
                  { id: 'analytics', label: 'Analytics' },
                ]}
                value={segmentVal}
                onChange={setSegmentVal}
              />
            </DemoCard>
            <DemoCard title="Filter Dropdown">
              <FilterDropdown
                options={[
                  { id: 'all', label: 'All' },
                  { id: 'gainers', label: 'Gainers' },
                  { id: 'losers', label: 'Losers' },
                  { id: 'volume', label: 'By Volume' },
                ]}
                value={filterVal}
                onChange={setFilterVal}
              />
            </DemoCard>
          </Section>

          {/* ═══════════════════════════════════════════════ */}
          {/*  COMMON COMPONENTS                              */}
          {/* ═══════════════════════════════════════════════ */}

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
          <footer className="border-t border-border-subtle pt-8 pb-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-sm font-bold text-text-primary tracking-tight">
                  <span className="text-accent">swiftgifts</span> uikit
                </p>
                <p className="text-[10px] text-text-muted mt-1 max-w-xs leading-relaxed">
                  Theme-aware component library for the SwiftGifts ecosystem. Dark-mode-first, built for Telegram Mini Apps.
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent">v0.1.0</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-surface-overlay text-text-muted">React 18+</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-surface-overlay text-text-muted">Tailwind v4</span>
                </div>
                <p className="text-[9px] text-text-muted/50 font-mono">
                  Phosphor Icons &middot; Plus Jakarta Sans &middot; JetBrains Mono
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border-subtle/50 flex items-center justify-between">
              <p className="text-[9px] text-text-muted/40 font-mono">alexbot &middot; {new Date().getFullYear()}</p>
              <div className="flex items-center gap-3">
                <span className="text-[9px] text-text-muted/40 font-mono">{NAV.filter(n => !n.divider).length} components</span>
                <span className="text-[9px] text-text-muted/40 font-mono">{Object.keys(themes).length} themes</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Project Card demo                                                  */
/* ------------------------------------------------------------------ */
function AnimatedFolderMini({ size = 0.3 }) {
  const accent = 'var(--color-accent)';
  const accentBack = 'color-mix(in srgb, var(--color-accent) 85%, black)';
  return (
    <div className="shrink-0 w-9 h-8 flex items-center justify-center">
      <div style={{ transform: `scale(${size})`, transformOrigin: 'center' }}>
        <div className="relative transition-all duration-200 ease-in group-hover:-translate-y-1">
          <div className="relative w-[100px] h-[80px]" style={{ backgroundColor: accentBack, borderRadius: '0 10px 10px 10px' }}>
            <span className="absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px]" style={{ backgroundColor: accentBack, borderRadius: '5px 5px 0 0' }} />
            {['#e0e0e0', '#efefef', '#ffffff'].map((bg, i) => (
              <div key={i} className="absolute z-20 bottom-[10%] left-1/2 transition-all duration-300 ease-in-out -translate-x-1/2 translate-y-[10%] group-hover:translate-y-0"
                style={{ backgroundColor: bg, borderRadius: '10px', width: ['70%', '80%', '90%'][i], height: ['80%', '70%', '60%'][i] }} />
            ))}
            <div className="absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out group-hover:transform-[skew(15deg)_scaleY(0.6)]" style={{ backgroundColor: accent, borderRadius: '5px 10px 10px 10px' }} />
            <div className="absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out group-hover:transform-[skew(-15deg)_scaleY(0.6)]" style={{ backgroundColor: accent, borderRadius: '5px 10px 10px 10px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCardDemo({ name, status = 'active', description, path, totalTasks = 0, activeTasks = 0, pendingTasks = 0, members = 0, agents = 0 }) {
  const truncPath = path && path.length > 35 ? '...' + path.slice(-32) : path;
  return (
    <div className="group relative text-left rounded-2xl bg-linear-to-br from-surface-raised to-surface-raised/90 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer">

      <div className="p-3.5 flex flex-col flex-1">
        <div className="flex items-start gap-2.5">
          <AnimatedFolderMini />
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
