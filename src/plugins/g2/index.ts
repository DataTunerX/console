import { Runtime, corelib, extend } from '@antv/g2';

// 基于 corelib 对 Runtime 进行扩展
// 1. 增加类型（如果使用的 TypeScript）
// 2. 增加 Mark
const Chart = extend(Runtime, { ...corelib() });

export { Chart };
