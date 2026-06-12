"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/server/actions";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, FileText, Gamepad2, AtSign } from "lucide-react";

type ProfileSettingsData = {
  username: string;
  displayName: string;
  bio: string;
  discordId: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring" as const, 
      stiffness: 300, 
      damping: 24 
    } 
  }
};

export default function SettingsForm({ profile }: { profile: ProfileSettingsData }) {
  const [username, setUsername] = useState(profile.username);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [discordId, setDiscordId] = useState(profile.discordId);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast.error("O Username é obrigatório.");
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile({
        username,
        displayName,
        bio,
        discordId,
      });
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar o perfil. O username pode já estar em uso.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Username */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-2 text-white/95">
            <AtSign className="w-4 h-4 text-red-400" />
            <Label htmlFor="username" className="text-sm font-semibold tracking-wide uppercase">Username (URL)</Label>
          </div>
          <div className="flex items-center group relative">
            <span className="flex items-center px-4 h-11 bg-white/5 border border-white/10 border-r-0 rounded-l-xl text-white/40 text-sm font-mono select-none">
              anthrax.cc/
            </span>
            <div className="relative flex-1 group">
              <Input 
                id="username" 
                name="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="seunome" 
                className="rounded-l-none rounded-r-xl bg-black/40 border-white/10 hover:border-white/20 focus:border-red-500/50 transition-all h-11 text-white placeholder-white/20 w-full" 
                required 
              />
              <div className="absolute inset-0 -z-10 bg-red-500/0 rounded-r-xl blur-md group-focus-within:bg-red-500/5 transition-all duration-300 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Display Name */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-2 text-white/95">
            <User className="w-4 h-4 text-red-400" />
            <Label htmlFor="displayName" className="text-sm font-semibold tracking-wide uppercase">Nome de Exibição</Label>
          </div>
          <div className="relative group">
            <Input 
              id="displayName" 
              name="displayName" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Como quer ser chamado?" 
              className="bg-black/40 border-white/10 hover:border-white/20 focus:border-red-500/50 transition-all rounded-xl h-11 text-white placeholder-white/30" 
            />
            <div className="absolute inset-0 -z-10 bg-red-500/0 rounded-xl blur-md group-focus-within:bg-red-500/5 transition-all duration-300 pointer-events-none" />
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-2 text-white/95">
            <FileText className="w-4 h-4 text-red-400" />
            <Label htmlFor="bio" className="text-sm font-semibold tracking-wide uppercase">Biografia</Label>
          </div>
          <div className="relative group">
            <Textarea 
              id="bio" 
              name="bio" 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Uma breve descrição sobre você..." 
              className="bg-black/40 border-white/10 hover:border-white/20 focus:border-red-500/50 transition-all rounded-xl min-h-[90px] text-white placeholder-white/30" 
              rows={3} 
            />
            <div className="absolute inset-0 -z-10 bg-red-500/0 rounded-xl blur-md group-focus-within:bg-red-500/5 transition-all duration-300 pointer-events-none" />
          </div>
        </motion.div>

        {/* Discord ID */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-2 text-white/95">
            <Gamepad2 className="w-4 h-4 text-red-400" />
            <Label htmlFor="discordId" className="text-sm font-semibold tracking-wide uppercase">Discord ID (Lanyard)</Label>
          </div>
          <div className="relative group">
            <Input 
              id="discordId" 
              name="discordId" 
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
              placeholder="Ex: 123456789012345678" 
              className="bg-black/40 border-white/10 hover:border-white/20 focus:border-red-500/50 transition-all rounded-xl h-11 text-white placeholder-white/30 font-mono" 
            />
            <div className="absolute inset-0 -z-10 bg-red-500/0 rounded-xl blur-md group-focus-within:bg-red-500/5 transition-all duration-300 pointer-events-none" />
          </div>
          <p className="text-xs text-white/40 mt-1 font-sans">
            Para o status funcionar em tempo real, você precisa estar no servidor Discord do Lanyard.
          </p>
        </motion.div>

        {/* Save Button */}
        <motion.div variants={itemVariants} className="pt-2">
          <Button 
            type="submit" 
            className="w-full sm:w-auto h-11 px-8 rounded-xl bg-white text-black hover:bg-white/90 font-bold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 cursor-pointer"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Salvando...
              </div>
            ) : "Salvar Alterações"}
          </Button>
        </motion.div>
      </motion.div>
    </form>
  );
}
