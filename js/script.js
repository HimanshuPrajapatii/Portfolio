window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.classList.add("hidden");
  }
});

// Copy button
document.addEventListener("DOMContentLoaded", () => {
  const email = "himanstudio25@gmail.com";
  const copyBtn = document.getElementById("copyMailBtn");
  if (copyBtn) {
    const copyBtnText = copyBtn.querySelector("span");
    copyBtn.addEventListener("click", () => {
      if (navigator.clipboard) {
        // Modern browsers
        navigator.clipboard
          .writeText(email)
          .then(() => {
            copyBtnText.textContent = "Copied!";
            setTimeout(() => (copyBtnText.textContent = "Copy Mail"), 1600);
          })
          .catch((err) => console.error(err));
      } else {
        // Fallback for older mobile browsers
        const textarea = document.createElement("textarea");
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          copyBtnText.textContent = "Copied!";
          setTimeout(() => (copyBtnText.textContent = "Copy Mail"), 1600);
        } catch (err) {
          console.error("Fallback: Could not copy", err);
        }
        document.body.removeChild(textarea);
      }
    });
  }
});

// MidlineBar section
const midline = document.getElementById("midline");
if (midline) {
  window.addEventListener("load", () => {
    originalTop = midline.getBoundingClientRect().top;
  });

  window.addEventListener("scroll", function () {
    const rect = midline.getBoundingClientRect();
    if (rect.top <= 48) {
      midline.classList.add("is-expanded");
    } else {
      midline.classList.remove("is-expanded");
    }
  });
}

// About Section
document.addEventListener("DOMContentLoaded", () => {
  const appleOverlay = document.getElementById("appleOverlay");

  // only run this code if appleOverlay exists
  if (appleOverlay) {
    const folderCloseBtn = document.getElementById("folderCloseBtn");
    const appleCard = appleOverlay.querySelector(".apple-folder");

    // Open overlay
    document.querySelectorAll(".read-more, .about-readmore").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        appleOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        if (appleCard) {
          appleCard.classList.remove("closing");
        }
      });
    });

    // Close overlay with animation
    function closeOverlay() {
      if (appleCard) appleCard.classList.add("closing");
      setTimeout(() => {
        appleOverlay.classList.remove("active");
        if (appleCard) appleCard.classList.remove("closing");
        document.body.style.overflow = "";
      }, 0.45); // match CSS transition
    }

    // Red button closes overlay
    if (folderCloseBtn) {
      folderCloseBtn.addEventListener("click", closeOverlay);
    }

    // Click outside card closes overlay
    appleOverlay.addEventListener("click", (e) => {
      if (e.target === appleOverlay) closeOverlay();
      console.log("click-outside");
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".ig-like-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("liked");
    });
  });
});

// --- 1) Define galleries from the paths provided ---
const galleries = {
  cafe: [
    "../assets/images/SocialMedia/cafe/cafe-1.png",
    "../assets/images/SocialMedia/cafe/cafe-2.png",
  ],
  lemp: [
    "../assets/images/SocialMedia/lemp/Post-1.png",
    "../assets/images/SocialMedia/lemp/Post-2.jpg",
    "../assets/images/SocialMedia/lemp/Post-3.jpg",
    "../assets/images/SocialMedia/lemp/Post-4.jpg",
    "../assets/images/SocialMedia/lemp/Post-5.jpg",
    "../assets/images/SocialMedia/lemp/post-6.jpg",
  ],
  fashion: [
    "../assets/images/SocialMedia/Fashion/post-1.png",
    "../assets/images/SocialMedia/Fashion/post-2.jpg",
    "../assets/images/SocialMedia/Fashion/post-3.jpg",
  ],
  shoes: [
    "../assets/images/SocialMedia/shoes/Artboard-1.png",
    "../assets/images/SocialMedia/shoes/Artboard-2.png",
    "../assets/images/SocialMedia/shoes/Artboard-3.png",
    "../assets/images/SocialMedia/shoes/Artboard-4.png",
    "../assets/images/SocialMedia/shoes/Artboard-5.png",
  ],
  food: [
    "../assets/images/SocialMedia/food/Dish-1.jpg",
    "../assets/images/SocialMedia/food/Dish-2.jpg",
    "../assets/images/SocialMedia/food/Dish-3.jpg",
    "../assets/images/SocialMedia/food/Dish-4.jpg",
  ],
};
(function () {
  function initIgOverlay() {
    const overlay = document.getElementById("igPostOverlay");
    if (!overlay) {
      console.warn("[IG] Overlay #igPostOverlay not found; skipping init.");
      return;
    }

    // --- 2) Cache DOM ---
    // const overlay = document.getElementById("igPostOverlay");
    const frame = overlay.querySelector(".ig-post-frame");
    const slider = overlay.querySelector(".ig-post-image-slider");
    const dotsContainer = overlay.querySelector(".ig-post-dots");
    const leftArrow = overlay.querySelector(".ig-arrow-left");
    const rightArrow = overlay.querySelector(".ig-arrow-right");
    const titleEl = overlay.querySelector(".ig-topbar-title");
    const backBtn = overlay.querySelector("[data-ig-back]");
    const cards = document.querySelectorAll(".socialCard");

    if (
      !frame ||
      !slider ||
      !dotsContainer ||
      !leftArrow ||
      !rightArrow ||
      !titleEl ||
      !backBtn
    ) {
      console.warn(
        "[IG] Missing one or more required overlay children; check markup."
      );
      return;
    }

    // --- 3) Slider state ---
    let currentImages = [];
    let index = 0;

    // --- 4) Build/rebuild slider content ---
    function buildSlider(images) {
      currentImages = images.slice();
      index = 0;

      // images
      slider.innerHTML = "";
      currentImages.forEach((src) => {
        const img = document.createElement("img");
        img.className = "ig-post-image";
        img.src = src;
        img.draggable = false;
        slider.appendChild(img);
      });

      // dots
      dotsContainer.innerHTML = "";
      currentImages.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = "ig-dot" + (i === 0 ? " active" : "");
        dot.addEventListener("click", () => {
          index = i;
          updateSlider();
        });
        dotsContainer.appendChild(dot);
      });

      updateSlider();
    }

    function updateSlider() {
      slider.style.transform = `translateX(${-index * 100}%)`;
      const dots = dotsContainer.querySelectorAll(".ig-dot");
      dots.forEach((dot, i) => dot.classList.toggle("active", i === index));

      leftArrow.style.visibility = index === 0 ? "hidden" : "visible";
      rightArrow.style.visibility =
        index === currentImages.length - 1 ? "hidden" : "visible";
    }

    // --- 5) Navigation handlers ---
    leftArrow.addEventListener("click", () => {
      if (index > 0) {
        index--;
        updateSlider();
      }
    });
    rightArrow.addEventListener("click", () => {
      if (index < currentImages.length - 1) {
        index++;
        updateSlider();
      }
    });

    // swipe
    let startX = 0;
    let isDragging = false;
    const imageWrap = overlay.querySelector(".ig-post-image-wrap");
    function handleStart(e) {
      isDragging = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
    }
    function handleEnd(e) {
      if (!isDragging) return;
      const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const diff = endX - startX;
      if (diff > 50 && index > 0) {
        index--;
        updateSlider();
      } else if (diff < -50 && index < currentImages.length - 1) {
        index++;
        updateSlider();
      }
      isDragging = false;
    }
    imageWrap.addEventListener("mousedown", handleStart);
    imageWrap.addEventListener("mouseup", handleEnd);
    imageWrap.addEventListener("mouseleave", handleEnd);
    imageWrap.addEventListener("touchstart", handleStart, { passive: true });
    imageWrap.addEventListener("touchend", handleEnd);

    // --- 6) Scroll lock helpers (no jump) ---
    function lockBodyScroll() {
      const y = window.scrollY || window.pageYOffset;
      document.body.dataset.scrollY = String(y);
      document.body.classList.add("modal-open");
      document.body.style.top = `-${y}px`;
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    }
    function unlockBodyScroll() {
      const y = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.classList.remove("modal-open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      delete document.body.dataset.scrollY;
      window.scrollTo(0, y);
    }

    // --- 7) Open/close overlay ---
    function openOverlay({ galleryKey, title }) {
      const imgs = galleries[galleryKey] || [];
      if (!imgs.length) return;

      titleEl.textContent = title || "Post";
      buildSlider(imgs);

      overlay.classList.add("open");
      lockBodyScroll();

      // move focus inside dialog per APG guidance
      backBtn.focus();
      // Escape to close
      document.addEventListener("keydown", onKeydown);
    }

    function closeOverlay() {
      overlay.classList.remove("open");
      unlockBodyScroll();
      document.removeEventListener("keydown", onKeydown);
    }

    function onKeydown(e) {
      if (e.key === "Escape") closeOverlay();
    }

    // backdrop/outside click: close if clicking the overlay background
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.classList.contains("ig-post-bg")) {
        closeOverlay();
      }
    });

    // back button
    backBtn.addEventListener("click", closeOverlay);

    // --- 8) Wire cards ---
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        e.preventDefault();
        const galleryKey = card.getAttribute("data-gallery");
        const title = card.getAttribute("data-title") || "Post";
        openOverlay({ galleryKey, title });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initIgOverlay, {
      once: true,
    });
  } else {
    initIgOverlay();
  }
})();

// Footer

// Inject a shared footer into #site-footer or at the end of <main> as a fallback
document.addEventListener("DOMContentLoaded", () => {
  // Time updater
  const timeEl = document.getElementById("time");
  const ampmEl = document.getElementById("ampm");

  function updateTime() {
    if (!timeEl || !ampmEl) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? "0" + minutes : "" + minutes;
    // Keep the space before <span> as requested
    timeEl.childNodes[0].textContent = hours + ":" + minutesStr + " ";
    ampmEl.textContent = ampm;
  }

  updateTime();
  setInterval(updateTime, 1000);
});
document
  .querySelectorAll(".icon-wrapper, .cloth-print-wrapper, .skinicon-wrapper")
  .forEach((wrapper) => {
    const scroller = wrapper.querySelector(
      ".icon-raw, .cloth-print__scroller, .skinicon-raw, .packaging__scroller"
    );
    const leftBtn = wrapper.querySelector(
      ".icon-arrow--left, .cloth-arrow--left, .skinicon-arrow--left"
    );
    const rightBtn = wrapper.querySelector(
      ".icon-arrow--right, .cloth-arrow--right, .skinicon-arrow--right"
    );

    if (!scroller || !leftBtn || !rightBtn) return;

    const card = scroller.querySelector("article");
    const scrollAmount = card ? card.offsetWidth + 16 : 300;

    // Update arrow visibility
    const updateArrows = () => {
      leftBtn.style.display = scroller.scrollLeft <= 0 ? "none" : "block";
      rightBtn.style.display =
        scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1
          ? "none"
          : "block";
    };

    // Initial state
    updateArrows();

    // Scroll left
    leftBtn.addEventListener("click", () => {
      scroller.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      setTimeout(updateArrows, 400);
    });

    // Scroll right
    rightBtn.addEventListener("click", () => {
      scroller.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(updateArrows, 400);
    });

    // Update on manual scroll
    scroller.addEventListener("scroll", updateArrows);
  });
