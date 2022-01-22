module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary: "RGB(3, 169, 245)",
    },
    extend: {
      backgroundImage: () => ({
        "login-background":
          "linear-gradient(rgba(0,0,0, 0.75), rgba(0,0,0, 0.75)), url('/src/assets/images/background-1920x1280.jpg')",
      }),
    },
  },

  plugins: [],
};
