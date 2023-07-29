module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'prefer-const': 'warn',
    'import/no-unresolved': 'off',
  },
  //   parserOptions: {
  //     ecmaVersion: 'latest',
  //     ecmaFeatures: {
  //       jsx: true,
  //     },
  //     sourceType: 'module',
  //     project: './tsconfig.json',
  //   },
}
