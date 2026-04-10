import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bo.checkpoint.app',
  appName: 'checkpoint',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 10000,
      backgroundColor: '#ffffff',
      splashFullscreen: true
    }
  }
};

export default config;
