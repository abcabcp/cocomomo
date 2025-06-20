/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * COCOMOMO API
 * COCOMOMO 백엔드 API 문서
 * OpenAPI spec version: 1.0
 */
import { useMutation, useQuery } from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import type {
  ApiErrorResponseDto,
  Post,
  PostsControllerCreatePostBody,
  PostsControllerFindAllParams,
  PostsControllerUploadContentImage201,
  PostsResponseDto,
  UpdatePostDto,
} from '../model';

import { apiInstance } from '../api';

/**
 * 게시글 목록을 조회합니다. 검색, 필터링, 페이징 기능을 제공합니다.
 * @summary 게시글 목록 조회
 */
export const postsControllerFindAll = (
  params?: PostsControllerFindAllParams,
  signal?: AbortSignal,
) => {
  return apiInstance<PostsResponseDto>({
    url: `/posts`,
    method: 'GET',
    params,
    signal,
  });
};

export const getPostsControllerFindAllQueryKey = (
  params?: PostsControllerFindAllParams,
) => {
  return [`/posts`, ...(params ? [params] : [])] as const;
};

export const getPostsControllerFindAllQueryOptions = <
  TData = Awaited<ReturnType<typeof postsControllerFindAll>>,
  TError = ApiErrorResponseDto,
>(
  params?: PostsControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof postsControllerFindAll>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getPostsControllerFindAllQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof postsControllerFindAll>>
  > = ({ signal }) => postsControllerFindAll(params, signal);

  return {
    queryKey,
    queryFn,
    staleTime: 10000,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof postsControllerFindAll>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type PostsControllerFindAllQueryResult = NonNullable<
  Awaited<ReturnType<typeof postsControllerFindAll>>
>;
export type PostsControllerFindAllQueryError = ApiErrorResponseDto;

export function usePostsControllerFindAll<
  TData = Awaited<ReturnType<typeof postsControllerFindAll>>,
  TError = ApiErrorResponseDto,
>(
  params: undefined | PostsControllerFindAllParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof postsControllerFindAll>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof postsControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof postsControllerFindAll>>
        >,
        'initialData'
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function usePostsControllerFindAll<
  TData = Awaited<ReturnType<typeof postsControllerFindAll>>,
  TError = ApiErrorResponseDto,
>(
  params?: PostsControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof postsControllerFindAll>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof postsControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof postsControllerFindAll>>
        >,
        'initialData'
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function usePostsControllerFindAll<
  TData = Awaited<ReturnType<typeof postsControllerFindAll>>,
  TError = ApiErrorResponseDto,
>(
  params?: PostsControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof postsControllerFindAll>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
/**
 * @summary 게시글 목록 조회
 */

export function usePostsControllerFindAll<
  TData = Awaited<ReturnType<typeof postsControllerFindAll>>,
  TError = ApiErrorResponseDto,
>(
  params?: PostsControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof postsControllerFindAll>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getPostsControllerFindAllQueryOptions(params, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * 새로운 게시글을 생성합니다. 썸네일 이미지 업로드 가능.
 * @summary 게시글 생성
 */
export const postsControllerCreatePost = (
  postsControllerCreatePostBody: PostsControllerCreatePostBody,
  signal?: AbortSignal,
) => {
  const formData = new FormData();
  formData.append(`title`, postsControllerCreatePostBody.title);
  formData.append(`content`, postsControllerCreatePostBody.content);
  if (postsControllerCreatePostBody.tags !== undefined) {
    postsControllerCreatePostBody.tags.forEach((value) =>
      formData.append(`tags`, value),
    );
  }
  if (postsControllerCreatePostBody.thumbnail !== undefined) {
    formData.append(`thumbnail`, postsControllerCreatePostBody.thumbnail);
  }

  return apiInstance<Post>({
    url: `/posts`,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
    signal,
  });
};

export const getPostsControllerCreatePostMutationOptions = <
  TError = ApiErrorResponseDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postsControllerCreatePost>>,
    TError,
    { data: PostsControllerCreatePostBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postsControllerCreatePost>>,
  TError,
  { data: PostsControllerCreatePostBody },
  TContext
> => {
  const mutationKey = ['postsControllerCreatePost'];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postsControllerCreatePost>>,
    { data: PostsControllerCreatePostBody }
  > = (props) => {
    const { data } = props ?? {};

    return postsControllerCreatePost(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostsControllerCreatePostMutationResult = NonNullable<
  Awaited<ReturnType<typeof postsControllerCreatePost>>
>;
export type PostsControllerCreatePostMutationBody =
  PostsControllerCreatePostBody;
export type PostsControllerCreatePostMutationError = ApiErrorResponseDto;

/**
 * @summary 게시글 생성
 */
export const usePostsControllerCreatePost = <
  TError = ApiErrorResponseDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof postsControllerCreatePost>>,
      TError,
      { data: PostsControllerCreatePostBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof postsControllerCreatePost>>,
  TError,
  { data: PostsControllerCreatePostBody },
  TContext
> => {
  const mutationOptions = getPostsControllerCreatePostMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * ID로 특정 게시글을 조회합니다.
 * @summary 게시글 조회
 */
export const postsControllerFindOne = (id: number, signal?: AbortSignal) => {
  return apiInstance<Post>({ url: `/posts/${id}`, method: 'GET', signal });
};

export const getPostsControllerFindOneQueryKey = (id: number) => {
  return [`/posts/${id}`] as const;
};

export const getPostsControllerFindOneQueryOptions = <
  TData = Awaited<ReturnType<typeof postsControllerFindOne>>,
  TError = ApiErrorResponseDto,
>(
  id: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof postsControllerFindOne>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getPostsControllerFindOneQueryKey(id);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof postsControllerFindOne>>
  > = ({ signal }) => postsControllerFindOne(id, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    staleTime: 10000,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof postsControllerFindOne>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type PostsControllerFindOneQueryResult = NonNullable<
  Awaited<ReturnType<typeof postsControllerFindOne>>
>;
export type PostsControllerFindOneQueryError = ApiErrorResponseDto;

export function usePostsControllerFindOne<
  TData = Awaited<ReturnType<typeof postsControllerFindOne>>,
  TError = ApiErrorResponseDto,
>(
  id: number,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof postsControllerFindOne>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof postsControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof postsControllerFindOne>>
        >,
        'initialData'
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function usePostsControllerFindOne<
  TData = Awaited<ReturnType<typeof postsControllerFindOne>>,
  TError = ApiErrorResponseDto,
>(
  id: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof postsControllerFindOne>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof postsControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof postsControllerFindOne>>
        >,
        'initialData'
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function usePostsControllerFindOne<
  TData = Awaited<ReturnType<typeof postsControllerFindOne>>,
  TError = ApiErrorResponseDto,
>(
  id: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof postsControllerFindOne>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
/**
 * @summary 게시글 조회
 */

export function usePostsControllerFindOne<
  TData = Awaited<ReturnType<typeof postsControllerFindOne>>,
  TError = ApiErrorResponseDto,
>(
  id: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof postsControllerFindOne>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getPostsControllerFindOneQueryOptions(id, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * 기존 게시글을 수정합니다. 썸네일 이미지도 변경 가능합니다.
 * @summary 게시글 수정
 */
export const postsControllerUpdatePost = (
  id: number,
  updatePostDto: UpdatePostDto,
) => {
  const formData = new FormData();
  if (updatePostDto.title !== undefined) {
    formData.append(`title`, updatePostDto.title);
  }
  if (updatePostDto.content !== undefined) {
    formData.append(`content`, updatePostDto.content);
  }
  if (updatePostDto.tags !== undefined) {
    updatePostDto.tags.forEach((value) => formData.append(`tags`, value));
  }
  if (updatePostDto.thumbnailUrl !== undefined) {
    formData.append(`thumbnailUrl`, updatePostDto.thumbnailUrl);
  }

  return apiInstance<Post>({
    url: `/posts/${id}`,
    method: 'PUT',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
  });
};

export const getPostsControllerUpdatePostMutationOptions = <
  TError = ApiErrorResponseDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postsControllerUpdatePost>>,
    TError,
    { id: number; data: UpdatePostDto },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postsControllerUpdatePost>>,
  TError,
  { id: number; data: UpdatePostDto },
  TContext
> => {
  const mutationKey = ['postsControllerUpdatePost'];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postsControllerUpdatePost>>,
    { id: number; data: UpdatePostDto }
  > = (props) => {
    const { id, data } = props ?? {};

    return postsControllerUpdatePost(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostsControllerUpdatePostMutationResult = NonNullable<
  Awaited<ReturnType<typeof postsControllerUpdatePost>>
>;
export type PostsControllerUpdatePostMutationBody = UpdatePostDto;
export type PostsControllerUpdatePostMutationError = ApiErrorResponseDto;

/**
 * @summary 게시글 수정
 */
export const usePostsControllerUpdatePost = <
  TError = ApiErrorResponseDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof postsControllerUpdatePost>>,
      TError,
      { id: number; data: UpdatePostDto },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof postsControllerUpdatePost>>,
  TError,
  { id: number; data: UpdatePostDto },
  TContext
> => {
  const mutationOptions = getPostsControllerUpdatePostMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * 게시글과 연관된 이미지를 삭제합니다.
 * @summary 게시글 삭제
 */
export const postsControllerDeletePost = (id: number) => {
  return apiInstance<void>({ url: `/posts/${id}`, method: 'DELETE' });
};

export const getPostsControllerDeletePostMutationOptions = <
  TError = ApiErrorResponseDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postsControllerDeletePost>>,
    TError,
    { id: number },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postsControllerDeletePost>>,
  TError,
  { id: number },
  TContext
> => {
  const mutationKey = ['postsControllerDeletePost'];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postsControllerDeletePost>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return postsControllerDeletePost(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostsControllerDeletePostMutationResult = NonNullable<
  Awaited<ReturnType<typeof postsControllerDeletePost>>
>;

export type PostsControllerDeletePostMutationError = ApiErrorResponseDto;

/**
 * @summary 게시글 삭제
 */
export const usePostsControllerDeletePost = <
  TError = ApiErrorResponseDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof postsControllerDeletePost>>,
      TError,
      { id: number },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof postsControllerDeletePost>>,
  TError,
  { id: number },
  TContext
> => {
  const mutationOptions = getPostsControllerDeletePostMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * 게시글 에디터에서 사용할 이미지를 업로드합니다. 허용된 이미지 타입: jpg, png, webp, gif, jpeg
 * @summary 에디터 이미지 업로드
 */
export const postsControllerUploadContentImage = (signal?: AbortSignal) => {
  return apiInstance<PostsControllerUploadContentImage201>({
    url: `/posts/upload-image`,
    method: 'POST',
    signal,
  });
};

export const getPostsControllerUploadContentImageMutationOptions = <
  TError = ApiErrorResponseDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postsControllerUploadContentImage>>,
    TError,
    void,
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postsControllerUploadContentImage>>,
  TError,
  void,
  TContext
> => {
  const mutationKey = ['postsControllerUploadContentImage'];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postsControllerUploadContentImage>>,
    void
  > = () => {
    return postsControllerUploadContentImage();
  };

  return { mutationFn, ...mutationOptions };
};

export type PostsControllerUploadContentImageMutationResult = NonNullable<
  Awaited<ReturnType<typeof postsControllerUploadContentImage>>
>;

export type PostsControllerUploadContentImageMutationError =
  ApiErrorResponseDto;

/**
 * @summary 에디터 이미지 업로드
 */
export const usePostsControllerUploadContentImage = <
  TError = ApiErrorResponseDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof postsControllerUploadContentImage>>,
      TError,
      void,
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof postsControllerUploadContentImage>>,
  TError,
  void,
  TContext
> => {
  const mutationOptions =
    getPostsControllerUploadContentImageMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
