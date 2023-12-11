import { nError } from '@/utils/useNoty';
import { i18n } from '@/plugins/vue-i18n';
import {
  cloudShellClient, CloudShell, Spec as CloudShellSpec, apiVersion, kind,
} from '@/api/cloudshell';

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
  shellName: string; // tab显示名
  accessUrl?: string; // iframe地址
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
): Promise<CloudShell> => {
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
    const { data } = await cloudShellClient.create(namespace, params);

    return data;
  } catch (error) {
    nError(i18n.t('components.CloudShell.fetchShellErrorText'), error);

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

const MAX_DETECT_TIMES = 25; // 最大ping html次数

export async function detectCloudShellReady(namespace: string, name: string, curTimes = 0) :Promise<string|undefined> {
  if (curTimes >= MAX_DETECT_TIMES) {
    throw new Error('Max detect times reached');
  }

  try {
    const { data } = await cloudShellClient.read(namespace, name);

    if (data.status?.phase === 'Ready' && data.status.accessUrl) {
      return data.status.accessUrl;
    }
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Error detecting CloudShell readiness:', error);
  }

  // If not ready, wait for 200ms and try again
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  return detectCloudShellReady(namespace, name, curTimes + 1);
}
