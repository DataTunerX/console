const re = /^http[s]?:\/\//;

export default function isHttpURL(url: unknown) {
  return re.test(String(url).toLowerCase());
}
