(function () {
    const body = document.body;
    const form = document.getElementById("adminLoginForm");
    const emailInput = document.getElementById("adminEmail");
    const passwordInput = document.getElementById("adminPassword");
    const passwordToggle = document.getElementById("passwordToggle");
    const submitButton = document.getElementById("loginSubmitBtn");
    const hint = document.getElementById("loginHint");
    const toast = document.getElementById("loginToast");
    const backendStatusBadge = document.getElementById("backendStatusBadge");
    const ambientStatus = document.getElementById("loginAmbientStatus");
    const capsLockHint = document.getElementById("capsLockHint");

    const HINT_STATES = ["is-error", "is-success", "is-busy"];
    const BADGE_STATES = ["is-error", "is-ready", "is-busy"];

    const setHint = (message, state = "info") => {
        if (!hint) return;
        hint.textContent = message;
        hint.classList.remove(...HINT_STATES);
        if (state === "error") hint.classList.add("is-error");
        if (state === "success") hint.classList.add("is-success");
        if (state === "busy") hint.classList.add("is-busy");
    };

    const setBadgeState = (message, state = "busy") => {
        if (!backendStatusBadge) return;
        backendStatusBadge.textContent = message;
        backendStatusBadge.classList.remove(...BADGE_STATES);
        if (state) {
            backendStatusBadge.classList.add(`is-${state}`);
        }
    };

    const setAmbientStatus = (message, state = "ready") => {
        if (!ambientStatus) return;
        ambientStatus.textContent = message;
        ambientStatus.classList.remove(...BADGE_STATES);
        if (state) {
            ambientStatus.classList.add(`is-${state}`);
        }
    };

    const setSubmitState = (busy) => {
        if (!submitButton) return;
        submitButton.disabled = busy;
        submitButton.textContent = busy ? "Signing in..." : "Sign in to dashboard";
    };

    const setPasswordVisibility = (visible) => {
        if (!passwordInput || !passwordToggle) return;
        passwordInput.type = visible ? "text" : "password";
        passwordToggle.textContent = visible ? "Hide" : "Show";
        passwordToggle.setAttribute("aria-pressed", String(visible));
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
            setHint("This account is signed in, but it is not listed in portfolio_admins yet.", "error");
            setBadgeState("Access blocked", "error");
            setAmbientStatus("Signed in account is missing from portfolio_admins", "error");
            return true;
        }
        return false;
    };

    const redirectToNext = () => {
        window.location.replace(new URL(getNextUrl(), window.location.href).toString());
    };

    const bootstrap = async () => {
        setTheme();
        const hasAccessNotice = handleReasonNotice();
        setSubmitState(false);
        setPasswordVisibility(false);

        if (!window.PortfolioBackend?.isConfigured?.()) {
            setHint("Supabase is not configured yet. Add the backend keys before logging in.", "error");
            setBadgeState("Backend missing", "error");
            setAmbientStatus("Add backend keys before using admin access", "error");
            return;
        }

        if (!hasAccessNotice) {
            setBadgeState("Backend ready", "ready");
            setAmbientStatus("Secure login flow ready", "ready");
            setHint("Tip: this uses your live backend account, not a local-only password.", "info");
        }

        setBadgeState("Checking session", "busy");
        setAmbientStatus("Checking for an existing admin session", "busy");
        const sessionResult = await window.PortfolioBackend.getSession();
        if (sessionResult.session) {
            const adminResult = await window.PortfolioBackend.isAdminUser();
            if (adminResult.isAdmin) {
                redirectToNext();
                return;
            }
            await window.PortfolioBackend.signOut();
        }

        setBadgeState("Ready to sign in", "ready");
        setAmbientStatus("Enter your admin account to continue", "ready");
        emailInput?.focus();
    };

    passwordToggle?.addEventListener("click", () => {
        const nextVisible = passwordInput?.type === "password";
        setPasswordVisibility(nextVisible);
        passwordInput?.focus();
    });

    passwordInput?.addEventListener("keydown", (event) => {
        if (!capsLockHint) return;
        capsLockHint.hidden = !event.getModifierState("CapsLock");
    });

    passwordInput?.addEventListener("keyup", (event) => {
        if (!capsLockHint) return;
        capsLockHint.hidden = !event.getModifierState("CapsLock");
    });

    passwordInput?.addEventListener("blur", () => {
        if (!capsLockHint) return;
        capsLockHint.hidden = true;
    });

    emailInput?.addEventListener("focus", () => {
        setHint("Use the same email address that exists in Supabase Auth.", "info");
    });

    passwordInput?.addEventListener("focus", () => {
        setHint("Use your live admin password for this project.", "info");
    });

    form?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = String(emailInput?.value || "").trim();
        const password = String(passwordInput?.value || "");

        if (!email || !password) {
            setHint("Please enter email and password.", "error");
            setBadgeState("Missing fields", "error");
            return;
        }

        setSubmitState(true);
        setHint("Signing in...", "busy");
        setBadgeState("Verifying account", "busy");
        setAmbientStatus("Checking credentials and admin access", "busy");
        toast?.classList.remove("show");

        const signInResult = await window.PortfolioBackend.signIn(email, password);
        if (signInResult.error) {
            setSubmitState(false);
            setHint(signInResult.error.message || "Could not sign in.", "error");
            setBadgeState("Sign-in failed", "error");
            setAmbientStatus("Credentials were rejected by the backend", "error");
            toast?.classList.remove("show");
            passwordInput?.select?.();
            return;
        }

        const adminResult = await window.PortfolioBackend.isAdminUser();
        if (adminResult.error) {
            await window.PortfolioBackend.signOut();
            setSubmitState(false);
            setHint(adminResult.error.message || "Could not verify admin access.", "error");
            setBadgeState("Access check failed", "error");
            setAmbientStatus("Unable to verify admin access right now", "error");
            toast?.classList.remove("show");
            return;
        }

        if (!adminResult.isAdmin) {
            await window.PortfolioBackend.signOut();
            setSubmitState(false);
            setHint("Your account signed in, but it is not listed in portfolio_admins.", "error");
            setBadgeState("Not authorized", "error");
            setAmbientStatus("Signed in account is missing from portfolio_admins", "error");
            toast?.classList.remove("show");
            return;
        }

        setBadgeState("Access granted", "ready");
        setAmbientStatus("Admin verified. Opening dashboard...", "ready");
        toast?.classList.add("show");
        setHint("Login successful.", "success");
        window.setTimeout(redirectToNext, 650);
    });

    document.addEventListener("DOMContentLoaded", bootstrap);
})();
