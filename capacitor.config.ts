import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'es.fullstackpro.novagenda',
  appName: 'Novagenda',
  webDir: 'dist/novagenda-front/browser',
  server: {
    androidScheme: 'https',
    hostname: 'beta.fullstackpro.es',
  },
};

export default config;
