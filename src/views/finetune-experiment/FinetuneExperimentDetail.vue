<script setup lang="ts">
import { useForm } from 'vee-validate';

import { object, string } from 'yup';
import { ref } from 'vue';
import KeyValueForm from '@/components/KeyValueForm.vue';

const labelRef = ref();

const {
  values, defineComponentBinds, validate,
} = useForm({
  validationSchema: object({
    email: string(),
    labels: object().test('labels', 'labels is required', async () => {
      const valid = await labelRef.value.validate();

      return valid;
    }),
  }),
  initialValues: {
    labels: {},
  },
});

const labels = defineComponentBinds('labels', {
  validateOnModelUpdate: false,
});
</script>

<template>
  <div>
    <!-- <dao-key-value-editor
      v-bind="labels"
      ref="labelRef"
    /> -->

    <key-value-form
      v-bind="labels"
      ref="labelRef"
      name="labels"
    />

    <pre>values: {{ values }}</pre>
  </div>

  <dao-button @click="validate">
    submit
  </dao-button>
</template>
