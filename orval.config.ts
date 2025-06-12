import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: `${process.env.NEXT_PUBLIC_API_URL}/swagger-json`,
      filters: {
        mode: 'exclude',
        // Util 폴더 제외
        tags: ['Util'],
      },
    },
    output: {
      mode: 'tags',
      target: './services/query',
      schemas: './services/model',
      client: 'react-query',
      tsconfig: './tsconfig.json',
      biome: true,
      clean: true,
      override: {
        title: (title) => {
          return `${title}Api`;
        },
        query: {
          useQuery: true,
          options: {
            staleTime: 10000,
          },
          signal: true,
        },
        mutator: {
          path: './services/api.ts',
          name: 'apiInstance',
        },
      },
    },
  },
});
