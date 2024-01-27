export const isDevEnv = process.env.NODE_ENV === "development";
export const API_URL = process.env.REACT_APP_CENTRALIZED_SERVER_URL as string
export const isMock = isDevEnv && process.env.REACT_APP_API_MOCKING === "true";
export const hCaptchaSitekey: string = process.env.REACT_APP_HCAPTCHA_SITEKEY || '';
export { default as locale } from "./locale.en";
export const PORTER_URI = process.env.REACT_APP_PORTER_URI as string;
export const STAKING_SERVICE_URL = process.env.REACT_APP_STAKING_SERVICE_URL as string;

export const DEMO_DAPP_BACKEND_URL = process.env.REACT_APP_NULINK_WEB_AGENT_INTEGRATION_DEMO_BACKEND_URL as string;
