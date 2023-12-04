# UI 发布流程

UI 的版本号遵循 DCE 5.0 版本规范，即用语义化版本。

UI 所有的新版本开发（功能迭代）都在主分支（master） 上进行，对于已经发布的版本，会维护在 release-x.y 的分支上，如果有 BUG 需要修复，需要先在 master 分支提交修复的 MR，然后运用 cherry-pick 流程将修复的 MR 合并到 release-x.y 分支上。
当当前版本（如 0.10）已经开发完成准备测试时，从 master checkout 一个新分支 release-0.10，并进行打 Tag v0.10.0，交由测试进行测试，同时 master 分支的 package.json 修改为 0.11.0。如果有 Bug，将按照 Bug 修复流程，先在 master 分支上修复，然后 cherry-pick 到 release-0.10，待到一定时间后发布 v0.10.1 进行测试，如此往复。同时，master 分支可以直接开始开发新功能。

## 发布操作流程

Minor release 和 Patch release 流程已经变为 GitLab Pipeline 自动化流程，流程执行步骤如下

### RC Release

1. 手动在 master 分支上新增 tag v0.10.0-rc.x（x 从 1 开始自增），并推送到远程
2. 流水线自动触发执行，等待执行成功，检查运行结果是否正确

### Minor Release

![alt minor-release](https://dn-daoweb-resource.qbox.me/ndx-uee/minor-release.png)

0. 确认 API SDK 已经是最新的 RC 版本，并且最新的 master 分支流水线已经成功执行，且自测无问题；确认后端 release 分支已经建立，名称为 release-0.10+Δv 格式
1. 进入 GitLab Pipeline 页面，选择手动执行 Pipeline
2. 分支选择 master
3. 输入环境变量，key 为 `RELEASE`，value 为 `minor`
4. 开始执行，等待执行成功，并检查运行结果是否正确

### Patch Release

![alt patch-release](https://dn-daoweb-resource.qbox.me/ndx-uee/patch-release.png)

0. 确认 release-0.10 分支流水线已经成功执行，且自测无问题
1. 进入 GitLab Pipeline 页面，选择手动执行 Pipeline
2. 分支选择 release-0.10
3. 输入环境变量，key 为 `RELEASE`，value 为 `patch`
4. 开始执行，等待执行成功，并检查运行结果是否正确
