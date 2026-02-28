import { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import { clsx } from 'clsx';
import { useSquircle } from '../hooks/useSquircle.js';

/**
 * Inner tooltip bubble with squircle clip-path.
 */
const TooltipBubble = forwardRef(function TooltipBubble({ children, className }, outerRef) {
  const [sqRef, sqStyle] = useSquircle(12);
  const combinedRef = useCallback((el) => {
    if (typeof outerRef === 'function') outerRef(el);
    else if (outerRef) outerRef.current = el;
    sqRef(el);
  }, [outerRef, sqRef]);

  return (
    <div
      ref={combinedRef}
      role="tooltip"
      className={clsx(
        'absolute z-[10000] px-2.5 py-1.5 rounded-lg text-[11px] font-medium',
        'bg-surface-raised text-text-secondary border-0',
        'whitespace-normal max-w-60 pointer-events-none',
        'animate-in fade-in duration-100',
        className,
      )}
      style={{ ...sqStyle, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))' }}
    >
      {children}
    </div>
  );
});

/**
 * Viewport-aware tooltip that repositions to stay on-screen.
 */
export function Tooltip({
  children,
  content,
  position = 'bottom',
  delay = 300,
  className,
}) {
  const [visible, setVisible] = useState(false);
  const [adjustedPos, setAdjustedPos] = useState(position);
  const timeoutRef = useRef(null);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  const reposition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const trigger = triggerRef.current.getBoundingClientRect();
    const tip = tooltipRef.current.getBoundingClientRect();
    const vw = window.innerWidth;

    // Check if tooltip overflows right edge
    if (position === 'bottom' || position === 'top') {
      const tipLeft = trigger.left + trigger.width / 2 - tip.width / 2;
      const tipRight = tipLeft + tip.width;
      if (tipRight > vw - 8) {
        tooltipRef.current.style.left = 'auto';
        tooltipRef.current.style.right = '0';
        tooltipRef.current.style.transform = 'none';
      } else if (tipLeft < 8) {
        tooltipRef.current.style.left = '0';
        tooltipRef.current.style.right = 'auto';
        tooltipRef.current.style.transform = 'none';
      }
    }
  }, [position]);

  function show() {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
      setAdjustedPos(position);
      requestAnimationFrame(reposition);
    }, delay);
  }

  function hide() {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  }

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      ref={triggerRef}
      className={clsx('relative inline-flex', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && content && (
        <TooltipBubble
          ref={tooltipRef}
          className={positionClasses[adjustedPos]}
        >
          {content}
        </TooltipBubble>
      )}
    </div>
  );
}
