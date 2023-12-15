import { noty } from '@/plugins/dao-style';

export function nSuccess(content?: string, title?: string) {
  noty.success({
    title,
    content,
  });
}

export function nError(
  title?: string,
  e?: { message?: string } | { error: string } | string | unknown,
) {
  if (typeof e === 'string') {
    noty.error({
      title,
      content: e ?? undefined,
    });
  } else if (e && typeof e === 'object') {
    if ('message' in e) {
      noty.error({
        title,
        content: (e as { message?: string })?.message ?? undefined,
      });
    } else if ('error' in e) {
      noty.error({
        title,
        content: (e as { error: string })?.error ?? undefined,
      });
    }
  } else {
    noty.error({
      title,
    });
  }
}
