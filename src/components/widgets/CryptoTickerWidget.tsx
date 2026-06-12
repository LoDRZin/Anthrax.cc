"use client";

import { useEffect, useState } from "react";

export default function CryptoTickerWidget({ config }: { config: any }) {
  const [prices, setPrices] = useState<{ btc: string; eth: string; sol: string } | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
        const data = await res.json();
        setPrices({
          btc: data.bitcoin.usd.toLocaleString("en-US", { style: "currency", currency: "USD" }),
          eth: data.ethereum.usd.toLocaleString("en-US", { style: "currency", currency: "USD" }),
          sol: data.solana.usd.toLocaleString("en-US", { style: "currency", currency: "USD" }),
        });
      } catch (e) {
        console.error("Crypto fetch error", e);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // 1 min
    return () => clearInterval(interval);
  }, []);

  if (!prices) return null;

  return (
    <div className="w-full flex justify-center my-2">
      <div className="w-full max-w-sm rounded-xl overflow-hidden backdrop-blur-md bg-black/40 border border-white/10 flex flex-col p-3">
        <h3 className="text-xs font-bold text-white/50 mb-2 uppercase tracking-wider text-center">Mercado Ao Vivo</h3>
        <div className="flex justify-around items-center text-sm font-mono">
          <div className="flex flex-col items-center">
            <span className="text-[#f7931a] font-bold">BTC</span>
            <span className="text-white/80">{prices.btc}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[#627eea] font-bold">ETH</span>
            <span className="text-white/80">{prices.eth}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[#14f195] font-bold">SOL</span>
            <span className="text-white/80">{prices.sol}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
