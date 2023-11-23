import { dayjs } from '@/plugins/dayjs';
import { isNil } from 'lodash';

type DateTime = string | number | Date | dayjs.Dayjs | null | undefined

export const useRelativeTime = (from: DateTime, to: DateTime = dayjs(), zeroNotToHyphen = false) => {
  if (!zeroNotToHyphen && (Number(from) === 0)) {
    return '-';
  }

  if (isNil(from) || from === '') {
    return '-';
  }

  return dayjs(from).to(to, true);
};
