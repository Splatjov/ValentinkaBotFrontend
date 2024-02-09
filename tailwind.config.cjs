const config = {
    content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],

    plugins: [require('flowbite/plugin')],

    darkMode: 'class',

    theme: {
        extend: {
            colors: {
                // flowbite-svelte
                primary: {
                    50: '#FFF5F2',
                    100: '#d1e2f6',
                    200: '#bad0fa',
                    300: '#acc4fc',
                    400: '#93b1fc',
                    500: '#7499fa',
                    600: '#628bfa',
                    700: '#6389f6',
                    800: '#4979f8',
                    900: '#2f6af8'
                }
            }
        }
    }
};

module.exports = config;

