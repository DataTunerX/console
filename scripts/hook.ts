/**
 * 在自动修改完 values.yaml 后调用的方法
 * @param basePath 后端 repo 的 basePath
 * @param version 当前的版本号
 */
export function onUpgradeFinish(basePath: string, version: string) {
  /* eslint-disable no-console */
  console.log(basePath, version);
}
