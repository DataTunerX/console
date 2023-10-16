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
} from './release-utils';

/*
 * Minor Release
 * 1. [master] generate CHANGELOG in master
 * 2. [master] git commit
 * 3. [release] git checkout -b release-x.y
 * 4. [release] git tag vx.y.0
 * 5. [release] change package.json to x.y.1
 * 6. [release] git commit & push
 * 7. [master] git checkout master
 * 8. [master] change package.json to x.y+1.0
 * 9. [master] git commit & push
 */

const minorRelease = () => {
  const { version } = readJSONSync('package.json');
  const majorVersion = version.split('.')[0];
  const minorVersion = version.split('.')[1];

  gitLogin();

  // master branch
  gitCheckout('master');
  generateChangelog();
  gitCommit(`chore(release): add ${version} changelog`);
  // end

  // release branch
  gitCheckout(`release-${majorVersion}.${minorVersion}`, true);
  gitTag(`v${majorVersion}.${minorVersion}.0`);

  updatePackageJsonVersion('patch');
  gitPush(`release-${majorVersion}.${minorVersion}`);
  gitPushTag(`v${majorVersion}.${minorVersion}.0`);
  // end

  // master branch
  gitCheckout('master');
  updatePackageJsonVersion('minor');
  gitPush('master');
};

minorRelease();
