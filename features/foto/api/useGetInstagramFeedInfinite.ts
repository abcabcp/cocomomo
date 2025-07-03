'use client';

import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';

interface InstagramPost {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'CAROUSEL_ALBUM' | 'VIDEO';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
}

interface InstagramResponse {
  data: InstagramPost[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next: string;
  };
}

export type InstagramFeedResponse = {
  data: InstagramPost[];
  next?: string;
};

export const useGetInstagramFeedInfinite = () => {
  return useInfiniteQuery({
    queryKey: ['instagram-infinite'] as const,
    queryFn: fetchInstagramFeedInfinite,
    initialPageParam: `https://graph.instagram.com/me/media?access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN}&limit=12&fields=id,caption,media_type,media_url,thumbnail_url,permalink`,
    getNextPageParam: (lastPage) => lastPage.next,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

const fetchInstagramFeedInfinite = async (
  context: QueryFunctionContext<readonly ['instagram-infinite'], string>,
): Promise<InstagramFeedResponse> => {
  const { pageParam } = context;
  const response = await axios.get<InstagramResponse>(pageParam);
  return {
    data: response.data.data,
    next: response.data.paging?.next,
  };
};
