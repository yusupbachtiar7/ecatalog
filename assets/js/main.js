document.addEventListener("DOMContentLoaded", () => {
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
    if (!sliderEl || !dots) return;
    currentSlide = index % slideCount;
    sliderEl.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
      dot.setAttribute("aria-selected", i === currentSlide);
      dot.classList.toggle("bg-white", i === currentSlide);
      dot.classList.toggle("bg-white/60", i !== currentSlide);
    });
  }

  if (slideCount > 0 && dots.length > 0) {
    dots.forEach((dot) => {
      dot.addEventListener("click", () =>
        goToSlide(parseInt(dot.dataset.index))
      );
    });
    // Auto-rotate slides every 5 seconds
    setInterval(() => goToSlide((currentSlide + 1) % slideCount), 5000);
  }

  // ===== MENU DATA =====
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
  let currentCategory = "fav",
    currentPage = 1,
    searchQuery = "";

  // DOM references
  const tabBtns = document.querySelectorAll(".tab-btn");
  const menuSearchEl = document.getElementById("menuSearch");
  const menuContainer = document.getElementById("menu-container");
  const loadMoreBtn = document.getElementById("loadMore");

  const modalCloseBtn = document.getElementById("modalClose");
  const previewModalEl = document.getElementById("previewModal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalBadge = document.getElementById("modalBadge");
  const modalDesc = document.getElementById("modalDesc");
  const modalPaymentEl = document.getElementById("modalPayment");

  // ===== PAYMENT METHODS =====
  const paymentMethods = [
    {
      type: "Tunai",
      note: "Bayar langsung di tempat",
      whatsapp: "6281234567890",
    },
    {
      type: "Transfer Bank",
      banks: [
        { name: "BCA", account: "1234567890" },
        { name: "Mandiri", account: "0987654321" },
        { name: "BNI", account: "1122334455" },
      ],
      whatsapp: "6281234567890",
    },
    {
      type: "QRIS",
      note: "Scan QR untuk pembayaran cepat",
      whatsapp: "6281234567890",
      qris: "https://via.placeholder.com/250x250.png?text=QRIS+Dummy",
    },
  ];

  // ===== TOAST =====
  function showToast(message, duration = 3000) {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className =
      "bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg opacity-0 translate-y-2 transition-all duration-300";
    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove("opacity-0", "translate-y-2");
      toast.classList.add("opacity-100", "translate-y-0");
    });
    setTimeout(() => {
      toast.classList.remove("opacity-100", "translate-y-0");
      toast.classList.add("opacity-0", "translate-y-2");
      toast.addEventListener("transitionend", () => toast.remove());
    }, duration);
  }

  // ===== FILTER & RENDER =====
  function getFilteredData(category) {
    const items = menuData[category] || [];
    if (!searchQuery) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  function renderMenu(category, page, replace = true) {
    const filtered = getFilteredData(category);
    const start = (page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);
    if (replace) menuContainer.innerHTML = "";

    const frag = document.createDocumentFragment();
    pageItems.forEach((item) => {
      const card = document.createElement("article");
      card.className =
        "bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer";
      card.innerHTML = `
      <div class="relative bg-gray-200 h-44 sm:h-56 md:h-48 lg:h-40 overflow-hidden">
        <img src="${item.img}" alt="${
        item.name
      }" class="w-full h-full object-cover hover:scale-105 transition duration-300" loading="lazy" />
        ${
          item.badge
            ? `<span class="absolute top-3 right-3 bg-white text-gray-900 text-xs px-3 py-1 rounded-full font-semibold shadow-md">${item.badge}</span>`
            : ""
        }
      </div>
      <div class="p-5">
        <h4 class="text-lg font-bold text-gray-900 mb-2">${item.name}</h4>
        <p class="text-gray-500 text-sm mb-4">Disiapkan segar saat Anda pesan. Tambahkan catatan khusus jika diperlukan.</p>
        <div class="flex items-center justify-between gap-3">
          <span class="font-bold text-lg text-green-600">Rp ${item.price.toLocaleString(
            "id-ID"
          )}</span>
          <div class="flex gap-2">
            <button class="preview-btn px-3 py-2 rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition font-semibold text-sm">Lihat</button>
            <a href="https://wa.me/6281234567890?text=${encodeURIComponent(
              `Halo, saya ingin pesan ${
                item.name
              } (Rp ${item.price.toLocaleString("id-ID")})`
            )}" target="_blank" class="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-semibold text-sm">Pesan</a>
          </div>
        </div>
      </div>
    `;
      frag.appendChild(card);

      // Klik di seluruh card buka modal kecuali tombol WA
      card.addEventListener("click", (e) => {
        if (!e.target.closest("a")) openModal(item);
      });

      // Tombol "Lihat" tetap berfungsi
      const previewBtn = card.querySelector(".preview-btn");
      if (previewBtn)
        previewBtn.addEventListener("click", () => openModal(item));
    });

    menuContainer.appendChild(frag);

    if (loadMoreBtn) {
      loadMoreBtn.style.display =
        start + PAGE_SIZE < filtered.length ? "inline-block" : "none";
    }
  }

  // ===== OPEN MODAL & PAYMENT =====
  function openModal(item) {
    if (!previewModalEl || !modalPaymentEl) return;
    modalImg.src = item.img;
    modalImg.alt = item.name;
    modalTitle.textContent = item.name;
    modalBadge.textContent = item.badge || "";
    modalDesc.textContent = `${item.name} dibuat segar. Tambahkan catatan khusus jika diperlukan.`;
    modalPaymentEl.innerHTML = "";

    const radioContainer = document.createElement("div");
    radioContainer.className = "flex flex-col gap-3";
    paymentMethods.forEach((method, idx) => {
      const label = document.createElement("label");
      label.className =
        "flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:shadow-lg transition shadow-sm bg-white";
      const spanText = document.createElement("span");
      spanText.textContent = method.type;
      spanText.className = "font-semibold text-gray-900";
      const radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "paymentMethod";
      radioInput.value = idx;
      radioInput.className = "ml-2";
      label.appendChild(spanText);
      label.appendChild(radioInput);
      radioContainer.appendChild(label);

      radioInput.addEventListener("change", () => {
        radioContainer
          .querySelectorAll("label")
          .forEach((l) =>
            l.classList.remove("bg-green-50", "border-green-600", "shadow-lg")
          );
        label.classList.add("bg-green-50", "border-green-600", "shadow-lg");
        renderPaymentDetail(method, item);
      });
    });
    modalPaymentEl.appendChild(radioContainer);
    previewModalEl.classList.remove("hidden");
    previewModalEl.classList.add("flex");
    previewModalEl.setAttribute("aria-hidden", "false");
  }

  // ===== RENDER PAYMENT DETAIL =====
  function renderPaymentDetail(method, item) {
    let detailContainer =
      document.getElementById("paymentDetail") ||
      (() => {
        const el = document.createElement("div");
        el.id = "paymentDetail";
        modalPaymentEl.appendChild(el);
        return el;
      })();
    detailContainer.className =
      "mt-3 p-3 border rounded-xl bg-gray-50 transition-all duration-300";
    detailContainer.innerHTML = "";

    if (method.type === "Transfer Bank") {
      const bankSelect = document.createElement("select");
      bankSelect.className = "border p-2 rounded w-full mb-2 text-gray-700";
      method.banks.forEach((bank) => {
        const option = document.createElement("option");
        option.value = bank.account;
        option.textContent = `${bank.name} - ${bank.account}`;
        bankSelect.appendChild(option);
      });
      const copyBtn = document.createElement("button");
      copyBtn.textContent = "Salin Nomor Rek";
      copyBtn.className =
        "mt-2 w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold";
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(bankSelect.value);
        showToast(`Nomor rekening ${bankSelect.value} berhasil disalin!`);
      });
      detailContainer.appendChild(bankSelect);
      detailContainer.appendChild(copyBtn);
    } else if (method.type === "QRIS") {
      const qrImg = document.createElement("img");
      qrImg.src = method.qris;
      qrImg.alt = "QRIS Dummy";
      qrImg.className = "w-48 h-48 mx-auto rounded-lg shadow-md mb-2";
      const noteEl = document.createElement("p");
      noteEl.textContent = method.note;
      noteEl.className = "text-gray-600 text-sm text-center mb-2";
      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "Download QRIS";
      downloadBtn.className =
        "w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold mb-2";
      downloadBtn.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = method.qris;
        link.download = `${item.name}-QRIS.png`;
        link.click();
        showToast("QRIS berhasil diunduh!");
      });
      detailContainer.appendChild(qrImg);
      detailContainer.appendChild(noteEl);
      detailContainer.appendChild(downloadBtn);
    } else {
      const noteEl = document.createElement("p");
      noteEl.textContent = method.note;
      noteEl.className = "text-gray-600 text-sm";
      detailContainer.appendChild(noteEl);
    }

    const waBtn = document.createElement("a");
    waBtn.href = `https://wa.me/${method.whatsapp}?text=${encodeURIComponent(
      `Saya ingin melakukan pembayaran ${method.type} untuk ${item.name}`
    )}`;
    waBtn.target = "_blank";
    waBtn.rel = "noopener noreferrer";
    waBtn.className =
      "mt-2 w-full inline-block px-4 py-2 bg-green-600 text-white rounded-xl text-center hover:bg-green-700 transition font-semibold";
    waBtn.textContent = "Kirim Bukti / Konfirmasi";
    detailContainer.appendChild(waBtn);
  }

  // ===== CLOSE MODAL =====
  if (modalCloseBtn && previewModalEl) {
    modalCloseBtn.addEventListener("click", () => {
      previewModalEl.classList.add("hidden");
      previewModalEl.classList.remove("flex");
      previewModalEl.setAttribute("aria-hidden", "true");
    });
    previewModalEl.addEventListener("click", (e) => {
      if (e.target.id === "previewModal") {
        previewModalEl.classList.add("hidden");
        previewModalEl.classList.remove("flex");
        previewModalEl.setAttribute("aria-hidden", "true");
      }
    });
  }

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
