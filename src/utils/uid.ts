export default function uniqueID(length = 10) {
  return `${Math.random()
    .toString(36)
    .substr(2, length)}`;
}

export const randomStr = (length: number) => {
  const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  let i = length;

  while (i) {
    result += str[Math.floor(Math.random() * str.length)];
    i -= 1;
  }

  return result;
};
