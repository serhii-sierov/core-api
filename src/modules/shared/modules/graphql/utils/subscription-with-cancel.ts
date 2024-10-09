export const withCancel = <T, TReturn = any>(
  asyncIterator: AsyncIterator<T | undefined>,
  onCancel: () => void,
): AsyncIterator<T | undefined> => {
  if (!asyncIterator.return) {
    asyncIterator.return = () => Promise.resolve({ value: undefined, done: true });
  }

  const originalReturn = asyncIterator.return.bind(asyncIterator) as typeof asyncIterator.return;

  asyncIterator.return = (value?: TReturn | PromiseLike<TReturn>) => {
    onCancel?.();

    return originalReturn(value);
  };

  return asyncIterator;
};
