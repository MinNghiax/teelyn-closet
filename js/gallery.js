// Dán link Web App mới của bạn vào đây
const API_URL = "https://script.google.com/macros/s/AKfycbxFJzi07kZn399Rmckdp8aRli9LTyjK01q6h0bCe-k33Fdf75fq1xmhDidNpAwhdsOKww/exec"; 

// ID CỦA FOLDER LỚN (CHA) CHỨA CÁC MỤC CON
// Bạn hãy thay ID này bằng ID thư mục gốc của bạn trên Drive
const PARENT_FOLDER_ID = "1NPDMS_5lPEmJNFP-BAOxv-4l6S3XMVKU"; 

const PLACEHOLDER_SRC = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// --- KHỞI TẠO TRANG ---
document.addEventListener("DOMContentLoaded", () => {
  initGallery();
});

async function initGallery() {
  const navContainer = document.querySelector(".categories");
  
  // 1. Lấy danh sách các mục (Folder con)
  try {
    const res = await fetch(`${API_URL}?action=getFolders&folderId=${PARENT_FOLDER_ID}`);
    const folders = await res.json();
    
    if (folders.error || folders.length === 0) {
      navContainer.innerHTML = "<p style='color:red'>Không tìm thấy danh mục nào.</p>";
      return;
    }

    // Sắp xếp folder theo tên (A-Z)
    folders.sort((a, b) => a.name.localeCompare(b.name));

    // 2. Tạo nút bấm động
    navContainer.innerHTML = folders.map((folder, index) => `
      <button 
        class="${index === 0 ? 'active' : ''}" 
        onclick="handleCategoryClick(this, '${folder.id}')"
      >
        ${folder.name}
      </button>
    `).join('');

    // 3. Tự động tải ảnh của mục đầu tiên
    if (folders.length > 0) {
      loadImages(folders[0].id);
    }

  } catch (err) {
    console.error("Lỗi khởi tạo:", err);
    navContainer.innerHTML = "<p>Lỗi kết nối Server.</p>";
  }
}

// Hàm xử lý khi bấm vào nút danh mục
function handleCategoryClick(btn, folderId) {
  // Xóa class active cũ
  document.querySelectorAll(".categories button").forEach(b => b.classList.remove("active"));
  // Thêm active cho nút mới
  btn.classList.add("active");
  // Tải ảnh
  loadImages(folderId);
}

// --- CẤU HÌNH LAZY LOAD ---
const observerOptions = {
  root: null,
  rootMargin: "300px",
  threshold: 0
};

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      loadImage(img);
      observer.unobserve(img);
    }
  });
}, observerOptions);

function loadImage(img) {
  const fileId = img.dataset.fileId;
  const thumbUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400-p`; 
  const fullUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;

  img.src = thumbUrl;
  img.dataset.fullSrc = fullUrl;

  img.onload = () => img.classList.add('loaded');
  img.onerror = () => { img.parentElement.style.display = 'none'; };
}

// --- HÀM TẢI ẢNH (GIỮ NGUYÊN LOGIC CŨ) ---
async function loadImages(folderId) {
  const gallery = document.getElementById("gallery");
  
  const sessionKey = `gallery_data_${folderId}`;
  const cachedData = sessionStorage.getItem(sessionKey);

  if (cachedData) {
    renderGallery(JSON.parse(cachedData));
    return;
  }

  gallery.innerHTML = '<div class="loader"><i class="fas fa-spinner fa-spin"></i> Đang tải ảnh...</div>';

  try {
    // Gọi API lấy ảnh (action mặc định là getImages)
    const res = await fetch(`${API_URL}?folderId=${folderId}`);
    const files = await res.json();

    if (files.error) {
      gallery.innerHTML = `<p>Lỗi: ${files.error}</p>`;
      return;
    }

    sessionStorage.setItem(sessionKey, JSON.stringify(files));
    renderGallery(files);

  } catch (err) {
    console.error(err);
    gallery.innerHTML = "<p>Lỗi kết nối!</p>";
  }
}

function renderGallery(files) {
  const gallery = document.getElementById("gallery");
  
  if (files.length === 0) {
    gallery.innerHTML = "<p>Danh mục này chưa có ảnh.</p>";
    return;
  }

  gallery.innerHTML = files.map(file => `
    <div class="img-card">
      <img 
        src="${PLACEHOLDER_SRC}" 
        data-file-id="${file.id}" 
        alt="${file.name}" 
        class="gallery-img"
      >
      <div class="img-caption">${file.name}</div>
    </div>
  `).join('');

  const images = document.querySelectorAll('.gallery-img');
  images.forEach(img => imageObserver.observe(img));
}

// --- POPUP EVENTS ---
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("gallery-img")) {
    const fullSrc = e.target.dataset.fullSrc;
    if (fullSrc) openImagePopup(fullSrc);
  }
});

function openImagePopup(src) {
  const popup = document.getElementById("imagePopup");
  const popupImg = document.getElementById("popupImage");
  popupImg.src = "";
  popup.classList.add("active");
  popupImg.src = src;
  document.body.style.overflow = "hidden";
}

function closeImagePopup() {
  document.getElementById("imagePopup").classList.remove("active");
  document.body.style.overflow = "";
}

document.getElementById("imagePopup").addEventListener("click", function(e) {
  if (e.target === this) closeImagePopup();
});