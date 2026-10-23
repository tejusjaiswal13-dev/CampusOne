import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ips.campusone",
  appName: "CampusOne",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#142d3b",
      showSpinner: true,
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#142d3b",
    },
    LocalNotifications: {
      smallIcon: "ic_campusone",
      iconColor: "#142d3b",
    },
  },
  android: {
    allowMixedContent: process.env.CAMPUS_ALLOW_HTTP === "true",
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
};

export default config;
