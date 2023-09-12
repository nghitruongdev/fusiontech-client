export type Callback<T extends Function> = T & { isCallback?: true }

export const checkIsCallback = (fn: Callback<any>) => {
  if (fn && !fn.isCallback) {
    throw new Error(
      "Function is not a callback function or you're forgetting to set isCallback to true",
    )
  }
}
