// lib/supabase/admin.ts
// Admin Supabase client (service_role key দিয়ে)
// ⚠️ শুধু Server-side এ use করবেন — কখনো Client Component এ নয়!

import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
