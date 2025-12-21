import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as jose from "https://esm.sh/jose@5.9.6";

const GOOGLE_TOKEN_URI = "https://oauth2.googleapis.com/token";
const FCM_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";

function json(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

async function getGoogleAccessToken() {
    const projectId = Deno.env.get("FIREBASE_PROJECT_ID") ?? "";
    const clientEmail = Deno.env.get("FIREBASE_CLIENT_EMAIL") ?? "";
    let privateKey = Deno.env.get("FIREBASE_PRIVATE_KEY") ?? "";

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error("Missing FIREBASE_* secrets");
    }

    // Supabase secrets bazen \n'i escape eder: düzelt
    privateKey = privateKey.replace(/\\n/g, "\n");

    const now = Math.floor(Date.now() / 1000);

    // JWT (service account) -> OAuth2 access token
    const jwt = await new jose.SignJWT({
        scope: FCM_SCOPE,
    })
        .setProtectedHeader({ alg: "RS256", typ: "JWT" })
        .setIssuer(clientEmail)
        .setSubject(clientEmail)
        .setAudience(GOOGLE_TOKEN_URI)
        .setIssuedAt(now)
        .setExpirationTime(now + 60 * 60) // 1 saat
        .sign(await jose.importPKCS8(privateKey, "RS256"));

    const res = await fetch(GOOGLE_TOKEN_URI, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: jwt,
        }),
    });

    const body = await res.json();
    if (!res.ok) {
        throw new Error(`Google token error: ${JSON.stringify(body)}`);
    }
    return body.access_token as string;
}

serve(async (req) => {
    // Basit admin koruması (istersen JWT role bazlı da yaparız)
    const adminSecret = Deno.env.get("PUSH_ADMIN_SECRET") ?? "";
    const givenSecret = req.headers.get("x-admin-secret") ?? "";
    if (!adminSecret || givenSecret !== adminSecret) {
        return json({ error: "Unauthorized" }, 401);
    }

    const { user_id, title, body, data } = await req.json();

    if (!user_id || !title || !body) {
        return json({ error: "Missing user_id/title/body" }, 400);
    }

    const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // 1) tokens
    const { data: rows, error } = await supabase
        .from("user_push_tokens")
        .select("token")
        .eq("user_id", user_id);

    if (error) return json({ error: error.message }, 500);
    const tokens = (rows ?? []).map((r) => r.token).filter(Boolean);

    if (tokens.length === 0) {
        return json({ message: "No tokens found" }, 200);
    }

    // 2) access token
    let accessToken = "";
    try {
        accessToken = await getGoogleAccessToken();
    } catch (e) {
        return json({ error: String(e) }, 500);
    }

    const projectId = Deno.env.get("FIREBASE_PROJECT_ID") ?? "";
    const fcmUrl = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

    // 3) send (FCM v1 tek tek gönderir; burada hepsini paralel gönderiyoruz)
    const results = await Promise.all(
        tokens.map(async (t) => {
            const payload = {
                message: {
                    token: t,
                    notification: { title, body },
                    // data sadece string kabul eder -> json'ı string'e çevir
                    data: data
                        ? Object.fromEntries(
                            Object.entries(data).map(([k, v]) => [k, String(v)]),
                        )
                        : undefined,
                },
            };

            const r = await fetch(fcmUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const text = await r.text();
            return { token: t, ok: r.ok, status: r.status, response: text };
        }),
    );

    return json({ sent: results.length, results });
});
