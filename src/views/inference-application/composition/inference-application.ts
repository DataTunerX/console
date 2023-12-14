import { rayServiceClient, RayService, InferenceApplication } from '@/api/ray-service';
import { createDialog } from '@dao-style/extend';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue';
import InferenceApplicationCreate from '../InferenceApplicationCreate.vue';

export function useDeleteInferenceApplication(namespace: Ref<string>, handleRefresh: () => void) {
  const { t } = useI18n();
  const deleteFn = (name: string) => rayServiceClient.delete(namespace.value, name);

  const onConfirmDelete = async (inferenceApplication: RayService) => {
    const dialog = createDialog(ConfirmDeleteDialog);

    await dialog.show({
      header: t('views.InferenceApplication.delete.header'),
      content: t('views.InferenceApplication.delete.content'),
      name: inferenceApplication.metadata?.name,
      deleteFn,
    });
    handleRefresh();
  };

  return {
    onConfirmDelete,
  };
}

export function useCreateInferenceApplication(handleRefresh: () => void) {
  const onCreate = async (model:InferenceApplication) => {
    const dialog = createDialog(InferenceApplicationCreate);

    await dialog.show({
      modelValue: model,
    });

    handleRefresh();
  };

  return {
    onCreate,
  };
}
