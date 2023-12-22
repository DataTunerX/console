import { useRelativeTime } from '@/utils/useRelativeTime';

describe('useRelativeTime', () => {
  it('should return "-" when "from" is 0 and "zeroNotToHyphen" is false', () => {
    const result = useRelativeTime(0);

    expect(result).toEqual('-');
  });

  it('should return "-" when "from" is null', () => {
    const result = useRelativeTime(null);

    expect(result).toEqual('-');
  });

  it('should return "-" when "from" is an empty string', () => {
    const result = useRelativeTime('');

    expect(result).toEqual('-');
  });

  it('should return the relative time between "from" and "to"', () => {
    const from = '2022-01-01';
    const to = '2022-01-02';
    const result = useRelativeTime(from, to);

    expect(result).toEqual('a day');
  });

  it('should return the relative time between "from" and current time if "to" is not provided', () => {
    const from = '2022-01-01';
    const result = useRelativeTime(from);

    // Assert that the result is a string representing the relative time
    expect(typeof result).toEqual('string');
  });
});
