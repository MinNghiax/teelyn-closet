const BOOKING_API =
  "https://script.google.com/macros/s/AKfycby-1ms4AlqzmZQlkL8A7Lm34DQEPnaINxiUNI2l0_ya6PNDCTNnsOzrpZkHUaOpnzalFw/exec";

const openBtn = document.getElementById("booking-open");
const modal = document.getElementById("booking-modal");
const cancelBtn = document.getElementById("booking-cancel");
const form = document.getElementById("booking-form");
const submitBtn = form?.querySelector('button[type="submit"]');

const successModal = document.getElementById("success-modal");
const successClose = document.getElementById("success-close");

if (openBtn && modal) {
  openBtn.addEventListener("click", () => {
    modal.classList.add("active");
  });
}

if (cancelBtn) {
  cancelBtn.addEventListener("click", closeModal);
}

if (successClose) {
  successClose.addEventListener("click", () => {
    successModal?.classList.remove("active");
  });
}

function closeModal() {
  modal?.classList.remove("active");
}

async function submitBooking(data) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value ?? "");
  });

  await fetch(BOOKING_API, {
    method: "POST",
    mode: "no-cors",
    body: formData
  });
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (submitBtn?.disabled) {
    return;
  }

  const data = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    service: form.service.value,
    date: form.date.value,
    time: form.time.value,
    note: form.note.value.trim()
  };

  const originalLabel = submitBtn?.textContent || "Xac nhan";

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Dang gui...";
  }

  try {
    await submitBooking(data);

    form.reset();
    closeModal();
    successModal?.classList.add("active");
  } catch (error) {
    console.error("Booking submit failed:", error);
    alert("Gui dang ky that bai. Vui long thu lai!");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  }
});
