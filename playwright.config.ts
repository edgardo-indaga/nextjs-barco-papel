import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    // Setup - crea los estados de sesión
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    // Pruebas que NO requieren autenticación
    {
      name: 'security',
      testMatch: 'security.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium-guest',
      testMatch: 'guest.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // Pruebas que requieren autenticación de usuario
    {
      name: 'chromium-user',
      testMatch: 'user.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
    },

    // Pruebas que requieren autenticación de admin
    {
      name: 'chromium-admin',
      testMatch: 'admin.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
    },
  ],

  // Iniciar servidor Next.js si no está corriendo
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
