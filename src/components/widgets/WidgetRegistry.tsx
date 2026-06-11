import dynamic from "next/dynamic";

// Mapeia o "type" do banco de dados para o componente React com Lazy Loading
export const WIDGET_REGISTRY: Record<string, React.ComponentType<{ config: any }>> = {
  weather: dynamic(() => import("./WeatherWidget"), { ssr: false }),
  // spotify: dynamic(() => import("./SpotifyWidget"), { ssr: false }),
};
