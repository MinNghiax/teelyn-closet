/* js/theme.js */

const toggleBtn = document.getElementById('theme-toggle');
// Tìm thẻ i bên trong nút (nếu có), nếu không thì chính là nút đó
const toggleIcon = toggleBtn.querySelector('i'); 
const html = document.documentElement;

// 1. Kiểm tra xem người dùng đã lưu chế độ nào chưa
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  html.setAttribute('data-theme', 'dark');
  if (toggleIcon) toggleIcon.classList.replace('fa-moon', 'fa-sun');
}

// 2. Hàm xử lý khi bấm nút
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    if (html.getAttribute('data-theme') === 'dark') {
      // Chuyển sang sáng
      html.removeAttribute('data-theme');
      if (toggleIcon) toggleIcon.classList.replace('fa-sun', 'fa-moon');
      localStorage.setItem('theme', 'light');
    } else {
      // Chuyển sang tối
      html.setAttribute('data-theme', 'dark');
      if (toggleIcon) toggleIcon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem('theme', 'dark');
    }
  });
}