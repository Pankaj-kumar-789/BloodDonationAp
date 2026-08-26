import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.raktasetu.app',
  appName: 'RaktaSetu',
  webDir: 'public',
  server: {
    url: 'https://blood-donation-ap.vercel.app',
    cleartext: false
  }
};

export default config;
