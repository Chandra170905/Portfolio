(function () {
    if (!document.body) return;
    if (document.body.querySelector(".retro-sprite-field, .login-sprite-field")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "retro-sprite-field";
    wrapper.setAttribute("aria-hidden", "true");
    wrapper.innerHTML = `
        <div class="retro-sprite sprite-left">
            <div class="retro-sprite-frame frame-1">
                <svg viewBox="0 0 16 16" focusable="false">
                    <g fill="currentColor">
                        <rect x="5" y="2" width="2" height="1"></rect>
                        <rect x="9" y="2" width="2" height="1"></rect>
                        <rect x="4" y="3" width="4" height="1"></rect>
                        <rect x="8" y="3" width="4" height="1"></rect>
                        <rect x="3" y="4" width="10" height="1"></rect>
                        <rect x="2" y="5" width="3" height="1"></rect>
                        <rect x="6" y="5" width="1" height="1"></rect>
                        <rect x="9" y="5" width="1" height="1"></rect>
                        <rect x="11" y="5" width="3" height="1"></rect>
                        <rect x="2" y="6" width="12" height="1"></rect>
                        <rect x="3" y="7" width="2" height="1"></rect>
                        <rect x="6" y="7" width="4" height="1"></rect>
                        <rect x="11" y="7" width="2" height="1"></rect>
                        <rect x="2" y="8" width="2" height="1"></rect>
                        <rect x="5" y="8" width="1" height="1"></rect>
                        <rect x="10" y="8" width="1" height="1"></rect>
                        <rect x="12" y="8" width="2" height="1"></rect>
                        <rect x="4" y="9" width="1" height="1"></rect>
                        <rect x="7" y="9" width="2" height="1"></rect>
                        <rect x="11" y="9" width="1" height="1"></rect>
                    </g>
                </svg>
            </div>
            <div class="retro-sprite-frame frame-2">
                <svg viewBox="0 0 16 16" focusable="false">
                    <g fill="currentColor">
                        <rect x="6" y="2" width="4" height="1"></rect>
                        <rect x="5" y="3" width="6" height="1"></rect>
                        <rect x="4" y="4" width="8" height="1"></rect>
                        <rect x="3" y="5" width="10" height="1"></rect>
                        <rect x="3" y="6" width="2" height="1"></rect>
                        <rect x="6" y="6" width="1" height="1"></rect>
                        <rect x="9" y="6" width="1" height="1"></rect>
                        <rect x="11" y="6" width="2" height="1"></rect>
                        <rect x="3" y="7" width="10" height="1"></rect>
                        <rect x="3" y="8" width="10" height="1"></rect>
                        <rect x="3" y="9" width="2" height="1"></rect>
                        <rect x="6" y="9" width="2" height="1"></rect>
                        <rect x="10" y="9" width="2" height="1"></rect>
                        <rect x="3" y="10" width="1" height="1"></rect>
                        <rect x="5" y="10" width="2" height="1"></rect>
                        <rect x="8" y="10" width="2" height="1"></rect>
                        <rect x="11" y="10" width="1" height="1"></rect>
                    </g>
                </svg>
            </div>
            <div class="retro-sprite-frame frame-3">
                <svg viewBox="0 0 16 16" focusable="false">
                    <g fill="currentColor">
                        <rect x="5" y="3" width="2" height="1"></rect>
                        <rect x="9" y="3" width="2" height="1"></rect>
                        <rect x="4" y="4" width="4" height="1"></rect>
                        <rect x="8" y="4" width="4" height="1"></rect>
                        <rect x="3" y="5" width="10" height="1"></rect>
                        <rect x="3" y="6" width="10" height="1"></rect>
                        <rect x="4" y="7" width="8" height="1"></rect>
                        <rect x="5" y="8" width="6" height="1"></rect>
                        <rect x="6" y="9" width="4" height="1"></rect>
                        <rect x="7" y="10" width="2" height="1"></rect>
                    </g>
                </svg>
            </div>
        </div>

        <div class="retro-sprite sprite-right">
            <div class="retro-sprite-frame frame-1">
                <svg viewBox="0 0 16 16" focusable="false">
                    <g fill="currentColor">
                        <rect x="7" y="2" width="2" height="1"></rect>
                        <rect x="6" y="3" width="4" height="1"></rect>
                        <rect x="6" y="4" width="4" height="1"></rect>
                        <rect x="5" y="5" width="6" height="1"></rect>
                        <rect x="5" y="6" width="6" height="1"></rect>
                        <rect x="4" y="7" width="8" height="1"></rect>
                        <rect x="4" y="8" width="2" height="1"></rect>
                        <rect x="7" y="8" width="2" height="1"></rect>
                        <rect x="10" y="8" width="2" height="1"></rect>
                        <rect x="5" y="9" width="2" height="1"></rect>
                        <rect x="9" y="9" width="2" height="1"></rect>
                        <rect x="6" y="10" width="1" height="1"></rect>
                        <rect x="9" y="10" width="1" height="1"></rect>
                    </g>
                </svg>
            </div>
            <div class="retro-sprite-frame frame-2">
                <svg viewBox="0 0 16 16" focusable="false">
                    <g fill="currentColor">
                        <rect x="7" y="2" width="2" height="1"></rect>
                        <rect x="6" y="3" width="4" height="1"></rect>
                        <rect x="5" y="4" width="6" height="1"></rect>
                        <rect x="4" y="5" width="8" height="1"></rect>
                        <rect x="5" y="6" width="6" height="1"></rect>
                        <rect x="6" y="7" width="4" height="1"></rect>
                        <rect x="7" y="8" width="2" height="1"></rect>
                        <rect x="6" y="9" width="1" height="1"></rect>
                        <rect x="9" y="9" width="1" height="1"></rect>
                        <rect x="7" y="10" width="2" height="1"></rect>
                    </g>
                </svg>
            </div>
            <div class="retro-sprite-frame frame-3">
                <svg viewBox="0 0 16 16" focusable="false">
                    <g fill="currentColor">
                        <rect x="7" y="2" width="2" height="1"></rect>
                        <rect x="7" y="3" width="2" height="1"></rect>
                        <rect x="4" y="4" width="2" height="1"></rect>
                        <rect x="7" y="4" width="2" height="1"></rect>
                        <rect x="10" y="4" width="2" height="1"></rect>
                        <rect x="5" y="5" width="6" height="1"></rect>
                        <rect x="3" y="6" width="10" height="1"></rect>
                        <rect x="5" y="7" width="6" height="1"></rect>
                        <rect x="4" y="8" width="2" height="1"></rect>
                        <rect x="7" y="8" width="2" height="1"></rect>
                        <rect x="10" y="8" width="2" height="1"></rect>
                        <rect x="7" y="9" width="2" height="1"></rect>
                    </g>
                </svg>
            </div>
        </div>

        <div class="retro-sprite sprite-bottom">
            <div class="retro-sprite-frame frame-1">
                <svg viewBox="0 0 16 16" focusable="false">
                    <g fill="currentColor">
                        <rect x="4" y="5" width="8" height="1"></rect>
                        <rect x="3" y="6" width="10" height="1"></rect>
                        <rect x="2" y="7" width="12" height="1"></rect>
                        <rect x="2" y="8" width="4" height="1"></rect>
                        <rect x="7" y="8" width="2" height="1"></rect>
                        <rect x="10" y="8" width="4" height="1"></rect>
                        <rect x="3" y="9" width="2" height="1"></rect>
                        <rect x="6" y="9" width="4" height="1"></rect>
                        <rect x="11" y="9" width="2" height="1"></rect>
                        <rect x="5" y="10" width="2" height="1"></rect>
                        <rect x="9" y="10" width="2" height="1"></rect>
                    </g>
                </svg>
            </div>
            <div class="retro-sprite-frame frame-2">
                <svg viewBox="0 0 16 16" focusable="false">
                    <g fill="currentColor">
                        <rect x="6" y="2" width="4" height="1"></rect>
                        <rect x="5" y="3" width="6" height="1"></rect>
                        <rect x="6" y="4" width="4" height="1"></rect>
                        <rect x="7" y="5" width="2" height="1"></rect>
                        <rect x="5" y="6" width="6" height="1"></rect>
                        <rect x="4" y="7" width="8" height="1"></rect>
                        <rect x="4" y="8" width="8" height="1"></rect>
                        <rect x="5" y="9" width="6" height="1"></rect>
                        <rect x="6" y="10" width="4" height="1"></rect>
                    </g>
                </svg>
            </div>
            <div class="retro-sprite-frame frame-3">
                <svg viewBox="0 0 16 16" focusable="false">
                    <g fill="currentColor">
                        <rect x="5" y="3" width="6" height="1"></rect>
                        <rect x="4" y="4" width="8" height="1"></rect>
                        <rect x="3" y="5" width="10" height="1"></rect>
                        <rect x="3" y="6" width="10" height="1"></rect>
                        <rect x="5" y="7" width="2" height="1"></rect>
                        <rect x="9" y="7" width="2" height="1"></rect>
                        <rect x="6" y="8" width="4" height="1"></rect>
                        <rect x="6" y="9" width="4" height="1"></rect>
                        <rect x="5" y="10" width="6" height="1"></rect>
                    </g>
                </svg>
            </div>
        </div>
    `;

    const anchor = document.body.querySelector(".bg-3d");
    if (anchor) {
        anchor.insertAdjacentElement("afterend", wrapper);
    } else {
        document.body.insertAdjacentElement("afterbegin", wrapper);
    }
})();
