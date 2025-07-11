import { NextResponse } from 'next/server';

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
    const accessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
      console.error(
        'NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN 환경 변수가 설정되지 않았습니다.',
      );
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

    return NextResponse.json({
      data: response.data,
      nextCursor: nextCursor,
    });
  } catch (error: any) {
    console.error('API 라우트 오류:', error);

    return NextResponse.json(
      {
        error: '인스타그램 피드를 가져오는 중 오류가 발생했습니다',
        message: error.message,
      },
      { status: 500 },
    );
  }
}
