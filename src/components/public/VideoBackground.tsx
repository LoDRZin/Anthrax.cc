"use client";

export default function VideoBackground({ videoUrl }: { videoUrl: string }) {
  if (!videoUrl) return null;

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none opacity-40"
    >
      <source src={videoUrl} type="video/mp4" />
      {/* Adicionar fallback caso o vídeo não carregue ou não seja mp4 suportado nativamente */}
    </video>
  );
}
