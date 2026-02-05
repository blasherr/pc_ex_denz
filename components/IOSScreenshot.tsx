'use client';

interface Message {
  text: string;
  sent: boolean;
  time?: string;
}

interface IOSScreenshotProps {
  contact: string;
  date: string;
  time: string;
  messages: Message[];
}

export default function IOSScreenshot({ contact, date, time, messages }: IOSScreenshotProps) {
  return (
    <div className="w-[320px] h-[480px] bg-black rounded-[40px] p-2 shadow-2xl">
      {/* iPhone frame */}
      <div className="w-full h-full bg-white rounded-[36px] overflow-hidden relative">
        {/* Status bar iOS 6 */}
        <div className="h-5 bg-gradient-to-b from-gray-800 to-gray-700 flex items-center justify-between px-2 text-white text-[10px] font-semibold">
          <span>AT&T</span>
          <span>{time}</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-2 border border-white rounded-sm relative">
              <div className="absolute right-0 top-0 w-2 h-full bg-white"></div>
            </div>
          </div>
        </div>

        {/* Header bar */}
        <div className="h-11 bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-between px-2 border-b border-blue-700">
          <button className="text-white text-sm font-medium">Messages</button>
          <span className="text-white text-sm font-bold">{contact}</span>
          <button className="text-white text-sm font-medium">Contact</button>
        </div>

        {/* Date header */}
        <div className="py-2 text-center">
          <span className="text-[11px] text-gray-600 bg-gray-200 px-3 py-1 rounded-full font-medium">
            {date}
          </span>
        </div>

        {/* Messages */}
        <div className="px-2 pb-12 space-y-2 overflow-y-auto" style={{ height: 'calc(100% - 130px)' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] px-3 py-2 rounded-2xl ${
                  msg.sent
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-gray-200 text-black rounded-bl-sm'
                }`}
              >
                <p className="text-sm leading-tight">{msg.text}</p>
                {msg.time && (
                  <span className={`text-[10px] ${msg.sent ? 'text-blue-100' : 'text-gray-500'}`}>
                    {msg.time}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="absolute bottom-0 left-0 right-0 h-11 bg-gradient-to-b from-gray-100 to-gray-200 border-t border-gray-300 flex items-center px-2 gap-2">
          <div className="flex-1 bg-white border border-gray-300 rounded-full h-7 px-3 flex items-center">
            <span className="text-xs text-gray-400">iMessage</span>
          </div>
          <button className="text-blue-500 text-sm font-semibold">Send</button>
        </div>
      </div>
    </div>
  );
}
