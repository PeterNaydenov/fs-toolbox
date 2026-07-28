import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    pool: 'forks',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      exclude: ['node_modules', 'test', 'test-data'],
      reporter: ['lcov', 'text-summary'],
    },
  },
})