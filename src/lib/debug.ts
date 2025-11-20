export const debug = (namespace: string): ((message: string) => void) => {
  return (message: string): void => {
    console.log(`${namespace} ${message}`);
  };
};
