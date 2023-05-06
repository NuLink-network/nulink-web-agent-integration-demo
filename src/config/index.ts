export const isDevEnv = process.env.NODE_ENV === "development";
export const API_URL = process.env.REACT_APP_SERVER_BASEURL as string
export const isMock = isDevEnv && process.env.REACT_APP_API_MOCKING === "true";
export const hCaptchaSitekey: string = process.env.REACT_APP_HCAPTCHA_SITEKEY || '';
export { default as locale } from "./locale.en";

