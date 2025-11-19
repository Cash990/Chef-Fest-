// Configuration for the frontend
// In Replit, we can fetch these from the backend
export async function getSupabaseConfig() {
  try {
    const response = await fetch('/api/config');
    if (!response.ok) {
      throw new Error('Failed to fetch config');
    }
    const config = await response.json();
    return {
      supabaseUrl: config.supabaseUrl,
      supabaseAnonKey: config.supabaseAnonKey,
    };
  } catch (error) {
    console.error('Error fetching config:', error);
    return {
      supabaseUrl: '',
      supabaseAnonKey: '',
    };
  }
}
