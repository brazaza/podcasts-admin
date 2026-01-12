import Link from "next/link";
import { Youtube, Send, Music2 } from "lucide-react";
import { SiVk } from "react-icons/si";

const navLinks = [
  { href: "/podcasts", label: "Podcasts" },
  { href: "/artists", label: "Artists" },
  { href: "/about", label: "About" },
];

const socialLinks = [
  { href: "https://www.youtube.com/@system108", icon: Youtube, label: "YouTube" },
  { href: "https://t.me/system108", icon: Send, label: "Telegram" },
  { href: "https://vk.com/system108", icon: SiVk, label: "VK" },
  { href: "https://www.tiktok.com/@system108", icon: Music2, label: "TikTok" },
];

export function Footer() {
  return (
    <footer className="w-full bg-black border-t border-white/10 pt-16 pb-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <img 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/f54a7117-225b-4b88-b1af-ec55a82fa2c5/logo-symbol-color-white-version-normal-1768004565285.png?width=8000&height=8000&resize=contain" 
                alt="SYSTEM108"
                className="w-12 h-12 object-contain group-hover:rotate-12 transition-transform duration-500"
              />
              <span className="text-2xl font-black tracking-tighter uppercase">
                SYSTEM108
              </span>
            </Link>
            <p className="text-zinc-500 text-sm max-w-[280px] font-medium leading-relaxed">
              Moscow based record label, event agency and community.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Navigation</h4>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-lg font-black uppercase tracking-tight hover:text-zinc-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Socials & Info */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Connect</h4>
            <div className="flex flex-wrap gap-6">
              {socialLinks.map((social) => (
                <a 
                  key={social.label} 
                  href={social.href}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:scale-110"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="pt-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                &copy; {new Date().getFullYear()} SYSTEM108. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
