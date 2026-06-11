"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateProfile(data: { username: string; displayName: string; bio: string; discordId: string }) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  // Verifica se o username já está em uso por outro usuário
  const existingUsername = await prisma.profile.findUnique({
    where: { username: data.username },
  });

  if (existingUsername && existingUsername.userId !== userId) {
    throw new Error("Este username já está em uso.");
  }

  // Garante que o usuário existe no nosso banco de dados (útil no localhost onde o webhook pode não rodar)
  const dbUser = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!dbUser) {
    await prisma.user.create({
      data: {
        id: userId,
        email: "user@clerk.com", // Fallback, não vamos precisar puxar os detalhes completos do Clerk agora
      }
    });
  }

  // Atualiza ou cria o perfil se não existir
  await prisma.profile.upsert({
    where: { userId },
    update: {
      username: data.username,
      displayName: data.displayName,
      bio: data.bio,
      discordId: data.discordId,
    },
    create: {
      userId,
      username: data.username,
      displayName: data.displayName,
      bio: data.bio,
      discordId: data.discordId,
    },
  });

  revalidatePath("/settings");
  revalidatePath(`/${data.username}`);
  
  return { success: true };
}
