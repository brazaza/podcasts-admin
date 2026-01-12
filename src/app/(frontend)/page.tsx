import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-2xl space-y-8 md:space-y-12">
        <div className="space-y-4 md:space-y-6">
          <img 
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/f54a7117-225b-4b88-b1af-ec55a82fa2c5/logo-symbol-color-white-version-normal-1768004565285.png?width=8000&height=8000&resize=contain" 
            alt="SYSTEM108"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 object-contain mx-auto animate-pulse"
          />
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase font-display italic leading-none">
            SYSTEM108
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.15em] sm:tracking-[0.3em] text-xs sm:text-sm md:text-base max-w-[280px] sm:max-w-none mx-auto">
            Moscow based record label & event agency
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-xs sm:max-w-none mx-auto">
          <Link 
            href="/podcasts"
            className="group relative px-8 sm:px-12 py-4 bg-white text-black font-black uppercase tracking-tighter text-lg sm:text-xl overflow-hidden transition-transform active:scale-95 w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Enter Podcasts <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-yellow-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
          <Link 
            href="/artists"
            className="px-8 sm:px-12 py-4 border border-white/20 hover:border-white hover:bg-white/5 font-black uppercase tracking-tighter text-lg sm:text-xl transition-all active:scale-95 w-full sm:w-auto"
          >
            Artists
          </Link>
        </div>
      </div>
    </div>
  );
}
