/** @type {import('tailwindcss').Config} */
export default {
        content: [
                "./src/**/*.{svelte,html,js,ts}",
                "./svelte.config.js"
        ],
        theme: {
                extend: {
                        backgroundImage: {
                                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                                "gradient-conic":
                                        "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                        },
                        colors: {
                                dark: "#111111",
                                light: "#f6f6f6",
                                accent: "#ffcb74",
                                "accent-100": "#f4c77f",
                                "accent-200": "#f7a218",
                                secondary: "#2f2f2f",
                        },
                        fontSize: {
                                sm: "clamp(0.8rem, 0.17vi + 0.76rem, 0.89rem)",
                                base: "clamp(1rem, 0.34vi + 0.91rem, 1.19rem)",
                                lg: "clamp(1.25rem, 0.61vi + 1.1rem, 1.58rem)",
                                xl: "clamp(1.56rem, 1vi + 1.31rem, 2.11rem)",
                                "2xl": "clamp(1.95rem, 1.56vi + 1.56rem, 2.81rem)",
                                "3xl": "clamp(2.44rem, 2.38vi + 1.85rem, 3.75rem)",
                                "4xl": "clamp(3.05rem, 3.54vi + 2.17rem, 5rem)",
                                "5xl": "clamp(3.81rem, 5.18vi + 2.52rem, 6.66rem)",
                                "6xl": "clamp(4.77rem, 7.48vi + 2.9rem, 8.88rem)",
                        }
                },
        },
};

