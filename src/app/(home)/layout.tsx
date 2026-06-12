import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={ptBR}>
      {children}
    </ClerkProvider>
  );
}
