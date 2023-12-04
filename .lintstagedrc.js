const fs = require('fs');
const { resolve } = require('path/posix');
const { ESLint } = require('eslint');

const generateTSConfig = (stagedFilenames) => (type) => {
  if (stagedFilenames.length === 0) return '';
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  const srcDir = resolve('src/**/*.d.ts');

  stagedFilenames.push(srcDir);
  tsconfig.include = stagedFilenames;

  tsconfig.compilerOptions.paths['@/*'] = ['../src/*'];

  fs.writeFileSync('node_modules/tsconfig.lint.json', JSON.stringify(tsconfig));

  return `${type} --noEmit --project node_modules/tsconfig.lint.json`;
};

// 处理 eslint warning: File ignored by default.
const removeEslintIgnored = async (stagedFilenames) => {
  if (stagedFilenames.length === 0) return '';
  const eslint = new ESLint();
  const isIgnored = await Promise.all(
    stagedFilenames.map((file) => eslint.isPathIgnored(file)),
  );
  const filteredFiles = stagedFilenames.filter((_, i) => !isIgnored[i]);

  // console.log("filteredFiles:"+filteredFiles)
  return `eslint --max-warnings=0   ${filteredFiles.join(' ')}`;
};

module.exports = {
  'src/**/*.{vue,css,scss}': 'stylelint --allow-empty-input',
  '*.{vue,ts,tsx}': [async (files) => removeEslintIgnored(files), (files) => generateTSConfig(files)('vue-tsc')],
  '*.{json,js,jsx}': [async (files) => removeEslintIgnored(files)],
};
