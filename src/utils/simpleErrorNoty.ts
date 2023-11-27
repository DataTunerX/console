import { noty } from '@/plugins/dao-style';

type grpcError = {
  code: number;
  details: Array<unknown>;
  message: string;
}

export default function simpleErrorNoty(data: unknown) {
  noty.error({
    title: (data as grpcError).message || String(data) || 'Unknown Error',
    showClose: true,
  });
}
