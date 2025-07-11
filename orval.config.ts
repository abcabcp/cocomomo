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
      target: './entities/api/query',
      schemas: './entities/api/model',
      client: 'react-query',
      tsconfig: './tsconfig.json',
      biome: true,
      clean: true,
      override: {
        title: (title) => `${title}Api`,
        query: {
          useQuery: true,
          signal: true,
        },
        mutator: {
          path: './entities/api/api.ts',
          name: 'apiInstance',
        },
        useTypeOverInterfaces: true,
      },
    },
  },
});
