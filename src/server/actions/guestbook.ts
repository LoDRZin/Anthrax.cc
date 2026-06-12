"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addGuestbookEntry(profileId: string, name: string, message: string) {
  if (!name || !message) throw new Error("Nome e mensagem são obrigatórios");
  if (message.length > 200) throw new Error("A mensagem é muito longa");

  await prisma.guestbookEntry.create({
    data: {
      profileId,
      name: name.slice(0, 50),
      message: message.slice(0, 200),
    }
  });

  const profile = await prisma.profile.findUnique({ where: { id: profileId } });
  if (profile) {
    revalidatePath(`/${profile.username}`);
  }
}
