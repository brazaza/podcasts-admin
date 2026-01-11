export interface Artist {
  name: string;
  slug: string;
  bannerImage: string;
  bio?: string;
  socials?: {
    telegram?: string;
    soundcloud?: string;
    spotify?: string;
    vk?: string;
    bandlink?: string;
    bandcamp?: string;
    yandexMusic?: string;
    instagram?: string;
  };
}

export interface Podcast {
  number: string;
  title: string;
  artists: Artist[];
  coverImage: string;
  audioFile: string;
  description: string;
  releaseDate: string;
  vkUrl?: string;
  soundcloudUrl?: string;
}

export const artists: Artist[] = [
  {
    name: "System 108",
    slug: "system-108",
    bannerImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&h=400&fit=crop",
    bio: "The legendary Moscow-based collective and label, pushing the boundaries of house and techno since 2015.",
  },
  {
    name: "Kovyazin D",
    slug: "kovyazin-d",
    bannerImage: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1600&h=400&fit=crop",
    bio: "Kovyazin D is known for his unique blend of acid, techno and electro, bringing raw energy to the dancefloor.",
    socials: {
      telegram: "#",
      soundcloud: "#",
      spotify: "#",
      vk: "#",
      bandcamp: "#",
      instagram: "#"
    }
  },
  {
    name: "Lipelis",
    slug: "lipelis",
    bannerImage: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=1600&h=400&fit=crop",
    bio: "One of the most versatile producers in the Moscow scene, from house to disco and everything in between.",
  },
  {
    name: "Mashkov",
    slug: "mashkov",
    bannerImage: "https://images.unsplash.com/photo-1571266028243-e4bb35f0a8b3?w=1600&h=400&fit=crop",
  },
  {
    name: "Egor Holkin",
    slug: "egor-holkin",
    bannerImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600&h=400&fit=crop",
  },
  {
    name: "Philipp Gorbachev",
    slug: "philipp-gorbachev",
    bannerImage: "https://images.unsplash.com/photo-1520120355714-0c39393c0423?w=1600&h=400&fit=crop",
  },
  {
    name: "Boym",
    slug: "boym",
    bannerImage: "https://images.unsplash.com/photo-1514525253361-bee8718a74a2?w=1600&h=400&fit=crop",
  }
];

const generatePodcasts = (count: number): Podcast[] => {
  const pods: Podcast[] = [];
  const validImages = [
    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=800&fit=crop"
  ];

  for (let i = 126; i >= 126 - count; i--) {
    const num = i.toString().padStart(3, '0');
    const artistPool = artists.slice(1);
    
    // Create some variety in artists
    let selectedArtists: Artist[];
    if (i === 126) {
      selectedArtists = [artistPool[0]]; // Kovyazin D for the featured one
    } else if (i % 5 === 0) {
      selectedArtists = [artistPool[0], artistPool[1]]; // b2b
    } else if (i % 7 === 0) {
      selectedArtists = [artistPool[2], artistPool[3], artistPool[4]]; // three artists
    } else {
      selectedArtists = [artistPool[i % artistPool.length]];
    }
    
    pods.push({
      number: num,
      title: i === 126 ? "Podcast #126" : `SYSTEM PODCAST ${num}`,
      artists: selectedArtists,
      coverImage: validImages[i % validImages.length],
      audioFile: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 10) + 1}.mp3`,
      description: `This is the description for System Podcast ${num}. A deep dive into the electronic underground of Moscow. Exploring the boundaries of sound and space.`,
      releaseDate: "03/01/2025",
      vkUrl: "https://vk.com",
      soundcloudUrl: "https://soundcloud.com"
    });
  }
  return pods;
};

export const podcasts: Podcast[] = generatePodcasts(60);
