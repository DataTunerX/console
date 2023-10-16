import { execSync } from 'child_process';
import { readJSONSync } from 'fs-extra';

const gitlabHost = 'gitlab.daocloud.cn';
const { version } = readJSONSync('package.json');
const majorVersion = version.split('.')[0];
const minorVersion = version.split('.')[1];

export const gitLogin = () => {
  execSync('git config --global user.email "ndx-uee-bot@daocloud.io"', { stdio: 'inherit' });
  execSync('git config --global user.name "ndx uee bot"', { stdio: 'inherit' });
  execSync(
    `git remote set-url origin https://gitlab-ci-token:${process.env.GITLAB_FE_PR_TOKEN}@${gitlabHost}/${process.env.CI_PROJECT_PATH}.git`,
    { stdio: 'inherit' },
  );
};

export const generateChangelog = () => {
  const changeLogPath = `CHANGELOG/v${majorVersion}.${minorVersion}`;
  const changeLogFile = `CHANGELOG-v${version}.md`;

  execSync(`mkdir -p ${changeLogPath}`, { stdio: 'inherit' });
  execSync('pwd', { stdio: 'inherit' });
  execSync(`npx conventional-changelog -p angular -o ${changeLogPath}/${changeLogFile} -r 1 --skip-unstable`, { stdio: 'inherit' });
};

export const gitCommit = (msg: string) => {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "${msg}" --no-verify`, { stdio: 'inherit' });
};

export const gitCheckout = (branch: string, isNew = false) => {
  if (isNew) {
    execSync(`git checkout -b ${branch}`, { stdio: 'inherit' });
  } else {
    execSync(`git checkout ${branch}`, { stdio: 'inherit' });
  }
};

export const gitTag = (tag: string) => {
  execSync(`git tag ${tag}`, { stdio: 'inherit' });
};

export const gitPushTag = (tag: string) => {
  execSync(`git push origin ${tag}`, { stdio: 'inherit' });
};

export const updatePackageJsonVersion = (type: 'major' | 'minor' | 'patch') => {
  execSync(`npx bump ${type}`, { stdio: 'inherit' });
  const { version: newVersion } = readJSONSync('package.json');

  gitCommit(`chore(release): update package.json version to ${newVersion}`);
};

export const gitPush = (branch: string) => {
  execSync(`git push --set-upstream origin ${branch} --follow-tags`, { stdio: 'inherit' });
};

export const gitFetch = () => {
  execSync('git fetch', { stdio: 'inherit' });
};
