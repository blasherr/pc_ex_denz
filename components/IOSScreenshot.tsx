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
    <div className="w-[340px] bg-black rounded-[45px] p-3 shadow-2xl">
      {/* iPhone 4/4S frame - iOS 6 style */}
      <div className="w-full h-[580px] bg-[#e8e8e8] rounded-[38px] overflow-hidden relative flex flex-col">
        {/* Status bar - iOS 6 */}
        <div className="h-5 bg-gradient-to-b from-[#c5c5c5] to-[#a8a8a8] flex items-center justify-between px-2 text-[10px] font-semibold text-black">
          <div className="flex items-center gap-0.5">
            <span>AT&T</span>
            <div className="flex gap-px ml-1">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className={`w-[3px] rounded-sm bg-black/80`} style={{ height: `${4 + i}px` }} />
              ))}
            </div>
          </div>
          <span>{time}</span>
          <div className="flex items-center gap-1">
            <span className="text-[9px]">100%</span>
            <div className="w-6 h-3 border border-black/80 rounded-sm relative">
              <div className="absolute inset-0.5 bg-green-500 rounded-[1px]" />
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-2 bg-black/80 rounded-r-sm" />
            </div>
          </div>
        </div>

        {/* Navigation bar - iOS 6 style */}
        <div className="h-11 bg-gradient-to-b from-[#5b8ecf] to-[#3a6db0] flex items-center justify-between px-2 border-b border-[#2a5a98] shadow-inner">
          <button className="px-2 py-1 text-white text-[13px] font-medium">
            &lt; Messages
          </button>
          <span className="text-white text-[15px] font-bold drop-shadow-sm">{contact}</span>
          <button className="px-2 py-1 text-white text-[13px] font-medium">
            Contact
          </button>
        </div>

        {/* Date header */}
        <div className="py-2 bg-[#e5e5e5] text-center">
          <span className="text-[11px] text-[#8e8e93] bg-[#d1d1d6] px-3 py-1 rounded-full">
            {date}
          </span>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2 bg-[#e5e5e5]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
              <div className="flex flex-col">
                <div
                  className={`relative max-w-[220px] px-3 py-2 text-[15px] leading-tight ${
                    msg.sent
                      ? 'bg-gradient-to-b from-[#44c148] to-[#34ac3a] text-white rounded-2xl rounded-br-md'
                      : 'bg-gradient-to-b from-[#e9e9eb] to-[#dcdcde] text-black rounded-2xl rounded-bl-md border border-[#c8c8cc]'
                  }`}
                >
                  {/* Bubble tail */}
                  <div className={`absolute bottom-1 ${msg.sent ? '-right-1.5' : '-left-1.5'} w-3 h-3 overflow-hidden`}>
                    <div className={`w-4 h-4 rotate-45 ${
                      msg.sent ? 'bg-[#34ac3a]' : 'bg-[#dcdcde] border-r border-b border-[#c8c8cc]'
                    }`} />
                  </div>
                  <p className="relative z-10">{msg.text}</p>
                </div>
                {msg.time && (
                  <span className={`text-[9px] text-[#8e8e93] mt-0.5 ${msg.sent ? 'text-right mr-1' : 'ml-1'}`}>
                    {msg.time}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input bar - iOS 6 style */}
        <div className="h-12 bg-gradient-to-b from-[#dcdcde] to-[#c9c9cc] border-t border-[#b2b2b5] flex items-center px-2 gap-2">
          <button className="w-7 h-7 rounded-full bg-gradient-to-b from-[#7e7e86] to-[#636369] flex items-center justify-center">
            <span className="text-white text-lg leading-none">+</span>
          </button>
          <div className="flex-1 h-8 bg-white rounded-full border border-[#b2b2b5] shadow-inner px-3 flex items-center">
            <span className="text-[14px] text-[#8e8e93]">iMessage</span>
          </div>
          <button className="px-3 py-1 bg-gradient-to-b from-[#5b8ecf] to-[#3a6db0] rounded-md text-white text-[14px] font-semibold shadow-sm">
            Envoyer
          </button>
        </div>

        {/* Home button indicator */}
        <div className="h-1 bg-black/10 flex items-center justify-center">
          <div className="w-32 h-1 bg-black/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
