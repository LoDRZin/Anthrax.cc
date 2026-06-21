"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { FaSpotify } from "react-icons/fa";
import { getSpotifyData } from "@/server/actions/spotify";

export default function SpotifyWidget({ config }: { config: any }) {
  const [data, setData] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (config?.url) {
      getSpotifyData(config.url).then((res) => {
        if (res && res.image) {
          setData(res);
        } else {
          setError(true);
        }
      }).catch(() => setError(true));
    }
  }, [config?.url]);

  useEffect(() => {
    if (data?.audio) {
      audioRef.current = new Audio(data.audio);
      audioRef.current.volume = 0.5;

      const updateProgress = () => {
        if (audioRef.current) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('timeupdate', updateProgress);
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [data?.audio]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!config?.url) return null;

  if (error) {
    // Fallback to iframe if server action failed to fetch
    let embedUrl = config.url;
    if (embedUrl.includes("open.spotify.com") && !embedUrl.includes("/embed/")) {
      embedUrl = embedUrl.replace("open.spotify.com/", "open.spotify.com/embed/");
    }

    return (
      <div className="w-full flex justify-center my-2">
        <iframe 
          style={{ borderRadius: '12px' }} 
          src={`${embedUrl}?theme=0`} 
          width="100%" 
          height="152" 
          frameBorder="0" 
          allowFullScreen 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
          className="backdrop-blur-md bg-black/40 border border-white/10"
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full flex justify-center my-2">
        <div className="w-full max-w-sm h-[88px] rounded-xl backdrop-blur-md bg-black/20 border border-white/10 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center my-2">
      <div className="w-full max-w-sm rounded-xl overflow-hidden backdrop-blur-md bg-black/40 border border-white/10 p-3 flex items-center gap-3 relative transition-all duration-300 hover:bg-black/50">
        
        {/* Album Art */}
        <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
          
          {data.audio && (
            <button 
              onClick={togglePlay}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white fill-white" />
              ) : (
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              )}
            </button>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-white font-semibold text-sm truncate">{data.title}</h3>
          <p className="text-white/60 text-xs truncate">{data.artist}</p>
        </div>

        {/* Spotify Icon linking to actual song */}
        <a 
          href={data.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors shrink-0"
        >
          <FaSpotify className="w-6 h-6 text-[#1DB954]" />
        </a>

        {/* Progress bar */}
        {data.audio && (
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10">
            <div 
              className="h-full bg-[#1DB954] transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
