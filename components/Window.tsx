'use client';

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';

interface WindowProps {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  initialX?: number;
  initialY?: number;
  minWidth?: number;
  minHeight?: number;
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
}

export default function Window({
  id,
  title,
  icon,
  children,
  initialWidth = 800,
  initialHeight = 600,
  initialX,
  initialY,
  minWidth = 400,
  minHeight = 300,
  isActive,
  onClose,
  onFocus,
}: WindowProps) {
  const [position, setPosition] = useState(() => ({
    x: initialX ?? (typeof window !== 'undefined' ? (window.innerWidth - initialWidth) / 2 : 100),
    y: initialY ?? (typeof window !== 'undefined' ? Math.max(80, (window.innerHeight - initialHeight) / 2) : 100),
  }));
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [preMaximize, setPreMaximize] = useState({ position, size });

  const windowRef = useRef<HTMLDivElement>(null);
  // Use refs for drag/resize tracking to avoid re-registering listeners
  const dragRef = useRef({ isDragging: false, isResizing: false, direction: '', startX: 0, startY: 0, origX: 0, origY: 0, origW: 0, origH: 0 });

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-header') && !isMaximized) {
      dragRef.current = { ...dragRef.current, isDragging: true, startX: e.clientX, startY: e.clientY, origX: position.x, origY: position.y, origW: size.width, origH: size.height };
      setIsInteracting(true);
      onFocus();
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const d = dragRef.current;
    if (d.isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - d.origW, d.origX + (e.clientX - d.startX)));
      const newY = Math.max(0, Math.min(window.innerHeight - d.origH - 48, d.origY + (e.clientY - d.startY)));
      setPosition({ x: newX, y: newY });
    } else if (d.isResizing) {
      const deltaX = e.clientX - d.startX;
      const deltaY = e.clientY - d.startY;

      let newWidth = d.origW;
      let newHeight = d.origH;
      let newX = d.origX;
      let newY = d.origY;

      if (d.direction.includes('e')) {
        newWidth = Math.max(minWidth, d.origW + deltaX);
      }
      if (d.direction.includes('w')) {
        newWidth = Math.max(minWidth, d.origW - deltaX);
        newX = d.origX + (d.origW - newWidth);
      }
      if (d.direction.includes('s')) {
        newHeight = Math.max(minHeight, d.origH + deltaY);
      }
      if (d.direction.includes('n')) {
        newHeight = Math.max(minHeight, d.origH - deltaY);
        newY = d.origY + (d.origH - newHeight);
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  }, [minWidth, minHeight]);

  const handleMouseUp = useCallback(() => {
    dragRef.current = { ...dragRef.current, isDragging: false, isResizing: false, direction: '' };
    setIsInteracting(false);
  }, []);

  // Handle resizing
  const startResize = (direction: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { isDragging: false, isResizing: true, direction, startX: e.clientX, startY: e.clientY, origX: position.x, origY: position.y, origW: size.width, origH: size.height };
    setIsInteracting(true);
    onFocus();
  };

  // Toggle maximize
  const handleMaximize = () => {
    if (!isMaximized) {
      setPreMaximize({ position, size });
      setIsMaximized(true);
    } else {
      setPosition(preMaximize.position);
      setSize(preMaximize.size);
      setIsMaximized(false);
    }
  };

  // Double-click header to maximize
  const handleDoubleClick = () => {
    handleMaximize();
  };

  useEffect(() => {
    if (isInteracting) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isInteracting, handleMouseMove, handleMouseUp]);

  const windowStyle = isMaximized
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 48px)' }
    : { top: position.y, left: position.x, width: size.width, height: size.height };

  return (
    <div
      ref={windowRef}
      className={`
        fixed bg-[#1e293b]/98 backdrop-blur-xl rounded-xl border shadow-2xl overflow-hidden
        transition-shadow duration-200
        ${isActive ? 'border-red-500/40 shadow-red-500/20' : 'border-white/10'}
        ${isInteracting ? 'select-none' : ''}
      `}
      style={{
        ...windowStyle,
        zIndex: isActive ? 1000 : 900,
        transition: isMaximized ? 'all 0.2s ease-out' : 'none',
      }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div
        className="window-header h-10 bg-gradient-to-r from-red-600/90 to-rose-600/90 flex items-center justify-between px-4 cursor-move select-none"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="flex items-center gap-2">
          {icon && <div className="flex items-center justify-center">{icon}</div>}
          <span className="text-white font-semibold text-sm">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="w-6 h-6 hover:bg-white/20 rounded flex items-center justify-center transition-all"
            onClick={(e) => {
              e.stopPropagation();
              // Minimize (just hide for now)
            }}
          >
            <span className="text-white text-lg leading-none">−</span>
          </button>
          <button
            className="w-6 h-6 hover:bg-white/20 rounded flex items-center justify-center transition-all"
            onClick={(e) => {
              e.stopPropagation();
              handleMaximize();
            }}
          >
            <span className="text-white text-lg leading-none">□</span>
          </button>
          <button
            className="w-6 h-6 hover:bg-red-600 rounded flex items-center justify-center transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <span className="text-white text-lg leading-none">×</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-40px)] overflow-hidden">
        {children}
      </div>

      {/* Resize handles */}
      {!isMaximized && (
        <>
          <div className="absolute top-0 left-0 right-0 h-1 cursor-n-resize" onMouseDown={startResize('n')} />
          <div className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize" onMouseDown={startResize('s')} />
          <div className="absolute top-0 bottom-0 left-0 w-1 cursor-w-resize" onMouseDown={startResize('w')} />
          <div className="absolute top-0 bottom-0 right-0 w-1 cursor-e-resize" onMouseDown={startResize('e')} />
          <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize" onMouseDown={startResize('nw')} />
          <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize" onMouseDown={startResize('ne')} />
          <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize" onMouseDown={startResize('sw')} />
          <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize" onMouseDown={startResize('se')} />
        </>
      )}
    </div>
  );
}
