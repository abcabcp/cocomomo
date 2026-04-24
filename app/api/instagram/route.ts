import { NextResponse } from 'next/server';

const INSTAGRAM_REVALIDATE_SECONDS = 3600;

async function fetchInstagramMedia(accessToken: string, after?: string | null) {
  const params = new URLSearchParams({
    access_token: accessToken,
    limit: '12',
    fields: 'id,caption,media_type,media_url,thumbnail_url,permalink',
  });

  if (after) {
    params.append('after', after);
  }

  const url = `https://graph.instagram.com/me/media?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: INSTAGRAM_REVALIDATE_SECONDS,
        tags: ['instagram-feed'],
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Instagram API 응답 오류: ${response.status} ${errorText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('인스타그램 API 호출 오류:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
      console.error('INSTAGRAM_ACCESS_TOKEN 환경 변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: 'Instagram access token is not configured' },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const after = searchParams.get('after');

    const response = await fetchInstagramMedia(accessToken, after);

    let nextCursor = null;
    if (response.paging?.next) {
      try {
        const nextUrl = new URL(response.paging.next);
        nextCursor = nextUrl.searchParams.get('after');
      } catch (error) {
        console.error('다음 URL 파싱 오류:', error);
      }
    }

    return NextResponse.json(
      {
        data: response.data,
        nextCursor: nextCursor,
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${INSTAGRAM_REVALIDATE_SECONDS}, stale-while-revalidate=600`,
        },
      },
    );
  } catch (error: any) {
    console.error('API 라우트 오류:', error);

    return NextResponse.json(
      {
        error: '인스타그램 피드를 가져오는 중 오류가 발생했습니다',
        message: error.message,
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      },
    );
  }
}
