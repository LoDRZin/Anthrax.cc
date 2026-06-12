export default function GithubWidget({ config }: { config: any }) {
  if (!config?.username) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 my-2 rounded-xl backdrop-blur-md bg-black/40 border border-white/10">
      <h3 className="text-white/80 font-bold mb-3 flex items-center gap-2">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        GitHub Contributions
      </h3>
      <div className="w-full overflow-hidden flex justify-center">
        <img 
          src={`https://ghchart.rshah.org/${config.username}`} 
          alt={`${config.username}'s GitHub chart`} 
          className="w-full max-w-[800px] invert hue-rotate-180 brightness-150 contrast-125"
        />
      </div>
    </div>
  );
}
