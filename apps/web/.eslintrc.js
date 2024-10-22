/** @type {import("eslint").Linter.Config} */
const config = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: [
    'eslint-plugin-react-compiler',
    '@typescript-eslint',
    'tailwindcss',
  ],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended-type-checked',
    'prettier',
    'plugin:tailwindcss/recommended',
  ],
  rules: {
    'react-compiler/react-compiler': 'error',
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'tailwindcss/no-custom-classname': [
      'error',
      {
        config: require('./tailwind.config'),
      },
    ],
  },
  settings: {
    tailwindcss: {
      callees: ['cn', 'cva'],
      config: require('./tailwind.config'),
      classRegex: '^(class(Name)?|tw)$',
    },
    next: {
      rootDir: ['./'],
    },
  },
};

module.exports = config;
