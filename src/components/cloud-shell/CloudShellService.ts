import { nError } from '@/utils/useNoty';
import { i18n } from '@/plugins/vue-i18n';
import {
  cloudShellClient, CloudShell, Spec as CloudShellSpec, apiVersion, kind,
} from '@/api/cloudshell';

/**
 * 后端返回的是相对路径，需要转换成绝对路径
 * @param url
 */
function getCorrectURL(url = '') {
  return url.startsWith('./') ? url : `.${url}`;
}

const ttl = 3600; // shell过期时间(s)
const once = false; // shell页面，是否刷新后则不可访问
const cleanup = true; // 后端自动清除长时间未使用的shell

export enum CommandType {
  // CommandTypeBash is a CommandType that indicates the commands can be executed from the terminal.
  CommandTypeBash = 'bash',
  // CommandTypeExec is a CommandType that indicates into the container.
  CommandTypeExec = 'exec',
  // CommandTypeLogs is a CommandType that indicates query pod logs.
  CommandTypeLogs = 'logs',
  // CommandTypeUpload is a CommandType that indicates upload a file to pod.
  CommandTypeUpload = 'upload',
  // CommandTypeDownload is a CommandType that indicates download a file from pod.
  CommandTypeDownload = 'download',
}

export interface CloudShellRequest {
  namespace: string;
  podName: string;
  container: string;
  type: CommandType;
}

export interface TerminalState {
  metadataName?: string; // 查询、删除CloudShell时使用
  shellName: string; // tab显示名
  shellUrl?: string; // iframe地址
  urlParams: CloudShellRequest;
  config?: CloudShellSpec;
}

function commandBuild(
  namespace: string,
  podName: string,
  container: string,
  logCount: number,
  commandType: CommandType,
): string {
  let command = '';
  let updatedLogCount = logCount;

  switch (commandType) {
    case CommandType.CommandTypeBash:
      command = CommandType.CommandTypeBash;
      break;
    case CommandType.CommandTypeExec:
      command = `kubectl exec -it ${podName}`;
      if (namespace !== '') {
        command += ` -n ${namespace}`;
      }
      if (container !== '') {
        command += ` -c ${container}`;
      }
      command += ' -- sh -c "bash||sh"';
      break;
    case CommandType.CommandTypeLogs:
      if (logCount === 0) {
        updatedLogCount = 100;
      }
      command = `kubectl logs -f --tail ${updatedLogCount} ${podName}`;
      if (namespace !== '') {
        command += ` -n ${namespace}`;
      }
      if (container !== '') {
        command += ` -c ${container}`;
      }
      break;
    default:
      command = CommandType.CommandTypeBash;
  }

  return command;
}

export const createCloudShell = async (
  {
    namespace, podName, container, type,
  }: CloudShellRequest,
  config?: CloudShellSpec,
): Promise<CloudShell & { shellUrl?: string }> => {
  const spec = {
    ttl,
    once,
    cleanup,
    ...config,
    commandAction: commandBuild(namespace, podName, container, 1000, type),
  };

  const params = {
    apiVersion,
    kind,
    metadata: {
      namespace: namespace === '_all' ? 'default' : namespace,
      name: `${podName.slice(0, 35)}-${Date.now()}`,
    },
    spec,
  };

  try {
    const res = await cloudShellClient.create(namespace, params);

    // subpath 需要加上 `./`
    const readyUrl = getCorrectURL(res.data.status?.accessURL);

    return {
      ...res,
      shellUrl: readyUrl,
    } as CloudShell & { shellUrl: string };
  } catch (error) {
    nError(i18n.t('components.cloud-shell.CloudShell.fetchShellErrorText'), error);

    return {};
  }
};

/**
 * 请求删除 CloudShell
 * @param metaName
 */
export const deleteCloudShell = async (namespace: string, name: string) => {
  try {
    await cloudShellClient.delete(namespace, name);
  } catch (error) {
    // TODO: 删除失败应该不用提示给用户吧？不会影响用户使用的错误。
    /* eslint-disable no-console */
    console.error('删除CloudShell失败:', error);
  }
};

/**
 * 查询 CloudShell(检查是否已存在，目前暂未使用到)
 * @param shellName
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCloudShell = (namespace: string, name: string) => cloudShellClient.read(namespace, name);

const MAX_DETECT_TIMES = 25; // 最大ping html次数

/**
 * Istio 注册路由映射是分布式的
 * 后端返回了CloudShell的路径时，可能index.html还不能马上访问到，前端轮询ping一下
 * @param url
 * @param curTimes
 */
export function detectHtmlReadiness(url: string | undefined, curTimes = 0) {
  if (!url) return Promise.reject();

  // eslint-disable-next-line
  // @ts-ignore
  const fetch = window.originFetch || window.fetch;

  return fetch(url).then((res: Response) => {
    if (res.ok) {
      return Promise.resolve();
    }

    if (!res.ok && curTimes === MAX_DETECT_TIMES) {
      return Promise.reject();
    }

    const timeout = 200;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        detectHtmlReadiness(url, curTimes + 1).then(
          () => {
            resolve(true);
          },
          () => {
            reject();
          },
        );
      }, timeout);
    });
  });
}
