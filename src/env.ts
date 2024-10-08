declare global {
  interface Window {
    env: any;
  }
}

type EnvType = {
  REACT_APP_ACTIVITY_TIME_LIMIT: string;
  REACT_APP_BASE_URL: string;
  REACT_APP_DSN: string;
  REACT_APP_WEBSOCKET_BASE_URL: string;
  REACT_APP_VERSION: string;
  REACT_APP_GOOGLE_CLIENT_ID: string;
  REACT_APP_POC: string;
  REACT_APP_COMPLIANCE: string;
  REACT_APP_SIMULATION: string;
  REACT_APP_DISABLE_GRC: string;
  REACT_APP_WEBSITE_TOKEN: string;
};
export const env: EnvType = { ...process.env, ...window.env };
