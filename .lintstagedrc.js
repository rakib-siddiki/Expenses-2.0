/* eslint-env node */
const path = require('path');

const eslintCommand = (filenames) =>
    `next lint --file ${filenames
        .map((f) => path.relative(process.cwd(), f))
        .join(' --file ')}`;

const formatCommand = (filenames) =>
    `prettier --write ${filenames
        .map((f) => path.relative(process.cwd(), f))
        .join(' ')}`;

module.exports = {
    // Type check TypeScript files
    'src/**/*.(ts|tsx)': () => 'tsc --noEmit',

    // Lint & Prettify TS and JS files
    'src/**/*.{js,jsx,ts,tsx}': (filenames) => [
        formatCommand(filenames),
        eslintCommand(filenames)
    ],

    // Prettify CSS and SCSS files
    'src/**/*.{css,scss}': (filenames) => formatCommand(filenames),

    // Prettify only Markdown and JSON files
    '**/*.(md|json)': (filenames) => formatCommand(filenames)
};
