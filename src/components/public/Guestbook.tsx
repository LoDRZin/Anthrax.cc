"use client";

import { useState } from "react";
import { addGuestbookEntry } from "@/server/actions/guestbook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Guestbook({ profileId, entries }: { profileId: string, entries: any[] }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setIsSubmitting(true);
    setError("");
    try {
      await addGuestbookEntry(profileId, name, message);
      setSuccess(true);
      setName("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Erro ao enviar recado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mt-10 bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>📝</span> Mural de Recados
      </h3>
      
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {entries.length === 0 ? (
          <p className="text-white/40 text-sm italic">Nenhum recado ainda. Seja o primeiro!</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="bg-white/5 border border-white/5 p-3 rounded-lg">
              <div className="flex justify-between items-end mb-1">
                <span className="font-semibold text-sm text-[var(--accent-color)]">{entry.name}</span>
                <span className="text-xs text-white/30">{new Date(entry.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-white/80 text-sm break-words">{entry.message}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {success && <p className="text-green-400 text-xs">Recado enviado com sucesso!</p>}
        <Input 
          placeholder="Seu nome" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          required 
          className="bg-black/50 border-white/10 h-9"
        />
        <Textarea 
          placeholder="Deixe uma mensagem legal..." 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={200}
          required
          className="bg-black/50 border-white/10 resize-none h-20"
        />
        <Button type="submit" disabled={isSubmitting || success} className="w-full h-9 bg-[var(--accent-color)] hover:brightness-110 text-black font-bold">
          {isSubmitting ? "Enviando..." : "Assinar Mural"}
        </Button>
      </form>
    </div>
  );
}
