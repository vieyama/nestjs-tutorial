import { omit } from 'lodash';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export type PaginateOptions = {
  page?: number | string;
  perPage?: number | string;
  include?: object;
  select?: object;
};
export type PaginateFunction = <T, K>(
  model: any,
  args?: K,
  options?: PaginateOptions,
) => Promise<PaginatedResult<T>>;

export const paginator = (
  defaultOptions: PaginateOptions,
): PaginateFunction => {
  return async (model, args: any = { where: undefined }, options) => {
    const page = Number(options?.page || defaultOptions?.page) || 1;

    const perPage = Number(options?.perPage || defaultOptions?.perPage) || 10;
    const include = options?.include;
    const select = options?.select;

    const skip = page > 0 ? perPage * (page - 1) : 0;
    const getOptions = {
      ...args,
      ...(include && { include }),
      ...(select && { select }),
      where: args.where,
      ...(!!options?.page && { take: perPage }),
      ...(!!options?.perPage && { skip }),
    };
    const [total, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany(getOptions),
    ]);

    const lastPage = Math.ceil(total / perPage);

    let result = data;

    if (model.name === 'User') {
      result = data.map((item) => {
        return omit(item, 'password');
      });
    }

    return {
      data: result,
      meta: {
        total,
        lastPage,
        currentPage: page,
        ...(!!options?.perPage && { perPage }),
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    };
  };
};
