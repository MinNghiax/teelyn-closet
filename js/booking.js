const BOOKING_API =
  "https://script.google.com/macros/s/AKfycbxh-JGPCe5LfBWHvVCI-6TJHsgHjdlzsmQvLQpcEQ0kWEWFedmlUeLNiEv9BpBoFcAHBw/exec";

const openBtn = document.getElementById("booking-open");
const modal = document.getElementById("booking-modal");
const cancelBtn = document.getElementById("booking-cancel");
const form = document.getElementById("booking-form");
const submitBtn = form?.querySelector('button[type="submit"]');

const successModal = document.getElementById("success-modal");
const successClose = document.getElementById("success-close");

// OPEN MODAL
if (openBtn && modal) {
  openBtn.addEventListener("click", () => {
    modal.classList.add("active");
  });
}

// CLOSE MODAL
if (cancelBtn) {
  cancelBtn.addEventListener("click", closeModal);
}

function closeModal() {
  modal?.classList.remove("active");
}

// CLOSE SUCCESS MODAL
if (successClose) {
  successClose.addEventListener("click", () => {
    successModal.classList.remove("active");
  });
}

// CALL API
async function submitBooking(data) {
  await fetch(BOOKING_API, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(data)
  });
}

// SUBMIT FORM
form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (submitBtn?.disabled) return;

  const data = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    service: form.service.value,
    date: form.date.value,
    time: form.time.value,
    note: form.note.value.trim()
  };

  const originalLabel = submitBtn?.textContent;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Đang gửi...";
  }

  try {
    await submitBooking(data);

    // reset form
    form.reset();

    // đóng modal form
    closeModal();

    // mở modal success
    successModal.classList.add("active");

  } catch (error) {
    console.error("Booking submit failed:", error);
    alert("Gửi đăng ký thất bại. Vui lòng thử lại!");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel || "Xác nhận";
    }
  }
});
