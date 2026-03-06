// ===== CONFIG =====

// Link Google Apps Script API
const API_URL = "https://script.google.com/macros/s/AKfycby2_lGPW5l9gKaJjzj9HdTqCnuDiI2U-yf_kSqs1339VdblJvWnqwQuh8glu7-ithhvZA/exec";

// Folder cha chứa các folder ảnh
const PARENT_FOLDER_ID = "17faevYEQAl2yfMVeigHTOhKCX-ACUWRH";

// Placeholder ảnh
const PLACEHOLDER_SRC =
"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

let currentGalleryImages = [];


// ===== INIT =====

document.addEventListener("DOMContentLoaded", () => {
  initGallery();
});


async function initGallery() {

  const navContainer = document.querySelector(".categories");

  try {

    const res = await fetch(`${API_URL}?action=getFolders&folderId=${PARENT_FOLDER_ID}`);

    const folders = await res.json();

    if (folders.error || folders.length === 0) {

      navContainer.innerHTML = "<p style='color:red'>Không tìm thấy danh mục.</p>";
      return;

    }

    folders.sort((a,b)=>a.name.localeCompare(b.name));

    navContainer.innerHTML = folders.map((folder,index)=>`

      <button
        class="${index===0?'active':''}"
        onclick="handleCategoryClick(this,'${folder.id}')"
      >
        ${folder.name}
      </button>

    `).join("");

    loadImages(folders[0].id);

  }
  catch(err){

    console.error(err);

    navContainer.innerHTML = "<p>Lỗi kết nối server.</p>";

  }

}


// ===== CATEGORY CLICK =====

function handleCategoryClick(btn,folderId){

  document.querySelectorAll(".categories button")
  .forEach(b=>b.classList.remove("active"));

  btn.classList.add("active");

  loadImages(folderId);

}


// ===== LOAD IMAGES =====

async function loadImages(folderId){

  const gallery = document.getElementById("gallery");

  const sessionKey = `gallery_${folderId}`;

  const cached = sessionStorage.getItem(sessionKey);

  if(cached){

    renderGallery(JSON.parse(cached));
    return;

  }

  gallery.innerHTML =
  '<div class="loader"><i class="fas fa-spinner fa-spin"></i> Đang tải ảnh...</div>';

  try{

    const res = await fetch(`${API_URL}?folderId=${folderId}`);

    const files = await res.json();

    if(files.error){

      gallery.innerHTML = `<p>Lỗi: ${files.error}</p>`;
      return;

    }

    sessionStorage.setItem(sessionKey,JSON.stringify(files));

    renderGallery(files);

  }
  catch(err){

    console.error(err);

    gallery.innerHTML = "<p>Lỗi kết nối.</p>";

  }

}


// ===== RENDER GALLERY =====

function renderGallery(files){

  const gallery = document.getElementById("gallery");

  if(files.length===0){

    gallery.innerHTML = "<p>Danh mục này chưa có ảnh.</p>";
    return;

  }

  currentGalleryImages = files;

  gallery.innerHTML = files.map(file=>`

    <div class="img-card">

      <img
        src="${PLACEHOLDER_SRC}"
        data-file-id="${file.id}"
        alt="${file.name}"
        class="gallery-img"
      >

      <div class="img-caption">${file.name}</div>

    </div>

  `).join("");

  const images = document.querySelectorAll(".gallery-img");

  images.forEach(img=>observer.observe(img));

}


// ===== LAZY LOAD =====

const observer = new IntersectionObserver((entries,observer)=>{

  entries.forEach(entry=>{

    if(entry.isIntersecting){

      const img = entry.target;

      loadImage(img);

      observer.unobserve(img);

    }

  });

},{
  rootMargin:"300px"
});


function loadImage(img){

  const fileId = img.dataset.fileId;

  const thumbUrl =
  `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;

  img.src = thumbUrl;

  img.onload = ()=> img.classList.add("loaded");

  img.onerror = ()=>{

    img.parentElement.style.display="none";

  };

}


// ===== IMAGE POPUP =====

document.addEventListener("click",function(e){

  if(e.target.classList.contains("gallery-img")){

    const fileId = e.target.dataset.fileId;

    // LINK FULL ẢNH CHUẨN GOOGLE DRIVE
    const fullSrc =
    `https://lh3.googleusercontent.com/d/${fileId}`;

    openImagePopup(fullSrc);

  }

});


function openImagePopup(src){

  const popup = document.getElementById("imagePopup");

  const popupImg = document.getElementById("popupImage");

  popupImg.src="";

  popup.classList.add("active");

  popupImg.src = src;

  document.body.style.overflow="hidden";

}


function closeImagePopup(){

  document.getElementById("imagePopup")
  .classList.remove("active");

  document.body.style.overflow="";

}


document.getElementById("imagePopup")
.addEventListener("click",function(e){

  if(e.target===this) closeImagePopup();

});