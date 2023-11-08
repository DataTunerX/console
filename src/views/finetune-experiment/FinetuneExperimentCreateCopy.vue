<script setup lang="ts">
import { DaoSelect } from '@dao-style/core';
import { useFieldArray, useForm } from 'vee-validate';
import { string, object } from 'yup';
import { computed, markRaw } from 'vue';
import { FinetuneJob } from '@/api/finetune-job';
import { finetuneExperimentClient } from '@/api/finetune-experiment';
import { useNamespaceStore } from '@/stores/namespace';
import { storeToRefs } from 'pinia';
import { nError } from '@/utils/useNoty';
import { useRouter } from 'vue-router';
import FinetuneJobComponent from './components/FinetuneJob.vue';
import { useFinetuneExperiment, useScoringConfig } from './composition/finetune';

const router = useRouter();

const { namespace } = storeToRefs(useNamespaceStore());

const { finetuneExperiment } = useFinetuneExperiment();

const { scoringConfigs, fetchScoringConfigs } = useScoringConfig();

fetchScoringConfigs(namespace.value);

const validationSchema = markRaw(
  object({
    metadata: object({
      name: string().RFC1123Label().required('请输入实验名称'),
    }),
    spec: object({
      scoringConfig: object({
        name: string().required('请输入评估方式'),
      }),
    }),
  }),
);

const { values, handleSubmit } = useForm({
  initialValues: finetuneExperiment,
  validationSchema,
});

const { push, remove } = useFieldArray<FinetuneJob>('spec.finetuneJobs');

const onAdd = (val: FinetuneJob) => {
  push(val);
};

const jobs = computed(() => values.spec?.finetuneJobs.map((job) => {
  const { metadata, spec } = job;
  const name = metadata?.name;
  const finetune = spec?.finetune;
  const llm = finetune?.llm;
  const dataset = finetune?.dataset;
  const hyperparameter = finetune?.hyperparameter;

  return {
    name,
    llm,
    dataset,
    hyperparameter,
  };
}));

const columns = computed(() => [
  {
    id: 'name',
    header: '任务名称',
  },
  {
    id: 'llm',
    header: '基础大模型',
  },
  {
    id: 'dataset',
    header: '数据集',
  },
  {
    id: 'hyperparameter',
    header: '超参组',
  },
  {
    id: 'action',
    header: '',
    defaultWidth: '60px',
  },
]);

const toList = () => {
  router.push({
    name: 'FinetuneExperimentList',
  });
};

const onSubmit = handleSubmit(async () => {
  try {
    await finetuneExperimentClient.create(namespace.value, values);
    toList();
  } catch (error) {
    nError('失败了', error);
  }
});

</script>

<template>
  <dao-modal-layout
    title="创建微调实验"
    @cancel="$router.back"
    @confirm="onSubmit"
  >
    <dao-form label-width="100px">
      <dao-form-group title="基本信息">
        <dao-form-item-validate
          label="实验名称"
          name="metadata.name"
          required
        />
        <dao-form-item-validate
          label="评估方式"
          name="spec.scoringConfig.name"
          :tag="DaoSelect"
        >
          <dao-option
            v-for="scoringConfig in scoringConfigs"
            :key="scoringConfig.metadata?.name"
            :label="scoringConfig.metadata?.name"
            :value="scoringConfig.metadata?.name"
          />
        </dao-form-item-validate>
      </dao-form-group>

      <div class="flex items-center mb-[10px]">
        <span class="dao-form-group__title m-0">任务</span>
        <dao-text-button
          class="ml-5"
          :prop="{
            type:'action',
            iconLeft:'icon-add-in-circle',
          }"
        >
          添加任务
        </dao-text-button>
      </div>

      <dao-card class="mb-[20px]">
        <template #action>
          <dao-button
            use-font
            type="ghost"
            icon-left="icon-checked"
          >
            保存
          </dao-button>
        </template>

        <dao-card-item>
          <dao-form label-width="120px">
            <dao-form-item
              label="任务名称"
              required
              icon-message="dao form item label with icon for helper message"
            >
              <dao-input />
            </dao-form-item>

            <dao-form-item
              label="任务描述"
              required
              icon-message="dao form item label with icon for helper message"
            >
              <textarea
                class="dao-textarea"
                rows="3"
                placeholder="placeholder"
              />
            </dao-form-item>

            <dao-form-item
              label="基础大模型"
              required
              icon-message="dao form item label with icon for helper message"
            >
              <dao-input />
            </dao-form-item>

            <dao-form-item label="数据集">
              <dao-input />
              <div class="dao-form-item__helper-text">
                测试用 helper text，测试用 helper text，测试用 helper text，
              </div>
              <dao-helper-text>
                with slot dao-helper-text
              </dao-helper-text>
              <dao-helper-text :content="'with props dao-helper-text'" />
            </dao-form-item>

            <dao-form-item label="超参组">
              <div class="flex justify-between">
                <dao-input />
                <dao-helper-text>
                  <dao-checkbox
                    id="checkbox-1"
                  >
                    基于选中的超参组，新建一个超参组
                  </dao-checkbox>
                </dao-helper-text>
              </div>
            </dao-form-item>

            <dao-form-item label="">
              <dao-form type="vertical">
                <div class="flex  space-x-4 border-dashed border-2 border-gray-200 rounded-lg p-[20px] mb-[10px]">
                  <dao-form-item
                    label="新超参组名称"
                    :padding-bottom="0"
                  >
                    <dao-input />
                  </dao-form-item>
                  <dao-form-item
                    label="微调类型"
                    :padding-bottom="0"
                  >
                    <dao-input />
                  </dao-form-item>
                </div>

                <div class="border-dashed border-2 border-blue-200 rounded-lg p-[20px] mb-[10px]">
                  <div class="flex space-x-4">
                    <div>
                      <dao-form-item label="Size">
                        <dao-input />
                      </dao-form-item>
                      <dao-form-item label="Optimizer">
                        <dao-input />
                      </dao-form-item>
                      <dao-form-item
                        label="LaRO"
                        :padding-bottom="0"
                      >
                        <dao-input />
                      </dao-form-item>
                    </div>
                    <div>
                      <dao-form-item label="Size">
                        <dao-input />
                      </dao-form-item>
                      <dao-form-item label="Optimizer">
                        <dao-input />
                      </dao-form-item>
                      <dao-form-item
                        label="LaRO"
                        :padding-bottom="0"
                      >
                        <dao-input />
                      </dao-form-item>
                    </div>
                    <div>
                      <dao-form-item label="Size">
                        <dao-input />
                      </dao-form-item>
                    </div>
                  </div>
                </div>

                <div class="border-dashed border-2 border-blue-200 rounded-lg p-[20px] mb-[10px]">
                  <div class="flex space-x-4">
                    <div>
                      <dao-form-item label="Size">
                        <dao-input />
                      </dao-form-item>
                      <dao-form-item label="Optimizer">
                        <dao-input />
                      </dao-form-item>
                      <dao-form-item
                        label="LaRO"
                        :padding-bottom="0"
                      >
                        <dao-input />
                      </dao-form-item>
                    </div>
                    <div>
                      <dao-form-item label="Size">
                        <dao-input />
                      </dao-form-item>
                      <dao-form-item label="Optimizer">
                        <dao-input />
                      </dao-form-item>
                      <dao-form-item
                        label="LaRO"
                        :padding-bottom="0"
                      >
                        <dao-input />
                      </dao-form-item>
                    </div>
                    <div>
                      <dao-form-item label="Size">
                        <dao-input />
                      </dao-form-item>
                      <dao-form-item label="Optimizer">
                        <dao-input />
                      </dao-form-item>
                    </div>
                  </div>
                </div>
              </dao-form>
            </dao-form-item>
          </dao-form>
        </dao-card-item>
      </dao-card>

      <dao-card
        title="判断语言的正负面"
        class="mb-[20px]"
      >
        <template #action>
          <dao-action-icon name="icon-edit-pen" />
          <dao-action-icon name="icon-trash" />
        </template>

        <template #header-prefix>
          <span class="mr-3 inline-block px-2 py-1 bg-blue-500 text-white font-semibold rounded-full shadow-md">
            BERT-Legal
          </span>
        </template>

        <span class="pl-5 pr-5">
          BERT-Legal是由北大法宝（Peking University Law Information Center）和哈佛大学合作开发的法律领域的自然语言处理模型。它特别针对法律文本，可以用于法律信息检索、法律文本分类等任务。
        </span>
      </dao-card>

      <dao-card
        title="语言转换"
        class="mb-[20px]"
      >
        <template #action>
          <dao-action-icon name="icon-edit-pen" />
          <dao-action-icon name="icon-trash" />
        </template>

        <template #header-prefix>
          <span class="mr-3 inline-block px-2 py-1 bg-pink-500 text-white font-semibold rounded-full shadow-md">
            LexOpen
          </span>
        </template>

        <span class="pl-5 pr-5">
          LexOpen是法学教育科技公司LexField推出的法律自然语言处理工具，用于文本分析、合同分析和法律知识图谱构建。        </span>
      </dao-card>

      <dao-card
        title="法律专场"
        class="mb-[20px]"
      >
        <template #action>
          <dao-action-icon name="icon-edit-pen" />
          <dao-action-icon name="icon-trash" />
        </template>

        <template #header-prefix>
          <span class="mr-3 inline-block px-2 py-1 bg-green-500 text-white font-semibold rounded-full shadow-md">
            Westlaw Edge
          </span>
        </template>

        <span class="pl-5 pr-5">
          Westlaw Edge是汤森路透推出的法律研究工具，其中包括自然语言处理技术，用于法律检索、合同分析和法律文本解析。       </span>
      </dao-card>
    </dao-form>
  </dao-modal-layout>
</template>

<style>
.bg-color{
  background: #f0f9ff;
}
</style>
