import React from 'react';
import { Play } from 'lucide-react';
import { Reveal } from './ui/Reveal';

export const VideoSection: React.FC = () => {
    return (
        <section className="px-4 py-8">
            <Reveal>
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/10 group cursor-pointer bg-gray-900">
                    {/* Placeholder Background */}
                    <img
                        src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1200"
                        alt="Video Preview"
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center pl-1 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(0,102,255,0.6)]">
                            <Play className="w-8 h-8 fill-current" />
                        </div>
                    </div>
                </div>
            </Reveal>
        </section>
    );
};
