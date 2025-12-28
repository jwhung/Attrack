import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, X } from 'lucide-react';

export const Toast: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Slight delay for animation entry
        setTimeout(() => setVisible(true), 100);

        const count = 200;
        const defaults = {
            origin: { y: 0.9, x: 0.9 },
            zIndex: 100000
        };

        function fire(particleRatio: number, opts: any) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, { spread: 26, startVelocity: 55, colors: ['#818cf8', '#c084fc'] });
        fire(0.2, { spread: 60, colors: ['#22d3ee', '#818cf8'] });

        const timer = setTimeout(onClose, 6000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed bottom-8 right-8 z-[99999] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative group overflow-hidden">
                {/* Glass Container */}
                <div className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-0.5 shadow-2xl shadow-indigo-500/10">
                    <div className="bg-gradient-to-br from-white/5 to-transparent rounded-[14px] p-5 pr-10 min-w-[300px] flex items-start gap-4">
                        <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h4 className="text-white font-medium text-sm mb-1">Focus Flow Achieved</h4>
                            <p className="text-white/60 text-xs leading-relaxed">
                                You've maintained deep focus for 30 minutes.<br />
                                Keep the momentum going.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
                >
                    <X size={14} />
                </button>

                {/* Subtle Gradient Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
            </div>
        </div>
    );
};
