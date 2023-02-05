export const aw = async <TData, TError extends Error = Error>(
  promise: Promise<TData>,
): Promise<readonly [TData, null] | readonly [null, TError]> => {
  try {
    const res = await promise;
    return [res, null];
  } catch (err) {
    return [null, err as TError];
  }
};
