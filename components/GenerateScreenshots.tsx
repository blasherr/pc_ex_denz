'use client';

import IOSScreenshot from './IOSScreenshot';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

export default function GenerateScreenshots() {
  const screenshotsRef = useRef<HTMLDivElement>(null);

  const conversations = [
    {
      id: 1,
      contact: '█████████ ███████',
      date: 'Thursday, July 5, 2012',
      time: '9:41 AM',
      messages: [
        { text: "Tu as acheté le lait?", sent: false, time: '9:30 AM' },
        { text: "Non j'ai oublié", sent: true, time: '9:32 AM' },
        { text: "Sérieusement? C'était la seule chose!", sent: false, time: '9:33 AM' },
        { text: "Je suis occupé █████████", sent: true, time: '9:35 AM' },
        { text: "Occupé à quoi exactement?", sent: false, time: '9:36 AM' },
        { text: "Mes recherches sont plus importantes que ton lait", sent: true, time: '9:38 AM' },
        { text: "Incroyable...", sent: false, time: '9:40 AM' },
      ],
    },
    {
      id: 2,
      contact: '█████████ ███████',
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
    {
      id: 3,
      contact: '█████████ ███████',
      date: 'Thursday, July 5, 2012',
      time: '4:30 PM',
      messages: [
        { text: "Pourquoi tu réponds pas au téléphone?", sent: false, time: '4:20 PM' },
        { text: "J'étais en réunion", sent: true, time: '4:25 PM' },
        { text: "Pendant 3 heures?", sent: false, time: '4:26 PM' },
        { text: "Oui █████████, c'est ce qu'on appelle le travail", sent: true, time: '4:28 PM' },
        { text: "Ton ton est vraiment désagréable", sent: false, time: '4:29 PM' },
        { text: "Et toi tu es épuisante", sent: true, time: '4:30 PM' },
      ],
    },
    {
      id: 4,
      contact: '█████████ ███████',
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
    {
      id: 5,
      contact: '█████████ ███████',
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
    {
      id: 6,
      contact: '█████████ ███████',
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
    {
      id: 7,
      contact: '█████████ ███████',
      date: 'Thursday, July 5, 2012',
      time: '10:30 PM',
      messages: [
        { text: "On doit décider pour la garde des enfants", sent: false, time: '10:15 PM' },
        { text: "Il n'y a rien à décider", sent: true, time: '10:18 PM' },
        { text: "Comment ça?", sent: false, time: '10:19 PM' },
        { text: "C'est moi qui ai la garde. Point final.", sent: true, time: '10:20 PM' },
        { text: "On est encore mariés Harry", sent: false, time: '10:22 PM' },
        { text: "Tu n'es pas une bonne mère █████████", sent: true, time: '10:24 PM' },
        { text: "Comment oses-tu dire ça?!", sent: false, time: '10:25 PM' },
        { text: "Tu sers à rien. Tu passes ton temps chez le coiffeur pendant que je travaille", sent: true, time: '10:26 PM' },
        { text: "C'est faux!", sent: false, time: '10:27 PM' },
        { text: "De toute façon j'ai déjà parlé à mon avocat. C'est moi qui garde les enfants.", sent: true, time: '10:28 PM' },
        { text: "Tu ne peux pas faire ça", sent: false, time: '10:29 PM' },
        { text: "C'est déjà fait. Et je te coupe les vivres aussi. Tu te débrouilles maintenant.", sent: true, time: '10:30 PM' },
        { text: "Harry...", sent: false, time: '10:30 PM' },
      ],
    },
  ];

  const generateImages = async () => {
    if (!screenshotsRef.current) return;

    const screenshots = screenshotsRef.current.querySelectorAll('.screenshot-item');

    for (let i = 0; i < screenshots.length; i++) {
      const element = screenshots[i] as HTMLElement;
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.download = `chat-0${i + 1}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="p-8">
      <button
        onClick={generateImages}
        className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Générer les captures d'écran
      </button>

      <div ref={screenshotsRef} className="flex flex-wrap gap-8">
        {conversations.map((conv) => (
          <div key={conv.id} className="screenshot-item">
            <IOSScreenshot
              contact={conv.contact}
              date={conv.date}
              time={conv.time}
              messages={conv.messages}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
