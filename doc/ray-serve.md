# 创建推理服务的方案

## LLMCheckpoint

从 LLMCheckpoint CR 上，取到微调出来的镜像，该镜像包含了推理服务

```yaml
apiVersion: core.datatunerx.io/v1beta1
kind: LLMCheckpoint
metadata:
  name: finetune-sample
  namespace: datatunerx-dev
spec:
  checkpoint: datatunerx/tuning/TorchTrainer_2023-11-29_19-41-17/TorchTrainer_5d9a0_00000_0_2023-11-29_19-41-43/checkpoint_000000
  image:
    imagePullPolicy: IfNotPresent
    name: rayproject/ray271-llama2-7b-finetune:20231129
    path: /tmp/llama2-7b
```

## 创建 RayService

创建一个包含 RayServe 的 RayService

[Ref](ttps://github.com/DataTunerX/utility-server/blob/main/inference/inference.py)

固定 RayServe:

`port name`: serve
`port`: 8000
`importPath`: inference.deployment
`working_dir`: file:///home/inference/inference.zip

`BASE_MODEL_DIR`

`CHECKPOINT_DIR`

```yaml
apiVersion: ray.io/v1
kind: RayService
metadata:
  name: finetune-sample
  namespace: datatunerx-dev
  labels:
    createdByFrontend: 'true'
spec:
  rayClusterConfig:
    headGroupSpec:
      rayStartParams:
        dashboard-host: 0.0.0.0
        num-gpus: '0'
      serviceType: NodePort
      template:
        spec:
          containers:
            - env:
              image: rayproject/ray271-llama2-7b-finetune:20231129
              ports:
                - containerPort: 6379
                  name: gcs-server
                  protocol: TCP
                - containerPort: 8265
                  name: dashboard
                  protocol: TCP
                - containerPort: 10001
                  name: client
                  protocol: TCP
                - containerPort: 8000
                  name: serve
                  protocol: TCP
              resources:
                limits:
                  cpu: 2000m
                  memory: 8Gi
                requests:
                  cpu: 1000m
                  memory: 4Gi
    rayVersion: 2.7.1
    workerGroupSpecs:
      - groupName: group
        maxReplicas: 1
        minReplicas: 1
        replicas: 1
        template:
          spec:
            containers:
              image: rayproject/ray271-llama2-7b-finetune:20231129
              lifecycle:
                preStop:
                  exec:
                    command:
                      - /bin/sh
                      - -c
                      - ray stop
              resources:
                limits:
                  cpu: 8000m
                  memory: 48Gi
                  nvidia.com/gpu: '1'
  serveConfig:
    deployments:
      - name: LlamaDeployment
        numReplicas: 1
        rayActorOptions:
          numGpus: 1
    importPath: inference.deployment
    runtimeEnv: |
      working_dir: "file:///home/inference/inference.zip"
  serveService:
    metadata:
      labels:
        app: inference
      name: finetune-sample-service
    spec:
      ports:
        - name: serve
          port: 8000
          protocol: TCP
          targetPort: 8000
      selector:
        ray.io/node-type: head
```

## Ray Proxy

如何在前端调用推理服务？端口不同，引起`跨域`问题。

前端地址：<http://10.29.26.43:30961>

推理服务：<http://10.29.26.43:30411>

启 Nginx 服务，根据 RayService 的名字代理到对应的推理服务。

`Ray Proxy` watch `RayService`（label: app=prediction），把 serveService 的 `ClusterIP`、`Port` 写到名称为 `ray-{RayServiceName}` 的文件:

```conf
 location ~ /apis/rayservice/{{ .Name }}/(.*) {
     set $target http://{{ .ClusterIP }}:{{ .Port }}/;
     proxy_pass $target$1$is_args$args;
     proxy_http_version 1.1;
     proxy_buffering off;
     proxy_set_header Upgrade $http_upgrade;
     proxy_set_header Connection $connection_upgrade;
     proxy_read_timeout          2000s;
     proxy_set_header Host $http_host;
     proxy_set_header X-Real-IP $remote_addr;
     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
 }
```

通过 nginx 代理所有的推理服务。前端反向代理到 `RayProxy`。

## Frontend Call

curl Demo:

```bash
curl -X "POST" "http://10.29.26.43:30961/apis/rayservice/qa-service-chatglm3/embeddings/QuestionAnswer?stream=true" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "temperature": 0.95,
  "secretKey": "dasdada",
  "invoke_method": "async",
  "prompt": [
    {
      "content": "你好",
      "role": "user"
    }
  ],
  "incremental": false
}'
```

```bash
curl -X "POST" "http://10.29.26.43:30961/apis/rayservice/qa-service-chatglm3/inference" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "input": "你好",
}'
```

Output:

```json
{ "output": "", "tokenLength": "", "elapsedTime": "", "tokenPerSec": "" }
```
