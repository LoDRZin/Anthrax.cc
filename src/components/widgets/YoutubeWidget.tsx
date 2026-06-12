export default function YoutubeWidget({ config }: { config: any }) {
  if (!config?.url) return null;

  let embedUrl = config.url;
  // Convert youtu.be/xyz or youtube.com/watch?v=xyz to youtube.com/embed/xyz
  try {
    const urlObj = new URL(config.url);
    if (urlObj.hostname.includes("youtu.be")) {
      embedUrl = `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
    } else if (urlObj.hostname.includes("youtube.com")) {
      const videoId = urlObj.searchParams.get("v");
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (e) {}

  return (
    <div className="w-full my-2 aspect-video rounded-xl overflow-hidden shadow-lg border border-white/10">
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
