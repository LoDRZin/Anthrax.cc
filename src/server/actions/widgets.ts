"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createMusicWidget(type: "spotify" | "soundcloud", url: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");

  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Perfil não encontrado");

  // Create the widget
  await prisma.widget.create({
    data: {
      profileId: profile.id,
      type,
      config: JSON.stringify({ url }),
      order: 0,
    },
  });

  revalidatePath(`/${profile.username}`);
  revalidatePath("/appearance");
  revalidatePath("/links");
  return { success: true };
}

export async function createWidget(type: string, configObj: any) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");

  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Perfil não encontrado");

  await prisma.widget.create({
    data: {
      profileId: profile.id,
      type,
      config: JSON.stringify(configObj),
      order: 0,
    },
  });

  revalidatePath(`/${profile.username}`);
  revalidatePath("/links");
  return { success: true };
}
