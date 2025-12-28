import React from 'react';
import { ProgressRing } from './components/ProgressRing';
import { useActiveTab } from './hooks/useActiveTab';
import { ExternalLink, ArrowRight } from 'lucide-react';

const NOTIFICATION_THRESHOLD = 30 * 60; // 30 minutes in seconds

export const Popup: React.FC = () => {
    const { activeUrl, data } = useActiveTab();

    const time = data?.totalActiveTime || 0;
    const progress = Math.min(100, Math.round((time / NOTIFICATION_THRESHOLD) * 100));

    // Format time (MM:SS)
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const host = activeUrl ? new URL(activeUrl).hostname : 'Waiting...';

    return (
        <div className="w-[320px] h-[480px] bg-black text-white font-sans overflow-hidden relative selection:bg-indigo-500/30">
            {/* Dispersion Background */}
            <div className="dispersion-bg">
                <div className="dispersion-blob bg-indigo-600 top-[-10%] left-[-20%]"></div>
                <div className="dispersion-blob bg-purple-600 top-[40%] right-[-20%] animation-delay-2000"></div>
                <div className="dispersion-blob bg-cyan-600 bottom-[-20%] left-[20%] animation-delay-4000"></div>
            </div>

            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                {/* Header */}
                <header className="flex flex-col items-center gap-1 mb-4">
                    <h1 className="text-sm font-medium tracking-[0.2em] text-white/60 uppercase">
                        Attrack
                    </h1>
                </header>

                {/* Main Ring */}
                <main className="flex flex-col items-center justify-center flex-1">
                    <div className="relative group">
                        {/* Glow effect behind ring */}
                        <div className="absolute inset-0 bg-indigo-500/20 blur-[40px] rounded-full"></div>

                        <ProgressRing
                            radius={90}
                            stroke={4}
                            progress={progress}
                            color="#818cf8" // Indigo-400
                            className="relative z-10"
                        />

                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-light tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                {formattedTime}
                            </span>
                            <div className="flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
                                <ExternalLink size={10} className="text-white/40" />
                                <span className="text-[10px] text-white/60 max-w-[100px] truncate">{host}</span>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="mt-6">
                    <button
                        onClick={() => chrome.runtime.openOptionsPage()}
                        className="group w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 backdrop-blur-xl flex items-center justify-between px-6"
                    >
                        <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                            View Insights
                        </span>
                        <ArrowRight size={14} className="text-white/40 group-hover:translate-x-1 group-hover:text-white transition-all duration-300" />
                    </button>
                </footer>
            </div>
        </div>
    );
};
