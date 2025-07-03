import { NextResponse } from 'next/server';
import axios from 'axios';

interface InstagramResponse {
  data: Array<{
    id: string;
    caption: string;
    media_type: 'IMAGE' | 'CAROUSEL_ALBUM' | 'VIDEO';
    media_url: string;
    thumbnail_url?: string;
    permalink: string;
  }>;
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next: string;
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const after = searchParams.get('after');

    const params = new URLSearchParams({
      access_token: process.env.INSTAGRAM_ACCESS_TOKEN || '',
      limit: '12',
      fields: 'id,caption,media_type,media_url,thumbnail_url,permalink',
    });

    if (after) {
      params.append('after', after);
    }

    const url = `https://graph.instagram.com/me/media?${params.toString()}`;
    const response = await axios.get<InstagramResponse>(url);

    let nextCursor = null;
    if (response.data.paging?.next) {
      try {
        const nextUrl = new URL(response.data.paging.next);
        nextCursor = nextUrl.searchParams.get('after');
      } catch (error) {
        console.error('Error parsing next URL:', error);
      }
    }

    return NextResponse.json({
      data: response.data.data,
      nextCursor: nextCursor,
    });
  } catch (error) {
    console.error('Instagram API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram feed' },
      { status: 500 },
    );
  }
}
