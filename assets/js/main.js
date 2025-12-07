document.addEventListener('DOMContentLoaded', () => {
  // ===== MENU TOGGLE =====
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", !isExpanded);
      mobileMenu.classList.toggle("hidden");
    });

    // Close menu when clicking on a link
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuBtn.setAttribute("aria-expanded", "false");
        mobileMenu.classList.add("hidden");
      });
    });
  }

  // ===== IMAGE SLIDER =====
  let currentSlide = 0;
  const sliderEl = document.getElementById("slider");
  const dots = document.querySelectorAll('[role="tab"][data-index]');
  const slideCount = sliderEl ? sliderEl.children.length : 0;

  function goToSlide(index) {
    if (!sliderEl) return;
    currentSlide = index % slideCount;
    sliderEl.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
      dot.setAttribute("aria-selected", i === currentSlide);
      dot.classList.toggle("bg-white", i === currentSlide);
      dot.classList.toggle("bg-white/60", i !== currentSlide);
    });
  }

  if (slideCount > 0) {
    dots.forEach((dot) => {
      dot.addEventListener("click", () => goToSlide(parseInt(dot.dataset.index)));
    });
    // Auto-rotate slides every 5 seconds
    setInterval(() => goToSlide((currentSlide + 1) % slideCount), 5000);
  }

  // ===== MENU DATA & RENDERING =====
  const menuData = {
    fav: Array.from({ length: 12 }).map((_, i) => ({
      name: `Menu Favorit ${i + 1}`,
      price: (40 + i) * 1000,
      img: `https://source.unsplash.com/500x400/?food,meal,${i}`,
      badge: i % 3 === 0 ? "⭐ Best Seller" : "",
    })),
    drink: Array.from({ length: 12 }).map((_, i) => ({
      name: `Minuman ${i + 1}`,
      price: (10 + i) * 1000,
      img: `https://source.unsplash.com/500x400/?drink,juice,${i}`,
      badge: i % 4 === 0 ? "🆕 Baru" : "",
    })),
    snack: Array.from({ length: 12 }).map((_, i) => ({
      name: `Snack ${i + 1}`,
      price: (15 + i) * 1000,
      img: `https://source.unsplash.com/500x400/?dessert,snack,${i}`,
      badge: i % 5 === 0 ? "🎉 Promo" : "",
    })),
  };

  const PAGE_SIZE = 6;
  let currentCategory = "fav";
  let currentPage = 1;
  let searchQuery = "";

  // Cache DOM references
  const tabBtns = document.querySelectorAll(".tab-btn");
  const menuSearchEl = document.getElementById("menuSearch");
  const menuContainer = document.getElementById("menu-container");
  const loadMoreBtn = document.getElementById("loadMore");
  const modalCloseBtn = document.getElementById("modalClose");
  const previewModalEl = document.getElementById("previewModal");

  function getFilteredData(category) {
    const items = menuData[category] || [];
    if (!searchQuery) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  function renderMenu(category, page, replace = true) {
    const filteredItems = getFilteredData(category);
    const start = (page - 1) * PAGE_SIZE;
    const pageItems = filteredItems.slice(start, start + PAGE_SIZE);

    if (replace && menuContainer) menuContainer.innerHTML = "";

    // Use DocumentFragment for efficient batch insertion
    const frag = document.createDocumentFragment();

    pageItems.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer";
      card.innerHTML = `
        <div class="relative bg-gray-200 h-44 sm:h-56 md:h-48 lg:h-40 overflow-hidden">
          <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover hover:scale-105 transition duration-300" loading="lazy" />
          ${item.badge ? `<span class="absolute top-3 right-3 bg-white text-gray-900 text-xs px-3 py-1 rounded-full font-semibold shadow-md">${item.badge}</span>` : ""}
        </div>
        <div class="p-5">
          <h4 class="text-lg font-bold text-gray-900 mb-2">${item.name}</h4>
          <p class="text-gray-500 text-sm mb-4">Disiapkan segar saat Anda pesan. Tambahkan catatan khusus jika diperlukan (mis. tingkat kepedasan, tanpa bawang).</p>
          <div class="flex items-center justify-between gap-3">
            <span class="font-bold text-lg text-green-600">Rp ${item.price.toLocaleString("id-ID")}</span>
            <div class="flex gap-2">
              <button class="preview-btn px-3 py-2 rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition font-semibold text-sm">Lihat</button>
              <a href="https://wa.me/6281234567890?text=${encodeURIComponent(`Halo, saya ingin pesan ${item.name} (Rp ${item.price.toLocaleString("id-ID")})`)}" target="_blank" rel="noopener noreferrer" class="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-semibold text-sm">Pesan</a>
            </div>
          </div>
        </div>
      `;

      card.style.opacity = "0";
      card.style.transform = "translateY(10px)";
      frag.appendChild(card);

      setTimeout(() => {
        card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 50);

      const previewBtn = card.querySelector(".preview-btn");
      if (previewBtn) previewBtn.addEventListener("click", () => openModal(item));
    });

    if (menuContainer) menuContainer.appendChild(frag);

    // Update load more visibility
    if (loadMoreBtn) {
      loadMoreBtn.style.display = start + PAGE_SIZE < filteredItems.length ? "inline-block" : "none";
    }
  }

  function openModal(item) {
    const modalImg = document.getElementById("modalImg");
    const modalTitle = document.getElementById("modalTitle");
    const modalBadge = document.getElementById("modalBadge");
    const modalDesc = document.getElementById("modalDesc");
    const modalWA = document.getElementById("modalWA");

    if (modalImg) modalImg.src = item.img;
    if (modalTitle) modalTitle.textContent = item.name;
    if (modalBadge) modalBadge.textContent = item.badge;
    if (modalDesc) modalDesc.textContent = `${item.name} dibuat segar dengan bahan pilihan. Tambahkan permintaan khusus (mis. tingkat kepedasan atau alergi) saat memesan lewat WhatsApp.`;
    if (modalWA) modalWA.href = `https://wa.me/6281234567890?text=${encodeURIComponent(`Saya mau pesan ${item.name}`)}`;

    if (previewModalEl) {
      previewModalEl.classList.remove("hidden");
      previewModalEl.classList.add("flex");
      previewModalEl.setAttribute("aria-hidden", "false");
    }
  }

  function closeModal() {
    if (previewModalEl) {
      previewModalEl.classList.add("hidden");
      previewModalEl.classList.remove("flex");
      previewModalEl.setAttribute("aria-hidden", "true");
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (previewModalEl) previewModalEl.addEventListener("click", (e) => {
    if (e.target.id === "previewModal") closeModal();
  });

  // ===== CATEGORY TABS =====
  if (tabBtns && tabBtns.length) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        tabBtns.forEach((b) => {
          b.classList.remove("bg-green-500", "text-white");
          b.classList.add("bg-gray-200", "text-gray-800");
          b.setAttribute("aria-selected", "false");
        });
        this.classList.remove("bg-gray-200", "text-gray-800");
        this.classList.add("bg-green-500", "text-white");
        this.setAttribute("aria-selected", "true");

        currentCategory = this.dataset.cat;
        currentPage = 1;
        searchQuery = "";
        if (menuSearchEl) menuSearchEl.value = "";
        renderMenu(currentCategory, currentPage, true);
      });
    });
  }

  // ===== SEARCH WITH DEBOUNCE =====
  let searchTimeout;
  if (menuSearchEl) {
    menuSearchEl.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchQuery = e.target.value.trim();
        currentPage = 1;
        renderMenu(currentCategory, currentPage, true);
      }, 300);
    });
  }

  // ===== LOAD MORE BUTTON =====
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      currentPage++;
      renderMenu(currentCategory, currentPage, false);
    });
  }

  // ===== INITIAL RENDER =====
  renderMenu("fav", 1, true);
});
