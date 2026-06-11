"use client";

import dynamic from "next/dynamic";

const WeatherWidget = dynamic(() => import("./WeatherWidget"), { ssr: false });
const SpotifyWidget = dynamic(() => import("./SpotifyWidget"), { ssr: false });
const SoundcloudWidget = dynamic(() => import("./SoundcloudWidget"), { ssr: false });

export function DynamicWidget({ widget }: { widget: any }) {
  let configObj = {};
  try {
    if (widget.config) configObj = JSON.parse(widget.config);
  } catch (e) {}

  if (widget.type === "weather") {
    return <WeatherWidget config={configObj} />;
  }
  
  if (widget.type === "spotify") {
    return <SpotifyWidget config={configObj} />;
  }

  if (widget.type === "soundcloud") {
    return <SoundcloudWidget config={configObj} />;
  }

  return null;
}
