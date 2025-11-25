// Set current year in footer
document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    initSmoothScrolling();
    initProjectBanner();
});

/**
 * Smooth scroll for same-page links that start with "#"
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href").slice(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
}

/**
 * Rotating project banner on the main page
 */
function initProjectBanner() {
    const banner = document.getElementById("project-banner");
    if (!banner) return;

    const slides = Array.from(banner.querySelectorAll(".banner-slide"));
    const prevBtn = banner.querySelector(".banner-control-prev");
    const nextBtn = banner.querySelector(".banner-control-next");
    const dotsContainer = document.getElementById("banner-dots");

    if (slides.length === 0 || !prevBtn || !nextBtn || !dotsContainer) return;

    let currentIndex = 0;
    let autoRotateInterval = null;
    const ROTATE_MS = 6000;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.classList.add("banner-dot");
        if (index === 0) dot.classList.add("active");
        dot.dataset.index = index.toString();
        dot.addEventListener("click", () => {
            goToSlide(index);
            resetAutoRotate();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll(".banner-dot"));

    function goToSlide(index) {
        slides[currentIndex].classList.remove("active");
        dots[currentIndex].classList.remove("active");

        currentIndex = (index + slides.length) % slides.length;

        slides[currentIndex].classList.add("active");
        dots[currentIndex].classList.add("active");
    }

    function goNext() {
        goToSlide(currentIndex + 1);
    }

    function goPrev() {
        goToSlide(currentIndex - 1);
    }

    prevBtn.addEventListener("click", () => {
        goPrev();
        resetAutoRotate();
    });

    nextBtn.addEventListener("click", () => {
        goNext();
        resetAutoRotate();
    });

    function startAutoRotate() {
        autoRotateInterval = setInterval(goNext, ROTATE_MS);
    }

    function resetAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
        }
        startAutoRotate();
    }

    startAutoRotate();
}
