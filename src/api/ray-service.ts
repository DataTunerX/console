import { ObjectMeta } from 'kubernetes-types/meta/v1';

/* eslint-disable no-use-before-define */
export interface RayService {
  apiVersion?: string;
  kind?: string;
  metadata?: ObjectMeta;
  spec?: CoordinateSpec;
  status?: CoordinateStatus;
}

export interface CoordinateSpec {
  deploymentUnhealthySecondThreshold?: number;
  rayClusterConfig?: RayClusterConfig;
  serveConfig?: ServeConfig;
  serveConfigV2?: string;
  serveService?: ServeService;
  serviceUnhealthySecondThreshold?: number;
}

export interface RayClusterConfig {
  autoscalerOptions?: AutoscalerOptions;
  enableInTreeAutoscaling?: boolean;
  headGroupSpec: HeadGroupSpec;
  headServiceAnnotations?: { [key: string]: string };
  rayVersion?: string;
  workerGroupSpecs?: WorkerGroupSpec[];
}

export interface AutoscalerOptions {
  env?: AutoscalerOptionsEnv[];
  envFrom?: AutoscalerOptionsEnvFrom[];
  idleTimeoutSeconds?: number;
  image?: string;
  imagePullPolicy?: string;
  resources?: AutoscalerOptionsResources;
  securityContext?: AutoscalerOptionsSecurityContext;
  upscalingMode?: UpscalingMode;
  volumeMounts?: AutoscalerOptionsVolumeMount[];
}

export interface AutoscalerOptionsEnv {
  name: string;
  value?: string;
  valueFrom?: PurpleValueFrom;
}

export interface PurpleValueFrom {
  configMapKeyRef?: PurpleConfigMapKeyRef;
  fieldRef?: PurpleFieldRef;
  resourceFieldRef?: PurpleResourceFieldRef;
  secretKeyRef?: PurpleSecretKeyRef;
}

export interface PurpleConfigMapKeyRef {
  key: string;
  name?: string;
  optional?: boolean;
}

export interface PurpleFieldRef {
  apiVersion?: string;
  fieldPath: string;
}

export interface PurpleResourceFieldRef {
  containerName?: string;
  divisor?: Divisor;
  resource: string;
}

export type Divisor = number | string;

export interface PurpleSecretKeyRef {
  key: string;
  name?: string;
  optional?: boolean;
}

export interface AutoscalerOptionsEnvFrom {
  configMapRef?: PurpleConfigMapRef;
  prefix?: string;
  secretRef?: PurpleSecretRef;
}

export interface PurpleConfigMapRef {
  name?: string;
  optional?: boolean;
}

export interface PurpleSecretRef {
  name?: string;
  optional?: boolean;
}

export interface AutoscalerOptionsResources {
  limits?: { [key: string]: Divisor };
  requests?: { [key: string]: Divisor };
}

export interface AutoscalerOptionsSecurityContext {
  allowPrivilegeEscalation?: boolean;
  capabilities?: PurpleCapabilities;
  privileged?: boolean;
  procMount?: string;
  readOnlyRootFilesystem?: boolean;
  runAsGroup?: number;
  runAsNonRoot?: boolean;
  runAsUser?: number;
  seccompProfile?: PurpleSeccompProfile;
  seLinuxOptions?: PurpleSELinuxOptions;
  windowsOptions?: PurpleWindowsOptions;
}

export interface PurpleCapabilities {
  add?: string[];
  drop?: string[];
}

export interface PurpleSELinuxOptions {
  level?: string;
  role?: string;
  type?: string;
  user?: string;
}

export interface PurpleSeccompProfile {
  localhostProfile?: string;
  type: string;
}

export interface PurpleWindowsOptions {
  gmsaCredentialSpec?: string;
  gmsaCredentialSpecName?: string;
  hostProcess?: boolean;
  runAsUserName?: string;
}

export enum UpscalingMode {
  Aggressive = 'Aggressive',
  Conservative = 'Conservative',
  Default = 'Default',
}

export interface AutoscalerOptionsVolumeMount {
  mountPath: string;
  mountPropagation?: string;
  name: string;
  readOnly?: boolean;
  subPath?: string;
  subPathExpr?: string;
}

export interface HeadGroupSpec {
  enableIngress?: boolean;
  headService?: HeadService;
  rayStartParams: { [key: string]: string };
  replicas?: number;
  serviceType?: string;
  template: HeadGroupSpecTemplate;
}

export interface HeadService {
  apiVersion?: string;
  kind?: string;
  metadata?: HeadServiceMetadata;
  spec?: HeadServiceSpec;
  status?: HeadServiceStatus;
}

export interface HeadServiceMetadata {
  annotations?: { [key: string]: string };
  finalizers?: string[];
  labels?: { [key: string]: string };
  name?: string;
  namespace?: string;
}

export interface HeadServiceSpec {
  allocateLoadBalancerNodePorts?: boolean;
  clusterIP?: string;
  clusterIPS?: string[];
  externalIPS?: string[];
  externalName?: string;
  externalTrafficPolicy?: string;
  healthCheckNodePort?: number;
  internalTrafficPolicy?: string;
  ipFamilies?: string[];
  ipFamilyPolicy?: string;
  loadBalancerClass?: string;
  loadBalancerIP?: string;
  loadBalancerSourceRanges?: string[];
  ports?: PurplePort[];
  publishNotReadyAddresses?: boolean;
  selector?: { [key: string]: string };
  sessionAffinity?: string;
  sessionAffinityConfig?: PurpleSessionAffinityConfig;
  type?: string;
}

export interface PurplePort {
  appProtocol?: string;
  name?: string;
  nodePort?: number;
  port: number;
  protocol?: string;
  targetPort?: Divisor;
}

export interface PurpleSessionAffinityConfig {
  clientIP?: PurpleClientIP;
}

export interface PurpleClientIP {
  timeoutSeconds?: number;
}

export interface HeadServiceStatus {
  conditions?: PurpleCondition[];
  loadBalancer?: PurpleLoadBalancer;
}

export interface PurpleCondition {
  lastTransitionTime: Date;
  message: string;
  observedGeneration?: number;
  reason: string;
  status: StatusEnum;
  type: string;
}

export enum StatusEnum {
  False = 'False',
  True = 'True',
  Unknown = 'Unknown',
}

export interface PurpleLoadBalancer {
  ingress?: PurpleIngress[];
}

export interface PurpleIngress {
  hostname?: string;
  ip?: string;
  ports?: FluffyPort[];
}

export interface FluffyPort {
  error?: string;
  port: number;
  protocol: string;
}

export interface HeadGroupSpecTemplate {
  metadata?: PurpleMetadata;
  spec?: PurpleSpec;
}

export interface PurpleMetadata {
  annotations?: { [key: string]: string };
  finalizers?: string[];
  labels?: { [key: string]: string };
  name?: string;
  namespace?: string;
}

export interface PurpleSpec {
  activeDeadlineSeconds?: number;
  affinity?: PurpleAffinity;
  automountServiceAccountToken?: boolean;
  containers: PurpleContainer[];
  dnsConfig?: PurpleDNSConfig;
  dnsPolicy?: string;
  enableServiceLinks?: boolean;
  ephemeralContainers?: PurpleEphemeralContainer[];
  hostAliases?: PurpleHostAlias[];
  hostIPC?: boolean;
  hostname?: string;
  hostNetwork?: boolean;
  hostPID?: boolean;
  imagePullSecrets?: PurpleImagePullSecret[];
  initContainers?: PurpleInitContainer[];
  nodeName?: string;
  nodeSelector?: { [key: string]: string };
  os?: PurpleOS;
  overhead?: { [key: string]: Divisor };
  preemptionPolicy?: string;
  priority?: number;
  priorityClassName?: string;
  readinessGates?: PurpleReadinessGate[];
  restartPolicy?: string;
  runtimeClassName?: string;
  schedulerName?: string;
  securityContext?: StickySecurityContext;
  serviceAccount?: string;
  serviceAccountName?: string;
  setHostnameAsFQDN?: boolean;
  shareProcessNamespace?: boolean;
  subdomain?: string;
  terminationGracePeriodSeconds?: number;
  tolerations?: PurpleToleration[];
  topologySpreadConstraints?: PurpleTopologySpreadConstraint[];
  volumes?: PurpleVolume[];
}

export interface PurpleAffinity {
  nodeAffinity?: PurpleNodeAffinity;
  podAffinity?: PurplePodAffinity;
  podAntiAffinity?: PurplePodAntiAffinity;
}

export interface PurpleNodeAffinity {
  preferredDuringSchedulingIgnoredDuringExecution?: PurplePreferredDuringSchedulingIgnoredDuringExecution[];
  requiredDuringSchedulingIgnoredDuringExecution?: PurpleRequiredDuringSchedulingIgnoredDuringExecution;
}

export interface PurplePreferredDuringSchedulingIgnoredDuringExecution {
  preference: PurplePreference;
  weight: number;
}

export interface PurplePreference {
  matchExpressions?: PurpleMatchExpression[];
  matchFields?: PurpleMatchField[];
}

export interface PurpleMatchExpression {
  key: string;
  operator: string;
  values?: string[];
}

export interface PurpleMatchField {
  key: string;
  operator: string;
  values?: string[];
}

export interface PurpleRequiredDuringSchedulingIgnoredDuringExecution {
  nodeSelectorTerms: PurpleNodeSelectorTerm[];
}

export interface PurpleNodeSelectorTerm {
  matchExpressions?: FluffyMatchExpression[];
  matchFields?: FluffyMatchField[];
}

export interface FluffyMatchExpression {
  key: string;
  operator: string;
  values?: string[];
}

export interface FluffyMatchField {
  key: string;
  operator: string;
  values?: string[];
}

export interface PurplePodAffinity {
  preferredDuringSchedulingIgnoredDuringExecution?: FluffyPreferredDuringSchedulingIgnoredDuringExecution[];
  requiredDuringSchedulingIgnoredDuringExecution?: FluffyRequiredDuringSchedulingIgnoredDuringExecution[];
}

export interface FluffyPreferredDuringSchedulingIgnoredDuringExecution {
  podAffinityTerm: PurplePodAffinityTerm;
  weight: number;
}

export interface PurplePodAffinityTerm {
  labelSelector?: PurpleLabelSelector;
  namespaces?: string[];
  namespaceSelector?: PurpleNamespaceSelector;
  topologyKey: string;
}

export interface PurpleLabelSelector {
  matchExpressions?: TentacledMatchExpression[];
  matchLabels?: { [key: string]: string };
}

export interface TentacledMatchExpression {
  key: string;
  operator: string;
  values?: string[];
}

export interface PurpleNamespaceSelector {
  matchExpressions?: StickyMatchExpression[];
  matchLabels?: { [key: string]: string };
}

export interface StickyMatchExpression {
  key: string;
  operator: string;
  values?: string[];
}

export interface FluffyRequiredDuringSchedulingIgnoredDuringExecution {
  labelSelector?: FluffyLabelSelector;
  namespaces?: string[];
  namespaceSelector?: FluffyNamespaceSelector;
  topologyKey: string;
}

export interface FluffyLabelSelector {
  matchExpressions?: IndigoMatchExpression[];
  matchLabels?: { [key: string]: string };
}

export interface IndigoMatchExpression {
  key: string;
  operator: string;
  values?: string[];
}

export interface FluffyNamespaceSelector {
  matchExpressions?: IndecentMatchExpression[];
  matchLabels?: { [key: string]: string };
}

export interface IndecentMatchExpression {
  key: string;
  operator: string;
  values?: string[];
}

export interface PurplePodAntiAffinity {
  preferredDuringSchedulingIgnoredDuringExecution?: TentacledPreferredDuringSchedulingIgnoredDuringExecution[];
  requiredDuringSchedulingIgnoredDuringExecution?: TentacledRequiredDuringSchedulingIgnoredDuringExecution[];
}

export interface TentacledPreferredDuringSchedulingIgnoredDuringExecution {
  podAffinityTerm: FluffyPodAffinityTerm;
  weight: number;
}

export interface FluffyPodAffinityTerm {
  labelSelector?: TentacledLabelSelector;
  namespaces?: string[];
  namespaceSelector?: TentacledNamespaceSelector;
  topologyKey: string;
}

export interface TentacledLabelSelector {
  matchExpressions?: HilariousMatchExpression[];
  matchLabels?: { [key: string]: string };
}

export interface HilariousMatchExpression {
  key: string;
  operator: string;
  values?: string[];
}

export interface TentacledNamespaceSelector {
  matchExpressions?: AmbitiousMatchExpression[];
  matchLabels?: { [key: string]: string };
}

export interface AmbitiousMatchExpression {
  key: string;
  operator: string;
  values?: string[];
}

export interface TentacledRequiredDuringSchedulingIgnoredDuringExecution {
  labelSelector?: StickyLabelSelector;
  namespaces?: string[];
  namespaceSelector?: StickyNamespaceSelector;
  topologyKey: string;
}

export interface StickyLabelSelector {
  matchExpressions?: CunningMatchExpression[];
  matchLabels?: { [key: string]: string };
}

export interface CunningMatchExpression {
  key: string;
  operator: string;
  values?: string[];
}

export interface StickyNamespaceSelector {
  matchExpressions?: MagentaMatchExpression[];
  matchLabels?: { [key: string]: string };
}

export interface MagentaMatchExpression {
  key: string;
  operator: string;
  values?: string[];
}

export interface PurpleContainer {
  args?: string[];
  command?: string[];
  env?: PurpleEnv[];
  envFrom?: PurpleEnvFrom[];
  image?: string;
  imagePullPolicy?: string;
  lifecycle?: PurpleLifecycle;
  livenessProbe?: PurpleLivenessProbe;
  name: string;
  ports?: TentacledPort[];
  readinessProbe?: PurpleReadinessProbe;
  resources?: PurpleResources;
  securityContext?: PurpleSecurityContext;
  startupProbe?: PurpleStartupProbe;
  stdin?: boolean;
  stdinOnce?: boolean;
  terminationMessagePath?: string;
  terminationMessagePolicy?: string;
  tty?: boolean;
  volumeDevices?: PurpleVolumeDevice[];
  volumeMounts?: PurpleVolumeMount[];
  workingDir?: string;
}

export interface PurpleEnv {
  name: string;
  value?: string;
  valueFrom?: FluffyValueFrom;
}

export interface FluffyValueFrom {
  configMapKeyRef?: FluffyConfigMapKeyRef;
  fieldRef?: FluffyFieldRef;
  resourceFieldRef?: FluffyResourceFieldRef;
  secretKeyRef?: FluffySecretKeyRef;
}

export interface FluffyConfigMapKeyRef {
  key: string;
  name?: string;
  optional?: boolean;
}

export interface FluffyFieldRef {
  apiVersion?: string;
  fieldPath: string;
}

export interface FluffyResourceFieldRef {
  containerName?: string;
  divisor?: Divisor;
  resource: string;
}

export interface FluffySecretKeyRef {
  key: string;
  name?: string;
  optional?: boolean;
}

export interface PurpleEnvFrom {
  configMapRef?: FluffyConfigMapRef;
  prefix?: string;
  secretRef?: FluffySecretRef;
}

export interface FluffyConfigMapRef {
  name?: string;
  optional?: boolean;
}

export interface FluffySecretRef {
  name?: string;
  optional?: boolean;
}

export interface PurpleLifecycle {
  postStart?: PurplePostStart;
  preStop?: PurplePreStop;
}

export interface PurplePostStart {
  exec?: PurpleExec;
  httpGet?: PurpleHTTPGet;
  tcpSocket?: PurpleTCPSocket;
}

export interface PurpleExec {
  command?: string[];
}

export interface PurpleHTTPGet {
  host?: string;
  httpHeaders?: PurpleHTTPHeader[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface PurpleHTTPHeader {
  name: string;
  value: string;
}

export interface PurpleTCPSocket {
  host?: string;
  port: Divisor;
}

export interface PurplePreStop {
  exec?: FluffyExec;
  httpGet?: FluffyHTTPGet;
  tcpSocket?: FluffyTCPSocket;
}

export interface FluffyExec {
  command?: string[];
}

export interface FluffyHTTPGet {
  host?: string;
  httpHeaders?: FluffyHTTPHeader[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface FluffyHTTPHeader {
  name: string;
  value: string;
}

export interface FluffyTCPSocket {
  host?: string;
  port: Divisor;
}

export interface PurpleLivenessProbe {
  exec?: TentacledExec;
  failureThreshold?: number;
  grpc?: PurpleGrpc;
  httpGet?: TentacledHTTPGet;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: TentacledTCPSocket;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface TentacledExec {
  command?: string[];
}

export interface PurpleGrpc {
  port: number;
  service?: string;
}

export interface TentacledHTTPGet {
  host?: string;
  httpHeaders?: TentacledHTTPHeader[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface TentacledHTTPHeader {
  name: string;
  value: string;
}

export interface TentacledTCPSocket {
  host?: string;
  port: Divisor;
}

export interface TentacledPort {
  containerPort: number;
  hostIP?: string;
  hostPort?: number;
  name?: string;
  protocol?: string;
}

export interface PurpleReadinessProbe {
  exec?: StickyExec;
  failureThreshold?: number;
  grpc?: FluffyGrpc;
  httpGet?: StickyHTTPGet;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: StickyTCPSocket;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface StickyExec {
  command?: string[];
}

export interface FluffyGrpc {
  port: number;
  service?: string;
}

export interface StickyHTTPGet {
  host?: string;
  httpHeaders?: StickyHTTPHeader[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface StickyHTTPHeader {
  name: string;
  value: string;
}

export interface StickyTCPSocket {
  host?: string;
  port: Divisor;
}

export interface PurpleResources {
  limits?: { [key: string]: Divisor };
  requests?: { [key: string]: Divisor };
}

export interface PurpleSecurityContext {
  allowPrivilegeEscalation?: boolean;
  capabilities?: FluffyCapabilities;
  privileged?: boolean;
  procMount?: string;
  readOnlyRootFilesystem?: boolean;
  runAsGroup?: number;
  runAsNonRoot?: boolean;
  runAsUser?: number;
  seccompProfile?: FluffySeccompProfile;
  seLinuxOptions?: FluffySELinuxOptions;
  windowsOptions?: FluffyWindowsOptions;
}

export interface FluffyCapabilities {
  add?: string[];
  drop?: string[];
}

export interface FluffySELinuxOptions {
  level?: string;
  role?: string;
  type?: string;
  user?: string;
}

export interface FluffySeccompProfile {
  localhostProfile?: string;
  type: string;
}

export interface FluffyWindowsOptions {
  gmsaCredentialSpec?: string;
  gmsaCredentialSpecName?: string;
  hostProcess?: boolean;
  runAsUserName?: string;
}

export interface PurpleStartupProbe {
  exec?: IndigoExec;
  failureThreshold?: number;
  grpc?: TentacledGrpc;
  httpGet?: IndigoHTTPGet;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: IndigoTCPSocket;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface IndigoExec {
  command?: string[];
}

export interface TentacledGrpc {
  port: number;
  service?: string;
}

export interface IndigoHTTPGet {
  host?: string;
  httpHeaders?: IndigoHTTPHeader[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface IndigoHTTPHeader {
  name: string;
  value: string;
}

export interface IndigoTCPSocket {
  host?: string;
  port: Divisor;
}

export interface PurpleVolumeDevice {
  devicePath: string;
  name: string;
}

export interface PurpleVolumeMount {
  mountPath: string;
  mountPropagation?: string;
  name: string;
  readOnly?: boolean;
  subPath?: string;
  subPathExpr?: string;
}

export interface PurpleDNSConfig {
  nameservers?: string[];
  options?: PurpleOption[];
  searches?: string[];
}

export interface PurpleOption {
  name?: string;
  value?: string;
}

export interface PurpleEphemeralContainer {
  args?: string[];
  command?: string[];
  env?: FluffyEnv[];
  envFrom?: FluffyEnvFrom[];
  image?: string;
  imagePullPolicy?: string;
  lifecycle?: FluffyLifecycle;
  livenessProbe?: FluffyLivenessProbe;
  name: string;
  ports?: StickyPort[];
  readinessProbe?: FluffyReadinessProbe;
  resources?: FluffyResources;
  securityContext?: FluffySecurityContext;
  startupProbe?: FluffyStartupProbe;
  stdin?: boolean;
  stdinOnce?: boolean;
  targetContainerName?: string;
  terminationMessagePath?: string;
  terminationMessagePolicy?: string;
  tty?: boolean;
  volumeDevices?: FluffyVolumeDevice[];
  volumeMounts?: FluffyVolumeMount[];
  workingDir?: string;
}

export interface FluffyEnv {
  name: string;
  value?: string;
  valueFrom?: TentacledValueFrom;
}

export interface TentacledValueFrom {
  configMapKeyRef?: TentacledConfigMapKeyRef;
  fieldRef?: TentacledFieldRef;
  resourceFieldRef?: TentacledResourceFieldRef;
  secretKeyRef?: TentacledSecretKeyRef;
}

export interface TentacledConfigMapKeyRef {
  key: string;
  name?: string;
  optional?: boolean;
}

export interface TentacledFieldRef {
  apiVersion?: string;
  fieldPath: string;
}

export interface TentacledResourceFieldRef {
  containerName?: string;
  divisor?: Divisor;
  resource: string;
}

export interface TentacledSecretKeyRef {
  key: string;
  name?: string;
  optional?: boolean;
}

export interface FluffyEnvFrom {
  configMapRef?: TentacledConfigMapRef;
  prefix?: string;
  secretRef?: TentacledSecretRef;
}

export interface TentacledConfigMapRef {
  name?: string;
  optional?: boolean;
}

export interface TentacledSecretRef {
  name?: string;
  optional?: boolean;
}

export interface FluffyLifecycle {
  postStart?: FluffyPostStart;
  preStop?: FluffyPreStop;
}

export interface FluffyPostStart {
  exec?: IndecentExec;
  httpGet?: IndecentHTTPGet;
  tcpSocket?: IndecentTCPSocket;
}

export interface IndecentExec {
  command?: string[];
}

export interface IndecentHTTPGet {
  host?: string;
  httpHeaders?: IndecentHTTPHeader[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface IndecentHTTPHeader {
  name: string;
  value: string;
}

export interface IndecentTCPSocket {
  host?: string;
  port: Divisor;
}

export interface FluffyPreStop {
  exec?: HilariousExec;
  httpGet?: HilariousHTTPGet;
  tcpSocket?: HilariousTCPSocket;
}

export interface HilariousExec {
  command?: string[];
}

export interface HilariousHTTPGet {
  host?: string;
  httpHeaders?: HilariousHTTPHeader[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HilariousHTTPHeader {
  name: string;
  value: string;
}

export interface HilariousTCPSocket {
  host?: string;
  port: Divisor;
}

export interface FluffyLivenessProbe {
  exec?: AmbitiousExec;
  failureThreshold?: number;
  grpc?: StickyGrpc;
  httpGet?: AmbitiousHTTPGet;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: AmbitiousTCPSocket;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface AmbitiousExec {
  command?: string[];
}

export interface StickyGrpc {
  port: number;
  service?: string;
}

export interface AmbitiousHTTPGet {
  host?: string;
  httpHeaders?: AmbitiousHTTPHeader[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface AmbitiousHTTPHeader {
  name: string;
  value: string;
}

export interface AmbitiousTCPSocket {
  host?: string;
  port: Divisor;
}

export interface StickyPort {
  containerPort: number;
  hostIP?: string;
  hostPort?: number;
  name?: string;
  protocol?: string;
}

export interface FluffyReadinessProbe {
  exec?: CunningExec;
  failureThreshold?: number;
  grpc?: IndigoGrpc;
  httpGet?: CunningHTTPGet;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: CunningTCPSocket;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface CunningExec {
  command?: string[];
}

export interface IndigoGrpc {
  port: number;
  service?: string;
}

export interface CunningHTTPGet {
  host?: string;
  httpHeaders?: CunningHTTPHeader[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface CunningHTTPHeader {
  name: string;
  value: string;
}

export interface CunningTCPSocket {
  host?: string;
  port: Divisor;
}

export interface FluffyResources {
  limits?: { [key: string]: Divisor };
  requests?: { [key: string]: Divisor };
}

export interface FluffySecurityContext {
  allowPrivilegeEscalation?: boolean;
  capabilities?: TentacledCapabilities;
  privileged?: boolean;
  procMount?: string;
  readOnlyRootFilesystem?: boolean;
  runAsGroup?: number;
  runAsNonRoot?: boolean;
  runAsUser?: number;
  seccompProfile?: TentacledSeccompProfile;
  seLinuxOptions?: TentacledSELinuxOptions;
  windowsOptions?: TentacledWindowsOptions;
}

export interface TentacledCapabilities {
  add?: string[];
  drop?: string[];
}

export interface TentacledSELinuxOptions {
  level?: string;
  role?: string;
  type?: string;
  user?: string;
}

export interface TentacledSeccompProfile {
  localhostProfile?: string;
  type: string;
}

export interface TentacledWindowsOptions {
  gmsaCredentialSpec?: string;
  gmsaCredentialSpecName?: string;
  hostProcess?: boolean;
  runAsUserName?: string;
}

export interface FluffyStartupProbe {
  exec?: MagentaExec;
  failureThreshold?: number;
  grpc?: IndecentGrpc;
  httpGet?: MagentaHTTPGet;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: MagentaTCPSocket;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface MagentaExec {
  command?: string[];
}

export interface IndecentGrpc {
  port: number;
  service?: string;
}

export interface MagentaHTTPGet {
  host?: string;
  httpHeaders?: MagentaHTTPHeader[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface MagentaHTTPHeader {
  name: string;
  value: string;
}

export interface MagentaTCPSocket {
  host?: string;
  port: Divisor;
}

export interface FluffyVolumeDevice {
  devicePath: string;
  name: string;
}

export interface FluffyVolumeMount {
  mountPath: string;
  mountPropagation?: string;
  name: string;
  readOnly?: boolean;
  subPath?: string;
  subPathExpr?: string;
}

export interface PurpleHostAlias {
  hostnames?: string[];
  ip?: string;
}

export interface PurpleImagePullSecret {
  name?: string;
}

export interface PurpleInitContainer {
  args?: string[];
  command?: string[];
  env?: TentacledEnv[];
  envFrom?: TentacledEnvFrom[];
  image?: string;
  imagePullPolicy?: string;
  lifecycle?: TentacledLifecycle;
  livenessProbe?: TentacledLivenessProbe;
  name: string;
  ports?: IndigoPort[];
  readinessProbe?: TentacledReadinessProbe;
  resources?: TentacledResources;
  securityContext?: TentacledSecurityContext;
  startupProbe?: TentacledStartupProbe;
  stdin?: boolean;
  stdinOnce?: boolean;
  terminationMessagePath?: string;
  terminationMessagePolicy?: string;
  tty?: boolean;
  volumeDevices?: TentacledVolumeDevice[];
  volumeMounts?: TentacledVolumeMount[];
  workingDir?: string;
}

export interface TentacledEnv {
  name: string;
  value?: string;
  valueFrom?: StickyValueFrom;
}

export interface StickyValueFrom {
  configMapKeyRef?: StickyConfigMapKeyRef;
  fieldRef?: StickyFieldRef;
  resourceFieldRef?: StickyResourceFieldRef;
  secretKeyRef?: StickySecretKeyRef;
}

export interface StickyConfigMapKeyRef {
  key: string;
  name?: string;
  optional?: boolean;
}

export interface StickyFieldRef {
  apiVersion?: string;
  fieldPath: string;
}

export interface StickyResourceFieldRef {
  containerName?: string;
  divisor?: Divisor;
  resource: string;
}

export interface StickySecretKeyRef {
  key: string;
  name?: string;
  optional?: boolean;
}

export interface TentacledEnvFrom {
  configMapRef?: StickyConfigMapRef;
  prefix?: string;
  secretRef?: StickySecretRef;
}

export interface StickyConfigMapRef {
  name?: string;
  optional?: boolean;
}

export interface StickySecretRef {
  name?: string;
  optional?: boolean;
}

export interface TentacledLifecycle {
  postStart?: TentacledPostStart;
  preStop?: TentacledPreStop;
}

export interface TentacledPostStart {
  exec?: FriskyExec;
  httpGet?: FriskyHTTPGet;
  tcpSocket?: FriskyTCPSocket;
}

export interface FriskyExec {
  command?: string[];
}

export interface FriskyHTTPGet {
  host?: string;
  httpHeaders?: FriskyHTTPHeader[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface FriskyHTTPHeader {
  name: string;
  value: string;
}

export interface FriskyTCPSocket {
  host?: string;
  port: Divisor;
}

export interface TentacledPreStop {
  exec?: MischievousExec;
  httpGet?: MischievousHTTPGet;
  tcpSocket?: MischievousTCPSocket;
}

export interface MischievousExec {
  command?: string[];
}

export interface MischievousHTTPGet {
  host?: string;
  httpHeaders?: MischievousHTTPHeader[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface MischievousHTTPHeader {
  name: string;
  value: string;
}

export interface MischievousTCPSocket {
  host?: string;
  port: Divisor;
}

export interface TentacledLivenessProbe {
  exec?: BraggadociousExec;
  failureThreshold?: number;
  grpc?: HilariousGrpc;
  httpGet?: BraggadociousHTTPGet;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: BraggadociousTCPSocket;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface BraggadociousExec {
  command?: string[];
}

export interface HilariousGrpc {
  port: number;
  service?: string;
}

export interface BraggadociousHTTPGet {
  host?: string;
  httpHeaders?: BraggadociousHTTPHeader[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface BraggadociousHTTPHeader {
  name: string;
  value: string;
}

export interface BraggadociousTCPSocket {
  host?: string;
  port: Divisor;
}

export interface IndigoPort {
  containerPort: number;
  hostIP?: string;
  hostPort?: number;
  name?: string;
  protocol?: string;
}

export interface TentacledReadinessProbe {
  exec?: Exec1;
  failureThreshold?: number;
  grpc?: AmbitiousGrpc;
  httpGet?: HTTPGet1;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: TCPSocket1;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface Exec1 {
  command?: string[];
}

export interface AmbitiousGrpc {
  port: number;
  service?: string;
}

export interface HTTPGet1 {
  host?: string;
  httpHeaders?: HTTPHeader1[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader1 {
  name: string;
  value: string;
}

export interface TCPSocket1 {
  host?: string;
  port: Divisor;
}

export interface TentacledResources {
  limits?: { [key: string]: Divisor };
  requests?: { [key: string]: Divisor };
}

export interface TentacledSecurityContext {
  allowPrivilegeEscalation?: boolean;
  capabilities?: StickyCapabilities;
  privileged?: boolean;
  procMount?: string;
  readOnlyRootFilesystem?: boolean;
  runAsGroup?: number;
  runAsNonRoot?: boolean;
  runAsUser?: number;
  seccompProfile?: StickySeccompProfile;
  seLinuxOptions?: StickySELinuxOptions;
  windowsOptions?: StickyWindowsOptions;
}

export interface StickyCapabilities {
  add?: string[];
  drop?: string[];
}

export interface StickySELinuxOptions {
  level?: string;
  role?: string;
  type?: string;
  user?: string;
}

export interface StickySeccompProfile {
  localhostProfile?: string;
  type: string;
}

export interface StickyWindowsOptions {
  gmsaCredentialSpec?: string;
  gmsaCredentialSpecName?: string;
  hostProcess?: boolean;
  runAsUserName?: string;
}

export interface TentacledStartupProbe {
  exec?: Exec2;
  failureThreshold?: number;
  grpc?: CunningGrpc;
  httpGet?: HTTPGet2;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: TCPSocket2;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface Exec2 {
  command?: string[];
}

export interface CunningGrpc {
  port: number;
  service?: string;
}

export interface HTTPGet2 {
  host?: string;
  httpHeaders?: HTTPHeader2[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader2 {
  name: string;
  value: string;
}

export interface TCPSocket2 {
  host?: string;
  port: Divisor;
}

export interface TentacledVolumeDevice {
  devicePath: string;
  name: string;
}

export interface TentacledVolumeMount {
  mountPath: string;
  mountPropagation?: string;
  name: string;
  readOnly?: boolean;
  subPath?: string;
  subPathExpr?: string;
}

export interface PurpleOS {
  name: string;
}

export interface PurpleReadinessGate {
  conditionType: string;
}

export interface StickySecurityContext {
  fsGroup?: number;
  fsGroupChangePolicy?: string;
  runAsGroup?: number;
  runAsNonRoot?: boolean;
  runAsUser?: number;
  seccompProfile?: IndigoSeccompProfile;
  seLinuxOptions?: IndigoSELinuxOptions;
  supplementalGroups?: number[];
  sysctls?: PurpleSysctl[];
  windowsOptions?: IndigoWindowsOptions;
}

export interface IndigoSELinuxOptions {
  level?: string;
  role?: string;
  type?: string;
  user?: string;
}

export interface IndigoSeccompProfile {
  localhostProfile?: string;
  type: string;
}

export interface PurpleSysctl {
  name: string;
  value: string;
}

export interface IndigoWindowsOptions {
  gmsaCredentialSpec?: string;
  gmsaCredentialSpecName?: string;
  hostProcess?: boolean;
  runAsUserName?: string;
}

export interface PurpleToleration {
  effect?: string;
  key?: string;
  operator?: string;
  tolerationSeconds?: number;
  value?: string;
}

export interface PurpleTopologySpreadConstraint {
  labelSelector?: IndigoLabelSelector;
  maxSkew: number;
  topologyKey: string;
  whenUnsatisfiable: string;
}

export interface IndigoLabelSelector {
  matchExpressions?: FriskyMatchExpression[];
  matchLabels?: { [key: string]: string };
}

export interface FriskyMatchExpression {
  key: string;
  operator: string;
  values?: string[];
}

export interface PurpleVolume {
  awsElasticBlockStore?: PurpleAwsElasticBlockStore;
  azureDisk?: PurpleAzureDisk;
  azureFile?: PurpleAzureFile;
  cephfs?: PurpleCephfs;
  cinder?: PurpleCinder;
  configMap?: PurpleConfigMap;
  csi?: PurpleCSI;
  downwardAPI?: PurpleDownwardAPI;
  emptyDir?: PurpleEmptyDir;
  ephemeral?: PurpleEphemeral;
  fc?: PurpleFc;
  flexVolume?: PurpleFlexVolume;
  flocker?: PurpleFlocker;
  gcePersistentDisk?: PurpleGcePersistentDisk;
  gitRepo?: PurpleGitRepo;
  glusterfs?: PurpleGlusterfs;
  hostPath?: PurpleHostPath;
  iscsi?: PurpleIscsi;
  name: string;
  nfs?: PurpleNFS;
  persistentVolumeClaim?: PurplePersistentVolumeClaim;
  photonPersistentDisk?: PurplePhotonPersistentDisk;
  portworxVolume?: PurplePortworxVolume;
  projected?: PurpleProjected;
  quobyte?: PurpleQuobyte;
  rbd?: PurpleRbd;
  scaleIO?: PurpleScaleIO;
  secret?: FluffySecret;
  storageos?: PurpleStorageos;
  vsphereVolume?: PurpleVsphereVolume;
}

export interface PurpleAwsElasticBlockStore {
  fsType?: string;
  partition?: number;
  readOnly?: boolean;
  volumeID: string;
}

export interface PurpleAzureDisk {
  cachingMode?: string;
  diskName: string;
  diskURI: string;
  fsType?: string;
  kind?: string;
  readOnly?: boolean;
}

export interface PurpleAzureFile {
  readOnly?: boolean;
  secretName: string;
  shareName: string;
}

export interface PurpleCephfs {
  monitors: string[];
  path?: string;
  readOnly?: boolean;
  secretFile?: string;
  secretRef?: IndigoSecretRef;
  user?: string;
}

export interface IndigoSecretRef {
  name?: string;
}

export interface PurpleCinder {
  fsType?: string;
  readOnly?: boolean;
  secretRef?: IndecentSecretRef;
  volumeID: string;
}

export interface IndecentSecretRef {
  name?: string;
}

export interface PurpleConfigMap {
  defaultMode?: number;
  items?: PurpleItem[];
  name?: string;
  optional?: boolean;
}

export interface PurpleItem {
  key: string;
  mode?: number;
  path: string;
}

export interface PurpleCSI {
  driver: string;
  fsType?: string;
  nodePublishSecretRef?: PurpleNodePublishSecretRef;
  readOnly?: boolean;
  volumeAttributes?: { [key: string]: string };
}

export interface PurpleNodePublishSecretRef {
  name?: string;
}

export interface PurpleDownwardAPI {
  defaultMode?: number;
  items?: FluffyItem[];
}

export interface FluffyItem {
  fieldRef?: IndigoFieldRef;
  mode?: number;
  path: string;
  resourceFieldRef?: IndigoResourceFieldRef;
}

export interface IndigoFieldRef {
  apiVersion?: string;
  fieldPath: string;
}

export interface IndigoResourceFieldRef {
  containerName?: string;
  divisor?: Divisor;
  resource: string;
}

export interface PurpleEmptyDir {
  medium?: string;
  sizeLimit?: Divisor;
}

export interface PurpleEphemeral {
  volumeClaimTemplate?: PurpleVolumeClaimTemplate;
}

export interface PurpleVolumeClaimTemplate {
  metadata?: FluffyMetadata;
  spec: FluffySpec;
}

export interface FluffyMetadata {
  annotations?: { [key: string]: string };
  finalizers?: string[];
  labels?: { [key: string]: string };
  name?: string;
  namespace?: string;
}

export interface FluffySpec {
  accessModes?: string[];
  dataSource?: PurpleDataSource;
  dataSourceRef?: PurpleDataSourceRef;
  resources?: StickyResources;
  selector?: PurpleSelector;
  storageClassName?: string;
  volumeMode?: string;
  volumeName?: string;
}

export interface PurpleDataSource {
  apiGroup?: string;
  kind: string;
  name: string;
}

export interface PurpleDataSourceRef {
  apiGroup?: string;
  kind: string;
  name: string;
}

export interface StickyResources {
  limits?: { [key: string]: Divisor };
  requests?: { [key: string]: Divisor };
}

export interface PurpleSelector {
  matchExpressions?: MischievousMatchExpression[];
  matchLabels?: { [key: string]: string };
}

export interface MischievousMatchExpression {
  key: string;
  operator: string;
  values?: string[];
}

export interface PurpleFc {
  fsType?: string;
  lun?: number;
  readOnly?: boolean;
  targetWWNS?: string[];
  wwids?: string[];
}

export interface PurpleFlexVolume {
  driver: string;
  fsType?: string;
  options?: { [key: string]: string };
  readOnly?: boolean;
  secretRef?: HilariousSecretRef;
}

export interface HilariousSecretRef {
  name?: string;
}

export interface PurpleFlocker {
  datasetName?: string;
  datasetUUID?: string;
}

export interface PurpleGcePersistentDisk {
  fsType?: string;
  partition?: number;
  pdName: string;
  readOnly?: boolean;
}

export interface PurpleGitRepo {
  directory?: string;
  repository: string;
  revision?: string;
}

export interface PurpleGlusterfs {
  endpoints: string;
  path: string;
  readOnly?: boolean;
}

export interface PurpleHostPath {
  path: string;
  type?: string;
}

export interface PurpleIscsi {
  chapAuthDiscovery?: boolean;
  chapAuthSession?: boolean;
  fsType?: string;
  initiatorName?: string;
  iqn: string;
  iscsiInterface?: string;
  lun: number;
  portals?: string[];
  readOnly?: boolean;
  secretRef?: AmbitiousSecretRef;
  targetPortal: string;
}

export interface AmbitiousSecretRef {
  name?: string;
}

export interface PurpleNFS {
  path: string;
  readOnly?: boolean;
  server: string;
}

export interface PurplePersistentVolumeClaim {
  claimName: string;
  readOnly?: boolean;
}

export interface PurplePhotonPersistentDisk {
  fsType?: string;
  pdID: string;
}

export interface PurplePortworxVolume {
  fsType?: string;
  readOnly?: boolean;
  volumeID: string;
}

export interface PurpleProjected {
  defaultMode?: number;
  sources?: PurpleSource[];
}

export interface PurpleSource {
  configMap?: FluffyConfigMap;
  downwardAPI?: FluffyDownwardAPI;
  secret?: PurpleSecret;
  serviceAccountToken?: PurpleServiceAccountToken;
}

export interface FluffyConfigMap {
  items?: TentacledItem[];
  name?: string;
  optional?: boolean;
}

export interface TentacledItem {
  key: string;
  mode?: number;
  path: string;
}

export interface FluffyDownwardAPI {
  items?: StickyItem[];
}

export interface StickyItem {
  fieldRef?: IndecentFieldRef;
  mode?: number;
  path: string;
  resourceFieldRef?: IndecentResourceFieldRef;
}

export interface IndecentFieldRef {
  apiVersion?: string;
  fieldPath: string;
}

export interface IndecentResourceFieldRef {
  containerName?: string;
  divisor?: Divisor;
  resource: string;
}

export interface PurpleSecret {
  items?: IndigoItem[];
  name?: string;
  optional?: boolean;
}

export interface IndigoItem {
  key: string;
  mode?: number;
  path: string;
}

export interface PurpleServiceAccountToken {
  audience?: string;
  expirationSeconds?: number;
  path: string;
}

export interface PurpleQuobyte {
  group?: string;
  readOnly?: boolean;
  registry: string;
  tenant?: string;
  user?: string;
  volume: string;
}

export interface PurpleRbd {
  fsType?: string;
  image: string;
  keyring?: string;
  monitors: string[];
  pool?: string;
  readOnly?: boolean;
  secretRef?: CunningSecretRef;
  user?: string;
}

export interface CunningSecretRef {
  name?: string;
}

export interface PurpleScaleIO {
  fsType?: string;
  gateway: string;
  protectionDomain?: string;
  readOnly?: boolean;
  secretRef: MagentaSecretRef;
  sslEnabled?: boolean;
  storageMode?: string;
  storagePool?: string;
  system: string;
  volumeName?: string;
}

export interface MagentaSecretRef {
  name?: string;
}

export interface FluffySecret {
  defaultMode?: number;
  items?: IndecentItem[];
  optional?: boolean;
  secretName?: string;
}

export interface IndecentItem {
  key: string;
  mode?: number;
  path: string;
}

export interface PurpleStorageos {
  fsType?: string;
  readOnly?: boolean;
  secretRef?: FriskySecretRef;
  volumeName?: string;
  volumeNamespace?: string;
}

export interface FriskySecretRef {
  name?: string;
}

export interface PurpleVsphereVolume {
  fsType?: string;
  storagePolicyID?: string;
  storagePolicyName?: string;
  volumePath: string;
}

export interface WorkerGroupSpec {
  groupName: string;
  maxReplicas: number;
  minReplicas: number;
  rayStartParams: { [key: string]: string };
  replicas?: number;
  scaleStrategy?: ScaleStrategy;
  template: WorkerGroupSpecTemplate;
}

export interface ScaleStrategy {
  workersToDelete?: string[];
}

export interface WorkerGroupSpecTemplate {
  metadata?: TentacledMetadata;
  spec?: TentacledSpec;
}

export interface TentacledMetadata {
  annotations?: { [key: string]: string };
  finalizers?: string[];
  labels?: { [key: string]: string };
  name?: string;
  namespace?: string;
}

export interface TentacledSpec {
  activeDeadlineSeconds?: number;
  affinity?: FluffyAffinity;
  automountServiceAccountToken?: boolean;
  containers: FluffyContainer[];
  dnsConfig?: FluffyDNSConfig;
  dnsPolicy?: string;
  enableServiceLinks?: boolean;
  ephemeralContainers?: FluffyEphemeralContainer[];
  hostAliases?: FluffyHostAlias[];
  hostIPC?: boolean;
  hostname?: string;
  hostNetwork?: boolean;
  hostPID?: boolean;
  imagePullSecrets?: FluffyImagePullSecret[];
  initContainers?: FluffyInitContainer[];
  nodeName?: string;
  nodeSelector?: { [key: string]: string };
  os?: FluffyOS;
  overhead?: { [key: string]: Divisor };
  preemptionPolicy?: string;
  priority?: number;
  priorityClassName?: string;
  readinessGates?: FluffyReadinessGate[];
  restartPolicy?: string;
  runtimeClassName?: string;
  schedulerName?: string;
  securityContext?: AmbitiousSecurityContext;
  serviceAccount?: string;
  serviceAccountName?: string;
  setHostnameAsFQDN?: boolean;
  shareProcessNamespace?: boolean;
  subdomain?: string;
  terminationGracePeriodSeconds?: number;
  tolerations?: FluffyToleration[];
  topologySpreadConstraints?: FluffyTopologySpreadConstraint[];
  volumes?: FluffyVolume[];
}

export interface FluffyAffinity {
  nodeAffinity?: FluffyNodeAffinity;
  podAffinity?: FluffyPodAffinity;
  podAntiAffinity?: FluffyPodAntiAffinity;
}

export interface FluffyNodeAffinity {
  preferredDuringSchedulingIgnoredDuringExecution?: StickyPreferredDuringSchedulingIgnoredDuringExecution[];
  requiredDuringSchedulingIgnoredDuringExecution?: StickyRequiredDuringSchedulingIgnoredDuringExecution;
}

export interface StickyPreferredDuringSchedulingIgnoredDuringExecution {
  preference: FluffyPreference;
  weight: number;
}

export interface FluffyPreference {
  matchExpressions?: BraggadociousMatchExpression[];
  matchFields?: TentacledMatchField[];
}

export interface BraggadociousMatchExpression {
  key: string;
  operator: string;
  values?: string[];
}

export interface TentacledMatchField {
  key: string;
  operator: string;
  values?: string[];
}

export interface StickyRequiredDuringSchedulingIgnoredDuringExecution {
  nodeSelectorTerms: FluffyNodeSelectorTerm[];
}

export interface FluffyNodeSelectorTerm {
  matchExpressions?: MatchExpression1[];
  matchFields?: StickyMatchField[];
}

export interface MatchExpression1 {
  key: string;
  operator: string;
  values?: string[];
}

export interface StickyMatchField {
  key: string;
  operator: string;
  values?: string[];
}

export interface FluffyPodAffinity {
  preferredDuringSchedulingIgnoredDuringExecution?: IndigoPreferredDuringSchedulingIgnoredDuringExecution[];
  requiredDuringSchedulingIgnoredDuringExecution?: IndigoRequiredDuringSchedulingIgnoredDuringExecution[];
}

export interface IndigoPreferredDuringSchedulingIgnoredDuringExecution {
  podAffinityTerm: TentacledPodAffinityTerm;
  weight: number;
}

export interface TentacledPodAffinityTerm {
  labelSelector?: IndecentLabelSelector;
  namespaces?: string[];
  namespaceSelector?: IndigoNamespaceSelector;
  topologyKey: string;
}

export interface IndecentLabelSelector {
  matchExpressions?: MatchExpression2[];
  matchLabels?: { [key: string]: string };
}

export interface MatchExpression2 {
  key: string;
  operator: string;
  values?: string[];
}

export interface IndigoNamespaceSelector {
  matchExpressions?: MatchExpression3[];
  matchLabels?: { [key: string]: string };
}

export interface MatchExpression3 {
  key: string;
  operator: string;
  values?: string[];
}

export interface IndigoRequiredDuringSchedulingIgnoredDuringExecution {
  labelSelector?: HilariousLabelSelector;
  namespaces?: string[];
  namespaceSelector?: IndecentNamespaceSelector;
  topologyKey: string;
}

export interface HilariousLabelSelector {
  matchExpressions?: MatchExpression4[];
  matchLabels?: { [key: string]: string };
}

export interface MatchExpression4 {
  key: string;
  operator: string;
  values?: string[];
}

export interface IndecentNamespaceSelector {
  matchExpressions?: MatchExpression5[];
  matchLabels?: { [key: string]: string };
}

export interface MatchExpression5 {
  key: string;
  operator: string;
  values?: string[];
}

export interface FluffyPodAntiAffinity {
  preferredDuringSchedulingIgnoredDuringExecution?: IndecentPreferredDuringSchedulingIgnoredDuringExecution[];
  requiredDuringSchedulingIgnoredDuringExecution?: IndecentRequiredDuringSchedulingIgnoredDuringExecution[];
}

export interface IndecentPreferredDuringSchedulingIgnoredDuringExecution {
  podAffinityTerm: StickyPodAffinityTerm;
  weight: number;
}

export interface StickyPodAffinityTerm {
  labelSelector?: AmbitiousLabelSelector;
  namespaces?: string[];
  namespaceSelector?: HilariousNamespaceSelector;
  topologyKey: string;
}

export interface AmbitiousLabelSelector {
  matchExpressions?: MatchExpression6[];
  matchLabels?: { [key: string]: string };
}

export interface MatchExpression6 {
  key: string;
  operator: string;
  values?: string[];
}

export interface HilariousNamespaceSelector {
  matchExpressions?: MatchExpression7[];
  matchLabels?: { [key: string]: string };
}

export interface MatchExpression7 {
  key: string;
  operator: string;
  values?: string[];
}

export interface IndecentRequiredDuringSchedulingIgnoredDuringExecution {
  labelSelector?: CunningLabelSelector;
  namespaces?: string[];
  namespaceSelector?: AmbitiousNamespaceSelector;
  topologyKey: string;
}

export interface CunningLabelSelector {
  matchExpressions?: MatchExpression8[];
  matchLabels?: { [key: string]: string };
}

export interface MatchExpression8 {
  key: string;
  operator: string;
  values?: string[];
}

export interface AmbitiousNamespaceSelector {
  matchExpressions?: MatchExpression9[];
  matchLabels?: { [key: string]: string };
}

export interface MatchExpression9 {
  key: string;
  operator: string;
  values?: string[];
}

export interface FluffyContainer {
  args?: string[];
  command?: string[];
  env?: StickyEnv[];
  envFrom?: StickyEnvFrom[];
  image?: string;
  imagePullPolicy?: string;
  lifecycle?: StickyLifecycle;
  livenessProbe?: StickyLivenessProbe;
  name: string;
  ports?: IndecentPort[];
  readinessProbe?: StickyReadinessProbe;
  resources?: IndigoResources;
  securityContext?: IndigoSecurityContext;
  startupProbe?: StickyStartupProbe;
  stdin?: boolean;
  stdinOnce?: boolean;
  terminationMessagePath?: string;
  terminationMessagePolicy?: string;
  tty?: boolean;
  volumeDevices?: StickyVolumeDevice[];
  volumeMounts?: StickyVolumeMount[];
  workingDir?: string;
}

export interface StickyEnv {
  name: string;
  value?: string;
  valueFrom?: IndigoValueFrom;
}

export interface IndigoValueFrom {
  configMapKeyRef?: IndigoConfigMapKeyRef;
  fieldRef?: HilariousFieldRef;
  resourceFieldRef?: HilariousResourceFieldRef;
  secretKeyRef?: IndigoSecretKeyRef;
}

export interface IndigoConfigMapKeyRef {
  key: string;
  name?: string;
  optional?: boolean;
}

export interface HilariousFieldRef {
  apiVersion?: string;
  fieldPath: string;
}

export interface HilariousResourceFieldRef {
  containerName?: string;
  divisor?: Divisor;
  resource: string;
}

export interface IndigoSecretKeyRef {
  key: string;
  name?: string;
  optional?: boolean;
}

export interface StickyEnvFrom {
  configMapRef?: IndigoConfigMapRef;
  prefix?: string;
  secretRef?: MischievousSecretRef;
}

export interface IndigoConfigMapRef {
  name?: string;
  optional?: boolean;
}

export interface MischievousSecretRef {
  name?: string;
  optional?: boolean;
}

export interface StickyLifecycle {
  postStart?: StickyPostStart;
  preStop?: StickyPreStop;
}

export interface StickyPostStart {
  exec?: Exec3;
  httpGet?: HTTPGet3;
  tcpSocket?: TCPSocket3;
}

export interface Exec3 {
  command?: string[];
}

export interface HTTPGet3 {
  host?: string;
  httpHeaders?: HTTPHeader3[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader3 {
  name: string;
  value: string;
}

export interface TCPSocket3 {
  host?: string;
  port: Divisor;
}

export interface StickyPreStop {
  exec?: Exec4;
  httpGet?: HTTPGet4;
  tcpSocket?: TCPSocket4;
}

export interface Exec4 {
  command?: string[];
}

export interface HTTPGet4 {
  host?: string;
  httpHeaders?: HTTPHeader4[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader4 {
  name: string;
  value: string;
}

export interface TCPSocket4 {
  host?: string;
  port: Divisor;
}

export interface StickyLivenessProbe {
  exec?: Exec5;
  failureThreshold?: number;
  grpc?: MagentaGrpc;
  httpGet?: HTTPGet5;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: TCPSocket5;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface Exec5 {
  command?: string[];
}

export interface MagentaGrpc {
  port: number;
  service?: string;
}

export interface HTTPGet5 {
  host?: string;
  httpHeaders?: HTTPHeader5[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader5 {
  name: string;
  value: string;
}

export interface TCPSocket5 {
  host?: string;
  port: Divisor;
}

export interface IndecentPort {
  containerPort: number;
  hostIP?: string;
  hostPort?: number;
  name?: string;
  protocol?: string;
}

export interface StickyReadinessProbe {
  exec?: Exec6;
  failureThreshold?: number;
  grpc?: FriskyGrpc;
  httpGet?: HTTPGet6;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: TCPSocket6;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface Exec6 {
  command?: string[];
}

export interface FriskyGrpc {
  port: number;
  service?: string;
}

export interface HTTPGet6 {
  host?: string;
  httpHeaders?: HTTPHeader6[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader6 {
  name: string;
  value: string;
}

export interface TCPSocket6 {
  host?: string;
  port: Divisor;
}

export interface IndigoResources {
  limits?: { [key: string]: Divisor };
  requests?: { [key: string]: Divisor };
}

export interface IndigoSecurityContext {
  allowPrivilegeEscalation?: boolean;
  capabilities?: IndigoCapabilities;
  privileged?: boolean;
  procMount?: string;
  readOnlyRootFilesystem?: boolean;
  runAsGroup?: number;
  runAsNonRoot?: boolean;
  runAsUser?: number;
  seccompProfile?: IndecentSeccompProfile;
  seLinuxOptions?: IndecentSELinuxOptions;
  windowsOptions?: IndecentWindowsOptions;
}

export interface IndigoCapabilities {
  add?: string[];
  drop?: string[];
}

export interface IndecentSELinuxOptions {
  level?: string;
  role?: string;
  type?: string;
  user?: string;
}

export interface IndecentSeccompProfile {
  localhostProfile?: string;
  type: string;
}

export interface IndecentWindowsOptions {
  gmsaCredentialSpec?: string;
  gmsaCredentialSpecName?: string;
  hostProcess?: boolean;
  runAsUserName?: string;
}

export interface StickyStartupProbe {
  exec?: Exec7;
  failureThreshold?: number;
  grpc?: MischievousGrpc;
  httpGet?: HTTPGet7;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: TCPSocket7;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface Exec7 {
  command?: string[];
}

export interface MischievousGrpc {
  port: number;
  service?: string;
}

export interface HTTPGet7 {
  host?: string;
  httpHeaders?: HTTPHeader7[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader7 {
  name: string;
  value: string;
}

export interface TCPSocket7 {
  host?: string;
  port: Divisor;
}

export interface StickyVolumeDevice {
  devicePath: string;
  name: string;
}

export interface StickyVolumeMount {
  mountPath: string;
  mountPropagation?: string;
  name: string;
  readOnly?: boolean;
  subPath?: string;
  subPathExpr?: string;
}

export interface FluffyDNSConfig {
  nameservers?: string[];
  options?: FluffyOption[];
  searches?: string[];
}

export interface FluffyOption {
  name?: string;
  value?: string;
}

export interface FluffyEphemeralContainer {
  args?: string[];
  command?: string[];
  env?: IndigoEnv[];
  envFrom?: IndigoEnvFrom[];
  image?: string;
  imagePullPolicy?: string;
  lifecycle?: IndigoLifecycle;
  livenessProbe?: IndigoLivenessProbe;
  name: string;
  ports?: HilariousPort[];
  readinessProbe?: IndigoReadinessProbe;
  resources?: IndecentResources;
  securityContext?: IndecentSecurityContext;
  startupProbe?: IndigoStartupProbe;
  stdin?: boolean;
  stdinOnce?: boolean;
  targetContainerName?: string;
  terminationMessagePath?: string;
  terminationMessagePolicy?: string;
  tty?: boolean;
  volumeDevices?: IndigoVolumeDevice[];
  volumeMounts?: IndigoVolumeMount[];
  workingDir?: string;
}

export interface IndigoEnv {
  name: string;
  value?: string;
  valueFrom?: IndecentValueFrom;
}

export interface IndecentValueFrom {
  configMapKeyRef?: IndecentConfigMapKeyRef;
  fieldRef?: AmbitiousFieldRef;
  resourceFieldRef?: AmbitiousResourceFieldRef;
  secretKeyRef?: IndecentSecretKeyRef;
}

export interface IndecentConfigMapKeyRef {
  key: string;
  name?: string;
  optional?: boolean;
}

export interface AmbitiousFieldRef {
  apiVersion?: string;
  fieldPath: string;
}

export interface AmbitiousResourceFieldRef {
  containerName?: string;
  divisor?: Divisor;
  resource: string;
}

export interface IndecentSecretKeyRef {
  key: string;
  name?: string;
  optional?: boolean;
}

export interface IndigoEnvFrom {
  configMapRef?: IndecentConfigMapRef;
  prefix?: string;
  secretRef?: BraggadociousSecretRef;
}

export interface IndecentConfigMapRef {
  name?: string;
  optional?: boolean;
}

export interface BraggadociousSecretRef {
  name?: string;
  optional?: boolean;
}

export interface IndigoLifecycle {
  postStart?: IndigoPostStart;
  preStop?: IndigoPreStop;
}

export interface IndigoPostStart {
  exec?: Exec8;
  httpGet?: HTTPGet8;
  tcpSocket?: TCPSocket8;
}

export interface Exec8 {
  command?: string[];
}

export interface HTTPGet8 {
  host?: string;
  httpHeaders?: HTTPHeader8[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader8 {
  name: string;
  value: string;
}

export interface TCPSocket8 {
  host?: string;
  port: Divisor;
}

export interface IndigoPreStop {
  exec?: Exec9;
  httpGet?: HTTPGet9;
  tcpSocket?: TCPSocket9;
}

export interface Exec9 {
  command?: string[];
}

export interface HTTPGet9 {
  host?: string;
  httpHeaders?: HTTPHeader9[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader9 {
  name: string;
  value: string;
}

export interface TCPSocket9 {
  host?: string;
  port: Divisor;
}

export interface IndigoLivenessProbe {
  exec?: Exec10;
  failureThreshold?: number;
  grpc?: BraggadociousGrpc;
  httpGet?: HTTPGet10;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: TCPSocket10;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface Exec10 {
  command?: string[];
}

export interface BraggadociousGrpc {
  port: number;
  service?: string;
}

export interface HTTPGet10 {
  host?: string;
  httpHeaders?: HTTPHeader10[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader10 {
  name: string;
  value: string;
}

export interface TCPSocket10 {
  host?: string;
  port: Divisor;
}

export interface HilariousPort {
  containerPort: number;
  hostIP?: string;
  hostPort?: number;
  name?: string;
  protocol?: string;
}

export interface IndigoReadinessProbe {
  exec?: Exec11;
  failureThreshold?: number;
  grpc?: Grpc1;
  httpGet?: HTTPGet11;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: TCPSocket11;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface Exec11 {
  command?: string[];
}

export interface Grpc1 {
  port: number;
  service?: string;
}

export interface HTTPGet11 {
  host?: string;
  httpHeaders?: HTTPHeader11[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader11 {
  name: string;
  value: string;
}

export interface TCPSocket11 {
  host?: string;
  port: Divisor;
}

export interface IndecentResources {
  limits?: { [key: string]: Divisor };
  requests?: { [key: string]: Divisor };
}

export interface IndecentSecurityContext {
  allowPrivilegeEscalation?: boolean;
  capabilities?: IndecentCapabilities;
  privileged?: boolean;
  procMount?: string;
  readOnlyRootFilesystem?: boolean;
  runAsGroup?: number;
  runAsNonRoot?: boolean;
  runAsUser?: number;
  seccompProfile?: HilariousSeccompProfile;
  seLinuxOptions?: HilariousSELinuxOptions;
  windowsOptions?: HilariousWindowsOptions;
}

export interface IndecentCapabilities {
  add?: string[];
  drop?: string[];
}

export interface HilariousSELinuxOptions {
  level?: string;
  role?: string;
  type?: string;
  user?: string;
}

export interface HilariousSeccompProfile {
  localhostProfile?: string;
  type: string;
}

export interface HilariousWindowsOptions {
  gmsaCredentialSpec?: string;
  gmsaCredentialSpecName?: string;
  hostProcess?: boolean;
  runAsUserName?: string;
}

export interface IndigoStartupProbe {
  exec?: Exec12;
  failureThreshold?: number;
  grpc?: Grpc2;
  httpGet?: HTTPGet12;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: TCPSocket12;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface Exec12 {
  command?: string[];
}

export interface Grpc2 {
  port: number;
  service?: string;
}

export interface HTTPGet12 {
  host?: string;
  httpHeaders?: HTTPHeader12[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader12 {
  name: string;
  value: string;
}

export interface TCPSocket12 {
  host?: string;
  port: Divisor;
}

export interface IndigoVolumeDevice {
  devicePath: string;
  name: string;
}

export interface IndigoVolumeMount {
  mountPath: string;
  mountPropagation?: string;
  name: string;
  readOnly?: boolean;
  subPath?: string;
  subPathExpr?: string;
}

export interface FluffyHostAlias {
  hostnames?: string[];
  ip?: string;
}

export interface FluffyImagePullSecret {
  name?: string;
}

export interface FluffyInitContainer {
  args?: string[];
  command?: string[];
  env?: IndecentEnv[];
  envFrom?: IndecentEnvFrom[];
  image?: string;
  imagePullPolicy?: string;
  lifecycle?: IndecentLifecycle;
  livenessProbe?: IndecentLivenessProbe;
  name: string;
  ports?: AmbitiousPort[];
  readinessProbe?: IndecentReadinessProbe;
  resources?: HilariousResources;
  securityContext?: HilariousSecurityContext;
  startupProbe?: IndecentStartupProbe;
  stdin?: boolean;
  stdinOnce?: boolean;
  terminationMessagePath?: string;
  terminationMessagePolicy?: string;
  tty?: boolean;
  volumeDevices?: IndecentVolumeDevice[];
  volumeMounts?: IndecentVolumeMount[];
  workingDir?: string;
}

export interface IndecentEnv {
  name: string;
  value?: string;
  valueFrom?: HilariousValueFrom;
}

export interface HilariousValueFrom {
  configMapKeyRef?: HilariousConfigMapKeyRef;
  fieldRef?: CunningFieldRef;
  resourceFieldRef?: CunningResourceFieldRef;
  secretKeyRef?: HilariousSecretKeyRef;
}

export interface HilariousConfigMapKeyRef {
  key: string;
  name?: string;
  optional?: boolean;
}

export interface CunningFieldRef {
  apiVersion?: string;
  fieldPath: string;
}

export interface CunningResourceFieldRef {
  containerName?: string;
  divisor?: Divisor;
  resource: string;
}

export interface HilariousSecretKeyRef {
  key: string;
  name?: string;
  optional?: boolean;
}

export interface IndecentEnvFrom {
  configMapRef?: HilariousConfigMapRef;
  prefix?: string;
  secretRef?: SecretRef1;
}

export interface HilariousConfigMapRef {
  name?: string;
  optional?: boolean;
}

export interface SecretRef1 {
  name?: string;
  optional?: boolean;
}

export interface IndecentLifecycle {
  postStart?: IndecentPostStart;
  preStop?: IndecentPreStop;
}

export interface IndecentPostStart {
  exec?: Exec13;
  httpGet?: HTTPGet13;
  tcpSocket?: TCPSocket13;
}

export interface Exec13 {
  command?: string[];
}

export interface HTTPGet13 {
  host?: string;
  httpHeaders?: HTTPHeader13[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader13 {
  name: string;
  value: string;
}

export interface TCPSocket13 {
  host?: string;
  port: Divisor;
}

export interface IndecentPreStop {
  exec?: Exec14;
  httpGet?: HTTPGet14;
  tcpSocket?: TCPSocket14;
}

export interface Exec14 {
  command?: string[];
}

export interface HTTPGet14 {
  host?: string;
  httpHeaders?: HTTPHeader14[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader14 {
  name: string;
  value: string;
}

export interface TCPSocket14 {
  host?: string;
  port: Divisor;
}

export interface IndecentLivenessProbe {
  exec?: Exec15;
  failureThreshold?: number;
  grpc?: Grpc3;
  httpGet?: HTTPGet15;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: TCPSocket15;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface Exec15 {
  command?: string[];
}

export interface Grpc3 {
  port: number;
  service?: string;
}

export interface HTTPGet15 {
  host?: string;
  httpHeaders?: HTTPHeader15[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader15 {
  name: string;
  value: string;
}

export interface TCPSocket15 {
  host?: string;
  port: Divisor;
}

export interface AmbitiousPort {
  containerPort: number;
  hostIP?: string;
  hostPort?: number;
  name?: string;
  protocol?: string;
}

export interface IndecentReadinessProbe {
  exec?: Exec16;
  failureThreshold?: number;
  grpc?: Grpc4;
  httpGet?: HTTPGet16;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: TCPSocket16;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface Exec16 {
  command?: string[];
}

export interface Grpc4 {
  port: number;
  service?: string;
}

export interface HTTPGet16 {
  host?: string;
  httpHeaders?: HTTPHeader16[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader16 {
  name: string;
  value: string;
}

export interface TCPSocket16 {
  host?: string;
  port: Divisor;
}

export interface HilariousResources {
  limits?: { [key: string]: Divisor };
  requests?: { [key: string]: Divisor };
}

export interface HilariousSecurityContext {
  allowPrivilegeEscalation?: boolean;
  capabilities?: HilariousCapabilities;
  privileged?: boolean;
  procMount?: string;
  readOnlyRootFilesystem?: boolean;
  runAsGroup?: number;
  runAsNonRoot?: boolean;
  runAsUser?: number;
  seccompProfile?: AmbitiousSeccompProfile;
  seLinuxOptions?: AmbitiousSELinuxOptions;
  windowsOptions?: AmbitiousWindowsOptions;
}

export interface HilariousCapabilities {
  add?: string[];
  drop?: string[];
}

export interface AmbitiousSELinuxOptions {
  level?: string;
  role?: string;
  type?: string;
  user?: string;
}

export interface AmbitiousSeccompProfile {
  localhostProfile?: string;
  type: string;
}

export interface AmbitiousWindowsOptions {
  gmsaCredentialSpec?: string;
  gmsaCredentialSpecName?: string;
  hostProcess?: boolean;
  runAsUserName?: string;
}

export interface IndecentStartupProbe {
  exec?: Exec17;
  failureThreshold?: number;
  grpc?: Grpc5;
  httpGet?: HTTPGet17;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  tcpSocket?: TCPSocket17;
  terminationGracePeriodSeconds?: number;
  timeoutSeconds?: number;
}

export interface Exec17 {
  command?: string[];
}

export interface Grpc5 {
  port: number;
  service?: string;
}

export interface HTTPGet17 {
  host?: string;
  httpHeaders?: HTTPHeader17[];
  path?: string;
  port: Divisor;
  scheme?: string;
}

export interface HTTPHeader17 {
  name: string;
  value: string;
}

export interface TCPSocket17 {
  host?: string;
  port: Divisor;
}

export interface IndecentVolumeDevice {
  devicePath: string;
  name: string;
}

export interface IndecentVolumeMount {
  mountPath: string;
  mountPropagation?: string;
  name: string;
  readOnly?: boolean;
  subPath?: string;
  subPathExpr?: string;
}

export interface FluffyOS {
  name: string;
}

export interface FluffyReadinessGate {
  conditionType: string;
}

export interface AmbitiousSecurityContext {
  fsGroup?: number;
  fsGroupChangePolicy?: string;
  runAsGroup?: number;
  runAsNonRoot?: boolean;
  runAsUser?: number;
  seccompProfile?: CunningSeccompProfile;
  seLinuxOptions?: CunningSELinuxOptions;
  supplementalGroups?: number[];
  sysctls?: FluffySysctl[];
  windowsOptions?: CunningWindowsOptions;
}

export interface CunningSELinuxOptions {
  level?: string;
  role?: string;
  type?: string;
  user?: string;
}

export interface CunningSeccompProfile {
  localhostProfile?: string;
  type: string;
}

export interface FluffySysctl {
  name: string;
  value: string;
}

export interface CunningWindowsOptions {
  gmsaCredentialSpec?: string;
  gmsaCredentialSpecName?: string;
  hostProcess?: boolean;
  runAsUserName?: string;
}

export interface FluffyToleration {
  effect?: string;
  key?: string;
  operator?: string;
  tolerationSeconds?: number;
  value?: string;
}

export interface FluffyTopologySpreadConstraint {
  labelSelector?: MagentaLabelSelector;
  maxSkew: number;
  topologyKey: string;
  whenUnsatisfiable: string;
}

export interface MagentaLabelSelector {
  matchExpressions?: MatchExpression10[];
  matchLabels?: { [key: string]: string };
}

export interface MatchExpression10 {
  key: string;
  operator: string;
  values?: string[];
}

export interface FluffyVolume {
  awsElasticBlockStore?: FluffyAwsElasticBlockStore;
  azureDisk?: FluffyAzureDisk;
  azureFile?: FluffyAzureFile;
  cephfs?: FluffyCephfs;
  cinder?: FluffyCinder;
  configMap?: TentacledConfigMap;
  csi?: FluffyCSI;
  downwardAPI?: TentacledDownwardAPI;
  emptyDir?: FluffyEmptyDir;
  ephemeral?: FluffyEphemeral;
  fc?: FluffyFc;
  flexVolume?: FluffyFlexVolume;
  flocker?: FluffyFlocker;
  gcePersistentDisk?: FluffyGcePersistentDisk;
  gitRepo?: FluffyGitRepo;
  glusterfs?: FluffyGlusterfs;
  hostPath?: FluffyHostPath;
  iscsi?: FluffyIscsi;
  name: string;
  nfs?: FluffyNFS;
  persistentVolumeClaim?: FluffyPersistentVolumeClaim;
  photonPersistentDisk?: FluffyPhotonPersistentDisk;
  portworxVolume?: FluffyPortworxVolume;
  projected?: FluffyProjected;
  quobyte?: FluffyQuobyte;
  rbd?: FluffyRbd;
  scaleIO?: FluffyScaleIO;
  secret?: StickySecret;
  storageos?: FluffyStorageos;
  vsphereVolume?: FluffyVsphereVolume;
}

export interface FluffyAwsElasticBlockStore {
  fsType?: string;
  partition?: number;
  readOnly?: boolean;
  volumeID: string;
}

export interface FluffyAzureDisk {
  cachingMode?: string;
  diskName: string;
  diskURI: string;
  fsType?: string;
  kind?: string;
  readOnly?: boolean;
}

export interface FluffyAzureFile {
  readOnly?: boolean;
  secretName: string;
  shareName: string;
}

export interface FluffyCephfs {
  monitors: string[];
  path?: string;
  readOnly?: boolean;
  secretFile?: string;
  secretRef?: SecretRef2;
  user?: string;
}

export interface SecretRef2 {
  name?: string;
}

export interface FluffyCinder {
  fsType?: string;
  readOnly?: boolean;
  secretRef?: SecretRef3;
  volumeID: string;
}

export interface SecretRef3 {
  name?: string;
}

export interface TentacledConfigMap {
  defaultMode?: number;
  items?: HilariousItem[];
  name?: string;
  optional?: boolean;
}

export interface HilariousItem {
  key: string;
  mode?: number;
  path: string;
}

export interface FluffyCSI {
  driver: string;
  fsType?: string;
  nodePublishSecretRef?: FluffyNodePublishSecretRef;
  readOnly?: boolean;
  volumeAttributes?: { [key: string]: string };
}

export interface FluffyNodePublishSecretRef {
  name?: string;
}

export interface TentacledDownwardAPI {
  defaultMode?: number;
  items?: AmbitiousItem[];
}

export interface AmbitiousItem {
  fieldRef?: MagentaFieldRef;
  mode?: number;
  path: string;
  resourceFieldRef?: MagentaResourceFieldRef;
}

export interface MagentaFieldRef {
  apiVersion?: string;
  fieldPath: string;
}

export interface MagentaResourceFieldRef {
  containerName?: string;
  divisor?: Divisor;
  resource: string;
}

export interface FluffyEmptyDir {
  medium?: string;
  sizeLimit?: Divisor;
}

export interface FluffyEphemeral {
  volumeClaimTemplate?: FluffyVolumeClaimTemplate;
}

export interface FluffyVolumeClaimTemplate {
  metadata?: StickyMetadata;
  spec: StickySpec;
}

export interface StickyMetadata {
  annotations?: { [key: string]: string };
  finalizers?: string[];
  labels?: { [key: string]: string };
  name?: string;
  namespace?: string;
}

export interface StickySpec {
  accessModes?: string[];
  dataSource?: FluffyDataSource;
  dataSourceRef?: FluffyDataSourceRef;
  resources?: AmbitiousResources;
  selector?: FluffySelector;
  storageClassName?: string;
  volumeMode?: string;
  volumeName?: string;
}

export interface FluffyDataSource {
  apiGroup?: string;
  kind: string;
  name: string;
}

export interface FluffyDataSourceRef {
  apiGroup?: string;
  kind: string;
  name: string;
}

export interface AmbitiousResources {
  limits?: { [key: string]: Divisor };
  requests?: { [key: string]: Divisor };
}

export interface FluffySelector {
  matchExpressions?: MatchExpression11[];
  matchLabels?: { [key: string]: string };
}

export interface MatchExpression11 {
  key: string;
  operator: string;
  values?: string[];
}

export interface FluffyFc {
  fsType?: string;
  lun?: number;
  readOnly?: boolean;
  targetWWNS?: string[];
  wwids?: string[];
}

export interface FluffyFlexVolume {
  driver: string;
  fsType?: string;
  options?: { [key: string]: string };
  readOnly?: boolean;
  secretRef?: SecretRef4;
}

export interface SecretRef4 {
  name?: string;
}

export interface FluffyFlocker {
  datasetName?: string;
  datasetUUID?: string;
}

export interface FluffyGcePersistentDisk {
  fsType?: string;
  partition?: number;
  pdName: string;
  readOnly?: boolean;
}

export interface FluffyGitRepo {
  directory?: string;
  repository: string;
  revision?: string;
}

export interface FluffyGlusterfs {
  endpoints: string;
  path: string;
  readOnly?: boolean;
}

export interface FluffyHostPath {
  path: string;
  type?: string;
}

export interface FluffyIscsi {
  chapAuthDiscovery?: boolean;
  chapAuthSession?: boolean;
  fsType?: string;
  initiatorName?: string;
  iqn: string;
  iscsiInterface?: string;
  lun: number;
  portals?: string[];
  readOnly?: boolean;
  secretRef?: SecretRef5;
  targetPortal: string;
}

export interface SecretRef5 {
  name?: string;
}

export interface FluffyNFS {
  path: string;
  readOnly?: boolean;
  server: string;
}

export interface FluffyPersistentVolumeClaim {
  claimName: string;
  readOnly?: boolean;
}

export interface FluffyPhotonPersistentDisk {
  fsType?: string;
  pdID: string;
}

export interface FluffyPortworxVolume {
  fsType?: string;
  readOnly?: boolean;
  volumeID: string;
}

export interface FluffyProjected {
  defaultMode?: number;
  sources?: FluffySource[];
}

export interface FluffySource {
  configMap?: StickyConfigMap;
  downwardAPI?: StickyDownwardAPI;
  secret?: TentacledSecret;
  serviceAccountToken?: FluffyServiceAccountToken;
}

export interface StickyConfigMap {
  items?: CunningItem[];
  name?: string;
  optional?: boolean;
}

export interface CunningItem {
  key: string;
  mode?: number;
  path: string;
}

export interface StickyDownwardAPI {
  items?: MagentaItem[];
}

export interface MagentaItem {
  fieldRef?: FriskyFieldRef;
  mode?: number;
  path: string;
  resourceFieldRef?: FriskyResourceFieldRef;
}

export interface FriskyFieldRef {
  apiVersion?: string;
  fieldPath: string;
}

export interface FriskyResourceFieldRef {
  containerName?: string;
  divisor?: Divisor;
  resource: string;
}

export interface TentacledSecret {
  items?: FriskyItem[];
  name?: string;
  optional?: boolean;
}

export interface FriskyItem {
  key: string;
  mode?: number;
  path: string;
}

export interface FluffyServiceAccountToken {
  audience?: string;
  expirationSeconds?: number;
  path: string;
}

export interface FluffyQuobyte {
  group?: string;
  readOnly?: boolean;
  registry: string;
  tenant?: string;
  user?: string;
  volume: string;
}

export interface FluffyRbd {
  fsType?: string;
  image: string;
  keyring?: string;
  monitors: string[];
  pool?: string;
  readOnly?: boolean;
  secretRef?: SecretRef6;
  user?: string;
}

export interface SecretRef6 {
  name?: string;
}

export interface FluffyScaleIO {
  fsType?: string;
  gateway: string;
  protectionDomain?: string;
  readOnly?: boolean;
  secretRef: SecretRef7;
  sslEnabled?: boolean;
  storageMode?: string;
  storagePool?: string;
  system: string;
  volumeName?: string;
}

export interface SecretRef7 {
  name?: string;
}

export interface StickySecret {
  defaultMode?: number;
  items?: MischievousItem[];
  optional?: boolean;
  secretName?: string;
}

export interface MischievousItem {
  key: string;
  mode?: number;
  path: string;
}

export interface FluffyStorageos {
  fsType?: string;
  readOnly?: boolean;
  secretRef?: SecretRef8;
  volumeName?: string;
  volumeNamespace?: string;
}

export interface SecretRef8 {
  name?: string;
}

export interface FluffyVsphereVolume {
  fsType?: string;
  storagePolicyID?: string;
  storagePolicyName?: string;
  volumePath: string;
}

export interface ServeConfig {
  deployments?: Deployment[];
  importPath: string;
  port?: number;
  runtimeEnv?: string;
}

export interface Deployment {
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

export interface RayActorOptions {
  acceleratorType?: string;
  memory?: number;
  numCpus?: number;
  numGpus?: number;
  objectStoreMemory?: number;
  resources?: string;
  runtimeEnv?: string;
}

export interface ServeService {
  apiVersion?: string;
  kind?: string;
  metadata?: ServeServiceMetadata;
  spec?: ServeServiceSpec;
  status?: ServeServiceStatus;
}

export interface ServeServiceMetadata {
  annotations?: { [key: string]: string };
  finalizers?: string[];
  labels?: { [key: string]: string };
  name?: string;
  namespace?: string;
}

export interface ServeServiceSpec {
  allocateLoadBalancerNodePorts?: boolean;
  clusterIP?: string;
  clusterIPS?: string[];
  externalIPS?: string[];
  externalName?: string;
  externalTrafficPolicy?: string;
  healthCheckNodePort?: number;
  internalTrafficPolicy?: string;
  ipFamilies?: string[];
  ipFamilyPolicy?: string;
  loadBalancerClass?: string;
  loadBalancerIP?: string;
  loadBalancerSourceRanges?: string[];
  ports?: CunningPort[];
  publishNotReadyAddresses?: boolean;
  selector?: { [key: string]: string };
  sessionAffinity?: string;
  sessionAffinityConfig?: FluffySessionAffinityConfig;
  type?: string;
}

export interface CunningPort {
  appProtocol?: string;
  name?: string;
  nodePort?: number;
  port: number;
  protocol?: string;
  targetPort?: Divisor;
}

export interface FluffySessionAffinityConfig {
  clientIP?: FluffyClientIP;
}

export interface FluffyClientIP {
  timeoutSeconds?: number;
}

export interface ServeServiceStatus {
  conditions?: FluffyCondition[];
  loadBalancer?: FluffyLoadBalancer;
}

export interface FluffyCondition {
  lastTransitionTime: Date;
  message: string;
  observedGeneration?: number;
  reason: string;
  status: StatusEnum;
  type: string;
}

export interface FluffyLoadBalancer {
  ingress?: FluffyIngress[];
}

export interface FluffyIngress {
  hostname?: string;
  ip?: string;
  ports?: MagentaPort[];
}

export interface MagentaPort {
  error?: string;
  port: number;
  protocol: string;
}

export interface CoordinateStatus {
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

export interface PurpleServeDeploymentStatus {
  healthLastUpdateTime?: Date;
  lastUpdateTime?: Date;
  message?: string;
  status?: string;
}

export interface ActiveServiceStatusDashboardStatus {
  healthLastUpdateTime?: Date;
  isHealthy?: boolean;
  lastUpdateTime?: Date;
}

export interface ActiveServiceStatusRayClusterStatus {
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

export interface PurpleHead {
  podIP?: string;
  serviceIP?: string;
}

export interface PendingServiceStatus {
  applicationStatuses?: { [key: string]: PendingServiceStatusApplicationStatus };
  dashboardStatus?: PendingServiceStatusDashboardStatus;
  rayClusterName?: string;
  rayClusterStatus?: PendingServiceStatusRayClusterStatus;
}

export interface PendingServiceStatusApplicationStatus {
  healthLastUpdateTime?: Date;
  lastUpdateTime?: Date;
  message?: string;
  serveDeploymentStatuses?: { [key: string]: FluffyServeDeploymentStatus };
  status?: string;
}

export interface FluffyServeDeploymentStatus {
  healthLastUpdateTime?: Date;
  lastUpdateTime?: Date;
  message?: string;
  status?: string;
}

export interface PendingServiceStatusDashboardStatus {
  healthLastUpdateTime?: Date;
  isHealthy?: boolean;
  lastUpdateTime?: Date;
}

export interface PendingServiceStatusRayClusterStatus {
  availableWorkerReplicas?: number;
  desiredWorkerReplicas?: number;
  endpoints?: { [key: string]: string };
  head?: FluffyHead;
  lastUpdateTime?: Date;
  maxWorkerReplicas?: number;
  minWorkerReplicas?: number;
  observedGeneration?: number;
  reason?: string;
  state?: string;
}

export interface FluffyHead {
  podIP?: string;
  serviceIP?: string;
}
