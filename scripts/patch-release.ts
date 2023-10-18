import { execSync } from 'child_process';
import { readJSONSync } from 'fs-extra';
import {
  gitLogin,
  generateChangelog,
  gitCommit,
  gitCheckout,
  gitTag,
  gitPushTag,
  updatePackageJsonVersion,
  gitPush,
  gitFetch,
} from './release-utils';

/*
 * Patch Release
 * 1. [release] generate CHANGELOG in release-x.y
 * 2. [release] git commit
 * 3. [release] git tag x.y.z
 * 4. [release] change package.json to x.y.z+1
 * 5. [release] git commit & push
 * 6. [master] generate CHANGELOG in master
 * 7. [master] git commit & push
 */

const patchRelease = () => {
  const { version } = readJSONSync('package.json');
  const majorVersion = version.split('.')[0];
  const minorVersion = version.split('.')[1];
  const patchVersion = version.split('.')[2];
  const currentBranch = process.env.CI_COMMIT_BRANCH as string;

  gitLogin();

  // release branch
  gitCheckout(currentBranch);
  generateChangelog();
  gitCommit(`chore(release): add ${version} changelog`);
  gitTag(`v${majorVersion}.${minorVersion}.${patchVersion}`);
  updatePackageJsonVersion('patch');
  gitPush(currentBranch);
  gitPushTag(`v${majorVersion}.${minorVersion}.${patchVersion}`);
  execSync(`cp CHANGELOG/v${majorVersion}.${minorVersion}/CHANGELOG-v${version}.md ..`, { stdio: 'inherit' });
  // end

  // master branch
  gitFetch();
  gitCheckout('master');
  // generateChangelog();
  execSync(`cp ../CHANGELOG-v${version}.md CHANGELOG/v${majorVersion}.${minorVersion}`, { stdio: 'inherit' });
  gitCommit(`chore(release): add ${version} changelog`);
  gitPush('master');
  // end
};

patchRelease();
