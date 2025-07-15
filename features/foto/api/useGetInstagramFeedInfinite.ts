'use client';

import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';

export interface InstagramPost {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'CAROUSEL_ALBUM' | 'VIDEO';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
}

export type InstagramFeedResponse = {
  data: InstagramPost[];
  nextCursor?: string;
};

export const useGetInstagramFeedInfinite = () => {
  return useInfiniteQuery({
    queryKey: ['instagram-infinite'] as const,
    queryFn: fetchInstagramFeedInfinite,
    initialPageParam: '/api/instagram',
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextCursor) return undefined;
      return `/api/instagram?after=${lastPage.nextCursor}`;
    },
    staleTime: 60 * 1000,
  });
};

const fetchInstagramFeedInfinite = async (
  context: QueryFunctionContext<readonly ['instagram-infinite'], string>,
): Promise<InstagramFeedResponse> => {
  const { pageParam } = context;
  const response = await axios.get<InstagramFeedResponse>(pageParam);
  return response.data;
};
