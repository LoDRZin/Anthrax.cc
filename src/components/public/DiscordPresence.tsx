"use client";

import useSWR from "swr";
import { SiDiscord } from "react-icons/si";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DiscordPresence({ discordId }: { discordId: string }) {
  const { data, error } = useSWR(`https://api.lanyard.rest/v1/users/${discordId}`, fetcher, {
    refreshInterval: 10000,
  });



  if (error || !data || !data.success) {
    return null;
  }

  const lanyard = data.data;
  const isOnline = lanyard.discord_status !== "offline";

  return (
    <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md mb-6 w-full max-w-sm">
      <div className="relative">
        <div className="w-10 h-10 bg-[#5865F2] rounded-full flex items-center justify-center">
          <SiDiscord className="text-white text-xl" />
        </div>
        {/* Status indicator */}
        <div 
          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${
            lanyard.discord_status === "online" ? "bg-green-500" :
            lanyard.discord_status === "idle" ? "bg-yellow-500" :
            lanyard.discord_status === "dnd" ? "bg-red-500" : "bg-gray-500"
          }`}
        />
      </div>
      
      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        <p className="text-sm font-semibold text-white/90">Discord Status</p>
        {isOnline && lanyard.activities && lanyard.activities.length > 0 ? (
          <p className="text-xs text-white/60 truncate">
            {lanyard.activities[0].name === "Custom Status" && lanyard.activities[0].state 
              ? lanyard.activities[0].state 
              : `Jogando ${lanyard.activities[0].name}`}
          </p>
        ) : (
          <p className="text-xs text-white/60">
            {isOnline ? "Online" : "Offline"}
          </p>
        )}
      </div>
    </div>
  );
}
