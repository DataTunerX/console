module.exports = {
  extends: [
    'stylelint-config-recess-order',
    'stylelint-config-sass-guidelines',
    'stylelint-config-recommended-vue',
  ],
  rules: {
    'max-nesting-depth': [
      6,
      {
        ignore: ['pseudo-classes'],
      },
    ],
    'order/properties-alphabetical-order': null,
    'selector-class-pattern': '^[a-z0-9\\-\\_]+$',
    'scss/at-import-partial-extension-whitelist': ['scss'],
    'scss/at-import-partial-extension-blacklist': [''],
    // 'color-hex-length': 'long',
  },
};
