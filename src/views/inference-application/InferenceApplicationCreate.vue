<script setup lang="ts">
import { InferenceApplication, createInferenceApplications } from '@/api/ray-service';
import { useNamespaceStore } from '@/stores/namespace';
import { nError, nSuccess } from '@/utils/useNoty';
import { object, string } from 'yup';

const props = defineProps({
  modelValue: {
    type: Object as PropType<InferenceApplication>,
    default: () => ({}),
  },
});

type Emits = {
  (event: 'resolve'): void;
  (event: 'reject'): void;
};

const emits = defineEmits<Emits>();

const { t } = useI18n();

const { namespace } = storeToRefs(useNamespaceStore());

const { handleSubmit } = useForm<InferenceApplication>({
  initialValues: props.modelValue,
  validationSchema: object({
    name: string().RFC1123Label().required().label(t('views.InferenceApplication.create.name')),
    llmCheckpoint: string().required().label(t('views.InferenceApplication.create.llmCheckpoint')),
  }),
});

const submit = handleSubmit(async (values) => {
  try {
    await createInferenceApplications(namespace.value, values);
    nSuccess(t('views.InferenceApplication.create.createSuccess'));
    emits('resolve');
  } catch (error) {
    nError(t('views.InferenceApplication.create.createFailed'), error);
  }
});
</script>

<template>
  <dao-dialog
    :model-value="true"
    :header="$t('views.InferenceApplication.create.header')"
    @cancel="$emit('reject')"
    @confirm="submit"
  >
    <dao-form label-width="70px">
      <dao-form-item-validate
        :label="$t('views.InferenceApplication.create.llmCheckpoint')"
        name="llmCheckpoint"
        required
        :control-props="{
          block: true,
          disabled: true,
        }"
      />

      <dao-form-item-validate
        :label="$t('views.InferenceApplication.create.name')"
        name="name"
        required
        :control-props="{
          block: true,
        }"
      />
    </dao-form>
  </dao-dialog>
</template>
