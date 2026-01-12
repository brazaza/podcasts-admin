"use client";

import Link from "next/link";
import { Drawer } from "vaul";
import { Menu, X, Youtube, Send, Music2 } from "lucide-react";
import { SiVk } from "react-icons/si";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-transparent bg-background",
        isScrolled && "backdrop-blur-lg bg-background/80 border-white/5"
      )}
    >
      <nav className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img 
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/f54a7117-225b-4b88-b1af-ec55a82fa2c5/logo-symbol-color-white-version-normal-1768004565285.png?width=8000&height=8000&resize=contain" 
            alt="SYSTEM108"
            className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform duration-500"
          />
          <span className="text-xl font-black tracking-tighter hover:opacity-80 transition-opacity hidden sm:block uppercase">
            SYSTEM108
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-base font-black uppercase tracking-tight">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="hover:text-zinc-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Drawer.Root direction="right">
            <Drawer.Trigger asChild>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
              <Drawer.Content className="bg-zinc-950 flex flex-col rounded-l-[32px] h-full w-[300px] mt-24 fixed bottom-0 right-0 z-50 border-l border-white/10 outline-none">
                <div className="p-8 flex flex-col h-full">
                  <div className="flex justify-end mb-12">
                    <Drawer.Close asChild>
                      <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                      </button>
                    </Drawer.Close>
                  </div>

                  <nav className="flex flex-col gap-8">
                    {navLinks.map((link) => (
                      <Drawer.Close key={link.href} asChild>
                        <Link 
                          href={link.href} 
                          className="text-4xl font-black uppercase tracking-tighter hover:text-zinc-400 transition-colors"
                        >
                          {link.label}
                        </Link>
                      </Drawer.Close>
                    ))}
                  </nav>

                  <div className="mt-auto pt-12 border-t border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-zinc-500">Follow Us</p>
                    <div className="flex gap-6">
                      {socialLinks.map((social) => (
                        <a 
                          key={social.label} 
                          href={social.href}
                          className="hover:text-zinc-400 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <social.icon className="w-6 h-6" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
      </nav>
    </header>
  );
}
