'use client';

import { useState } from 'react';
import { recycleBin, FileItem } from '@/data/fileSystem';
import IOSScreenshot from './IOSScreenshot';

interface RecycleBinProps {
  onClose: () => void;
}

export default function RecycleBin({ onClose }: RecycleBinProps) {
  const [items, setItems] = useState<FileItem[]>(recycleBin);
  const [currentFolder, setCurrentFolder] = useState<FileItem | null>(null);
  const [path, setPath] = useState<string[]>(['Recycle Bin']);
  const [passwordPrompt, setPasswordPrompt] = useState<FileItem | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [viewingReport, setViewingReport] = useState<string | null>(null);

  const handleFolderClick = (folder: FileItem) => {
    if (folder.locked) {
      setPasswordPrompt(folder);
      setPassword('');
      setPasswordError(false);
    } else {
      setCurrentFolder(folder);
      setPath([...path, folder.name]);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordPrompt && password === passwordPrompt.password) {
      setCurrentFolder(passwordPrompt);
      setPath([...path, passwordPrompt.name]);
      setPasswordPrompt(null);
      setPassword('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPassword('');
    }
  };

  const handleBack = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
      setCurrentFolder(null);
    }
  };

  const handleRestore = (item: FileItem) => {
    if (confirm(`Restore "${item.name}" to Desktop?`)) {
      setItems(items.filter((i) => i.id !== item.id));
      alert(`"${item.name}" has been restored to Desktop!`);
    }
  };

  const handleFileClick = async (file: FileItem) => {
    if (file.type === 'image') {
      setViewingImage(file.id);
    } else if (file.canOpen && file.content) {
      try {
        const response = await fetch(file.content);
        const text = await response.text();
        setViewingReport(text);
      } catch (error) {
        alert('Error loading file');
      }
    } else {
      alert('This file cannot be opened.');
    }
  };

  const currentItems = currentFolder ? currentFolder.children || [] : items;

  // iOS conversation data for images
  const conversationsData: { [key: string]: any } = {
    'chat-01': {
      contact: 'Helene Bertram',
      date: 'Thursday, July 5, 2012',
      time: '9:41 AM',
      messages: [
        { text: "Tu as acheté le lait?", sent: false, time: '9:30 AM' },
        { text: "Non j'ai oublié", sent: true, time: '9:32 AM' },
        { text: "Sérieusement? C'était la seule chose!", sent: false, time: '9:33 AM' },
        { text: "Je suis occupé Helene", sent: true, time: '9:35 AM' },
        { text: "Occupé à quoi exactement?", sent: false, time: '9:36 AM' },
        { text: "Mes recherches sont plus importantes que ton lait", sent: true, time: '9:38 AM' },
        { text: "Incroyable...", sent: false, time: '9:40 AM' },
      ],
    },
    'chat-02': {
      contact: 'Helene Bertram',
      date: 'Thursday, July 5, 2012',
      time: '2:15 PM',
      messages: [
        { text: "Les enfants demandent quand tu rentres", sent: false, time: '2:10 PM' },
        { text: "Tard ce soir", sent: true, time: '2:12 PM' },
        { text: "Encore? Tu avais promis", sent: false, time: '2:13 PM' },
        { text: "Le projet GP-TWO ne peut pas attendre", sent: true, time: '2:14 PM' },
        { text: "Et ta famille peut attendre?", sent: false, time: '2:14 PM' },
        { text: "Tu ne comprends pas l'importance de mon travail", sent: true, time: '2:15 PM' },
      ],
    },
    'chat-03': {
      contact: 'Helene Bertram',
      date: 'Thursday, July 5, 2012',
      time: '4:30 PM',
      messages: [
        { text: "Pourquoi tu réponds pas au téléphone?", sent: false, time: '4:20 PM' },
        { text: "J'étais en réunion", sent: true, time: '4:25 PM' },
        { text: "Pendant 3 heures?", sent: false, time: '4:26 PM' },
        { text: "Oui Helene, c'est ce qu'on appelle le travail", sent: true, time: '4:28 PM' },
        { text: "Ton ton est vraiment désagréable", sent: false, time: '4:29 PM' },
        { text: "Et toi tu es épuisante", sent: true, time: '4:30 PM' },
      ],
    },
    'chat-04': {
      contact: 'Helene Bertram',
      date: 'Thursday, July 5, 2012',
      time: '6:45 PM',
      messages: [
        { text: "Tu veux que je prépare quoi ce soir?", sent: false, time: '6:30 PM' },
        { text: "Je mange au labo", sent: true, time: '6:35 PM' },
        { text: "Sérieux? Encore?", sent: false, time: '6:36 PM' },
        { text: "Oui encore", sent: true, time: '6:40 PM' },
        { text: "Les enfants vont être déçus", sent: false, time: '6:42 PM' },
        { text: "Ils survivront", sent: true, time: '6:45 PM' },
      ],
    },
    'chat-05': {
      contact: 'Helene Bertram',
      date: 'Thursday, July 5, 2012',
      time: '8:20 PM',
      messages: [
        { text: "Je suis allée chez le coiffeur", sent: false, time: '8:10 PM' },
        { text: "Et alors?", sent: true, time: '8:12 PM' },
        { text: "Tu pourrais faire un effort et dire que c'est joli", sent: false, time: '8:15 PM' },
        { text: "J'ai pas que ça à faire", sent: true, time: '8:18 PM' },
        { text: "Tu es vraiment insupportable", sent: false, time: '8:19 PM' },
        { text: "Toi aussi", sent: true, time: '8:20 PM' },
      ],
    },
    'chat-06': {
      contact: 'Helene Bertram',
      date: 'Thursday, July 5, 2012',
      time: '9:05 PM',
      messages: [
        { text: "On doit parler sérieusement", sent: false, time: '9:00 PM' },
        { text: "De quoi encore", sent: true, time: '9:02 PM' },
        { text: "De nous, de notre couple", sent: false, time: '9:03 PM' },
        { text: "J'ai pas le temps pour ça maintenant", sent: true, time: '9:04 PM' },
        { text: "Tu n'as jamais le temps", sent: false, time: '9:05 PM' },
      ],
    },
    'chat-07': {
      contact: 'Helene Bertram',
      date: 'Thursday, July 5, 2012',
      time: '10:30 PM',
      messages: [
        { text: "On doit décider pour la garde des enfants", sent: false, time: '10:15 PM' },
        { text: "Il n'y a rien à décider", sent: true, time: '10:18 PM' },
        { text: "Comment ça?", sent: false, time: '10:19 PM' },
        { text: "C'est moi qui ai la garde. Point final.", sent: true, time: '10:20 PM' },
        { text: "On est encore mariés Harry", sent: false, time: '10:22 PM' },
        { text: "Tu n'es pas une bonne mère Helene", sent: true, time: '10:24 PM' },
        { text: "Comment oses-tu dire ça?!", sent: false, time: '10:25 PM' },
        { text: "Tu sers à rien. Tu passes ton temps chez le coiffeur pendant que je travaille", sent: true, time: '10:26 PM' },
        { text: "C'est faux!", sent: false, time: '10:27 PM' },
        { text: "De toute façon j'ai déjà parlé à mon avocat. C'est moi qui garde les enfants.", sent: true, time: '10:28 PM' },
        { text: "Tu ne peux pas faire ça", sent: false, time: '10:29 PM' },
        { text: "C'est déjà fait. Et je te coupe les vivres aussi. Tu te débrouilles maintenant.", sent: true, time: '10:30 PM' },
        { text: "Harry...", sent: false, time: '10:30 PM' },
      ],
    },
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-8">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="relative w-full max-w-4xl h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* Title Bar */}
          <div className="h-10 bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-between px-4 text-white">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="font-semibold">Recycle Bin</span>
            </div>

            <button
              onClick={onClose}
              className="w-6 h-6 hover:bg-red-600 rounded flex items-center justify-center transition-all"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>

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

            <div className="flex-1 flex items-center bg-white border border-gray-300 rounded px-3 py-1">
              <svg className="w-4 h-4 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="text-sm text-gray-700">{path.join(' > ')}</span>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6 bg-white">
            <div className="grid grid-cols-4 gap-6">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-all group relative"
                >
                  <div
                    onClick={() => {
                      if (item.type === 'folder') {
                        handleFolderClick(item);
                      } else {
                        handleFileClick(item);
                      }
                    }}
                    className="cursor-pointer w-full flex flex-col items-center"
                  >
                    {item.type === 'folder' ? (
                      <>
                        <svg className="w-16 h-16 mb-2" viewBox="0 0 64 64" fill="none">
                          <path
                            d="M8 14h20l4 6h24v32H8V14z"
                            fill="#9CA3AF"
                            stroke="#6B7280"
                            strokeWidth="2"
                          />
                          <path d="M8 20h48v32H8V20z" fill="#6B7280" />
                        </svg>
                        {item.locked && (
                          <div className="absolute top-12 right-12">
                            <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C9.243 2 7 4.243 7 7v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V11a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v2H9V7c0-1.654 1.346-3 3-3z" />
                            </svg>
                          </div>
                        )}
                      </>
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
                          fill="#93C5FD"
                          stroke="#3B82F6"
                          strokeWidth="2"
                        />
                        <path d="M40 8v8h8" fill="#BFDBFE" />
                        <path d="M24 28h16M24 36h16M24 44h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                    <span className="text-sm text-center text-gray-700 group-hover:text-blue-600 break-words line-clamp-2">
                      {item.name}
                    </span>
                  </div>

                  {!currentFolder && (
                    <button
                      onClick={() => handleRestore(item)}
                      className="mt-2 px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-all"
                    >
                      Restore
                    </button>
                  )}
                </div>
              ))}
            </div>

            {currentItems.length === 0 && (
              <div className="text-center text-gray-400 py-16">
                <svg className="w-24 h-24 mx-auto mb-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <p className="text-lg">Recycle Bin is empty</p>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="h-8 bg-gray-100 border-t border-gray-300 flex items-center px-4 text-xs text-gray-600">
            <span>{currentItems.length} items</span>
          </div>
        </div>
      </div>

      {/* Password Prompt */}
      {passwordPrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-[60]">
          <div className="absolute inset-0 bg-black/70" onClick={() => setPasswordPrompt(null)}></div>
          <div className="relative bg-white rounded-lg shadow-2xl p-6 w-96">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C9.243 2 7 4.243 7 7v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V11a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v2H9V7c0-1.654 1.346-3 3-3z" />
              </svg>
              Password Required
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This folder is protected. Enter password to access.
            </p>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full px-4 py-2 border-2 ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                } rounded focus:outline-none focus:border-blue-500`}
                autoFocus
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">Incorrect password</p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-all"
                >
                  Unlock
                </button>
                <button
                  type="button"
                  onClick={() => setPasswordPrompt(null)}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Viewer */}
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
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-8">
          <div className="absolute inset-0 bg-black/90" onClick={() => setViewingReport(null)}></div>
          <div className="relative bg-white rounded-lg shadow-2xl p-8 max-w-4xl max-h-[80vh] overflow-auto">
            <button
              onClick={() => setViewingReport(null)}
              className="absolute top-4 right-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-all"
            >
              Close
            </button>
            <pre className="text-sm font-mono whitespace-pre-wrap">{viewingReport}</pre>
          </div>
        </div>
      )}
    </>
  );
}
