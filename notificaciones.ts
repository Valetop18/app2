import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const PAGE_SIZE = 1000;
const EXPO_BATCH_SIZE = 100;
const JSON_HEADERS = { "Content-Type" : "application/json"};

interface NotificationRequest {
    title?: unknown;
    body?: unknown;
}

interface PushTokenRow{
    id: number;
    expo_push_token: string;
}

interface ExpoPushTicket {
    status: "ok" | "error";
    id?: string;
    message?: string;
    details?: Record<string, unknown>;
}

function jsonResponse(body: Record<string,unknown>, status = 200 ): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: JSON_HEADERS
    } )
}

function secretsMatch(received: string, expected: string): boolean{
    if (received.length !== expected.length) return false;

    let difference = 0; 

    for ( let index = 0; index < received.length; index+= 1){
        difference |= received.charCodeAt(index) ^ expected.charCodeAt(index);
    }

    return difference === 0;

}

function splitIntoBatches<T>(items: T[], size: number): T[][]{
    const batches: T[][] = [];

    for (let index = 0; index < items.length; index+=size) {
        batches.push(items.slice(index, index+size));
    }

    return batches;
}


async function getAllPushTokens(supabase: SupabaseClient): Promise<PushTokenRow[]>{

    const tokens: PushTokenRow[] = [];
    let from = 0;

    while (true) {
        const { data, error } = await supabase
            .from('push_tokens')
            .select("id, expo_push_token")
            .order("id", { ascending: true})
            .range(from, from + PAGE_SIZE - 1 )
        
        if (error) throw error;
        
        const page = ( data ?? []  ) as PushTokenRow[];
        tokens.push(...page);

        if ( page.length < PAGE_SIZE ) break;

        from += PAGE_SIZE;
    }

    return tokens;

}

async function sendBatch(
    tokens: string[],
    title: string,
    body: string
): Promise<ExpoPushTicket[]> {

    const messages = tokens.map( (token) => ({
        to: token,
        title,
        body,
        sound: "default",
        channelId: "updates",
        priority: "high"
    }))

    const headers: Record<string, string> = {...JSON_HEADERS};
    const expoAccessToken = Deno.env.get("EXPO_ACCESS_TOKEN");

    if (expoAccessToken) {
        headers.Authorization = `Bearer ${expoAccessToken}`;
    }

    const response = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(messages)
    })

    const responseText = await response.text();
    let responseBody: { data?: ExpoPushTicket[]; errors?: unknown  } = {};

    try {
        responseBody = JSON.parse(responseText);
    } catch (error) {
        throw new Error(`EXPO_INVALID_RESPONSE: ${responseText}`);
    }

    if (!response.ok || responseBody.errors) {
        throw new Error(`EXPO_REQUEST_FAILED: ${responseText}`);
    }

    return responseBody.data ?? [];
    
}


Deno.serve( async (request: Request): Promise<Response> => {

    if (request.method !== "POST") {
        return jsonResponse({ error: "METHOD_NOT_ALLOWED" }, 405);
    }

    const configuredSecret = Deno.env.get("CRON_NOTIFICATION_SECRET");

    if (!configuredSecret) {
        return jsonResponse({ error: "CRON_NOTIFICATION_SECRET_MISSING" }, 500);
    }

    const receivedSecret = request.headers.get("x-cron-secret") ?? "";

    if (  !secretsMatch(receivedSecret, configuredSecret) ) {
        return jsonResponse({ error: "UNAUTHORIZED" }, 401);
    }

    let payload: NotificationRequest;

    try {
        payload = await request.json();
    } catch (error) {
        return jsonResponse({ error: "INVALID_JSON" }, 400);
    }

    const title = typeof payload.title === "string" ? payload.title.trim() : "";
    const body = typeof payload.body === "string" ? payload.body.trim() : "";

    if (!title || !body) {
        return jsonResponse({ error: "TITLE_AND_BODY_REQUIRED"}, 400);
    }

    if (title.length > 100 || body.length > 1000) {
        return jsonResponse({ error: "CONTENT_TOO_LONG"}, 400);
    }

    const supabaseUrl: string = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey: string = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
        return jsonResponse({ error: "SUPABASE_CONFIGURATION_MISSING"}, 500);
    }

    try {
        const supabase =  createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        const storedTokens = await getAllPushTokens(supabase);

        const validTokens = [
            ...new Set(
                storedTokens
                    .map( ({expo_push_token}) => expo_push_token )
                    //se puede filtrar por isExpo
            )
        ]

        const tickets: ExpoPushTicket[] = [];

        for (const batch of splitIntoBatches(validTokens, EXPO_BATCH_SIZE)) {
            tickets.push( ...await sendBatch(batch, title, body) );
        }

        const successfulTickets = tickets.filter(({status}) => status === "ok");
        const failedTickets = tickets.filter(({status}) => status === "error");

        return jsonResponse({
            success: failedTickets.length === 0,
            storedTokens: storedTokens.length,
            validTokens: validTokens.length,
            sentToExpo: successfulTickets.length,
            ticketErrors: failedTickets.length,
            invalidTokens: storedTokens.length - validTokens.length,
            receiptIds: successfulTickets
                .map( ({id}) => id)
                .filter( (id): id is string => Boolean(id) ),
            errors: failedTickets.map(({message, details}) => ({message, details}))
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
        console.error("Error enviando notificacion general: ", error)
        return jsonResponse({ error: "UNKNOWN_ERROR", message}, 500);
    }


});
