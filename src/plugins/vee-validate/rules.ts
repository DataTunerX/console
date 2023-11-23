/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { findDuplicateIndices } from '@/utils/findDuplicate';
import { useI18n } from 'vue-i18n';
import { addMethod, array, Flags } from 'yup'; // Import the ArraySchema type

type MapperFunction = (item: any) => any;

declare module 'yup' {
  // Ensure that the type parameters match the original ArraySchema declaration
  interface ArraySchema<
    TIn extends any[] | null | undefined = any[],
    TContext = Record<string, any>,
    TDefault = undefined,
    TFlags extends Flags = ''
  > {
    unique(mapper: MapperFunction, label?: string): ArraySchema;
  }
}

addMethod(array, 'unique', function unique(mapper: MapperFunction, label: string) {
  const { t } = useI18n();

  return this.test({
    name: 'unique',
    exclusive: true,
    test(value, ctx) {
      if (value && value.length > 1) {
        const indices = findDuplicateIndices(value, mapper);

        if (indices.length > 0) {
          const messages = indices.map((group) => {
            const items = group.map((index) => index + 1).join(', ');

            return t('views.FinetuneExperiment.error.duplicateName', {
              items,
              label,
            });
          });

          return ctx.createError({ message: messages.join('; ') });
        }
      }

      return true;
    },
  });
});

export * as yup from 'yup';
