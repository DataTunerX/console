/* eslint-disable no-use-before-define */
import { K8sClient } from '@/plugins/axios/client';
import { ObjectMeta } from 'kubernetes-types/meta/v1';

export const apiVersion = 'cloudshell.cloudtty.io/v1alpha1';
export const kind = 'CloudShell';
export const cloudShellClient = new K8sClient<CloudShell>(apiVersion, kind);

/**
 * CloudShell is the Schema for the cloudshells API
 */
export interface CloudShell {
  /**
   * APIVersion defines the versioned schema of this representation of an object. Servers
   * should convert recognized schemas to the latest internal value, and may reject
   * unrecognized values. More info:
   * https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
   */
  apiVersion?: string;
  /**
   * Kind is a string value representing the REST resource this object represents. Servers may
   * infer this from the endpoint the client submits requests to. Cannot be updated. In
   * CamelCase. More info:
   * https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
   */
  kind?: string;
  metadata?: ObjectMeta;
  /**
   * Spec defines the desired behavior of the cloudshell.
   */
  spec?: Spec;
  /**
   * Most recently observed status of the cloudshell.
   */
  status?: Status;
}

/**
* Spec defines the desired behavior of the cloudshell.
*/
export interface Spec {
  /**
   * Cleanup specified whether to delete cloudshell resources when corresponding job status is
   * completed.
   */
  cleanup?: boolean;
  commandAction?: string;
  /**
   * Configmap of the target kube-config, will replace by SA TODO: it will be deprecated in
   * v0.5.0 version and be removed in v0.6.0 if open the featuregate
   * AllowSecretStoreKubeconfig, it's not work.
   */
  configmapName?: string;
  /**
   * List of environment variables to set in the container. Cannot be updated.
   */
  env?: Env[];
  /**
   * ExposeMode describes how to access ttyd service, either ClusterIP, NodePort, Ingress or
   * VirtualService.
   */
  exposureMode?: ExposureMode;
  /**
   * Image defines the image to cloudshell, we can customize an image. Note: the image must be
   * built on top of the officially available base image. Please see:
   * https://github.com/cloudtty/cloudtty#how-to-build-custom-cloudshell-image
   */
  image?: string;
  ingressConfig?: IngressConfig;
  /**
   * accept only one client and exit on disconnection
   */
  once?: boolean;
  /**
   * PathPrefix specified a path prefix to access url, if not, the default path is used.
   */
  pathPrefix?: string;
  /**
   * PathSuffix specified a path suffix to access url, if not, the default path is used.
   */
  pathSuffix?: string;
  runAsUser?: string;
  /**
   * SecretRef represents the secret contains mandatory credentials to access the target
   * cluster. The secret should hold credentials as follows: - secret.data.token -
   * secret.data.caBundle The field is alpha phase, paleas open the featuregate
   * AllowSecretStoreKubeconfig to use it.
   */
  secretRef?: SecretRef;
  /**
   * TODO: repalce type `int32` of ttl with `time`.
   */
  ttl?: number;
  urlArg?: boolean;
  /**
   * VirtualServiceConfig specifies some of the parameters necessary to create the
   * virtaulService.
   */
  virtualServiceConfig?: VirtualServiceConfig;
}

/**
* EnvVar represents an environment variable present in a Container.
*/
export interface Env {
  /**
   * Name of the environment variable. Must be a C_IDENTIFIER.
   */
  name: string;
  value?: string;
  /**
   * Source for the environment variable's value. Cannot be used if value is not empty.
   */
  valueFrom?: ValueFrom;
}

/**
* Source for the environment variable's value. Cannot be used if value is not empty.
*/
export interface ValueFrom {
  /**
   * Selects a key of a ConfigMap.
   */
  configMapKeyRef?: ConfigMapKeyRef;
  fieldRef?: FieldRef;
  /**
   * Selects a resource of the container: only resources limits and requests (limits.cpu,
   * limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory and
   * requests.ephemeral-storage) are currently supported.
   */
  resourceFieldRef?: ResourceFieldRef;
  /**
   * Selects a key of a secret in the pod's namespace
   */
  secretKeyRef?: SecretKeyRef;
}

/**
* Selects a key of a ConfigMap.
*/
export interface ConfigMapKeyRef {
  /**
   * The key to select.
   */
  key: string;
  /**
   * Name of the referent. More info:
   * https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names TODO: Add
   * other useful fields. apiVersion, kind, uid?
   */
  name?: string;
  /**
   * Specify whether the ConfigMap or its key must be defined
   */
  optional?: boolean;
}

export interface FieldRef {
  apiVersion?: string;
  /**
   * Path of the field to select in the specified API version.
   */
  fieldPath: string;
}

/**
* Selects a resource of the container: only resources limits and requests (limits.cpu,
* limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory and
* requests.ephemeral-storage) are currently supported.
*/
export interface ResourceFieldRef {
  /**
   * Container name: required for volumes, optional for env vars
   */
  containerName?: string;
  divisor?: Divisor;
  /**
   * Required: resource to select
   */
  resource: string;
}

export type Divisor = number | string;

/**
* Selects a key of a secret in the pod's namespace
*/
export interface SecretKeyRef {
  /**
   * The key of the secret to select from.  Must be a valid secret key.
   */
  key: string;
  /**
   * Name of the referent. More info:
   * https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names TODO: Add
   * other useful fields. apiVersion, kind, uid?
   */
  name?: string;
  /**
   * Specify whether the Secret or its key must be defined
   */
  optional?: boolean;
}

/**
* ExposeMode describes how to access ttyd service, either ClusterIP, NodePort, Ingress or
* VirtualService.
*/
export enum ExposureMode {
  ClusterIP = 'ClusterIP',
  Ingress = 'Ingress',
  NodePort = 'NodePort',
  VirtualService = 'VirtualService',
}

export interface IngressConfig {
  /**
   * IngressClassName specifies a ingress controller to ingress, it must be fill when the
   * cluster have multiple ingress controller service.
   */
  ingressClassName?: string;
  ingressName?: string;
  /**
   * Namespace specifies a namespace that the virtualService will be created in it. if it's
   * empty, default the cloudshell namespace.
   */
  namespace?: string;
}

/**
* SecretRef represents the secret contains mandatory credentials to access the target
* cluster. The secret should hold credentials as follows: - secret.data.token -
* secret.data.caBundle The field is alpha phase, paleas open the featuregate
* AllowSecretStoreKubeconfig to use it.
*/
export interface SecretRef {
  /**
   * Name is the name of resource being referenced.
   */
  name?: string;
}

/**
* VirtualServiceConfig specifies some of the parameters necessary to create the
* virtaulService.
*/
export interface VirtualServiceConfig {
  exportTo?: string;
  /**
   * Gateway must be specified and the gateway already exists in the cluster.
   */
  gateway?: string;
  /**
   * Namespace specifies a namespace that the virtualService will be created in it. if it's
   * empty, default the cloudshell namespace.
   */
  namespace?: string;
  virtualServiceName?: string;
}

/**
* Most recently observed status of the cloudshell.
*/
export interface Status {
  accessUrl?: string;
  phase?: string;
}
