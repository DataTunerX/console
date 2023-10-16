const pathJoin = (...paths: string[]) => paths.join('/').replace(/\/{1,}/g, '/');

export default pathJoin;
