export default function SoundcloudWidget({ config }: { config: any }) {
  if (!config?.url) return null;

  const encodedUrl = encodeURIComponent(config.url);
  const iframeSrc = `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;

  return (
    <div className="w-full flex justify-center my-2">
      <iframe 
        width="100%" 
        height="166" 
        scrolling="no" 
        frameBorder="no" 
        allow="autoplay" 
        src={iframeSrc}
        className="rounded-xl backdrop-blur-md bg-black/40 border border-white/10"
      />
    </div>
  );
}
