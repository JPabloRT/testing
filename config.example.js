// Supabase configuration
const config = {
    SUPABASE_URL: 'your-supabase-project-url',
    SUPABASE_ANON_KEY: 'your-supabase-anon-key'
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}
