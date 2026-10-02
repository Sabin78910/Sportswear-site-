/**
 * Newsletter form.
 * Swap `submitEmail` for a real request to your email provider (Klaviyo, Mailchimp, etc.).
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function submitEmail(/* email */) {
  // Example:
  // await fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email }) });
  return Promise.resolve();
}

export function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  const input = document.getElementById("newsletter-email");
  const message = document.getElementById("newsletter-msg");
  if (!form || !input || !message) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = input.value.trim();

    if (!EMAIL_PATTERN.test(email)) {
      message.textContent = "Enter an email address like name@domain.com.";
      input.focus();
      return;
    }

    try {
      await submitEmail(email);
      message.textContent = "You're on the grid list.";
      form.reset();
    } catch {
      message.textContent = "Couldn't sign you up. Check your connection and try again.";
    }
  });
}
