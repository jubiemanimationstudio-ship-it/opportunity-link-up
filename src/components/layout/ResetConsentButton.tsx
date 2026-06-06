"use client";

export function ResetConsentButton() {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          localStorage.removeItem("tol_consent_v1");
          document.cookie = "tol_consent=; path=/; max-age=0";
          location.reload();
        } catch {}
      }}
      className="underline decoration-accent underline-offset-4 hover:text-white"
      title="Change cookie preferences"
    >
      Cookies
    </button>
  );
}
