const getUrlBase = () => {
  const baseTag = document.getElementsByTagName('base')?.[0];

  if (!baseTag) {
    return '/';
  }

  return baseTag.href.slice(window.location.origin.length);
};

export default getUrlBase;
