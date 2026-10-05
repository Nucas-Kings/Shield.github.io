import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const authorization = req.headers.get("Authorization") ?? "";
    if (!authorization.startsWith("Bearer ")) return json({ error: "Missing user session." }, 401);

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const token = authorization.replace(/^Bearer\s+/i, "");
    const { data: userData, error: userError } = await adminClient.auth.getUser(token);
    if (userError || !userData.user) return json({ error: "Invalid or expired session." }, 401);

    const { data: callerProfile } = await adminClient.from("profiles").select("account_type").eq("id", userData.user.id).maybeSingle();
    if (callerProfile?.account_type !== "admin") return json({ error: "Administrator access required." }, 403);

    const body = await req.json();
    const userId = String(body.userId || "").trim();
    if (!userId) return json({ error: "Employee user ID is required." }, 400);
    if (userId === userData.user.id) return json({ error: "You cannot delete your own administrator account here." }, 400);

    const { data: target } = await adminClient.from("profiles").select("account_type,employee_id").eq("id", userId).maybeSingle();
    if (!target || target.account_type !== "employee") return json({ error: "Employee account not found." }, 404);

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteError) return json({ error: deleteError.message }, 400);

    return json({ ok: true, employeeId: target.employee_id });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unexpected server error." }, 500);
  }
});