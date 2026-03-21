(function () {
    const readMeta = (name, fallback = "") => {
        const node = document.querySelector(`meta[name="${name}"]`);
        return node?.getAttribute("content")?.trim() || fallback;
    };

    const slugify = (value, fallback = "item") => {
        const slug = String(value || "")
            .toLowerCase()
            .replace(/&/g, " and ")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        return slug || fallback;
    };

    const getConfig = () => ({
        url: readMeta("portfolio-supabase-url"),
        anonKey: readMeta("portfolio-supabase-anon-key"),
        contentTable: readMeta("portfolio-content-table", "portfolio_content"),
        adminTable: readMeta("portfolio-admin-table", "portfolio_admins"),
        bucket: readMeta("portfolio-media-bucket", "portfolio-media"),
        contentId: readMeta("portfolio-content-id", "site")
    });

    const hasClientSdk = () => Boolean(
        window.supabase
        && typeof window.supabase.createClient === "function"
    );

    const isConfigured = () => {
        const config = getConfig();
        return Boolean(config.url && config.anonKey);
    };

    let cachedClient = null;
    const getClient = () => {
        if (!isConfigured() || !hasClientSdk()) return null;
        if (cachedClient) return cachedClient;

        const config = getConfig();
        cachedClient = window.supabase.createClient(config.url, config.anonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        });

        return cachedClient;
    };

    const normalizeBundle = (bundle) => {
        const source = bundle && typeof bundle === "object" ? bundle : {};
        return {
            projects: Array.isArray(source.projects) ? source.projects : [],
            skills: Array.isArray(source.skills) ? source.skills : [],
            certificates: Array.isArray(source.certificates) ? source.certificates : [],
            site: source.site && typeof source.site === "object" ? source.site : {},
            about: source.about && typeof source.about === "object" ? source.about : undefined,
            contact: source.contact && typeof source.contact === "object" ? source.contact : undefined
        };
    };

    const fetchContentViaRest = async () => {
        const config = getConfig();
        if (!config.url || !config.anonKey) {
            return { data: null, updatedAt: null, error: new Error("Supabase is not configured.") };
        }

        const endpoint = new URL(`/rest/v1/${encodeURIComponent(config.contentTable)}`, config.url);
        endpoint.searchParams.set("select", "id,content,updated_at");
        endpoint.searchParams.set("id", `eq.${config.contentId}`);
        endpoint.searchParams.set("limit", "1");

        try {
            const response = await fetch(endpoint.toString(), {
                method: "GET",
                headers: {
                    apikey: config.anonKey,
                    authorization: `Bearer ${config.anonKey}`,
                    accept: "application/json"
                }
            });

            if (!response.ok) {
                const message = await response.text().catch(() => "");
                return {
                    data: null,
                    updatedAt: null,
                    error: new Error(message || `Portfolio content request failed with status ${response.status}.`)
                };
            }

            const payload = await response.json();
            const row = Array.isArray(payload) ? payload[0] : null;
            return {
                data: row?.content ? normalizeBundle(row.content) : null,
                updatedAt: row?.updated_at || null,
                error: null
            };
        } catch (error) {
            return { data: null, updatedAt: null, error };
        }
    };

    const getCurrentUser = async () => {
        const client = getClient();
        if (!client) return { user: null, error: new Error("Supabase is not configured.") };

        const { data, error } = await client.auth.getUser();
        return { user: data?.user || null, error: error || null };
    };

    const getSession = async () => {
        const client = getClient();
        if (!client) return { session: null, error: new Error("Supabase is not configured.") };

        const { data, error } = await client.auth.getSession();
        return { session: data?.session || null, error: error || null };
    };

    const signIn = async (email, password) => {
        const client = getClient();
        if (!client) return { data: null, error: new Error("Supabase is not configured.") };
        return client.auth.signInWithPassword({
            email: String(email || "").trim().toLowerCase(),
            password
        });
    };

    const signOut = async () => {
        const client = getClient();
        if (!client) return { error: null };
        return client.auth.signOut();
    };

    const onAuthStateChange = (callback) => {
        const client = getClient();
        if (!client) {
            return { data: { subscription: { unsubscribe() {} } } };
        }
        return client.auth.onAuthStateChange(callback);
    };

    const isAdminUser = async () => {
        const client = getClient();
        if (!client) return { isAdmin: false, error: new Error("Supabase is not configured.") };

        const { user, error: userError } = await getCurrentUser();
        if (userError) return { isAdmin: false, error: userError };
        if (!user?.email) return { isAdmin: false, error: null };
        const email = String(user.email || "").trim().toLowerCase();
        if (!email) return { isAdmin: false, error: null };

        const config = getConfig();
        const { data, error } = await client
            .from(config.adminTable)
            .select("email")
            .ilike("email", email)
            .limit(1);

        if (error) return { isAdmin: false, error };
        return { isAdmin: Array.isArray(data) && data.length > 0, error: null };
    };

    const fetchContent = async () => {
        const client = getClient();
        if (!client) {
            return fetchContentViaRest();
        }

        const config = getConfig();
        const { data, error } = await client
            .from(config.contentTable)
            .select("id, content, updated_at")
            .eq("id", config.contentId)
            .limit(1);

        if (error) return { data: null, error };

        const row = Array.isArray(data) ? data[0] : null;
        return {
            data: row?.content ? normalizeBundle(row.content) : null,
            updatedAt: row?.updated_at || null,
            error: null
        };
    };

    const saveContent = async (content) => {
        const client = getClient();
        if (!client) return { data: null, error: new Error("Supabase is not configured.") };

        const { user, error: userError } = await getCurrentUser();
        if (userError) return { data: null, error: userError };
        if (!user) return { data: null, error: new Error("Please sign in before saving.") };

        const config = getConfig();
        const payload = {
            id: config.contentId,
            content: normalizeBundle(content),
            updated_at: new Date().toISOString(),
            updated_by: user.email || null
        };

        const { data, error } = await client
            .from(config.contentTable)
            .upsert(payload, { onConflict: "id" })
            .select("id, content, updated_at")
            .limit(1);

        if (error) return { data: null, error };

        const row = Array.isArray(data) ? data[0] : null;
        return {
            data: row?.content ? normalizeBundle(row.content) : normalizeBundle(payload.content),
            updatedAt: row?.updated_at || payload.updated_at,
            error: null
        };
    };

    const uploadMedia = async (file, options = {}) => {
        const client = getClient();
        if (!client) return { data: null, error: new Error("Supabase is not configured.") };
        if (!(file instanceof File)) return { data: null, error: new Error("Please choose a file to upload.") };

        const config = getConfig();
        const rawName = options.fileName || file.name || "file";
        const parts = rawName.split(".");
        const extension = parts.length > 1 ? parts.pop().toLowerCase() : "";
        const baseName = parts.join(".") || rawName;
        const folder = options.folder || "certificates";
        const filePath = options.path || `${folder}/${Date.now()}-${slugify(baseName)}${extension ? `.${extension}` : ""}`;

        const { data, error } = await client.storage
            .from(config.bucket)
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
                contentType: file.type || undefined
            });

        if (error) return { data: null, error };

        const publicResult = client.storage.from(config.bucket).getPublicUrl(filePath);

        return {
            data: {
                path: data?.path || filePath,
                publicUrl: publicResult?.data?.publicUrl || ""
            },
            error: null
        };
    };

    const removeMedia = async (filePath) => {
        const client = getClient();
        if (!client || !filePath) return { error: null };

        const config = getConfig();
        const { error } = await client.storage.from(config.bucket).remove([filePath]);
        return { error: error || null };
    };

    window.PortfolioBackend = {
        getConfig,
        getClient,
        isConfigured,
        getCurrentUser,
        getSession,
        signIn,
        signOut,
        onAuthStateChange,
        isAdminUser,
        fetchContent,
        saveContent,
        uploadMedia,
        removeMedia,
        normalizeBundle
    };
})();
