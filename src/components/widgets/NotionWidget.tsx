export default function NotionWidget({ config }: { config: any }) {
  const url = config?.url || "";
  // Notion URLs need to be embedded or just linked. 
  // Wait, Notion doesn't allow iframe embedding easily unless using third-party like super.so or iframe with notion-embed.
  // Actually, Notion pages *can* be embedded if they are public, but it's tricky due to X-Frame-Options.
  // We will use an iframe pointing directly to the notion page, or an embedded look-alike link if iframe fails.
  // We'll try iframe first. If it blocks, it blocks.
  
  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
      <div className="p-3 border-b border-white/10 flex items-center gap-2">
        <svg viewBox="0 0 1024 1024" className="w-4 h-4 fill-current"><path d="M129.8 191.6l-5.6-21.4c178-58.4 466.8-132.8 543-152l4.8 18.2c-63 15-207.2 49-354.2 87-23 20-30 46-24 75 1.6 7 22.8 107.6 24 113-13.6-7-25-10-33-10-18.6 0-38 12.8-57 38.6l159 750.6c-48.4 12.2-229.6 57.6-281.8 70.8-23 6-41-11.8-43.6-32.2l-37-640.2c-15.6-4.2-31-6.6-46.6-6.6-22 0-40 7.8-54 23.4l1.6-18.4c48-31 106-44 148.8-37.6l23 371 16-77.4c-4-23.6-11.8-63.4-18-93.6-15.6-76-26.6-140-5.8-172.6 15-23.8 41-36 78-36 18.6 0 38.4 4 58.2 12l2-9.6c-37.4-80.4-86-136-151-167-46-21.8-102.2-32.8-146.4-32.8-7.6 0-15.2.4-22.8.8z M844 266c-18.6 0-38 4-58.2 12l-1.8 11.2c35.6 77 82 130 144 158 54.4 25 119.8 37 146.4 37 7.6 0 15-.4 22.8-1l5.4 21.6c-178 58.2-466.8 132.8-543 152l-5-18.4c63.4-15 208-49 355.2-87 23.4-20 30-46 24-75-1.6-7-23.2-108-24-113.6 13.8 7.2 25 10 33 10 18.8 0 38-12.8 57-38.6L792.8 1024c-13.6 3.6-27.4 7-41 10.4-25.2-50.6-54.6-121-82.6-200.4L511 834c-4.4-23.2-12.6-62.8-19-93.6-16-75.4-27.4-140-6.6-172.6 15-23.8 41.2-36.2 78-36.2 18.8 0 38 4.2 58 12.2l2-9.6c-37-80.6-86-136.2-151-167.2-46-21.8-102-32.8-146-32.8-7.6 0-15.4.2-22.8.8l5.6-21.6c178-58.4 466.6-132.8 543-152l4.8 18.2c-63 15-207.2 49-354 87-23.2 20-30.2 46.2-24.2 75 1.6 7.2 23 108 24 113.8-13.8-7-25-10-33-10z"/></svg>
        <span className="font-semibold text-sm">Notion</span>
      </div>
      <div className="w-full h-[400px]">
        {/* We use an iframe. If Notion blocks it, user sees browser error, but mostly public pages with proper embed formats work */}
        <iframe 
          src={url} 
          width="100%" 
          height="100%" 
          style={{ border: "none" }}
          sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin"
        />
      </div>
    </div>
  );
}
