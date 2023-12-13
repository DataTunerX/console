import { Service } from 'kubernetes-types/core/v1';
import { ObjectMeta } from 'kubernetes-types/meta/v1';
import { K8sClient } from '@/plugins/axios/client';
import { Spec as RayClusterConfig } from './ray-cluster';
/* eslint-disable no-use-before-define */
export interface RayService {
  apiVersion?: string;
  kind?: string;
  metadata?: ObjectMeta;
  spec?: Spec;
  status?: Status;
}

interface Spec {
  deploymentUnhealthySecondThreshold?: number;
  rayClusterConfig?: RayClusterConfig;
  serveConfig?: ServeConfig;
  serveConfigV2?: string;
  serveService?: Service;
  serviceUnhealthySecondThreshold?: number;
}

interface ServeConfig {
  deployments?: Deployment[];
  importPath: string;
  port?: number;
  runtimeEnv?: string;
}

interface Deployment {
  autoscalingConfig?: string;
  gracefulShutdownTimeoutS?: number;
  gracefulShutdownWaitLoopS?: number;
  healthCheckPeriodS?: number;
  healthCheckTimeoutS?: number;
  maxConcurrentQueries?: number;
  name: string;
  numReplicas?: number;
  rayActorOptions?: RayActorOptions;
  routePrefix?: string;
  userConfig?: string;
}

interface RayActorOptions {
  acceleratorType?: string;
  memory?: number;
  numCpus?: number;
  numGpus?: number;
  objectStoreMemory?: number;
  resources?: string;
  runtimeEnv?: string;
}

interface Status {
  activeServiceStatus?: ActiveServiceStatus;
  observedGeneration?: number;
  pendingServiceStatus?: PendingServiceStatus;
  serviceStatus?: string;
}

export interface ActiveServiceStatus {
  applicationStatuses?: { [key: string]: ActiveServiceStatusApplicationStatus };
  dashboardStatus?: ActiveServiceStatusDashboardStatus;
  rayClusterName?: string;
  rayClusterStatus?: ActiveServiceStatusRayClusterStatus;
}

export interface ActiveServiceStatusApplicationStatus {
  healthLastUpdateTime?: Date;
  lastUpdateTime?: Date;
  message?: string;
  serveDeploymentStatuses?: { [key: string]: PurpleServeDeploymentStatus };
  status?: string;
}

interface PurpleServeDeploymentStatus {
  healthLastUpdateTime?: Date;
  lastUpdateTime?: Date;
  message?: string;
  status?: string;
}

interface ActiveServiceStatusDashboardStatus {
  healthLastUpdateTime?: Date;
  isHealthy?: boolean;
  lastUpdateTime?: Date;
}

interface ActiveServiceStatusRayClusterStatus {
  availableWorkerReplicas?: number;
  desiredWorkerReplicas?: number;
  endpoints?: { [key: string]: string };
  head?: PurpleHead;
  lastUpdateTime?: Date;
  maxWorkerReplicas?: number;
  minWorkerReplicas?: number;
  observedGeneration?: number;
  reason?: string;
  state?: string;
}

interface PurpleHead {
  podIP?: string;
  serviceIP?: string;
}

interface PendingServiceStatus {
  applicationStatuses?: { [key: string]: PendingServiceStatusApplicationStatus };
  dashboardStatus?: PendingServiceStatusDashboardStatus;
  rayClusterName?: string;
  rayClusterStatus?: PendingServiceStatusRayClusterStatus;
}

interface PendingServiceStatusApplicationStatus {
  healthLastUpdateTime?: Date;
  lastUpdateTime?: Date;
  message?: string;
  serveDeploymentStatuses?: { [key: string]: FluffyServeDeploymentStatus };
  status?: string;
}

interface FluffyServeDeploymentStatus {
  healthLastUpdateTime?: Date;
  lastUpdateTime?: Date;
  message?: string;
  status?: string;
}

interface PendingServiceStatusDashboardStatus {
  healthLastUpdateTime?: Date;
  isHealthy?: boolean;
  lastUpdateTime?: Date;
}

interface PendingServiceStatusRayClusterStatus {
  availableWorkerReplicas?: number;
  desiredWorkerReplicas?: number;
  endpoints?: { [key: string]: string };
  head?: Head;
  lastUpdateTime?: Date;
  maxWorkerReplicas?: number;
  minWorkerReplicas?: number;
  observedGeneration?: number;
  reason?: string;
  state?: string;
}

interface Head {
  podIP?: string;
  serviceIP?: string;
}

const apiVersion = 'ray.io/v1';
const kind = 'RayService';

export const rayServiceClient = new K8sClient<RayService>(apiVersion, kind);
