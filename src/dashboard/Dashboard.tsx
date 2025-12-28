import React, { useEffect, useState } from 'react';
import { SiteCard } from './components/SiteCard';
import { Download, Search, Sparkles } from 'lucide-react';

interface SiteData {
    url: string;
    totalActiveTime: number;
    visitCount: number;
    lastVisitTime: number;
    title: string;
}

export const Dashboard: React.FC = () => {
    const [sites, setSites] = useState<SiteData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Load data from chrome.storage.local
        chrome.storage.local.get(null, (result) => {
            const loadedSites: SiteData[] = [];
            for (const [url, data] of Object.entries(result)) {
                if (url.startsWith('http')) {
                    // @ts-ignore
                    loadedSites.push({ url, ...data });
                }
            }
            // Sort by last visit time descending
            loadedSites.sort((a, b) => b.lastVisitTime - a.lastVisitTime);
            setSites(loadedSites);
        });
    }, []);

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sites, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "attrack_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const filteredSites = sites.filter(site =>
        site.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black font-sans selection:bg-indigo-500/30">
            {/* Dispersion Background */}
            <div className="dispersion-bg">
                <div className="dispersion-blob bg-indigo-900 top-[-20%] left-[-10%] opacity-40"></div>
                <div className="dispersion-blob bg-purple-900 top-[20%] right-[-10%] animation-delay-4000 opacity-30"></div>
                <div className="dispersion-blob bg-cyan-900 bottom-[-20%] left-[30%] animation-delay-2000 opacity-30"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-10">
                <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-px w-8 bg-indigo-500"></div>
                            <span className="text-xs font-semibold tracking-widest uppercase text-indigo-400">Insights</span>
                        </div>
                        <h1 className="text-5xl font-light text-white tracking-tight">
                            Active Attention<span className="text-white/20">.</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/70 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Filter sessions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
                            />
                        </div>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            <Download size={16} />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                    </div>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSites.map((site) => (
                        <SiteCard key={site.url} {...site} />
                    ))}

                    {filteredSites.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                            <div className="bg-white/5 p-4 rounded-full mb-4">
                                <Sparkles size={24} className="text-white/40" />
                            </div>
                            <span className="text-lg text-white/70 font-medium">No attention data recorded</span>
                            <span className="text-sm text-white/30 mt-1">Visit websites to start tracking your flow</span>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
