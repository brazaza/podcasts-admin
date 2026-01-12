"use client";

import React from "react";
import { Share2, Copy, Twitter, Facebook } from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const VKIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.162 18.994c-6.098 0-9.57-4.172-9.714-11.108h3.047c.105 5.092 2.348 7.247 4.127 7.691V7.886h2.868v4.39c1.755-.188 3.606-2.18 4.228-4.39h2.868c-.464 2.686-2.433 4.678-3.84 5.32 1.407.656 3.658 2.406 4.453 5.788h-3.141c-.622-1.94-2.168-3.435-4.568-3.673v3.673h-2.868z" />
  </svg>
);

interface ShareDropdownProps {
  url?: string;
  path?: string;
  title: string;
  triggerClassName?: string;
  iconClassName?: string;
  onOpenChange?: (open: boolean) => void;
  invertOnOpen?: boolean;
}

export function ShareDropdown({ 
  url: providedUrl, 
  path, 
  title, 
  triggerClassName, 
  iconClassName,
  onOpenChange,
  invertOnOpen = false
}: ShareDropdownProps) {
  const getFullUrl = () => {
    if (providedUrl) return providedUrl;
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      return path ? `${origin}${path}` : window.location.href;
    }
    return "";
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getFullUrl();
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const shareToSocial = (platform: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getFullUrl();
    let shareUrl = "";

      switch (platform) {
        case "vk":
          shareUrl = `https://vk.com/share.php?url=${encodeURIComponent(url)}`;
          break;
        case "tg":
          shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
          break;
        case "x":
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
          break;
        case "fb":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
          break;
      }

    window.open(shareUrl, "_blank");
  };

  return (
<DropdownMenu onOpenChange={onOpenChange} modal={false}>
<DropdownMenuTrigger asChild>
<button 
    className={cn(
      "rounded-none outline-none ring-0 focus:ring-0",
      invertOnOpen && "data-[state=open]:bg-white data-[state=open]:text-black",
      triggerClassName
    )}
>
<Share2 className={cn("w-4 h-4", iconClassName)} />
</button>
</DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        side="top" 
        className="bg-zinc-900 border-white/10 text-white rounded-none min-w-[150px] z-[60]"
      >
        <DropdownMenuItem 
          onClick={handleCopyLink} 
          className="hover:bg-white/10 cursor-pointer flex items-center gap-2 uppercase font-black text-[10px] tracking-widest p-3"
        >
          <Copy className="w-3 h-3" /> Copy Link
        </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={(e) => shareToSocial('vk', e)} 
            className="hover:bg-white/10 cursor-pointer flex items-center gap-2 uppercase font-black text-[10px] tracking-widest p-3 border-t border-white/5"
          >
            <VKIcon className="w-3 h-3" /> VK
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={(e) => shareToSocial('tg', e)} 
            className="hover:bg-white/10 cursor-pointer flex items-center gap-2 uppercase font-black text-[10px] tracking-widest p-3 border-t border-white/5"
          >
            <FaTelegramPlane className="w-3 h-3" /> Telegram
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={(e) => shareToSocial('x', e)} 
            className="hover:bg-white/10 cursor-pointer flex items-center gap-2 uppercase font-black text-[10px] tracking-widest p-3 border-t border-white/5"
          >
            <Twitter className="w-3 h-3" /> Twitter (X)
          </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={(e) => shareToSocial('fb', e)} 
          className="hover:bg-white/10 cursor-pointer flex items-center gap-2 uppercase font-black text-[10px] tracking-widest p-3 border-t border-white/5"
        >
          <Facebook className="w-3 h-3" /> Facebook
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
