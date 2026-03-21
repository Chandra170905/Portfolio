(function () {
    const body = document.body;
    const form = document.getElementById("adminLoginForm");
    const emailInput = document.getElementById("adminEmail");
    const passwordInput = document.getElementById("adminPassword");
    const hint = document.getElementById("loginHint");
    const toast = document.getElementById("loginToast");
    const stateChip = document.getElementById("loginStateChip");

    const setStateChip = (message, tone = "success") => {
        if (!stateChip) return;
        stateChip.textContent = message;
        stateChip.classList.remove("is-success", "is-error", "is-busy");
        if (tone) {
            stateChip.classList.add(`is-${tone}`);
        }
    };

    const setHint = (message, isError = false) => {
        if (!hint) return;
        hint.textContent = message;
        hint.style.color = isError ? "#ff7a7a" : "";
    };

    const setTheme = () => {
        if (localStorage.getItem("portfolio-theme") === "light") {
            body.classList.add("light");
        }
    };

    const getNextUrl = () => {
        const url = new URL(window.location.href);
        const requested = url.searchParams.get("next") || "admin.html";

        try {
            const resolved = new URL(requested, window.location.href);
            if (resolved.origin !== window.location.origin) {
                return "admin.html";
            }
            return `${resolved.pathname}${resolved.search}${resolved.hash}`;
        } catch {
            return "admin.html";
        }
    };

    const handleReasonNotice = () => {
        const url = new URL(window.location.href);
        const reason = url.searchParams.get("reason");
        if (reason === "forbidden") {
            setHint("This account is signed in, but it is not listed in portfolio_admins yet.", true);
            setStateChip("Blocked", "error");
        }
    };

    const redirectToNext = () => {
        window.location.replace(new URL(getNextUrl(), window.location.href).toString());
    };

    const bootstrap = async () => {
        setTheme();
        handleReasonNotice();

        if (!window.PortfolioBackend?.isConfigured?.()) {
            setHint("Supabase is not configured yet. Add the backend keys before logging in.", true);
            setStateChip("Offline", "error");
            return;
        }

        setStateChip("Checking", "busy");
        const sessionResult = await window.PortfolioBackend.getSession();
        if (sessionResult.session) {
            const adminResult = await window.PortfolioBackend.isAdminUser();
            if (adminResult.isAdmin) {
                redirectToNext();
                return;
            }
            await window.PortfolioBackend.signOut();
        }

        setStateChip("Ready", "success");
        emailInput?.focus();
    };

    form?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = String(emailInput?.value || "").trim();
        const password = String(passwordInput?.value || "");

        if (!email || !password) {
            setHint("Please enter email and password.", true);
            setStateChip("Input", "error");
            return;
        }

        setHint("Signing in...", false);
        setStateChip("Authing", "busy");

        const signInResult = await window.PortfolioBackend.signIn(email, password);
        if (signInResult.error) {
            setHint(signInResult.error.message || "Could not sign in.", true);
            setStateChip("Denied", "error");
            toast?.classList.remove("show");
            passwordInput?.select?.();
            return;
        }

        const adminResult = await window.PortfolioBackend.isAdminUser();
        if (adminResult.error) {
            await window.PortfolioBackend.signOut();
            setHint(adminResult.error.message || "Could not verify admin access.", true);
            setStateChip("Error", "error");
            toast?.classList.remove("show");
            return;
        }

        if (!adminResult.isAdmin) {
            await window.PortfolioBackend.signOut();
            setHint("Your account signed in, but it is not listed in portfolio_admins.", true);
            setStateChip("Blocked", "error");
            toast?.classList.remove("show");
            return;
        }

        toast?.classList.add("show");
        setHint("Login successful.", false);
        setStateChip("Granted", "success");
        window.setTimeout(redirectToNext, 650);
    });

    document.addEventListener("DOMContentLoaded", bootstrap);
})();
