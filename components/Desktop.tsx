'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import FileExplorer from './FileExplorer';
import RecycleBin from './RecycleBin';
import Window from './Window';
import EmailApp from './EmailApp';
import { useNotification } from './NotificationSystem';
import { useAudio, AudioControlPanel } from './AudioManager';

// Configuration de la grille
const GRID_COLS = 15;
const GRID_ROWS = 8;
const CELL_WIDTH = 85;
const CELL_HEIGHT = 90;

interface IconPosition {
  id: string;
  col: number;
  row: number;
}

interface DesktopIconData {
  id: string;
  label: string;
  type: 'explorer' | 'recycle' | 'email' | 'neuralweb' | 'plasmanav' | 'quantumedge';
  disabled?: boolean;
  action?: () => void;
}

interface WindowState {
  id: string;
  type: 'explorer' | 'recycle' | 'email' | 'restored-folder';
  title: string;
  icon: React.ReactNode;
  folderId?: string;
}

export default function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);
  const [restoredFolders, setRestoredFolders] = useState<{ id: string; name: string }[]>([]);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [draggedIcon, setDraggedIcon] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [selectionBox, setSelectionBox] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; iconId?: string } | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  const { addNotification } = useNotification();
  const { playSound } = useAudio();

  // Open window
  const openRestoredFolder = (folderId: string, folderName: string) => {
    playSound('open');
    const windowId = `restored-${folderId}-${Date.now()}`;
    const newWindow: WindowState = {
      id: windowId,
      type: 'restored-folder',
      title: folderName,
      icon: <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" /></svg>,
      folderId,
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(windowId);
  };

  const openWindow = (type: 'explorer' | 'recycle' | 'email') => {
    playSound('open');

    const windowId = `${type}-${Date.now()}`;
    const windowConfig = {
      explorer: {
        title: 'File Explorer',
        icon: <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" /></svg>
      },
      recycle: {
        title: 'Archive Bin',
        icon: <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="currentColor"><path d="M6 7h12l-1 13H7L6 7zm2-4h8v2H8V3zm-3 3h14v1H5V6z" /></svg>
      },
      email: {
        title: 'Email - CERBERUS Mail',
        icon: <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      }
    }[type];

    const newWindow: WindowState = {
      id: windowId,
      type,
      ...windowConfig
    };

    setWindows([...windows, newWindow]);
    setActiveWindowId(windowId);

    addNotification({
      type: 'info',
      title: 'Application lancée',
      message: `${windowConfig.title} ouvert avec succès`,
      duration: 3000
    });
  };

  // Close window
  const closeWindow = (windowId: string) => {
    playSound('close');
    setWindows(windows.filter(w => w.id !== windowId));
    if (activeWindowId === windowId) {
      setActiveWindowId(windows.length > 1 ? windows[windows.length - 2].id : null);
    }
  };

  // Focus window
  const focusWindow = (windowId: string) => {
    playSound('click');
    setActiveWindowId(windowId);
  };

  // Callback quand un dossier est restauré depuis la corbeille
  const handleFolderRestore = useCallback((folderId: string, folderName: string) => {
    setRestoredFolders(prev => {
      if (prev.some(f => f.id === folderId)) return prev;
      return [...prev, { id: folderId, name: folderName }];
    });

    // Ajouter une position pour la nouvelle icône
    setIconPositions(prev => {
      if (prev.some(p => p.id === `restored-${folderId}`)) return prev;
      // Trouver la prochaine position libre dans la colonne de droite
      const usedPositions = new Set(prev.map(p => `${p.col}-${p.row}`));
      let col = GRID_COLS - 1;
      let row = 0;
      while (usedPositions.has(`${col}-${row}`)) {
        row++;
        if (row >= GRID_ROWS) {
          row = 0;
          col--;
        }
      }
      return [...prev, { id: `restored-${folderId}`, col, row }];
    });

    playSound('success');
    addNotification({
      type: 'success',
      title: 'Dossier Restauré',
      message: `"${folderName}" est maintenant disponible sur le bureau.`,
      duration: 5000
    });
  }, [playSound, addNotification]);

  // Définition des icônes (base + restaurées)
  const restoredIcons: DesktopIconData[] = restoredFolders.map(f => ({
    id: `restored-${f.id}`,
    label: f.name,
    type: 'explorer' as const,
    action: () => openRestoredFolder(f.id, f.name),
  }));

  const icons: DesktopIconData[] = [
    { id: 'explorer', label: 'File System', type: 'explorer', action: () => openWindow('explorer') },
    { id: 'recycle', label: 'Archive Bin', type: 'recycle', action: () => openWindow('recycle') },
    { id: 'email', label: 'Email', type: 'email', action: () => openWindow('email') },
    { id: 'neuralweb', label: 'NeuralWeb', type: 'neuralweb', disabled: true },
    { id: 'plasmanav', label: 'PlasmaNav', type: 'plasmanav', disabled: true },
    { id: 'quantumedge', label: 'QuantumEdge', type: 'quantumedge', disabled: true },
    ...restoredIcons,
  ];

  // Positions initiales des icônes (colonne gauche)
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([
    { id: 'explorer', col: 0, row: 0 },
    { id: 'recycle', col: 0, row: 1 },
    { id: 'email', col: 0, row: 2 },
    { id: 'neuralweb', col: 0, row: 3 },
    { id: 'plasmanav', col: 0, row: 4 },
    { id: 'quantumedge', col: 0, row: 5 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Calcul position pixel depuis grille
  const gridToPixel = (col: number, row: number) => ({
    x: col * CELL_WIDTH + 12,
    y: row * CELL_HEIGHT + 12,
  });

  // Calcul position grille depuis pixel
  const pixelToGrid = (x: number, y: number) => ({
    col: Math.max(0, Math.min(GRID_COLS - 1, Math.floor((x - 12) / CELL_WIDTH))),
    row: Math.max(0, Math.min(GRID_ROWS - 1, Math.floor((y - 12) / CELL_HEIGHT))),
  });

  // Vérifier si une cellule est occupée
  const isCellOccupied = (col: number, row: number, excludeId?: string) => {
    return iconPositions.some(pos => pos.col === col && pos.row === row && pos.id !== excludeId);
  };

  // Trouver la cellule libre la plus proche
  const findNearestFreeCell = (col: number, row: number, excludeId: string): { col: number; row: number } => {
    if (!isCellOccupied(col, row, excludeId)) return { col, row };
    
    for (let radius = 1; radius < Math.max(GRID_COLS, GRID_ROWS); radius++) {
      for (let dc = -radius; dc <= radius; dc++) {
        for (let dr = -radius; dr <= radius; dr++) {
          const newCol = col + dc;
          const newRow = row + dr;
          if (newCol >= 0 && newCol < GRID_COLS && newRow >= 0 && newRow < GRID_ROWS) {
            if (!isCellOccupied(newCol, newRow, excludeId)) {
              return { col: newCol, row: newRow };
            }
          }
        }
      }
    }
    return { col, row };
  };

  // Gestion du drag
  const handleMouseDown = useCallback((e: React.MouseEvent, iconId: string) => {
    if (e.button !== 0) return; // Only left click
    e.preventDefault();
    e.stopPropagation();
    
    const iconPos = iconPositions.find(p => p.id === iconId);
    if (!iconPos) return;

    const pixelPos = gridToPixel(iconPos.col, iconPos.row);
    setDragOffset({
      x: e.clientX - pixelPos.x,
      y: e.clientY - pixelPos.y,
    });
    setDragPosition(pixelPos);
    setDraggedIcon(iconId);
    setContextMenu(null);

    if (!e.ctrlKey && !e.shiftKey) {
      setSelectedIcons([iconId]);
    } else {
      setSelectedIcons(prev => 
        prev.includes(iconId) ? prev.filter(id => id !== iconId) : [...prev, iconId]
      );
    }
  }, [iconPositions]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggedIcon) {
      setDragPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    } else if (selectionBox) {
      setSelectionBox(prev => prev ? { ...prev, endX: e.clientX, endY: e.clientY } : null);
      
      // Sélectionner les icônes dans la boîte
      const box = {
        left: Math.min(selectionBox.startX, e.clientX),
        right: Math.max(selectionBox.startX, e.clientX),
        top: Math.min(selectionBox.startY, e.clientY),
        bottom: Math.max(selectionBox.startY, e.clientY),
      };
      
      const selected = iconPositions.filter(pos => {
        const pixel = gridToPixel(pos.col, pos.row);
        const iconRect = {
          left: pixel.x,
          right: pixel.x + CELL_WIDTH,
          top: pixel.y,
          bottom: pixel.y + CELL_HEIGHT,
        };
        return !(box.right < iconRect.left || box.left > iconRect.right || 
                 box.bottom < iconRect.top || box.top > iconRect.bottom);
      }).map(pos => pos.id);
      
      setSelectedIcons(selected);
    }
  }, [draggedIcon, dragOffset, selectionBox, iconPositions]);

  const handleMouseUp = useCallback(() => {
    if (draggedIcon) {
      const targetGrid = pixelToGrid(dragPosition.x + CELL_WIDTH / 2, dragPosition.y + CELL_HEIGHT / 2);
      const freeCell = findNearestFreeCell(targetGrid.col, targetGrid.row, draggedIcon);
      
      setIconPositions(prev => prev.map(pos => 
        pos.id === draggedIcon ? { ...pos, col: freeCell.col, row: freeCell.row } : pos
      ));
    }
    setDraggedIcon(null);
    setSelectionBox(null);
  }, [draggedIcon, dragPosition]);

  const handleDesktopMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (e.target === desktopRef.current || (e.target as HTMLElement).classList.contains('desktop-bg')) {
      setSelectedIcons([]);
      setShowStartMenu(false);
      setContextMenu(null);
      setSelectionBox({
        startX: e.clientX,
        startY: e.clientY,
        endX: e.clientX,
        endY: e.clientY,
      });
    }
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent, iconId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, iconId });
    if (iconId) setSelectedIcons([iconId]);
  }, []);

  const handleDoubleClick = useCallback((iconId: string) => {
    const icon = icons.find(i => i.id === iconId);
    if (icon && !icon.disabled && icon.action) {
      playSound('click');
      icon.action();
    }
  }, [windows, playSound]);

  // Rendu des icônes
  const getIconStyle = (iconId: string): React.CSSProperties => {
    if (draggedIcon === iconId) {
      return {
        position: 'absolute',
        left: dragPosition.x,
        top: dragPosition.y,
        zIndex: 1000,
        opacity: 0.9,
        transform: 'scale(1.05)',
        transition: 'none',
      };
    }
    
    const pos = iconPositions.find(p => p.id === iconId);
    if (!pos) return {};
    
    const pixel = gridToPixel(pos.col, pos.row);
    return {
      position: 'absolute',
      left: pixel.x,
      top: pixel.y,
      transition: draggedIcon ? 'none' : 'all 0.15s ease-out',
    };
  };

  return (
    <div 
      ref={desktopRef}
      className="w-full h-full bg-[#0a0000] relative overflow-hidden select-none"
      onMouseDown={handleDesktopMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={(e) => handleContextMenu(e)}
      onClick={() => setContextMenu(null)}
    >
      {/* Wallpaper - Cerberus Theme */}
      <div className="desktop-bg absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0000] via-[#1a0505] to-[#000000]" />

        {/* Cerberus Logo Watermark */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Red halo/glow effect */}
          <div className="absolute w-[600px] h-[600px] bg-red-500/30 rounded-full blur-[100px]" />
          <img 
            src="/images/cerberus-logo.png" 
            alt="Cerberus" 
            className="w-[500px] h-auto relative z-10 drop-shadow-[0_0_80px_rgba(220,38,38,0.6)] select-none"
            draggable={false}
          />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.06)_1px,transparent_1px)] bg-[size:80px_80px]" />

        {/* Animated scan lines */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(220,38,38,0.03)_50%,transparent_100%)] bg-[size:100%_4px] animate-scan" />

        {/* Glowing orbs - Red theme */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-red-800/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '4s' }} />

        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />

        {/* Corner accents - Red */}
        <div className="absolute top-0 left-0 w-40 h-40 border-t-2 border-l-2 border-red-600/20" />
        <div className="absolute top-0 right-0 w-40 h-40 border-t-2 border-r-2 border-red-600/20" />
        <div className="absolute bottom-12 left-0 w-40 h-40 border-b-2 border-l-2 border-red-600/20" />
        <div className="absolute bottom-12 right-0 w-40 h-40 border-b-2 border-r-2 border-red-600/20" />
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>

      {/* Desktop Icons */}
      {icons.map(icon => (
        <DesktopIconComponent
          key={icon.id}
          style={getIconStyle(icon.id)}
          icon={<IconRenderer type={icon.type} />}
          label={icon.label}
          selected={selectedIcons.includes(icon.id)}
          disabled={icon.disabled}
          isDragging={draggedIcon === icon.id}
          onMouseDown={(e) => handleMouseDown(e, icon.id)}
          onDoubleClick={() => handleDoubleClick(icon.id)}
          onContextMenu={(e) => handleContextMenu(e, icon.id)}
        />
      ))}

      {/* Selection Box */}
      {selectionBox && Math.abs(selectionBox.endX - selectionBox.startX) > 5 && (
        <div
          className="absolute border border-red-400/60 bg-red-500/15 pointer-events-none z-40"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.endX),
            top: Math.min(selectionBox.startY, selectionBox.endY),
            width: Math.abs(selectionBox.endX - selectionBox.startX),
            height: Math.abs(selectionBox.endY - selectionBox.startY),
          }}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="absolute bg-[#1e293b]/95 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl py-1 min-w-[180px] z-[100]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.iconId ? (
            <>
              <ContextMenuItem 
                label="Ouvrir" 
                onClick={() => {
                  handleDoubleClick(contextMenu.iconId!);
                  setContextMenu(null);
                }}
                disabled={icons.find(i => i.id === contextMenu.iconId)?.disabled}
              />
              <div className="h-px bg-white/10 my-1" />
              <ContextMenuItem label="Renommer" disabled />
              <ContextMenuItem label="Supprimer" disabled />
            </>
          ) : (
            <>
              <ContextMenuItem label="Actualiser" onClick={() => setContextMenu(null)} />
              <div className="h-px bg-white/10 my-1" />
              <ContextMenuItem label="Nouveau dossier" disabled />
              <ContextMenuItem label="Paramètres d'affichage" disabled />
              <div className="h-px bg-white/10 my-1" />
              <ContextMenuItem label="Personnaliser" disabled />
            </>
          )}
        </div>
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-center px-3 z-50">
        <div className="flex items-center gap-0.5 bg-white/5 rounded-full px-1.5 py-1">
          {/* Start Button */}
          <TaskbarButton
            active={showStartMenu}
            onClick={(e) => { e.stopPropagation(); setShowStartMenu(!showStartMenu); }}
          >
            <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
          </TaskbarButton>

          {/* Search */}
          <TaskbarButton disabled>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </TaskbarButton>

          {/* File Explorer */}
          <TaskbarButton
            active={windows.some(w => w.type === 'explorer')}
            onClick={() => openWindow('explorer')}
          >
            <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" />
            </svg>
          </TaskbarButton>

          {/* Recycle Bin */}
          <TaskbarButton
            active={windows.some(w => w.type === 'recycle')}
            onClick={() => openWindow('recycle')}
          >
            <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 7h12l-1 13H7L6 7zm2-4h8v2H8V3zm-3 3h14v1H5V6z" />
            </svg>
          </TaskbarButton>

          {/* NeuralWeb (disabled) */}
          <TaskbarButton disabled>
            <svg className="w-5 h-5 text-red-400 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path d="M12 2v20M2 12h20M6 6l12 12M6 18l12-12" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </TaskbarButton>
        </div>

        {/* System Tray */}
        <div className="absolute right-3 flex items-center gap-2 text-slate-300">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 cursor-pointer transition-colors">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 18c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-5.9-2.2C7.5 14.5 9.6 13.5 12 13.5s4.5 1 5.9 2.3l1.4-1.4C17.5 12.5 14.9 11.5 12 11.5s-5.5 1-7.3 2.9l1.4 1.4z" />
            </svg>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
            <svg className="w-4 h-3.5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 4h-3V2h-4v2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2z" />
            </svg>
          </div>
          <div className="text-right px-2 py-1 rounded-md hover:bg-white/5 cursor-pointer transition-colors">
            <div className="text-[11px] font-medium">{currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-[10px] text-slate-500">{currentTime.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}/2035</div>
          </div>
        </div>
      </div>

      {/* Start Menu */}
      {showStartMenu && (
        <div 
          className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[420px] bg-[#1e293b]/98 backdrop-blur-2xl rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Bar */}
          <div className="p-3 border-b border-white/5">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Rechercher..."
                className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 outline-none"
                disabled
              />
            </div>
          </div>

          {/* Pinned Apps */}
          <div className="p-3">
            <div className="text-[11px] text-red-400/60 mb-2 font-medium uppercase tracking-wider">Applications</div>
            <div className="grid grid-cols-5 gap-1">
              <StartMenuItem
                icon={<IconRenderer type="explorer" />}
                label="Explorateur"
                onClick={() => { openWindow('explorer'); setShowStartMenu(false); }}
              />
              <StartMenuItem
                icon={<IconRenderer type="recycle" />}
                label="Corbeille"
                onClick={() => { openWindow('recycle'); setShowStartMenu(false); }}
              />
              <StartMenuItem
                icon={<IconRenderer type="email" />}
                label="Email"
                onClick={() => { openWindow('email'); setShowStartMenu(false); }}
              />
              <StartMenuItem icon={<IconRenderer type="neuralweb" />} label="NeuralWeb" disabled />
              <StartMenuItem icon={<IconRenderer type="plasmanav" />} label="PlasmaNav" disabled />
            </div>
          </div>

          {/* User Section */}
          <div className="p-3 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center text-white text-xs font-bold">G</div>
              <span className="text-white text-sm">GP-TWO</span>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Windows */}
      {windows.map((window) => (
        <Window
          key={window.id}
          id={window.id}
          title={window.title}
          icon={window.icon}
          isActive={activeWindowId === window.id}
          onClose={() => closeWindow(window.id)}
          onFocus={() => focusWindow(window.id)}
        >
          {window.type === 'explorer' && <FileExplorer onClose={() => closeWindow(window.id)} />}
          {window.type === 'restored-folder' && <FileExplorer onClose={() => closeWindow(window.id)} initialFolderId={window.folderId} />}
          {window.type === 'recycle' && <RecycleBin onClose={() => closeWindow(window.id)} onRestore={handleFolderRestore} restoredFolderIds={restoredFolders.map(f => f.id)} />}
          {window.type === 'email' && <EmailApp />}
        </Window>
      ))}

      {/* Audio Control Panel */}
      <AudioControlPanel />
    </div>
  );
}

// Context Menu Item
function ContextMenuItem({ label, onClick, disabled }: { label: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
        disabled ? 'text-slate-500 cursor-not-allowed' : 'text-white hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  );
}

// Desktop Icon Component
function DesktopIconComponent({ 
  icon, 
  label, 
  selected, 
  disabled, 
  isDragging,
  style, 
  onMouseDown, 
  onDoubleClick,
  onContextMenu,
}: {
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  isDragging?: boolean;
  style?: React.CSSProperties;
  onMouseDown?: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      style={style}
      className={`
        w-[76px] h-[80px] flex flex-col items-center justify-center p-1.5 rounded-md cursor-pointer
        ${selected ? 'bg-red-500/25 ring-1 ring-red-400/40' : 'hover:bg-white/5'}
        ${disabled ? 'opacity-60' : ''}
        ${isDragging ? 'cursor-grabbing shadow-xl' : ''}
      `}
      onMouseDown={onMouseDown}
      onDoubleClick={disabled ? undefined : onDoubleClick}
      onContextMenu={onContextMenu}
    >
      <div className="w-10 h-10 flex items-center justify-center mb-1">{icon}</div>
      <span className="text-[10px] text-white text-center leading-tight line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{label}</span>
    </div>
  );
}

// Taskbar Button
function TaskbarButton({ 
  children, 
  active, 
  disabled, 
  onClick 
}: { 
  children: React.ReactNode; 
  active?: boolean; 
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`
        w-10 h-10 rounded-md flex items-center justify-center transition-all relative
        ${active ? 'bg-white/15' : 'hover:bg-white/10'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        text-slate-300
      `}
    >
      {children}
      {active && <div className="absolute bottom-1 w-4 h-0.5 bg-red-400 rounded-full" />}
    </button>
  );
}

// Start Menu Item
function StartMenuItem({ 
  icon, 
  label, 
  onClick, 
  disabled 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick?: () => void; 
  disabled?: boolean;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`
        flex flex-col items-center gap-1 p-2 rounded-lg transition-all
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'}
      `}
    >
      <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
      <span className="text-[10px] text-white/80 truncate w-full text-center">{label}</span>
    </button>
  );
}

// Icon Renderer - Robotique/Moderne
function IconRenderer({ type }: { type: string }) {
  switch (type) {
    case 'explorer':
      return (
        <svg className="w-full h-full" viewBox="0 0 48 48" fill="none">
          {/* Futuristic folder */}
          <defs>
            <linearGradient id="folderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#b91c1c', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path d="M6 16l3-4h9l3 3h21l-3 4H6z" fill="url(#folderGrad)" opacity="0.6" />
          <path d="M6 19h36l-4 20H10L6 19z" fill="url(#folderGrad)" />
          <path d="M6 19h36M10 39L6 19l3-3m33 3l-4 20" stroke="#991b1b" strokeWidth="1.5" opacity="0.5" />
          <circle cx="24" cy="29" r="4" fill="#dc2626" opacity="0.8" />
          <circle cx="24" cy="29" r="2" fill="#fff" />
        </svg>
      );
    case 'recycle':
      return (
        <svg className="w-full h-full" viewBox="0 0 48 48" fill="none">
          {/* Futuristic recycle bin */}
          <defs>
            <linearGradient id="recycleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#64748b', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#94a3b8', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path d="M14 16h20l4 24H10l4-24z" fill="url(#recycleGrad)" />
          <path d="M12 16h24v2H12z" fill="#cbd5e1" />
          <path d="M20 16v-2a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#cbd5e1" strokeWidth="2" fill="none" />
          <path d="M20 24v10M28 24v10M24 24v10" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <path d="M14 16l4 24h12l4-24" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      );
    case 'email':
      return (
        <svg className="w-full h-full" viewBox="0 0 48 48" fill="none">
          {/* Email/message icon */}
          <defs>
            <linearGradient id="emailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#991b1b', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <rect x="6" y="12" width="36" height="24" rx="2" fill="url(#emailGrad)" />
          <path d="M6 12l18 12l18-12" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 36l12-10M42 36l-12-10" stroke="#7f1d1d" strokeWidth="1.5" opacity="0.6" />
          <rect x="6" y="12" width="36" height="24" rx="2" stroke="#b91c1c" strokeWidth="1.5" fill="none" opacity="0.8" />
          <circle cx="35" cy="18" r="3" fill="#fbbf24" />
          <circle cx="35" cy="18" r="1.5" fill="#fff" />
        </svg>
      );
    case 'neuralweb':
      return (
        <svg className="w-full h-full" viewBox="0 0 48 48" fill="none">
          {/* Neural network icon */}
          <defs>
            <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="18" stroke="url(#neuralGrad)" strokeWidth="2" fill="none" />
          <circle cx="24" cy="8" r="3" fill="#dc2626" />
          <circle cx="24" cy="40" r="3" fill="#dc2626" />
          <circle cx="8" cy="24" r="3" fill="#dc2626" />
          <circle cx="40" cy="24" r="3" fill="#dc2626" />
          <circle cx="16" cy="16" r="2.5" fill="#ef4444" />
          <circle cx="32" cy="16" r="2.5" fill="#ef4444" />
          <circle cx="16" cy="32" r="2.5" fill="#ef4444" />
          <circle cx="32" cy="32" r="2.5" fill="#ef4444" />
          <path d="M24 8L16 16M24 8L32 16M8 24L16 16M8 24L16 32M40 24L32 16M40 24L32 32M24 40L16 32M24 40L32 32" stroke="#ef4444" strokeWidth="1" opacity="0.4" />
          <circle cx="24" cy="24" r="5" fill="#dc2626" />
          <circle cx="24" cy="24" r="2" fill="#fff" />
        </svg>
      );
    case 'plasmanav':
      return (
        <svg className="w-full h-full" viewBox="0 0 48 48" fill="none">
          {/* Plasma/fire icon */}
          <defs>
            <linearGradient id="plasmaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#b91c1c', stopOpacity: 1 }} />
            </linearGradient>
            <radialGradient id="plasmaCenter">
              <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#f97316', stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <circle cx="24" cy="24" r="20" fill="url(#plasmaGrad)" />
          <path d="M24 4a20 20 0 0 1 10 18 20 20 0 0 1-10 18 20 20 0 0 1-10-18A20 20 0 0 1 24 4z" fill="url(#plasmaCenter)" opacity="0.6" />
          <circle cx="24" cy="24" r="16" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.4" />
          <circle cx="24" cy="24" r="12" fill="none" stroke="#fde047" strokeWidth="1" opacity="0.6" />
          <circle cx="24" cy="24" r="8" fill="#fde047" opacity="0.8" />
          <circle cx="24" cy="24" r="4" fill="#fff" />
        </svg>
      );
    case 'quantumedge':
      return (
        <svg className="w-full h-full" viewBox="0 0 48 48" fill="none">
          {/* Quantum/hexagon icon */}
          <defs>
            <linearGradient id="quantumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path d="M24 4l16 9v18l-16 9l-16-9V13z" stroke="url(#quantumGrad)" strokeWidth="2" fill="none" />
          <path d="M24 4l16 9v18l-16 9l-16-9V13z" fill="url(#quantumGrad)" opacity="0.2" />
          <path d="M24 12l10 6v12l-10 6l-10-6V18z" fill="url(#quantumGrad)" opacity="0.4" />
          <path d="M24 12l10 6v12l-10 6l-10-6V18z" stroke="#8b5cf6" strokeWidth="1.5" fill="none" />
          <circle cx="24" cy="24" r="6" fill="#a78bfa" />
          <circle cx="24" cy="24" r="3" fill="#fff" />
          <path d="M24 4v8M24 36v8M8 13l7 4M33 31l7 4M8 31l7-4M33 13l7-4" stroke="#8b5cf6" strokeWidth="1" opacity="0.5" />
        </svg>
      );
    default:
      return (
        <svg className="w-full h-full" viewBox="0 0 48 48" fill="none">
          <rect x="8" y="12" width="32" height="28" rx="2" fill="#64748b" />
        </svg>
      );
  }
}
