"use client";

import dynamic from "next/dynamic";

const WeatherWidget = dynamic(() => import("./WeatherWidget"), { ssr: false });
const SpotifyWidget = dynamic(() => import("./SpotifyWidget"), { ssr: false });
const SoundcloudWidget = dynamic(() => import("./SoundcloudWidget"), { ssr: false });
const GithubWidget = dynamic(() => import("./GithubWidget"), { ssr: false });
const YoutubeWidget = dynamic(() => import("./YoutubeWidget"), { ssr: false });
const TwitchWidget = dynamic(() => import("./TwitchWidget"), { ssr: false });
const CryptoTickerWidget = dynamic(() => import("./CryptoTickerWidget"), { ssr: false });
const CountdownWidget = dynamic(() => import("./CountdownWidget"), { ssr: false });
const HtmlWidget = dynamic(() => import("./HtmlWidget"), { ssr: false });

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
  if (widget.type === "github") {
    return <GithubWidget config={configObj} />;
  }
  if (widget.type === "youtube") {
    return <YoutubeWidget config={configObj} />;
  }
  if (widget.type === "twitch") {
    return <TwitchWidget config={configObj} />;
  }
  if (widget.type === "crypto") {
    return <CryptoTickerWidget config={configObj} />;
  }
  if (widget.type === "countdown") {
    return <CountdownWidget config={configObj} />;
  }
  if (widget.type === "html") {
    return <HtmlWidget config={configObj} />;
  }

  return null;
}
