const IMAGE_STORAGE_KEY = 'nparfum_custom_images';
const ADMIN_SESSION_KEY = 'nparfum_admin_session';
const ADMIN_PASSWORD = 'nparfum2025';

let serverCustomImages = {};

function encodeImageSrc(path) {
  if (!path || path.startsWith('data:') || path.startsWith('http')) return path;
  return path.split('/').map((part, i) => i === 0 ? part : encodeURIComponent(part)).join('/');
}

function isAdminLoggedIn() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
}

function loginAdmin(password) {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
    updateAdminVisibility();
    return true;
  }
  return false;
}

function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  updateAdminVisibility();
}

function updateAdminVisibility() {
  const admin = isAdminLoggedIn();
  const section = document.getElementById('admin-images');
  if (section) section.classList.toggle('admin-visible', admin);
  document.querySelectorAll('.admin-nav-link').forEach(el => {
    el.style.display = admin ? '' : 'none';
  });
  const loginModal = document.getElementById('adminLoginModal');
  if (loginModal) loginModal.classList.remove('open');
  if (admin) renderAdminPanel();
}

async function loadServerImages() {
  try {
    const res = await fetch('custom-images.json?t=' + Date.now());
    if (res.ok) serverCustomImages = await res.json();
  } catch {
    serverCustomImages = {};
  }
}

const products = [
  { id: 1, brand: "Escentric Molecules", name: "Escentric 02", price: "1.5 ₼", gender: "unisex", badge: null, image: "sekiller/molecule 02.jpeg", desc: "Tək molekulun sehri — Ambroxan. Dərinizdə unikal bir iz buraxır, saatlarla davam edir. Müasir parfümeriyənin ikon əsəri." },
  { id: 2, brand: "Louis Vuitton", name: "Symphony", price: "1.5 ₼", gender: "unisex", badge: "TOP", image: "sekiller/l-v symphony.jpeg", desc: "Çiçəkli-odunlu akkord, zəncinc ağacı, müşk. Louis Vuitton-un simfonik bir ətri — zənginlik və zərifliyin vəhdəti." },
  { id: 3, brand: "Bvlgari", name: "Tygar", price: "1.5 ₼", gender: "men", badge: null, image: "sekiller/bvlgsri tygar.jpeg", desc: "Sitrus, qalın ağac notları və müşk akkordları. Güclü, cəsarətli — müasir kişi üçün yaradılmış selin ruhu." },
  { id: 4, brand: "Baccarat Rouge", name: "Rouge 540", price: "1 ₼", gender: "unisex", badge: "HIT", image: "sekiller/baccarat rouge.jpeg", desc: "Jasmin, safran, sedr, ambroxan. Dünyanın ən tanınan niş ətri — zəfəran və çiçəyin mükəmməl balansı." },
  { id: 5, brand: "Tiziana Terenzi", name: "Kirke", price: "1 ₼", gender: "women", badge: null, image: "sekiller/kirke.jpeg", desc: "Tropik meyvələr, sarı çiçəklər, ağ müşk. Fantastik bir macəra — baş gicəlləndirən şirəli sihir." },
  { id: 6, brand: "Louis Vuitton", name: "L'Immensite", price: "1.5 ₼", gender: "men", badge: "TOP", image: "sekiller/l-v limmensite.jpeg", desc: "Okean, kardamom, ağac, kəhrəba. Engin dənizin azadlığını cisimləşdirən maskulin master əsər." },
  { id: 7, brand: "Kilian", name: "Good Girl Gone Bad", price: "1 ₼", gender: "women", badge: null, image: "sekiller/kilian good gril.jpeg", desc: "Tuberose, jasmin, cəfəri, narın ağ çiçəklər. Hər qız daxilindəki gizli cəsarəti. İttiraz edə bilməzsiniz." },
  { id: 8, brand: "YSL", name: "Libre Deluxe", price: "1.5 ₼", gender: "women", badge: null, image: "sekiller/ysl libre.jpeg", desc: "Lavanda, portağal çiçəyi, müşk, vanilya. Azadlığın simvolu — güclü, romantik, unudulmaz bir qadın." },
  { id: 9, brand: "Antonio Banderas", name: "Blue Seduction Man", price: "1 ₼", gender: "men", badge: null, image: "sekiller/antonio banderas blue men.jpeg", desc: "Sitrus, dəniz notları, ağac. Gündəlik istifadə üçün ideal seçim — zərif, təravətli, əlçatan." },
  { id: 10, brand: "Antonio Banderas", name: "Golden Secret", price: "2 ₼", gender: "men", badge: null, image: "sekiller/antonio banderas golden secret.jpeg", desc: "Alma, jasmin, qara bibər, tütün, vanil. Sıravi gündəlik ətri deyil — qızıl cazibənin sirri." },
  { id: 11, brand: "Orto Parisi", name: "Megamare", price: "2 ₼", gender: "unisex", badge: "NICHE", image: "sekiller/megamere.jpeg", desc: "Duz, dəniz yosunu, ambra, limon. Açıq dənizin dərinliyindən gətirilmiş xam və güclü niş ətri." },
  { id: 12, brand: "Chanel", name: "Coco Mademoiselle Deluxe", price: "1 ₼", gender: "women", badge: null, image: "sekiller/chanel coco madmasell.jpeg", desc: "Bergamot, jasmin, gül, patchouli, vanil. Chanel-in ikonik qadın ətrinin lüks versiyası — zamansız elegantlıq." },
  { id: 13, brand: "Chanel", name: "Chance Deluxe", price: "1 ₼", gender: "women", badge: null, image: "sekiller/chanel chance.jpeg", desc: "Sitrus, jasmin, qızılgül, müşk. Şansınızı tutun — gənc ruhlu, zərif, pozitiv bir Chanel klassiki." },
  { id: 14, brand: "Chanel", name: "N°5", price: "1 ₼", gender: "women", badge: "CLASSIC", image: "sekiller/chanel 05.jpeg", desc: "Aldehid, may çiçəyi, jasmin, vetiver. Parfümeriya tarixinin ən məşhur əsəri — 100 illik bir əfsanə." },
  { id: 15, brand: "Chanel", name: "Egoïste Deluxe", price: "1 ₼", gender: "men", badge: null, image: "sekiller/chanel eqoist.jpeg", desc: "Odun, müşk, rozmarin, qara bibər. Güclü maskulin akkordların elegantlıqla birləşməsi." },
  { id: 16, brand: "Versace", name: "Bright Crystal", price: "1 ₼", gender: "women", badge: null, image: "sekiller/v-c bright crystal.jpeg", desc: "Nar, yuzu, çiçəklər, müşk, mahun. Parlaq, işıqlı, ruhlandırıcı — Versace-nin cazibədar xanım ətri." },
  { id: 17, brand: "Gucci", name: "Bloom Deluxe", price: "1 ₼", gender: "women", badge: null, image: "sekiller/gucci bloom.jpeg", desc: "Jasmin, tuberose, Rangoon körpüsü çiçəyi, sandalwood. Guccinin bağ dünyasına dəvət — çiçəkli şair ruhu." },
  { id: 18, brand: "Armani", name: "My Way Deluxe", price: "1.5 ₼", gender: "women", badge: null, image: "sekiller/armani my-way.jpeg", desc: "Bergamot, hindistan cevizi, jasmin, sedr, vanilya. Həyatda öz yolunuzu tapın — Armaninin azadlıq bəyannaməsi." },
  { id: 19, brand: "Armani", name: "Sì Deluxe", price: "1 ₼", gender: "women", badge: null, image: "sekiller/aramni si.jpeg", desc: "Qara qarağat, frezia, gül, çay, vanilya. Zamanı aşan zəriflik — modern qadının daxili gücü." },
  { id: 20, brand: "Armani", name: "Stronger With You", price: "1 ₼", gender: "men", badge: null, image: "sekiller/stronger.jpeg", desc: "Kardamom, qoz, gilas çiçəyi, müşk. Sevginin gücünü hiss et — həm romantik, həm güclü." },
  { id: 21, brand: "Burberry", name: "Weekend Deluxe (Sherrizad)", price: "1 ₼", gender: "women", badge: null, image: "sekiller/burbery weekend-shehrizad.jpeg", desc: "Qızılgül, kakao, çeşid ağacı, limon. Həftə sonunun rahatlığı — gündəlik istifadəyə uyğun zərif ətir." },
  { id: 22, brand: "Dior", name: "Sauvage Deluxe", price: "1.5 ₼", gender: "men", badge: "HIT", image: "sekiller/dior savuge.jpeg", desc: "Bergamot, biber, lavanda, ambroxan, vetiver. Vəhşi çöllərin azadlığı — müasir kişi parfümeriyəsinin zirvəsi." },
  { id: 23, brand: "Victoria's Secret", name: "Bombshell", price: "1 ₼", gender: "women", badge: null, image: "sekiller/v-c bomshell.jpeg", desc: "Şampan üzümü, çiçəklər, müşk, vanil. Həssas, şirin, cəlbedici — bombalamanın özündən gəlir." },
  { id: 24, brand: "Captain Black", name: "Captain Black", price: "1 ₼", gender: "men", badge: null, image: "sekiller/captain black.jpeg", desc: "Dəri, ağac, tütün, müşk. Dənizçinin hekayəsi — cəsarətli, dərin, unudulmaz maskulin kəşf." },
  { id: 25, brand: "Attar", name: "Zem-Zem", price: "1 ₼", gender: "unisex", badge: null, image: "sekiller/zem zem.jpeg", desc: "Oud, gülab, amber, müşk. Müqəddəs Zəmzəm suyundan ilham almış — ruhun dərinliyinə çatan şərq hekayəsi." },
  { id: 26, brand: "Avon", name: "Today", price: "1 ₼", gender: "women", badge: null, image: "sekiller/avon today.jpeg", desc: "Çiçəklər, meyvə, müşk. Bu günü yaşa — hər günün özünəxas sehri olan zərif bir çiçəkli təravət." },
  { id: 27, brand: "Hermès", name: "Terre d'Hermès Deluxe", price: "1 ₼", gender: "men", badge: null, image: "sekiller/hermes terre.jpeg", desc: "Portağal qabığı, qreyfrut, flint, vetiver, sedr. Torpağın ruhu — maskulin sənət əsərinin ən yüksək ifadəsi." },
  { id: 28, brand: "Bond No.9", name: "Lafayette Street", price: "1 ₼", gender: "unisex", badge: "NICHE", image: "sekiller/bond9.jpeg", desc: "Qərb müşkü, odunlu notlar, gül. Nyu-Yorkun ən stylish küçəsindən ilham — müasir niş parfümeriyənin sehri." },
  { id: 29, brand: "Fendi", name: "Fan di Fendi", price: "1 ₼", gender: "women", badge: null, image: "sekiller/fendi.jpeg", desc: "Çiçəklər, müşk, ağac. Fendinin klassik Romasından gəlir — italyan zərifliyi birinci addımdan." },
  { id: 30, brand: "Shiseido", name: "Ginza", price: "1 ₼", gender: "women", badge: null, image: "sekiller/ginza.jpeg", desc: "Bergamot, kardamom, çay, gül, müşk. Tokionun işıqlı günbatımı — Şərq elegantlığının Qərb zirvəsi." },
  { id: 31, brand: "Trussardi", name: "Donna Deluxe", price: "1 ₼", gender: "women", badge: null, image: "sekiller/trussardi donna.jpeg", desc: "İpək müşk, çiçəklər, ağac, vanilya. Milanlı moda evinin qadın ruhunu əks etdirən rafinedinmiş ətir." },
  { id: 32, brand: "Creed", name: "Aventus", price: "1.5 ₼", gender: "men", badge: "NICHE", image: "sekiller/aventus.jpeg", desc: "Ananas, qara qarağat, gülməşə, müşk, vetiver. 200 illik irsə sahib evin şah əsəri — uğurun qoxusu." },
  { id: 33, brand: "A. Barrios", name: "Tilia Uni", price: "1 ₼", gender: "unisex", badge: "NICHE", image: "sekiller/WhatsApp Image 2026-06-07 at 16.47.01.jpeg", desc: "Cəfəri, çay, cəviz, müşk. Müstəqil parfümeriyənin incisi — fərqli, cəsarətli, özünəxas." },
  { id: 34, brand: "Shaik", name: "Sheyx No.77", price: "1 ₼", gender: "men", badge: null, image: "sekiller/sheyx77.jpeg", desc: "Bergamot, qızılgül, sandal ağacı, oud, müşk. Şərq lüksünün zirvəsi — klassik Şaik üslubu ilə." },
];

function loadCustomImages() {
  try {
    return JSON.parse(localStorage.getItem(IMAGE_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveCustomImages(images) {
  localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
}

function getProductImage(product) {
  const custom = loadCustomImages();
  const id = String(product.id);
  if (custom[id]) return custom[id];
  if (serverCustomImages[id]) return serverCustomImages[id];
  return encodeImageSrc(product.image);
}

function setCustomImage(productId, dataUrl) {
  const custom = loadCustomImages();
  custom[String(productId)] = dataUrl;
  saveCustomImages(custom);
}

function removeCustomImage(productId) {
  const custom = loadCustomImages();
  delete custom[String(productId)];
  saveCustomImages(custom);
}

function clearAllCustomImages() {
  localStorage.removeItem(IMAGE_STORAGE_KEY);
}

function renderProducts(filter) {
  const grid = document.getElementById('productGrid');
  const filtered = filter === 'all' ? products
    : filter === 'niche' ? products.filter(p => p.badge === 'NICHE')
    : products.filter(p => p.gender === filter);

  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-image">
        <img src="${getProductImage(p)}" alt="${p.brand} ${p.name}" loading="lazy" decoding="async"
             onerror="handleImageError(this)">
        <div class="image-fallback" style="display:none;">Şəkil yoxdur</div>
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div>
            <div class="product-price">${p.price}</div>
            <div class="product-unit">per ml</div>
          </div>
          <a href="https://wa.me/994554429551?text=${encodeURIComponent('Salam! ' + p.brand + ' - ' + p.name + ' ətirindən sifariş etmək istəyirəm.')}" target="_blank" class="btn-order">Sifariş et</a>
        </div>
      </div>
    </div>
  `).join('');
}

function handleImageError(img) {
  const raw = img.dataset.rawSrc || img.getAttribute('src');
  if (!img.dataset.triedEncode && raw && !raw.startsWith('data:')) {
    img.dataset.triedEncode = '1';
    img.dataset.rawSrc = raw;
    img.src = encodeImageSrc(raw);
    return;
  }
  img.style.display = 'none';
  if (img.nextElementSibling) img.nextElementSibling.style.display = 'flex';
}

function renderAdminPanel() {
  if (!isAdminLoggedIn()) return;
  const grid = document.getElementById('adminGrid');
  if (!grid) return;

  const custom = loadCustomImages();
  grid.innerHTML = products.map(p => {
    const src = getProductImage(p);
    const isCustom = Boolean(custom[String(p.id)]);
    return `
      <div class="admin-card" data-id="${p.id}">
        <div class="admin-card-header">
          <span class="admin-id">ID ${p.id}</span>
          ${isCustom ? '<span class="admin-custom-badge">Yüklənmiş</span>' : '<span class="admin-default-badge">Standart</span>'}
        </div>
        <div class="admin-preview">
          <img id="admin-img-${p.id}" src="${src}" alt="${p.name}">
        </div>
        <div class="admin-meta">
          <div class="admin-brand">${p.brand}</div>
          <div class="admin-name">${p.name}</div>
        </div>
        <div class="admin-actions">
          <label class="btn-upload">
            ${isCustom ? 'Dəyiş' : 'Yüklə'}
            <input type="file" accept="image/*" hidden onchange="handleImageUpload(${p.id}, this)">
          </label>
          <button type="button" class="btn-reset" onclick="resetProductImage(${p.id})" ${isCustom ? '' : 'disabled'}>Sıfırla</button>
        </div>
      </div>
    `;
  }).join('');
}

function handleImageUpload(productId, input) {
  const file = input.files && input.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Yalnız şəkil faylı seçin.');
    input.value = '';
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast('Şəkil çox böyükdür. Maksimum 5 MB.');
    input.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      setCustomImage(productId, reader.result);
      const adminImg = document.getElementById('admin-img-' + productId);
      if (adminImg) adminImg.src = reader.result;
      renderAdminPanel();
      renderProducts(document.querySelector('.filter-btn.active')?.dataset?.filter || 'all');
      showToast('Şəkil #' + productId + ' uğurla saxlanıldı.');
    } catch (e) {
      showToast('Şəkil saxlanıla bilmədi. Brauzer yaddaşı dolu ola bilər.');
    }
    input.value = '';
  };
  reader.readAsDataURL(file);
}

function resetProductImage(productId) {
  removeCustomImage(productId);
  renderAdminPanel();
  renderProducts(document.querySelector('.filter-btn.active')?.dataset?.filter || 'all');
  showToast('Şəkil #' + productId + ' standart fayla qaytarıldı.');
}

function resetAllImages() {
  if (!confirm('Bütün yüklənmiş şəkillər silinsin və standart fayllar istifadə olunsun?')) return;
  clearAllCustomImages();
  renderAdminPanel();
  renderProducts(document.querySelector('.filter-btn.active')?.dataset?.filter || 'all');
  showToast('Bütün şəkillər sıfırlandı.');
}

function exportImageMap() {
  const data = products.map(p => ({
    id: p.id,
    brand: p.brand,
    name: p.name,
    defaultImage: p.image,
    currentImage: getProductImage(p).startsWith('data:') ? '(yüklənmiş)' : getProductImage(p)
  }));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nparfum-image-map.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Şəkil xəritəsi endirildi.');
}

function exportCustomImages() {
  const custom = loadCustomImages();
  if (!Object.keys(custom).length) {
    showToast('Yüklənmiş şəkil yoxdur.');
    return;
  }
  const blob = new Blob([JSON.stringify(custom, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'custom-images.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('custom-images.json endirildi — serverə yükləyin.');
}

function openAdminLogin() {
  const modal = document.getElementById('adminLoginModal');
  if (modal) modal.classList.add('open');
}

function submitAdminLogin(e) {
  e.preventDefault();
  const input = document.getElementById('adminPassword');
  const err = document.getElementById('adminLoginError');
  if (loginAdmin(input.value)) {
    input.value = '';
    if (err) err.textContent = '';
    showToast('Admin paneli açıldı.');
  } else if (err) {
    err.textContent = 'Yanlış parol.';
  }
}

function showToast(message) {
  let toast = document.getElementById('imageToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'imageToast';
    toast.className = 'image-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function filterProducts(filter, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove('active');
    b.dataset.filter = b.textContent.trim() === 'Hamısı' ? 'all'
      : b.textContent.trim() === 'Qadın' ? 'women'
      : b.textContent.trim() === 'Kişi' ? 'men'
      : b.textContent.trim() === 'Uni' ? 'unisex'
      : b.textContent.trim() === 'Niche' ? 'niche' : 'all';
  });
  btn.classList.add('active');
  btn.dataset.filter = filter;
  renderProducts(filter);
}

document.addEventListener('DOMContentLoaded', async () => {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const text = btn.textContent.trim();
    btn.dataset.filter = text === 'Hamısı' ? 'all'
      : text === 'Qadın' ? 'women'
      : text === 'Kişi' ? 'men'
      : text === 'Uni' ? 'unisex'
      : text === 'Niche' ? 'niche' : 'all';
  });

  await loadServerImages();
  renderProducts('all');
  updateAdminVisibility();

  const logo = document.querySelector('.nav-logo');
  if (logo) {
    let taps = 0;
    let tapTimer;
    logo.addEventListener('click', (e) => {
      if (isAdminLoggedIn()) return;
      e.preventDefault();
      taps++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => { taps = 0; }, 800);
      if (taps >= 5) {
        taps = 0;
        openAdminLogin();
      }
    });
  }

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    document.querySelectorAll('.menu-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
});
