import React from 'react';
import { ExternalLink, Clock, BarChart } from 'lucide-react';

interface SiteCardProps {
    url: string;
    title: string;
    totalActiveTime: number;
    visitCount: number;
    lastVisitTime: number;
}

export const SiteCard: React.FC<SiteCardProps> = ({
    url,
    title,
    totalActiveTime,
    visitCount,
    lastVisitTime
}) => {
    const hostname = new URL(url).hostname;
    const averageTime = visitCount > 0 ? totalActiveTime / visitCount : 0;

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}h ${m}m`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    };

    return (
        <div className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.1] rounded-2xl p-6 transition-all duration-500 ease-out backdrop-blur-xl hover:shadow-[0_0_40px_-10px_rgba(129,140,248,0.1)]">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-base font-medium text-white/90 truncate group-hover:text-white transition-colors">
                        {title}
                    </h3>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 mt-1 text-xs text-white/40 hover:text-indigo-400 transition-colors w-fit">
                        <span className="truncate">{hostname}</span>
                        <ExternalLink size={10} />
                    </a>
                </div>
                <div className="bg-white/5 rounded-full px-2 py-1 text-[10px] text-white/30 font-mono">
                    {new Date(lastVisitTime).toLocaleDateString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/40 mb-1">
                        <Clock size={10} />
                        <span>Total</span>
                    </div>
                    <div className="text-lg font-light text-white font-mono tracking-tight">
                        {formatTime(totalActiveTime)}
                    </div>
                </div>

                <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/40 mb-1">
                        <BarChart size={10} />
                        <span>Avg</span>
                    </div>
                    <div className="text-lg font-light text-white font-mono tracking-tight">
                        {formatTime(averageTime)}
                    </div>
                </div>
            </div>
        </div>
    );
};
