"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addProfileRating(profileId: string, rating: number, ipHash: string) {
  if (rating < 1 || rating > 5) throw new Error("A avaliação deve ser de 1 a 5");

  // Verifica se o IP já avaliou esse perfil
  const existing = await prisma.profileRating.findFirst({
    where: { profileId, ipHash }
  });

  if (existing) {
    throw new Error("Você já avaliou este perfil");
  }

  await prisma.profileRating.create({
    data: {
      profileId,
      rating,
      ipHash,
    }
  });

  const profile = await prisma.profile.findUnique({ where: { id: profileId } });
  if (profile) {
    revalidatePath(`/${profile.username}`);
  }
}
