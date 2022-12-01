export const differenceBy = (arr1: any, arr2: any, iteratee: any) => {
  if (typeof iteratee === "string") {
    const prop = iteratee;
    iteratee = (item: any) => item[prop];
  }
  return arr1.filter((c: any) => !arr2.map(iteratee).includes(iteratee(c)));
};
