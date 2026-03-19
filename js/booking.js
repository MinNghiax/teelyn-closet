const BOOKING_API =
  "https://script.google.com/macros/s/AKfycbzrEEJbko0kgube37CdDnMpXwHa9W-1CTh-TxWRHqef_81WNGB-ppFImH5ImLJd6VAHrg/exec";

const openBtn = document.getElementById("booking-open");
const modal = document.getElementById("booking-modal");
const closeBtn = document.getElementById("booking-close");
const cancelBtn = document.getElementById("booking-cancel");
const form = document.getElementById("booking-form");
const submitBtn = form?.querySelector('button[type="submit"]');

if (openBtn && modal) {
  openBtn.addEventListener("click", () => {
    modal.classList.add("active");
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", closeModal);
}

if (cancelBtn) {
  cancelBtn.addEventListener("click", closeModal);
}

function closeModal() {
  modal?.classList.remove("active");
}

async function submitBooking(data) {
  await fetch(BOOKING_API, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(data)
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
    datetime: form.datetime.value,
    note: form.note.value.trim()
  };

  const originalLabel = submitBtn?.textContent;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Dang gui...";
  }

  try {
    await submitBooking(data);

    alert("Da gui dang ky. Shop se lien he voi ban som.");
    form.reset();
    closeModal();
  } catch (error) {
    console.error("Booking submit failed:", error);
    alert("Gui dang ky that bai. Vui long thu lai sau.");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel || "Xac nhan";
    }
  }
});
