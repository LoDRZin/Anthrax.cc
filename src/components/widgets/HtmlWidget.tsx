export default function HtmlWidget({ config }: { config: any }) {
  if (!config?.html) return null;

  return (
    <div className="w-full my-2 flex justify-center">
      <div 
        className="w-full"
        dangerouslySetInnerHTML={{ __html: config.html }} 
      />
    </div>
  );
}
