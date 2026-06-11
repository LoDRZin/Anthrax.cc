"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateAppearance(data: {
  avatarUrl?: string;
  backgroundUrl?: string;
  audioUrl?: string;
  effect?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");

  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Perfil não encontrado");

  await prisma.profile.update({
    where: { userId },
    data: {
      avatarUrl: data.avatarUrl,
      backgroundUrl: data.backgroundUrl,
      audioUrl: data.audioUrl,
      effect: data.effect,
    },
  });

  revalidatePath("/appearance");
  revalidatePath(`/${profile.username}`);
  
  return { success: true };
}

export async function updateAdvancedStyling(uiConfigString: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");

  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Perfil não encontrado");

  await prisma.profile.update({
    where: { userId },
    data: { uiConfig: uiConfigString },
  });

  revalidatePath("/appearance");
  revalidatePath(`/${profile.username}`);
  
  return { success: true };
}
