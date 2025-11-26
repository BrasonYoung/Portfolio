// Set current year in footer
document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    initSmoothScrolling();
    initProjectBanner();
    initProjectGalleryLightbox();
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

/**
 * Lightbox for project detail galleries
 */
function initProjectGalleryLightbox() {
    const galleryImages = document.querySelectorAll(".project-gallery img");
    if (galleryImages.length === 0) return;

    let lightbox = document.getElementById("image-lightbox");
    let lightboxImage;
    let lightboxCaption;

    const ensureLightbox = () => {
        if (lightbox) return;

        lightbox = document.createElement("div");
        lightbox.id = "image-lightbox";
        lightbox.innerHTML = `
            <div class="lightbox-backdrop" data-role="close"></div>
            <div class="lightbox-content" role="dialog" aria-modal="true" aria-label="Image preview">
                <button class="lightbox-close" type="button" aria-label="Close image preview">&times;</button>
                <img class="lightbox-image" src="" alt="">
                <p class="lightbox-caption"></p>
            </div>
        `;
        document.body.appendChild(lightbox);

        lightboxImage = lightbox.querySelector(".lightbox-image");
        lightboxCaption = lightbox.querySelector(".lightbox-caption");

        const hide = () => hideLightbox();
        lightbox.querySelector(".lightbox-close").addEventListener("click", hide);
        lightbox.querySelector(".lightbox-backdrop").addEventListener("click", hide);
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && lightbox.classList.contains("is-visible")) {
                hideLightbox();
            }
        });
    };

    const showLightbox = (src, altText) => {
        ensureLightbox();
        if (!lightboxImage || !lightboxCaption) return;
        lightboxImage.src = src;
        lightboxImage.alt = altText || "";
        lightboxCaption.textContent = altText || "";
        lightbox.classList.add("is-visible");
        document.body.classList.add("lightbox-open");
    };

    function hideLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove("is-visible");
        document.body.classList.remove("lightbox-open");
        if (lightboxImage) {
            lightboxImage.src = "";
            lightboxImage.alt = "";
        }
        if (lightboxCaption) {
            lightboxCaption.textContent = "";
        }
    }

    galleryImages.forEach((img) => {
        img.addEventListener("click", (event) => {
            event.preventDefault();
            const { src, alt } = img;
            showLightbox(src, alt);
        });
    });
}
