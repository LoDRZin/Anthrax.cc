"use client";

import { useState } from "react";
import { Share2, QrCode, X } from "lucide-react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileActions({ profileUrl }: { profileUrl: string }) {
  const [showQr, setShowQr] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Link copiado para a área de transferência!");
  };

  return (
    <>
      <div className="absolute top-4 right-4 flex gap-2 z-50">
        <button 
          onClick={handleCopy}
          className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors text-white/80 hover:text-white"
          title="Copiar Link"
        >
          <Share2 size={18} />
        </button>
        <button 
          onClick={() => setShowQr(true)}
          className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors text-white/80 hover:text-white"
          title="Mostrar QR Code"
        >
          <QrCode size={18} />
        </button>
      </div>

      <AnimatePresence>
        {showQr && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowQr(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border border-white/10 p-6 rounded-2xl flex flex-col items-center max-w-xs w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center w-full mb-6">
                <h3 className="text-lg font-bold text-white">QR Code</h3>
                <button onClick={() => setShowQr(false)} className="text-white/50 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="bg-white p-4 rounded-xl mb-6">
                <QRCode value={profileUrl} size={200} />
              </div>
              
              <p className="text-sm text-center text-white/60 mb-4">
                Escaneie o código para acessar o perfil pelo celular.
              </p>
              
              <button 
                onClick={handleCopy}
                className="w-full py-2 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition-colors"
              >
                Copiar Link
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
