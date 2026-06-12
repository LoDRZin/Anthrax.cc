"use client";

import { useEffect, useState } from "react";

export default function TwitchWidget({ config }: { config: any }) {
  const [hostname, setHostname] = useState("localhost");

  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  if (!config?.username) return null;

  return (
    <div className="w-full my-2 aspect-video rounded-xl overflow-hidden shadow-lg border border-white/10 bg-black/50">
      <iframe
        src={`https://player.twitch.tv/?channel=${config.username}&parent=${hostname}&autoplay=false`}
        frameBorder="0"
        allowFullScreen
        scrolling="no"
        className="w-full h-full"
      />
    </div>
  );
}
