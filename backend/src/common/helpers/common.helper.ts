import { get } from 'lodash';

export const extractItemsAndTotalItems = <T = any>(data: any) => {
  if (Array.isArray(data)) {
    return {
      items: get(data, '[0].data', []) as T[],
      totalItems: get(data, '[0].total.0.count', 0) as number,
    };
  }
  return {
    items: get(data, 'data', []) as T[],
    totalItems: get(data, 'total.0.count', 0) as number,
  };
};
