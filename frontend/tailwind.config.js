/** @type {import('tailwindcss').Config} */
export default {
    content: ["./node_modules/flowbite/**/*.js", "./src/**/*.{html,vue,js}"],
    theme: {
        extend: {
            fontFamily: {
                montserrat: ['"Montserrat"', "sans-serif"],
            },
        },
    },
    plugins: [require("flowbite/plugin")],
    daisyui: {
        themes: [{}],
    },
};
