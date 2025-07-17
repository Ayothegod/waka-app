const baseUrl = import.meta.env.API_BASE_URL;  //default: 'http://localhost:3000/api'

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  signup: (userData: { email: string; password: string; name: string }) =>
    fetchWithAuth('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};
