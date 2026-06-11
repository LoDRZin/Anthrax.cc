"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getLinks() {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");

  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { links: { orderBy: { order: 'asc' } } },
  });

  return profile?.links || [];
}

export async function createLink(data: { title: string; url: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");

  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Perfil não encontrado");

  // Pega a ordem mais alta
  const lastLink = await prisma.link.findFirst({
    where: { profileId: profile.id },
    orderBy: { order: 'desc' },
  });

  const newOrder = lastLink ? lastLink.order + 1 : 0;

  await prisma.link.create({
    data: {
      profileId: profile.id,
      title: data.title,
      url: data.url,
      order: newOrder,
    },
  });

  revalidatePath("/links");
  revalidatePath(`/${profile.username}`);
  return { success: true };
}

export async function deleteLink(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");

  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Perfil não encontrado");

  await prisma.link.delete({
    where: { id, profileId: profile.id },
  });

  revalidatePath("/links");
  revalidatePath(`/${profile.username}`);
  return { success: true };
}

export async function updateLinksOrder(links: { id: string; order: number }[]) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");

  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Perfil não encontrado");

  // O ideal seria uma transaction, mas para simplificar:
  for (const link of links) {
    await prisma.link.updateMany({
      where: { id: link.id, profileId: profile.id },
      data: { order: link.order },
    });
  }

  revalidatePath("/links");
  revalidatePath(`/${profile.username}`);
  return { success: true };
}
