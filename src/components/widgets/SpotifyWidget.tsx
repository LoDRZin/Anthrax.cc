export default function SpotifyWidget({ config }: { config: any }) {
  if (!config?.url) return null;

  // Converter URL padrão do spotify para embed
  // De: https://open.spotify.com/track/xyz
  // Para: https://open.spotify.com/embed/track/xyz
  
  let embedUrl = config.url;
  if (embedUrl.includes("open.spotify.com") && !embedUrl.includes("/embed/")) {
    embedUrl = embedUrl.replace("open.spotify.com/", "open.spotify.com/embed/");
  }

  return (
    <div className="w-full flex justify-center my-2">
      <iframe 
        style={{ borderRadius: '12px' }} 
        src={`${embedUrl}?theme=0`} // theme=0 forces dark mode
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
