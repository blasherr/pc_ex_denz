'use client';

import { useState } from 'react';
import { fileSystem, recycleBin, FileItem } from '@/data/fileSystem';
import { useNotification } from './NotificationSystem';
import { useAudio } from './AudioManager';
import IOSScreenshot from './IOSScreenshot';
import ReportViewer from './ReportViewer';

interface FileExplorerProps {
  onClose: () => void;
  initialFolderId?: string;
}

// Données de conversations iOS (identiques à RecycleBin)
const conversationsData: { [key: string]: { contact: string; date: string; time: string; messages: { text: string; sent: boolean; time: string }[] } } = {
  'chat-01': {
    contact: '█████████ ███████',
    date: 'Thursday, July 5, 2012',
    time: '9:41 AM',
    messages: [
        { text: "Tu as acheté le lait pour les enfants?", sent: false, time: '9:30 AM' },
        { text: "Tu me déranges pour du lait? Sérieusement?", sent: true, time: '9:32 AM' },
        { text: "C'était la seule chose que je t'avais demandé", sent: false, time: '9:33 AM' },
        { text: "Tu sais quoi █████████ t'avais qu'à y aller toi même au lieu de rien foutre de ta journée", sent: true, time: '9:35 AM' },
        { text: "Je m'occupe des enfants Harry...", sent: false, time: '9:36 AM' },
        { text: "T'appelles ça s'occuper des enfants? Tu sais même pas les éduquer correctement", sent: true, time: '9:38 AM' },
        { text: "C'est pas juste ce que tu dis", sent: false, time: '9:39 AM' },
        { text: "La vérité fait mal hein. Arrête de me déranger pour tes bêtises.", sent: true, time: '9:41 AM' },
      ],
    },
    'chat-02': {
      contact: '█████████ ███████',
      date: 'Thursday, July 5, 2012',
      time: '2:15 PM',
      messages: [
        { text: "Les enfants demandent quand tu rentres, ils veulent te voir", sent: false, time: '2:10 PM' },
        { text: "J'ai autre chose à faire que de jouer à la dînette", sent: true, time: '2:12 PM' },
        { text: "Tu avais promis de rentrer tôt aujourd'hui", sent: false, time: '2:13 PM' },
        { text: "Et toi tu avais promis d'être une femme correcte. On est tous les deux déçus.", sent: true, time: '2:14 PM' },
        { text: "Pourquoi tu me parles comme ça?", sent: false, time: '2:14 PM' },
        { text: "Parce que t'es incapable de comprendre que mon travail nourrit cette famille. Sans moi t'as RIEN.", sent: true, time: '2:15 PM' },
        { text: "...", sent: false, time: '2:16 PM' },
      ],
    },
    'chat-03': {
      contact: '█████████ ███████',
      date: 'Thursday, July 5, 2012',
      time: '4:30 PM',
      messages: [
        { text: "Pourquoi tu réponds pas au téléphone? J'ai essayé 6 fois", sent: false, time: '4:20 PM' },
        { text: "Parce que j'ai pas envie de t'entendre te plaindre", sent: true, time: '4:25 PM' },
        { text: "Je voulais juste te dire que Clara a de la fièvre", sent: false, time: '4:26 PM' },
        { text: "Et qu'est-ce que tu veux que j'y fasse? Donne lui du doliprane. C'est pas compliqué.", sent: true, time: '4:27 PM' },
        { text: "C'est ta fille aussi Harry", sent: false, time: '4:28 PM' },
        { text: "Justement. SI c'était que ma fille elle serait en meilleure santé. C'est toi qui les rend malades avec ta cuisine dégueulasse.", sent: true, time: '4:29 PM' },
        { text: "T'es horrible", sent: false, time: '4:30 PM' },
        { text: "Non je suis honnête. C'est pas pareil. Mais ça tu peux pas comprendre.", sent: true, time: '4:30 PM' },
      ],
    },
    'chat-04': {
      contact: '█████████ ███████',
      date: 'Thursday, July 5, 2012',
      time: '6:45 PM',
      messages: [
        { text: "Tu veux que je te garde une assiette?", sent: false, time: '6:30 PM' },
        { text: "Non. Ta bouffe est immangeable de toute façon.", sent: true, time: '6:35 PM' },
        { text: "D'accord... Les enfants voulaient manger avec toi", sent: false, time: '6:36 PM' },
        { text: "Les enfants veulent ci, les enfants veulent ça. T'as que ça à la bouche.", sent: true, time: '6:38 PM' },
        { text: "C'est normal c'est nos enfants", sent: false, time: '6:40 PM' },
        { text: "TES enfants. Moi j'ai un travail qui va changer le monde. Toi t'as quoi? Rien. T'es personne sans moi.", sent: true, time: '6:42 PM' },
        { text: "Harry s'il te plaît", sent: false, time: '6:43 PM' },
        { text: "S'il te plaît quoi? Ferme la et arrête de me harceler.", sent: true, time: '6:45 PM' },
      ],
    },
    'chat-05': {
      contact: '█████████ ███████',
      date: 'Thursday, July 5, 2012',
      time: '8:20 PM',
      messages: [
        { text: "Ma sœur m'a invitée à dîner samedi", sent: false, time: '8:10 PM' },
        { text: "Ta sœur c'est une ratée comme toi. Vous allez parler de quoi? De comment être inutile?", sent: true, time: '8:12 PM' },
        { text: "Arrête d'insulter ma famille", sent: false, time: '8:14 PM' },
        { text: "C'est pas des insultes c'est des faits. Toute ta famille est médiocre.", sent: true, time: '8:16 PM' },
        { text: "Et la tienne elle est parfaite peut-être?", sent: false, time: '8:17 PM' },
        { text: "Au moins ma famille a produit un génie. La tienne a produit quoi? Une femme au foyer incapable.", sent: true, time: '8:18 PM' },
        { text: "Je pleure là Harry tu sais", sent: false, time: '8:19 PM' },
        { text: "Pleure. C'est tout ce que tu sais faire.", sent: true, time: '8:20 PM' },
      ],
    },
    'chat-06': {
      contact: '█████████ ███████',
      date: 'Thursday, July 5, 2012',
      time: '9:05 PM',
      messages: [
        { text: "On doit parler sérieusement Harry", sent: false, time: '9:00 PM' },
        { text: "Encore?", sent: true, time: '9:01 PM' },
        { text: "Je suis pas heureuse. On est pas heureux.", sent: false, time: '9:02 PM' },
        { text: "TOI t'es pas heureuse. Moi je m'en fous. T'existes à peine dans ma vie.", sent: true, time: '9:03 PM' },
        { text: "Comment tu peux dire ça... On a des enfants ensemble", sent: false, time: '9:03 PM' },
        { text: "Les enfants c'est la seule chose bien que t'as faite. Et encore c'est grâce à mes gènes.", sent: true, time: '9:04 PM' },
        { text: "T'es un monstre", sent: false, time: '9:04 PM' },
        { text: "Non je suis réaliste. Le jour où tu me quitteras t'auras RIEN. Pas de maison, pas d'argent, pas d'enfants. RIEN.", sent: true, time: '9:05 PM' },
        { text: "...", sent: false, time: '9:05 PM' },
      ],
    },
    'chat-07': {
      contact: '█████████ ███████',
      date: 'Thursday, July 5, 2012',
      time: '10:30 PM',
      messages: [
        { text: "On doit parler de la garde des enfants", sent: false, time: '10:15 PM' },
        { text: "Y'a rien à discuter. C'est MOI qui les garde.", sent: true, time: '10:17 PM' },
        { text: "On est encore mariés Harry. J'ai des droits.", sent: false, time: '10:18 PM' },
        { text: "Des droits? Tu me fais rire. T'as AUCUN droit. T'as aucun revenu, aucun diplôme, aucune valeur.", sent: true, time: '10:19 PM' },
        { text: "Je suis leur mère!", sent: false, time: '10:20 PM' },
        { text: "Une mère lamentable. Tu sais même pas aider Clara et Jenna avec leurs devoirs. T'es trop bête.", sent: true, time: '10:21 PM' },
        { text: "C'est faux et tu le sais!", sent: false, time: '10:22 PM' },
        { text: "Mon avocat a déjà tout préparé. Tu vas te retrouver à la rue.", sent: true, time: '10:24 PM' },
        { text: "Tu peux pas faire ça...", sent: false, time: '10:25 PM' },
        { text: "C'est déjà fait. La maison est à MON nom. Les comptes sont à MON nom. Tu dégages.", sent: true, time: '10:26 PM' },
        { text: "Et les enfants?", sent: false, time: '10:27 PM' },
        { text: "Je vais leur expliquer que leur mère les a abandonnés. Ils me croiront moi. Pas toi.", sent: true, time: '10:28 PM' },
        { text: "Harry je t'en supplie", sent: false, time: '10:29 PM' },
        { text: "Supplie tant que tu veux. T'es finie █████████. Personne voudra de toi.", sent: true, time: '10:30 PM' },
      ],
    },
  };

export default function FileExplorer({ onClose, initialFolderId }: FileExplorerProps) {
  // Si un initialFolderId est fourni, trouver le dossier dans fileSystem ou recycleBin
  const findInitialFolder = (): { folder: FileItem | null; path: string[] } => {
    if (!initialFolderId) return { folder: null, path: ['This PC'] };
    // Chercher dans recycleBin
    const recycleFolder = recycleBin.find(f => f.id === initialFolderId);
    if (recycleFolder) return { folder: recycleFolder, path: ['This PC', recycleFolder.name] };
    // Chercher dans fileSystem
    const fsFolder = fileSystem.find(f => f.id === initialFolderId);
    if (fsFolder) return { folder: fsFolder, path: ['This PC', fsFolder.name] };
    return { folder: null, path: ['This PC'] };
  };

  const initial = findInitialFolder();
  const [currentFolder, setCurrentFolder] = useState<FileItem | null>(initial.folder);
  const [path, setPath] = useState<string[]>(initial.path);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [viewingReport, setViewingReport] = useState<string | null>(null);
  const { addNotification } = useNotification();
  const { playSound } = useAudio();

  const handleFolderClick = (folder: FileItem) => {
    setCurrentFolder(folder);
    setPath([...path, folder.name]);
  };

  const handleBack = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
      setCurrentFolder(null);
    }
  };

  const handleFileClick = async (file: FileItem) => {
    // Fichier image (conversation iOS)
    if (file.type === 'image' && conversationsData[file.id]) {
      playSound('open');
      setViewingImage(file.id);
      return;
    }

    // Fichier rapport (PDF/txt)
    if (file.canOpen && file.content) {
      try {
        playSound('open');
        const response = await fetch(file.content);
        const text = await response.text();
        setViewingReport(text);
      } catch {
        playSound('error');
        addNotification({
          type: 'error',
          title: 'Erreur de Chargement',
          message: 'Impossible de charger le fichier.',
          duration: 4000
        });
      }
      return;
    }

    // Fichier protégé ou sans viewer
    if (file.canOpen === false) {
      playSound('error');
      addNotification({
        type: 'error',
        title: 'Accès Refusé',
        message: `Le fichier "${file.name}" est protégé et ne peut pas être ouvert. Clearance insuffisante.`,
        duration: 4000
      });
    } else {
      playSound('error');
      addNotification({
        type: 'warning',
        title: 'Fonctionnalité Indisponible',
        message: 'Le visualiseur de fichiers n\'est pas encore implémenté.',
        duration: 3000
      });
    }
  };

  const currentItems = currentFolder ? currentFolder.children || [] : fileSystem;

  return (
    <>
    <div className="h-full flex flex-col bg-white">
        {/* Toolbar */}
        <div className="h-12 bg-gray-100 border-b border-gray-300 flex items-center px-4 gap-2">
          <button
            onClick={handleBack}
            disabled={path.length <= 1}
            className={`p-2 rounded ${
              path.length > 1
                ? 'hover:bg-gray-200 text-gray-700'
                : 'text-gray-400 cursor-not-allowed'
            } transition-all`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button className="p-2 rounded hover:bg-gray-200 text-gray-400 cursor-not-allowed transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => {
              setCurrentFolder(null);
              setPath(['This PC']);
            }}
            className="p-2 rounded hover:bg-gray-200 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>

          {/* Address bar */}
          <div className="flex-1 flex items-center bg-white border border-gray-300 rounded px-3 py-1">
            <svg className="w-4 h-4 text-gray-400 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" />
            </svg>
            <span className="text-sm text-gray-700">{path.join(' > ')}</span>
          </div>

          <button className="p-2 rounded hover:bg-gray-200 transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {currentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type === 'folder') {
                    handleFolderClick(item);
                  } else {
                    handleFileClick(item);
                  }
                }}
                className="flex flex-col items-center p-4 hover:bg-rose-50 rounded-lg cursor-pointer transition-all group"
              >
                {item.type === 'folder' ? (
                  <svg className="w-16 h-16 mb-2" viewBox="0 0 64 64" fill="none">
                    <path
                      d="M8 14h20l4 6h24v32H8V14z"
                      fill="#FCD34D"
                      stroke="#F59E0B"
                      strokeWidth="2"
                    />
                    <path d="M8 20h48v32H8V20z" fill="#FBBF24" />
                  </svg>
                ) : item.type === 'image' ? (
                  <svg className="w-16 h-16 mb-2" viewBox="0 0 64 64" fill="none">
                    <rect width="56" height="48" x="4" y="8" fill="#86EFAC" stroke="#22C55E" strokeWidth="2" rx="2" />
                    <circle cx="20" cy="20" r="6" fill="#22C55E" />
                    <path d="M4 40l16-16 12 12 16-20 12 12v20H4z" fill="#16A34A" />
                  </svg>
                ) : (
                  <svg className="w-16 h-16 mb-2" viewBox="0 0 64 64" fill="none">
                    <path
                      d="M16 8h24l8 8v40H16V8z"
                      fill="#60A5FA"
                      stroke="#3B82F6"
                      strokeWidth="2"
                    />
                    <path d="M40 8v8h8" fill="#93C5FD" />
                    <path d="M24 28h16M24 36h16M24 44h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                <span className="text-sm text-center text-gray-700 group-hover:text-red-600 break-words line-clamp-2">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          {currentItems.length === 0 && (
            <div className="text-center text-gray-400 py-16">
              <svg className="w-24 h-24 mx-auto mb-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg">This folder is empty</p>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="h-8 bg-gray-100 border-t border-gray-300 flex items-center px-4 text-xs text-gray-600">
          <span>{currentItems.length} items</span>
        </div>
    </div>

    {/* Image Viewer (iOS Screenshot) */}
    {viewingImage && conversationsData[viewingImage] && (
      <div className="fixed inset-0 flex items-center justify-center z-[60] p-8">
        <div className="absolute inset-0 bg-black/90" onClick={() => setViewingImage(null)}></div>
        <div className="relative">
          <button
            onClick={() => setViewingImage(null)}
            className="absolute -top-12 right-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-all"
          >
            Close
          </button>
          <IOSScreenshot {...conversationsData[viewingImage]} />
        </div>
      </div>
    )}

    {/* Report Viewer */}
    {viewingReport && (
      <ReportViewer content={viewingReport} onClose={() => setViewingReport(null)} />
    )}
    </>
  );
}
