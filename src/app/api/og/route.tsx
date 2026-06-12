import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return new ImageResponse(
        (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#000', color: '#fff', fontSize: 40 }}>
            Anthrax.cc
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { username },
    });

    if (!profile) {
      return new ImageResponse(
        (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#000', color: '#fff', fontSize: 40 }}>
            Perfil não encontrado
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#0a0a0a',
            backgroundImage: profile.backgroundUrl ? `url(${profile.backgroundUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Overlay escuro */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
            <img
              src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
              alt="Avatar"
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                border: '8px solid rgba(255,255,255,0.2)',
                marginBottom: 30,
                objectFit: 'cover'
              }}
            />
            <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-0.05em', marginBottom: 10 }}>
              {profile.displayName || profile.username}
            </div>
            <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.6)' }}>
              anthrax.cc/{profile.username}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
