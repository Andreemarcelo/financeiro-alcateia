/**
 * Supabase client — só ativa quando as variáveis de ambiente estiverem configuradas.
 * Enquanto isso, o app usa dados mockados de mock-data.ts.
 */
import { createClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = url && key ? createClient(url, key) : null;
export const USE_MOCK = !supabase;
