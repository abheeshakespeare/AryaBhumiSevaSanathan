interface EnvConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  site: {
    url: string;
  };
}

export const env: EnvConfig = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://aryabhumisevasansthan.org',
  },
};

// Validate environment variables
export function validateEnv() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
} 