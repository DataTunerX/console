import { execSync } from 'child_process';
import { readJSONSync } from 'fs-extra';
import { resolve } from 'path';
import semver from 'semver';
import { updateVersion } from './modify';
import { onUpgradeFinish } from './hook';

const { name } = readJSONSync('package.json');

const version = (execSync('git describe --tags --always').toString() || 'unknown').split('\n')[0];

const tokenName = process.env.GITLAB_FE_PR_TOKEN_NAME || 'release-ci-token';
const project = process.env.BACKEND_PROJECT || ((name || '').split('-')[0]);
const group = process.env.BACKEND_GROUP || 'ndx';
let targetBranch = process.env.BACKEND_BRANCH || 'master';
const versionGap = process.env.VERSION_GAP || 0;
const keyPath = process.env.UI_TAG_PATH || 'ui:.image:.tag:'; // 找到 ui: 之后的最近的 image: 之后再找到离 image: 最近的 tag: , 可以根据需求进行扩展，最后的为最终的目标行条件
const versionFilePath = process.env.UI_VALUES || './charts/values.yaml';

const major = semver.major(version) ?? 0;
const minor = semver.minor(version) ?? 0;

targetBranch = targetBranch.replace(/{version}/, `${major}.${minor + Number(versionGap)}`);

const cloneCmd = `git clone  https://${tokenName}:${process.env.GITLAB_FE_PR_TOKEN}@gitlab.daocloud.cn/${group}/${project}.git`;

// set git username & email
execSync('git config --global user.email "uee-chart-bot@daocloud.io"', { stdio: 'inherit' });
execSync('git config --global user.name "uee chart bot"', { stdio: 'inherit' });

// clone project
execSync(`cd .. && ls -al && ${cloneCmd}`, { stdio: 'inherit' });

// 变更工作目录
process.chdir(`../${project}`);

// checkout new git branch
const newBranchName = `chore/ui_upgrade-version-to-${version}`;

execSync('git fetch', { stdio: 'inherit' });
execSync(`git checkout ${targetBranch}`, { stdio: 'inherit' });
execSync(`git checkout -b ${newBranchName}`, { stdio: 'inherit' });

// find version file
const basePath = './';

const absolutePath = resolve(basePath, versionFilePath);

// change version file
const lastVersion = updateVersion(absolutePath, keyPath, version);

onUpgradeFinish(basePath, version);

// commit change
execSync('git add .', { stdio: 'inherit' });
execSync(`git commit -m "chore(ui): upgrade ui from ${lastVersion} to ${version}"`, { stdio: 'inherit' });

// push new branch to remote
execSync(`git push origin ${newBranchName}`, { stdio: 'inherit' });

// call api to create new merge request.
const projectId = encodeURIComponent(`${group}/${project}`);

const curlUrl = `https://gitlab.daocloud.cn/api/v4/projects/${projectId}/merge_requests`;

const curlHeader = `--header "Private-Token: ${process.env.GITLAB_FE_PR_TOKEN}" --header "Content-Type: application/json"`;

const curlData = {
  id: projectId,
  source_branch: newBranchName,
  target_branch: targetBranch,
  title: `chore(ui): upgrade ui from ${lastVersion} to ${version}`,
  remove_source_branch: true,
};

const curlDataStr = `--data '${JSON.stringify(curlData)}'`;

execSync(`curl --request POST ${curlHeader} ${curlDataStr} "${curlUrl}"`, { stdio: 'inherit' });
