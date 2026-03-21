(function () {
    const DEFAULT_CONTENT = {
        projects: [
            {
                id: "1",
                title: "Friday - Your Local Buddy",
                description: "Community-focused web platform for local support and discovery.",
                url: "https://chandra170905.github.io/Friday-your-Local-buddy/",
                image: "project-preview-friday.svg",
                status: "Live",
                highlights: ["Responsive UI", "Community-first journey", "Location-aware concept"],
                stack: ["HTML", "CSS", "JavaScript"]
            },
            {
                id: "2",
                title: "Swift Movers",
                description: "Service website for relocation and moving solutions.",
                url: "https://swift-movers.onrender.com",
                image: "project-preview-swift-movers.svg",
                status: "Live",
                highlights: ["Conversion-focused sections", "Trust-building layout", "Business-ready flow"],
                stack: ["HTML", "CSS", "JavaScript"]
            },
            {
                id: "3",
                title: "Memory Management Visualizer",
                description: "An educational web application that simulates operating system memory management",
                url: "https://memory-management-visualizer.vercel.app/?tab=sim",
                image: "project-preview-memory.svg",
                status: "Live",
                highlights: ["Interactive learning", "System concepts made visual", "Focused interface states"],
                stack: ["HTML", "CSS", "JavaScript"]
            },
            {
                id: "4",
                title: "Hexa Clothing",
                description: "Modern clothing storefront with focused product presentation.",
                url: "https://hexaclothing.onrender.com",
                image: "project-preview-hexa.svg",
                status: "Live",
                highlights: ["Brand-driven styling", "Product-first storytelling", "Retail-oriented visuals"],
                stack: ["HTML", "CSS", "JavaScript"]
            }
        ],
        skills: [
            {
                id: "1",
                key: "programming",
                category: "Programming Languages",
                tags: ["C", "C++", "Java", "Python", "JavaScript", "PHP", "SQL"]
            },
            {
                id: "2",
                key: "webdev",
                category: "Web Development",
                tags: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "Bootstrap", "Tailwind", "Django", "Laravel", "jQuery"]
            },
            {
                id: "3",
                key: "databases",
                category: "Databases",
                tags: ["MongoDB", "PostgreSQL"]
            },
            {
                id: "4",
                key: "tools",
                category: "Tools & Technologies",
                tags: ["Git", "GitHub", "VS Code", "DSA", "XAMPP", "Cisco Packet Tracer"]
            },
            {
                id: "5",
                key: "other",
                category: "Other Technologies",
                tags: ["Generative AI", "Cloud Computing", "Networking", "Hardware/OS", "Ubuntu", "UI/UX Design", "Photoshop", "Blender", "Unity"]
            }
        ],
        certificates: [
            {
                id: "1",
                title: "C Programming",
                category: "programming",
                description: "Core C programming concepts including syntax, control flow, functions, and foundational problem solving.",
                file: "certificates/C.png",
                storagePath: ""
            },
            {
                id: "2",
                title: "Responsive Web Designing",
                category: "webdev",
                description: "Responsive design skills for building adaptable layouts with HTML, CSS, and mobile-first thinking.",
                file: "certificates/RESPONSIVE%20WEB%20DESIGNING.png",
                storagePath: ""
            },
            {
                id: "3",
                title: "AI Essentials",
                category: "ai",
                description: "Foundational AI knowledge covering core concepts, use cases, and real-world applications of intelligent systems.",
                file: "certificates/AI%20ESSENTIALS.png",
                storagePath: ""
            }
        ],
        about: {
            title: "About Me",
            content: "Currently pursuing a B.Tech in Computer Science and Engineering at Lovely Professional University (LPU), where I continue to grow my skills in software development and technology.",
            subtitle: "I completed a 6-month Diploma in Full Stack Development where I gained practical experience building modern web applications.\n\nBefore that, I completed my schooling at Kendriya Vidyalaya No. 3, JRC, where my interest in computers and technology first began."
        },
        contact: {
            email: "chandra170905@gmail.com",
            phone: "",
            address: "",
            links: {
                github: "https://github.com/Chandra170905",
                linkedin: "https://www.linkedin.com/in/chandra-prakash-2960553a0/"
            }
        },
        site: {
            brand: "Chandra Prakash",
            hero: {
                headline: "Building clean, responsive, user-first web experiences.",
                intro: "I am Chandra, a",
                outro: "focused on modern UI, performance, and accessibility.",
                roles: ["Frontend Developer", "Full Stack Developer", "UI Builder", "Web Designer"]
            },
            stats: [
                { value: "15+", label: "UI Components" },
                { value: "8+", label: "Projects Built" },
                { value: "100%", label: "Responsive Design" }
            ]
        }
    };

    const clone = (value) => JSON.parse(JSON.stringify(value));
    const split = (value) => String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
    const splitDataList = (value) => String(value || "").split("|").map((item) => item.trim()).filter(Boolean);
    const esc = (value) => String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    const uid = () => `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    const safeName = (value) => String(value || "certificate").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "certificate";
    const normalizeCertificateCategory = (value) => safeName(value || "general");
    const getDefaultProjectImage = (project = {}) => {
        const fingerprint = `${project.title || ""} ${project.url || ""}`.toLowerCase();
        if (fingerprint.includes("friday")) return "project-preview-friday.svg";
        if (fingerprint.includes("swift")) return "project-preview-swift-movers.svg";
        if (fingerprint.includes("memory")) return "project-preview-memory.svg";
        if (fingerprint.includes("hexa")) return "project-preview-hexa.svg";
        return "";
    };

    const parseStaticPortfolioDocument = (doc) => ({
        projects: Array.from(doc.querySelectorAll("#projectGrid .project-card")).map((card, index) => ({
            id: String(index + 1),
            title: card.querySelector("h3")?.textContent?.trim() || `Project ${index + 1}`,
            description: card.querySelector("p")?.textContent?.trim() || "",
            url: card.querySelector("a[href]")?.getAttribute("href") || "",
            image: card.dataset.image || card.querySelector(".project-preview img")?.getAttribute("src") || "",
            status: card.dataset.status || "Live",
            highlights: splitDataList(card.dataset.highlights),
            stack: splitDataList(card.dataset.stack)
        })),
        skills: Array.from(doc.querySelectorAll("#skillsGrid .skill-category")).map((item, index) => ({
            id: String(index + 1),
            key: item.dataset.category || safeName(item.querySelector("h3")?.textContent || `skill-${index + 1}`),
            category: item.querySelector("h3")?.textContent?.trim() || `Skill Category ${index + 1}`,
            tags: Array.from(item.querySelectorAll(".skill-label")).map((tag) => tag.textContent.trim()).filter(Boolean)
        })),
        certificates: Array.from(doc.querySelectorAll("#certificateGrid .cert-card")).map((card, index) => ({
            id: String(index + 1),
            title: card.querySelector("h3")?.textContent?.trim() || `Certificate ${index + 1}`,
            category: normalizeCertificateCategory(card.dataset.category || "general"),
            description: card.querySelector(".cert-description")?.textContent?.trim() || "",
            file: card.querySelector("a[href]")?.getAttribute("href") || card.querySelector("img[src]")?.getAttribute("src") || "",
            storagePath: ""
        })),
        about: (() => {
            const block = doc.getElementById("aboutContentBlock");
            const paragraphs = Array.from(block?.querySelectorAll("p") || []);
            return {
                title: block?.querySelector("h2")?.textContent?.trim() || DEFAULT_CONTENT.about.title,
                content: paragraphs[0]?.textContent?.trim() || DEFAULT_CONTENT.about.content,
                subtitle: paragraphs.slice(1).map((item) => item.textContent.trim()).filter(Boolean).join("\n\n") || DEFAULT_CONTENT.about.subtitle
            };
        })(),
        contact: {
            email: doc.getElementById("contactEmailLink")?.textContent?.trim() || DEFAULT_CONTENT.contact.email,
            phone: "",
            address: "",
            links: {
                github: doc.getElementById("contactGithubLink")?.getAttribute("href") || DEFAULT_CONTENT.contact.links.github,
                linkedin: doc.getElementById("contactLinkedinLink")?.getAttribute("href") || DEFAULT_CONTENT.contact.links.linkedin
            }
        },
        site: {
            brand: doc.getElementById("brandName")?.textContent?.trim() || DEFAULT_CONTENT.site.brand,
            hero: {
                headline: doc.getElementById("heroHeadline")?.textContent?.trim() || DEFAULT_CONTENT.site.hero.headline,
                intro: doc.getElementById("heroIntro")?.textContent?.trim() || DEFAULT_CONTENT.site.hero.intro,
                outro: doc.getElementById("heroOutro")?.textContent?.trim() || DEFAULT_CONTENT.site.hero.outro,
                roles: clone(DEFAULT_CONTENT.site.hero.roles)
            },
            stats: Array.from(doc.querySelectorAll("#quickStats li")).map((item) => ({
                value: item.querySelector("strong")?.textContent?.trim() || "",
                label: item.querySelector("span")?.textContent?.trim() || ""
            })).filter((item) => item.value || item.label)
        }
    });

    const loadSeedContentFromStaticSite = async () => {
        try {
            const response = await fetch(new URL("index.html", window.location.href).toString(), {
                cache: "no-store"
            });
            if (!response.ok) {
                throw new Error(`Could not fetch index.html (${response.status}).`);
            }

            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, "text/html");
            const parsed = parseStaticPortfolioDocument(doc);

            return mergeContent({
                ...parsed,
                site: {
                    ...parsed.site,
                    stats: parsed.site.stats.length ? parsed.site.stats : clone(DEFAULT_CONTENT.site.stats)
                }
            });
        } catch (error) {
            console.warn("Could not seed admin content from static portfolio files.", error);
            return null;
        }
    };

    const mergeContent = (remoteContent) => {
        const remote = remoteContent && typeof remoteContent === "object" ? remoteContent : {};
        return {
            projects: Array.isArray(remote.projects)
                ? remote.projects.map((item) => ({
                    ...item,
                    image: String(item?.image || getDefaultProjectImage(item)).trim()
                }))
                : clone(DEFAULT_CONTENT.projects),
            skills: Array.isArray(remote.skills) ? remote.skills : clone(DEFAULT_CONTENT.skills),
            certificates: Array.isArray(remote.certificates) ? remote.certificates : clone(DEFAULT_CONTENT.certificates),
            about: remote.about && typeof remote.about === "object" ? remote.about : clone(DEFAULT_CONTENT.about),
            contact: remote.contact && typeof remote.contact === "object" ? remote.contact : clone(DEFAULT_CONTENT.contact),
            site: remote.site && typeof remote.site === "object" ? remote.site : clone(DEFAULT_CONTENT.site)
        };
    };

    const body = document.body;
    const messageContainer = document.getElementById("messageContainer");
    const projectAddForm = document.getElementById("projectAddForm");
    const skillAddForm = document.getElementById("skillAddForm");
    const certificateAddForm = document.getElementById("certificateAddForm");
    const siteForm = document.getElementById("siteForm");
    const projectEditId = document.getElementById("projectEditId");
    const projectTitle = document.getElementById("projectTitle");
    const projectDescription = document.getElementById("projectDescription");
    const projectUrl = document.getElementById("projectUrl");
    const projectImage = document.getElementById("projectImage");
    const projectStatus = document.getElementById("projectStatus");
    const projectStack = document.getElementById("projectStack");
    const projectHighlights = document.getElementById("projectHighlights");
    const skillEditId = document.getElementById("skillEditId");
    const skillKey = document.getElementById("skillKey");
    const skillCategory = document.getElementById("skillCategory");
    const skillTags = document.getElementById("skillTags");
    const certificateEditId = document.getElementById("certificateEditId");
    const certificateTitle = document.getElementById("certificateTitle");
    const certificateCategory = document.getElementById("certificateCategory");
    const certificateDescription = document.getElementById("certificateDescription");
    const certificateImage = document.getElementById("certificateImage");
    const certificateImageHint = document.getElementById("certificateImageHint");
    const siteBrand = document.getElementById("siteBrand");
    const siteHeroHeadline = document.getElementById("siteHeroHeadline");
    const siteHeroIntro = document.getElementById("siteHeroIntro");
    const siteHeroOutro = document.getElementById("siteHeroOutro");
    const siteHeroRoles = document.getElementById("siteHeroRoles");
    const statValue1 = document.getElementById("statValue1");
    const statLabel1 = document.getElementById("statLabel1");
    const statValue2 = document.getElementById("statValue2");
    const statLabel2 = document.getElementById("statLabel2");
    const statValue3 = document.getElementById("statValue3");
    const statLabel3 = document.getElementById("statLabel3");

    let currentContent = clone(DEFAULT_CONTENT);
    let lastSavedAt = null;

    const setThemeLabel = () => {
        const button = document.getElementById("themeToggle");
        if (!button) return;
        const isLight = body.classList.contains("light");
        button.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
        button.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");
        button.dataset.theme = isLight ? "light" : "dark";
    };

    const initializeTheme = () => {
        const button = document.getElementById("themeToggle");
        if (localStorage.getItem("portfolio-theme") === "light") {
            body.classList.add("light");
        }
        setThemeLabel();
        button?.addEventListener("click", () => {
            body.classList.toggle("light");
            localStorage.setItem("portfolio-theme", body.classList.contains("light") ? "light" : "dark");
            setThemeLabel();
        });
    };

    const setReady = () => {
        body.dataset.adminReady = "true";
    };

    const msg = (message, type = "success") => {
        if (!messageContainer) return;
        messageContainer.innerHTML = `<div class="${type}-message">${esc(message)}</div>`;
        window.setTimeout(() => {
            if (messageContainer.textContent?.trim() === message.trim()) {
                messageContainer.innerHTML = "";
            }
        }, 3200);
    };

    const updateMeta = () => {
        document.getElementById("countProjects").textContent = String(currentContent.projects.length);
        document.getElementById("countSkills").textContent = String(currentContent.skills.length);
        document.getElementById("countCertificates").textContent = String(currentContent.certificates.length);
        document.getElementById("lastSaved").textContent = lastSavedAt
            ? new Date(lastSavedAt).toLocaleString()
            : "Not published yet";
    };

    const renderList = (id, items, view) => {
        const target = document.getElementById(id);
        if (!target) return;
        target.innerHTML = items.map(view).join("") || `<div class="item-card"><div class="item-info"><h4>No items yet</h4><p>Add one and it will show on the live portfolio.</p></div></div>`;
    };

    const setFormMode = (type, editing) => {
        const config = {
            projects: { title: "projectFormTitle", submit: "projectSubmitBtn", cancel: "projectCancelEditBtn", add: "Add Project", edit: "Save Project" },
            skills: { title: "skillFormTitle", submit: "skillSubmitBtn", cancel: "skillCancelEditBtn", add: "Add Skill Category", edit: "Save Skill Category" },
            certificates: { title: "certificateFormTitle", submit: "certificateSubmitBtn", cancel: "certificateCancelEditBtn", add: "Add Certificate", edit: "Save Certificate" }
        }[type];

        if (!config) return;
        document.getElementById(config.title).textContent = editing ? config.edit : config.add;
        document.getElementById(config.submit).textContent = editing ? config.edit : config.add;
        document.getElementById(config.cancel).hidden = !editing;
    };

    const resetProjectForm = () => {
        projectAddForm.reset();
        projectEditId.value = "";
        projectStatus.value = "Live";
        setFormMode("projects", false);
    };

    const resetSkillForm = () => {
        skillAddForm.reset();
        skillEditId.value = "";
        setFormMode("skills", false);
    };

    const updateCertificateImageHint = (text) => {
        certificateImageHint.textContent = text || "No image selected";
    };

    const resetCertificateForm = () => {
        certificateAddForm.reset();
        certificateEditId.value = "";
        certificateImage.required = true;
        updateCertificateImageHint("No image selected");
        setFormMode("certificates", false);
    };

    const loadForms = () => {
        const site = currentContent.site || clone(DEFAULT_CONTENT.site);
        const stats = Array.isArray(site.stats) ? site.stats : clone(DEFAULT_CONTENT.site.stats);

        siteBrand.value = site.brand || "";
        siteHeroHeadline.value = site.hero?.headline || "";
        siteHeroIntro.value = site.hero?.intro || "";
        siteHeroOutro.value = site.hero?.outro || "";
        siteHeroRoles.value = (site.hero?.roles || []).join(", ");
        statValue1.value = stats[0]?.value || "";
        statLabel1.value = stats[0]?.label || "";
        statValue2.value = stats[1]?.value || "";
        statLabel2.value = stats[1]?.label || "";
        statValue3.value = stats[2]?.value || "";
        statLabel3.value = stats[2]?.label || "";
    };

    const renderAll = () => {
        renderList("projectsList", currentContent.projects, (item, index) => `
            <article class="item-card">
                <div class="item-info">
                    <span class="item-order">#${index + 1}</span>
                    <h4>${esc(item.title)}</h4>
                    <p>${esc(item.description)}</p>
                    <small>${esc(item.image || item.url)}</small>
                </div>
                <div class="item-actions">
                    <div class="order-actions">
                        <button class="btn btn-secondary btn-mini" type="button" onclick="moveItem('projects','${esc(item.id)}','up')" ${index === 0 ? "disabled" : ""} title="Move up" aria-label="Move project up">&#8593;</button>
                        <button class="btn btn-secondary btn-mini" type="button" onclick="moveItem('projects','${esc(item.id)}','down')" ${index === currentContent.projects.length - 1 ? "disabled" : ""} title="Move down" aria-label="Move project down">&#8595;</button>
                    </div>
                    <button class="btn btn-secondary btn-mini" type="button" onclick="editItem('projects','${esc(item.id)}')">Edit</button>
                    <button class="btn btn-danger btn-mini" type="button" onclick="deleteItem('projects','${esc(item.id)}')">Delete</button>
                </div>
            </article>
        `);

        renderList("skillsList", currentContent.skills, (item) => `
            <article class="item-card">
                <div class="item-info">
                    <h4>${esc(item.category)}</h4>
                    <p>${esc((item.tags || []).join(", "))}</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-secondary btn-mini" type="button" onclick="editItem('skills','${esc(item.id)}')">Edit</button>
                    <button class="btn btn-danger btn-mini" type="button" onclick="deleteItem('skills','${esc(item.id)}')">Delete</button>
                </div>
            </article>
        `);

        renderList("certificatesList", currentContent.certificates, (item, index) => `
            <article class="item-card">
                <div class="item-info">
                    <span class="item-order">#${index + 1}</span>
                    <h4>${esc(item.title)}</h4>
                    <p>${esc(item.description)}</p>
                    <small>${esc(normalizeCertificateCategory(item.category))} | ${item.storagePath ? "Supabase Storage" : "Static file"}</small>
                </div>
                <div class="item-actions">
                    <div class="order-actions">
                        <button class="btn btn-secondary btn-mini" type="button" onclick="moveItem('certificates','${esc(item.id)}','up')" ${index === 0 ? "disabled" : ""} title="Move up" aria-label="Move certificate up">&#8593;</button>
                        <button class="btn btn-secondary btn-mini" type="button" onclick="moveItem('certificates','${esc(item.id)}','down')" ${index === currentContent.certificates.length - 1 ? "disabled" : ""} title="Move down" aria-label="Move certificate down">&#8595;</button>
                    </div>
                    <button class="btn btn-secondary btn-mini" type="button" onclick="editItem('certificates','${esc(item.id)}')">Edit</button>
                    <button class="btn btn-danger btn-mini" type="button" onclick="deleteItem('certificates','${esc(item.id)}')">Delete</button>
                </div>
            </article>
        `);

        loadForms();
        updateMeta();
    };

    const syncContent = async (successMessage) => {
        const result = await window.PortfolioBackend.saveContent(currentContent);
        if (result.error) {
            msg(result.error.message || "Could not save to the backend.", "error");
            return false;
        }

        currentContent = mergeContent(result.data || currentContent);
        lastSavedAt = result.updatedAt || new Date().toISOString();
        renderAll();
        msg(successMessage, "success");
        return true;
    };

    const moveItem = async (type, id, direction) => {
        const list = Array.isArray(currentContent[type]) ? currentContent[type].slice() : [];
        const currentIndex = list.findIndex((item) => String(item.id) === String(id));
        if (currentIndex === -1) return;

        let targetIndex = currentIndex;
        if (direction === "top") targetIndex = 0;
        if (direction === "up") targetIndex = Math.max(0, currentIndex - 1);
        if (direction === "down") targetIndex = Math.min(list.length - 1, currentIndex + 1);
        if (targetIndex === currentIndex) return;

        const [moved] = list.splice(currentIndex, 1);
        list.splice(targetIndex, 0, moved);
        currentContent[type] = list;

        const label = type === "projects" ? "Project order" : "Certificate order";
        await syncContent(`${label} updated on the live portfolio.`);
    };

    const deleteItem = async (type, id) => {
        const list = currentContent[type] || [];
        const target = list.find((item) => String(item.id) === String(id));

        if (type === "certificates" && target?.storagePath) {
            await window.PortfolioBackend.removeMedia(target.storagePath);
        }

        currentContent[type] = list.filter((item) => String(item.id) !== String(id));
        await syncContent("Item removed from the live portfolio.");
    };

    const editItem = (type, id) => {
        const item = (currentContent[type] || []).find((entry) => String(entry.id) === String(id));
        if (!item) return;

        if (type === "projects") {
            projectEditId.value = item.id || "";
            projectTitle.value = item.title || "";
            projectDescription.value = item.description || "";
            projectUrl.value = item.url || "";
            projectImage.value = item.image || "";
            projectStatus.value = item.status || "Live";
            projectStack.value = (item.stack || []).join(", ");
            projectHighlights.value = (item.highlights || []).join(", ");
            setFormMode("projects", true);
            document.querySelector('[data-section="projects"]')?.click();
            projectTitle.focus();
        }

        if (type === "skills") {
            skillEditId.value = item.id || "";
            skillKey.value = item.key || "";
            skillCategory.value = item.category || "";
            skillTags.value = (item.tags || []).join(", ");
            setFormMode("skills", true);
            document.querySelector('[data-section="skills"]')?.click();
            skillCategory.focus();
        }

        if (type === "certificates") {
            certificateEditId.value = item.id || "";
            certificateTitle.value = item.title || "";
            certificateCategory.value = item.category || "";
            certificateDescription.value = item.description || "";
            certificateImage.value = "";
            certificateImage.required = false;
            updateCertificateImageHint(item.storagePath || item.file ? "Current image kept unless you choose a new one" : "No image selected");
            setFormMode("certificates", true);
            document.querySelector('[data-section="certificates"]')?.click();
            certificateTitle.focus();
        }
    };

    window.deleteItem = deleteItem;
    window.editItem = editItem;
    window.moveItem = moveItem;

    const redirectToLogin = (reason = "") => {
        const url = new URL("login.html", window.location.href);
        url.searchParams.set("next", "admin.html");
        if (reason) url.searchParams.set("reason", reason);
        window.location.replace(url.toString());
    };

    document.addEventListener("DOMContentLoaded", async () => {
        initializeTheme();

        if (!window.PortfolioBackend?.isConfigured?.()) {
            setReady();
            msg("Backend is not configured yet. Add your Supabase URL and anon key in the portfolio meta tags first.", "error");
            return;
        }

        const sessionResult = await window.PortfolioBackend.getSession();
        if (!sessionResult.session) {
            redirectToLogin();
            return;
        }

        const adminResult = await window.PortfolioBackend.isAdminUser();
        if (adminResult.error) {
            setReady();
            msg(adminResult.error.message || "Could not verify admin access.", "error");
            return;
        }

        if (!adminResult.isAdmin) {
            await window.PortfolioBackend.signOut();
            redirectToLogin("forbidden");
            return;
        }

        document.querySelectorAll(".admin-nav-btn").forEach((button) => {
            button.addEventListener("click", () => {
                const section = button.dataset.section;
                document.querySelectorAll(".admin-nav-btn").forEach((node) => node.classList.remove("active"));
                button.classList.add("active");
                document.querySelectorAll(".admin-section").forEach((sectionNode) => {
                    sectionNode.classList.toggle("active", sectionNode.id === `${section}-section`);
                });
            });
        });

        document.getElementById("logoutAdminBtn")?.addEventListener("click", async (event) => {
            event.preventDefault();
            await window.PortfolioBackend.signOut();
            redirectToLogin();
        });

        document.getElementById("openPreviewBtn")?.addEventListener("click", () => {
            window.open("index.html", "_blank", "noopener,noreferrer");
        });

        certificateImage?.addEventListener("change", () => {
            const file = certificateImage.files?.[0];
            if (file) {
                certificateImage.required = false;
                updateCertificateImageHint(file.name);
            } else {
                updateCertificateImageHint(certificateEditId.value ? "Current image kept unless you choose a new one" : "No image selected");
            }
        });

        document.getElementById("projectCancelEditBtn")?.addEventListener("click", resetProjectForm);
        document.getElementById("skillCancelEditBtn")?.addEventListener("click", resetSkillForm);
        document.getElementById("certificateCancelEditBtn")?.addEventListener("click", resetCertificateForm);

        const remoteResult = await window.PortfolioBackend.fetchContent();
        if (remoteResult.error) {
            setReady();
            msg(remoteResult.error.message || "Could not load live portfolio content.", "error");
            return;
        }

        const seededContent = remoteResult.data ? null : await loadSeedContentFromStaticSite();
        currentContent = mergeContent(remoteResult.data || seededContent || DEFAULT_CONTENT);
        lastSavedAt = remoteResult.updatedAt || null;
        renderAll();
        resetProjectForm();
        resetSkillForm();
        resetCertificateForm();
        setReady();

        if (!remoteResult.data) {
            msg(
                seededContent
                    ? "Backend is empty. The admin loaded your current static portfolio as the starting content."
                    : "Backend is empty. Your first save will publish the starter portfolio content.",
                "success"
            );
        }

        projectAddForm?.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(projectAddForm);
            const editId = String(formData.get("editId") || "").trim();
            const next = {
                id: editId || uid(),
                title: String(formData.get("title") || "").trim(),
                description: String(formData.get("description") || "").trim(),
                url: String(formData.get("url") || "").trim(),
                image: String(formData.get("image") || "").trim(),
                status: String(formData.get("status") || "").trim() || "Live",
                stack: split(formData.get("stack")),
                highlights: split(formData.get("highlights"))
            };

            currentContent.projects = editId
                ? currentContent.projects.map((item) => String(item.id) === editId ? next : item)
                : currentContent.projects.concat(next);

            if (await syncContent(editId ? "Project updated on the live portfolio." : "Project added to the live portfolio.")) {
                resetProjectForm();
            }
        });

        skillAddForm?.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(skillAddForm);
            const editId = String(formData.get("editId") || "").trim();
            const next = {
                id: editId || uid(),
                key: String(formData.get("key") || "").trim(),
                category: String(formData.get("category") || "").trim(),
                tags: split(formData.get("tags"))
            };

            currentContent.skills = editId
                ? currentContent.skills.map((item) => String(item.id) === editId ? next : item)
                : currentContent.skills.concat(next);

            if (await syncContent(editId ? "Skill category updated on the live portfolio." : "Skill category added to the live portfolio.")) {
                resetSkillForm();
            }
        });

        certificateAddForm?.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(certificateAddForm);
            const editId = String(formData.get("editId") || "").trim();
            const existing = currentContent.certificates.find((item) => String(item.id) === editId);
            const imageFile = certificateImage.files?.[0];
            let fileUrl = existing?.file || "";
            let storagePath = existing?.storagePath || "";
            let fileName = existing?.fileName || "";

            if (imageFile) {
                const uploadResult = await window.PortfolioBackend.uploadMedia(imageFile, {
                    folder: "certificates",
                    fileName: imageFile.name || `${safeName(formData.get("title"))}.png`
                });

                if (uploadResult.error) {
                    msg(uploadResult.error.message || "Could not upload the certificate image.", "error");
                    return;
                }

                if (existing?.storagePath) {
                    await window.PortfolioBackend.removeMedia(existing.storagePath);
                }

                fileUrl = uploadResult.data.publicUrl;
                storagePath = uploadResult.data.path;
                fileName = imageFile.name || `${safeName(formData.get("title"))}.png`;
            }

            if (!fileUrl) {
                msg("Please choose a certificate image.", "error");
                return;
            }

            const next = {
                id: editId || uid(),
                title: String(formData.get("title") || "").trim(),
                category: normalizeCertificateCategory(formData.get("category")),
                description: String(formData.get("description") || "").trim(),
                file: fileUrl,
                storagePath,
                fileName
            };

            currentContent.certificates = editId
                ? currentContent.certificates.map((item) => String(item.id) === editId ? next : item)
                : currentContent.certificates.concat(next);

            if (await syncContent(editId ? "Certificate updated on the live portfolio." : "Certificate added to the live portfolio.")) {
                resetCertificateForm();
            }
        });

        siteForm?.addEventListener("submit", async (event) => {
            event.preventDefault();

            currentContent.site = {
                brand: siteBrand.value.trim(),
                hero: {
                    headline: siteHeroHeadline.value.trim(),
                    intro: siteHeroIntro.value.trim(),
                    outro: siteHeroOutro.value.trim(),
                    roles: split(siteHeroRoles.value)
                },
                stats: [
                    { value: statValue1.value.trim(), label: statLabel1.value.trim() },
                    { value: statValue2.value.trim(), label: statLabel2.value.trim() },
                    { value: statValue3.value.trim(), label: statLabel3.value.trim() }
                ]
            };

            await syncContent("Site content updated on the live portfolio.");
        });
    });
})();
