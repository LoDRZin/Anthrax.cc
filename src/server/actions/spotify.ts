"use server";

export async function getSpotifyData(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const html = await res.text();
    
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/);
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    const audioMatch = html.match(/<meta property="og:audio" content="([^"]+)"/);

    const title = titleMatch ? titleMatch[1] : 'Unknown Song';
    let artist = 'Unknown Artist';
    if (descMatch) {
      // Typically: "Artist · Album · Song · Year"
      artist = descMatch[1].split(' · ')[0];
    }

    return {
      title,
      artist,
      image: imageMatch ? imageMatch[1] : '',
      audio: audioMatch ? audioMatch[1] : null,
      url
    };
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return null;
  }
}
