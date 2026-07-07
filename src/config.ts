const URL_KEY = 'gym_api_url';
const TOKEN_KEY = 'gym_api_token';

const ENV_URL = import.meta.env.VITE_GYM_API_URL ?? '';
const ENV_TOKEN = import.meta.env.VITE_GYM_API_TOKEN ?? '';

export function getApiUrl(): string {
  return localStorage.getItem(URL_KEY) ?? ENV_URL;
}

export function setApiUrl(url: string) {
  localStorage.setItem(URL_KEY, url.trim());
}

export function getApiToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? ENV_TOKEN;
}

export function setApiToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token.trim());
}

export function isConfigured(): boolean {
  return getApiUrl().length > 0 && getApiToken().length > 0;
}
