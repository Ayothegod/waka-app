
const baseUrl = import.meta.env.VITE_API_BASE_URL;  //default: 'https://api.mantahq.com/api/workflow/tolu/tests'

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });
  

  if (!response.ok) {
    throw new Error(`${response.statusText}` || `Invalid credentials provided.`);
  }

  return response.json();
}

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiFetch('/auth-test-2/login', {

      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  signup: (userData: { email: string; password: string; name: string }) =>
    apiFetch('/auth-test-2/signup', {

      method: 'POST',
      body: JSON.stringify(userData),
    }),
};
