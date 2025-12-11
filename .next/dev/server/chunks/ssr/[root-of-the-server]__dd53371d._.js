module.exports = [
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/app/actions/waitlist.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4090a0212f8e143f392f77a4c404ee5547c6bd6b19":"submitWaitlist"},"",""] */ __turbopack_context__.s([
    "submitWaitlist",
    ()=>submitWaitlist
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$postmark$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/postmark/dist/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function submitWaitlist(formData) {
    const name = (formData.get("name") || "").trim();
    const email = (formData.get("email") || "").trim().toLowerCase();
    console.log("SERVER ACTION HIT:", {
        name,
        email
    });
    // Name: 2+ alphabetic characters (including international), max 50 chars
    const nameRegex = /^[\p{L}\s'-]{2,50}$/u;
    if (!nameRegex.test(name)) {
        return {
            success: false,
            error: "Name must be at least 2 letters and contain only alphabetic characters."
        };
    }
    // Email: Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            success: false,
            error: "Please enter a valid email address."
        };
    }
    if (email.length > 100) {
        return {
            success: false,
            error: "Email is too long."
        };
    }
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
        cookies: {
            get: ()=>"",
            set: ()=>{},
            remove: ()=>{}
        }
    });
    const { data: existingUser, error: checkError } = await supabase.from("waitlist").select("name").eq("email", email).single();
    if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 means no rows found, which is what we want
        console.error("Database check error:", checkError);
        return {
            success: false,
            error: "An error occurred. Please try again."
        };
    }
    if (existingUser) {
        // User already exists
        return {
            success: false,
            duplicate: true,
            existingName: name
        };
    }
    const { data, error } = await supabase.from("waitlist").insert({
        name,
        email
    }).select().single();
    if (error) {
        console.error("Insert error:", error);
        return {
            success: false,
            error: "An error occurred. Please try again."
        };
    }
    if (data) {
        console.log("[v0] User successfully inserted into database:", {
            name,
            email
        });
        console.log("[v0] Checking environment variables...");
        console.log("[v0] POSTMARK_API_TOKEN exists:", !!process.env.POSTMARK_API_TOKEN);
        console.log("[v0] POSTMARK_SENDER_EMAIL:", process.env.POSTMARK_SENDER_EMAIL);
        const debugInfo = [];
        debugInfo.push(`User inserted: ${name} (${email})`);
        debugInfo.push(`POSTMARK_API_TOKEN exists: ${!!process.env.POSTMARK_API_TOKEN}`);
        debugInfo.push(`POSTMARK_SENDER_EMAIL: ${process.env.POSTMARK_SENDER_EMAIL || "NOT SET"}`);
        try {
            debugInfo.push("Initializing Postmark client...");
            const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$postmark$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ServerClient"](process.env.POSTMARK_API_TOKEN);
            const htmlBody = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; padding: 20px 0; }
              .content { background-color: #f9f9f9; padding: 30px; border-radius: 8px; }
              .footer { text-align: center; padding: 20px 0; font-size: 12px; color: #666; }
              h1 { color: #000; margin-bottom: 20px; }
              p { margin-bottom: 15px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Book Talent!</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>Thank you for joining the Book Talent waitlist! We're excited to have you on board.</p>
                <p>You'll be among the first to know when we launch. Stay tuned for updates!</p>
                <p>Best regards,<br>The Book Talent Team</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Book Talent. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
            console.log("[v0] Attempting to send email to:", email);
            console.log("[v0] Email from:", process.env.POSTMARK_SENDER_EMAIL);
            const emailResult = await client.sendEmail({
                From: process.env.POSTMARK_SENDER_EMAIL,
                To: email,
                Subject: "Welcome to the Book Talent Waitlist",
                HtmlBody: htmlBody,
                TextBody: `Hi ${name},\n\nThank you for joining the Book Talent waitlist! We're excited to have you on board.\n\nYou'll be among the first to know when we launch. Stay tuned for updates!\n\nBest regards,\nThe Book Talent Team`,
                MessageStream: "outbound"
            });
            console.log("[v0] Email sent successfully!");
            console.log("[v0] Postmark response:", emailResult);
            debugInfo.push("Email sent successfully!");
            debugInfo.push(`Postmark MessageID: ${emailResult.MessageID}`);
            return {
                success: true,
                debug: debugInfo.join(" | ")
            };
        } catch (emailError) {
            debugInfo.push("EMAIL ERROR!");
            debugInfo.push(`Error: ${emailError instanceof Error ? emailError.message : String(emailError)}`);
            return {
                success: true,
                debug: debugInfo.join(" | "),
                emailError: true
            };
        }
    }
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    submitWaitlist
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(submitWaitlist, "4090a0212f8e143f392f77a4c404ee5547c6bd6b19", null);
}),
"[project]/app/actions/auth.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00161da4c345cc4811d0c447824656ad878c18c42b":"signOut","40248c7ddbd1bb82cbe137fa0bfdbebbad8d088e46":"signIn","40f842a65978d88bcb8157a7fe5f248ed47896b0c2":"signUp"},"",""] */ __turbopack_context__.s([
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut,
    "signUp",
    ()=>signUp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function signUp(formData) {
    const email = (formData.get("email") || "").trim().toLowerCase();
    const password = formData.get("password") || "";
    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            success: false,
            error: "Please enter a valid email address."
        };
    }
    if (password.length < 8) {
        return {
            success: false,
            error: "Password must be at least 8 characters long."
        };
    }
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
        cookies: {
            get: (name)=>cookieStore.get(name)?.value,
            set: (name, value, options)=>{
                cookieStore.set({
                    name,
                    value,
                    ...options
                });
            },
            remove: (name, options)=>{
                cookieStore.set({
                    name,
                    value: "",
                    ...options
                });
            }
        }
    });
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/verification`
        }
    });
    if (authError) {
        console.error("[v0] Auth signup error:", authError);
        return {
            success: false,
            error: authError.message
        };
    }
    if (!authData.user) {
        return {
            success: false,
            error: "Failed to create user account."
        };
    }
    const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: email,
        user_type: null,
        is_verified: false,
        verification_status: "pending",
        onboarding_completed: false
    });
    if (profileError) {
        console.error("[v0] Profile creation error:", profileError);
        return {
            success: false,
            error: "Account created but profile setup failed. Please contact support."
        };
    }
    console.log("[v0] User successfully created:", {
        email,
        userId: authData.user.id
    });
    return {
        success: true,
        userId: authData.user.id
    };
}
async function signIn(formData) {
    const email = (formData.get("email") || "").trim().toLowerCase();
    const password = formData.get("password") || "";
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
        cookies: {
            get: (name)=>cookieStore.get(name)?.value,
            set: (name, value, options)=>{
                cookieStore.set({
                    name,
                    value,
                    ...options
                });
            },
            remove: (name, options)=>{
                cookieStore.set({
                    name,
                    value: "",
                    ...options
                });
            }
        }
    });
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (authError) {
        console.error("[v0] Auth signin error:", authError);
        return {
            success: false,
            error: "Invalid email or password."
        };
    }
    if (!authData.user) {
        return {
            success: false,
            error: "Failed to sign in."
        };
    }
    const { data: profile, error: profileError } = await supabase.from("profiles").select("user_type, onboarding_completed, is_verified").eq("id", authData.user.id).single();
    if (profileError) {
        console.error("[v0] Profile fetch error:", profileError);
        return {
            success: false,
            error: "Failed to load user profile."
        };
    }
    console.log("[v0] User signed in:", {
        email,
        userId: authData.user.id,
        profile
    });
    return {
        success: true,
        userId: authData.user.id,
        needsVerification: !profile.user_type || !profile.is_verified,
        needsOnboarding: !profile.onboarding_completed,
        userType: profile.user_type
    };
}
async function signOut() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
        cookies: {
            get: (name)=>cookieStore.get(name)?.value,
            set: (name, value, options)=>{
                cookieStore.set({
                    name,
                    value,
                    ...options
                });
            },
            remove: (name, options)=>{
                cookieStore.set({
                    name,
                    value: "",
                    ...options
                });
            }
        }
    });
    await supabase.auth.signOut();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/");
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    signUp,
    signIn,
    signOut
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signUp, "40f842a65978d88bcb8157a7fe5f248ed47896b0c2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signIn, "40248c7ddbd1bb82cbe137fa0bfdbebbad8d088e46", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signOut, "00161da4c345cc4811d0c447824656ad878c18c42b", null);
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/waitlist.tsx [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/auth.tsx [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$waitlist$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/waitlist.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/auth.tsx [app-rsc] (ecmascript)");
;
;
;
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/waitlist.tsx [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/auth.tsx [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "40248c7ddbd1bb82cbe137fa0bfdbebbad8d088e46",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signIn"],
    "4090a0212f8e143f392f77a4c404ee5547c6bd6b19",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$waitlist$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["submitWaitlist"],
    "40f842a65978d88bcb8157a7fe5f248ed47896b0c2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signUp"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$waitlist$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$auth$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/waitlist.tsx [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/app/actions/auth.tsx [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$waitlist$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/waitlist.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/auth.tsx [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dd53371d._.js.map