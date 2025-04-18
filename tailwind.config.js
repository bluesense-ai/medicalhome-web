/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['"Roboto"'],
        inter: ["Inter"],
      },
      backgroundImage: {
        "verification-method-screen-background":
          "url('/images/VerificationMethodScreenBackground.svg')",
        "arrow-component": "url('/images/ButtonArrow.svg')",
        "patient-login-background": "url('/images/PatientLoginBackground.svg')",
        "medical-home-logo": "url('/Icons/MedicalHome.svg')",
        "hope-health-center": "url('/images/HopeHealthCenter.svg')",
        "walmart-clinic": "url('/images/WalmartClinic.svg')",
        "patient-status-background-image":
          "url('/images/PatientStatusBackground.svg')",
        "healthcard-onboarding-background-image":
          "url('/images/HealthcardOnboardingBackground.svg')",
        "provider-onboarding-background-image":
          "url('/images/ProviderOnboardingImage.svg')",
      },
      keyframes: {
        scale: {
          "0%": {
            transform: "scaleX(0.80) scaleY(0.80)",
            transformOrigin: "right center",
          },
          "50%": {
            transform: "scaleX(0.9) scaleY(0.9)",
            transformOrigin: "right center",
          },

          "100%": {
            transform: "scaleX(1) scaleY(1)",
            transformOrigin: "right center",
          },
        },
        vector: {
          "0%": {
            transform: "scaleX(0.7) scaleY(0.7)",
            transformOrigin: "top left",
          },
          "100%": {
            transform: "scaleX(1) scaleY(1)",
            transformOrigin: "top left",
          },
        },
      },
      animation: {
        "scale-animation": "scale 1.3s linear 1",
        "vector-animation": "vector 2s ease-in-out 1",
      },
    },
  },
  plugins: [],
};
