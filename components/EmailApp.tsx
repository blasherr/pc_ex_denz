'use client';

import { useState } from 'react';

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  read: boolean;
  flagged: boolean;
  classification?: 'confidential' | 'normal' | 'urgent';
}

const mockEmails: Email[] = [
  {
    id: '1',
    from: 'HR Department <hr@cerberus-corp.com>',
    subject: 'Rappel : Déclaration des heures - Semaine 3',
    preview: 'Merci de compléter votre feuille de temps avant vendredi 17h00...',
    body: `Chers collaborateurs,

Nous vous rappelons que la déclaration des heures de travail pour la semaine 3 doit être complétée avant vendredi 17h00.

Procédure:
1. Connectez-vous au portail RH
2. Accédez à "Temps de travail"
3. Validez vos heures
4. Cliquez sur "Soumettre"

En cas de questions, contactez le service RH.

Cordialement,
Département des Ressources Humaines
CERBERUS Corporation`,
    date: '2035-01-15 08:47',
    read: false,
    flagged: false,
    classification: 'normal',
  },
  {
    id: '2',
    from: 'IT Department <it@cerberus-corp.com>',
    subject: 'Mise à jour antivirus - Action requise',
    preview: 'Veuillez mettre à jour votre logiciel antivirus avant le 20 janvier...',
    body: `Bonjour,

Une nouvelle version du logiciel antivirus est disponible. Pour des raisons de sécurité, tous les postes de travail doivent être mis à jour avant le 20 janvier 2035.

La mise à jour se fera automatiquement lors du prochain redémarrage de votre ordinateur.

IMPORTANT: Sauvegardez votre travail avant de redémarrer.

Si vous rencontrez des problèmes, contactez le support IT au poste 4455.

Équipe IT
CERBERUS Corporation`,
    date: '2035-01-14 16:22',
    read: true,
    flagged: false,
    classification: 'normal',
  },
  {
    id: '3',
    from: 'Facilities <facilities@cerberus-corp.com>',
    subject: 'Réservation salle de réunion - Modification',
    preview: 'Votre réservation pour la salle B-304 a été modifiée...',
    body: `Bonjour,

Votre réservation pour la salle de réunion B-304 initialement prévue le 18 janvier de 14h00 à 16h00 a été modifiée.

NOUVELLE RÉSERVATION:
- Date: 18 janvier 2035
- Heure: 15h00 - 17h00
- Salle: B-304
- Capacité: 12 personnes
- Équipement: Projecteur, tableau blanc

Cette modification a été effectuée suite à un conflit d'horaire.

Merci de votre compréhension.

Service Facilities`,
    date: '2035-01-13 11:15',
    read: true,
    flagged: false,
    classification: 'normal',
  },
  {
    id: '4',
    from: 'Cafeteria Services <cafeteria@cerberus-corp.com>',
    subject: 'Menu de la semaine - 20-24 janvier',
    preview: 'Découvrez le menu de la cafétéria pour la semaine prochaine...',
    body: `Chers employés,

Voici le menu de la cafétéria pour la semaine du 20 au 24 janvier 2035:

LUNDI: Poulet rôti / Option végétarienne: Lasagnes aux légumes
MARDI: Poisson grillé / Option végétarienne: Curry de pois chiches
MERCREDI: Bœuf bourguignon / Option végétarienne: Quiche lorraine
JEUDI: Pizza maison / Option végétarienne: Salade composée
VENDREDI: Saumon teriyaki / Option végétarienne: Pad thaï légumes

Desserts et boissons disponibles tous les jours.

Bon appétit!
L'équipe de la cafétéria`,
    date: '2035-01-12 09:30',
    read: true,
    flagged: false,
    classification: 'normal',
  },
  {
    id: '5',
    from: 'Admin <admin@cerberus-corp.com>',
    subject: 'Parking - Nouveaux badges d\'accès',
    preview: 'Les nouveaux badges de parking sont disponibles à la réception...',
    body: `Chers collègues,

Les nouveaux badges d'accès au parking souterrain sont maintenant disponibles.

Points de retrait:
- Réception principale (Bâtiment A)
- Heures: 08h00 - 18h00, du lundi au vendredi

Documents requis:
- Carte d'employé CERBERUS
- Justificatif d'immatriculation du véhicule

Les anciens badges seront désactivés le 31 janvier 2035. Merci de procéder au remplacement avant cette date.

Administration
CERBERUS Corporation`,
    date: '2035-01-11 14:55',
    read: false,
    flagged: false,
    classification: 'normal',
  },
];

export default function EmailApp() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [searchQuery, setSearchQuery] = useState('');

  const markAsRead = (id: string) => {
    setEmails(emails.map(e => e.id === id ? { ...e, read: true } : e));
  };

  const toggleFlag = (id: string) => {
    setEmails(emails.map(e => e.id === id ? { ...e, flagged: !e.flagged } : e));
  };

  const handleSelectEmail = (email: Email) => {
    setSelectedEmail(email);
    markAsRead(email.id);
  };

  const filteredEmails = emails.filter(e =>
    e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getClassificationColor = (classification?: string) => {
    switch (classification) {
      case 'urgent': return 'text-red-400 border-red-500/40';
      case 'confidential': return 'text-amber-400 border-amber-500/40';
      default: return 'text-gray-400 border-gray-500/40';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0e1a]">
      {/* Toolbar */}
      <div className="h-14 bg-[#0f1420] border-b border-white/5 flex items-center px-4 gap-2">
        <button className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau
        </button>

        <div className="h-6 w-px bg-white/10 mx-2" />

        <button className="p-2 hover:bg-white/5 rounded transition-colors" title="Actualiser">
          <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <button className="p-2 hover:bg-white/5 rounded transition-colors" title="Supprimer">
          <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md ml-auto">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher des emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 bg-white/5 border border-white/10 rounded text-white text-sm placeholder-white/30 focus:outline-none focus:border-red-500/40"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Email List */}
        <div className="w-96 border-r border-white/5 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-white/40 px-3 py-2 font-medium uppercase tracking-wider">
              Boîte de réception ({filteredEmails.filter(e => !e.read).length})
            </div>

            {filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleSelectEmail(email)}
                className={`
                  p-3 rounded-lg cursor-pointer transition-all mb-1 group relative
                  ${selectedEmail?.id === email.id ? 'bg-red-500/20 border border-red-500/40' : 'hover:bg-white/5 border border-transparent'}
                  ${!email.read ? 'bg-white/5' : ''}
                `}
              >
                {/* Unread indicator */}
                {!email.read && (
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" />
                )}

                {/* Classification badge */}
                {email.classification && email.classification !== 'normal' && (
                  <div className={`text-[9px] px-1.5 py-0.5 rounded border mb-1 inline-block ${getClassificationColor(email.classification)}`}>
                    {email.classification.toUpperCase()}
                  </div>
                )}

                <div className="flex items-start justify-between mb-1">
                  <span className={`text-sm ${!email.read ? 'font-semibold text-white' : 'text-white/80'} truncate flex-1`}>
                    {email.from.split('<')[0].trim()}
                  </span>
                  <span className="text-xs text-white/40 ml-2 flex-shrink-0">{email.date.split(' ')[0]}</span>
                </div>

                <div className={`text-sm mb-1 truncate ${!email.read ? 'font-medium text-white' : 'text-white/70'}`}>
                  {email.subject}
                </div>

                <div className="text-xs text-white/50 truncate">{email.preview}</div>

                {/* Flag button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFlag(email.id);
                  }}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    className={`w-4 h-4 ${email.flagged ? 'text-amber-400 fill-amber-400' : 'text-white/40'}`}
                    fill={email.flagged ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedEmail ? (
            <div className="p-6">
              {/* Email header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">{selectedEmail.subject}</h2>

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
                    {selectedEmail.from.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{selectedEmail.from}</div>
                    <div className="text-white/50 text-sm">{selectedEmail.date}</div>
                  </div>
                </div>

                {selectedEmail.classification && selectedEmail.classification !== 'normal' && (
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border ${getClassificationColor(selectedEmail.classification)} bg-white/5 text-xs`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {selectedEmail.classification.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Email body */}
              <div className="text-white/80 leading-relaxed whitespace-pre-wrap font-mono text-sm bg-[#0f1420]/50 p-4 rounded-lg border border-white/10">
                {selectedEmail.body}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-white/30">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-lg">Sélectionnez un email pour le lire</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
