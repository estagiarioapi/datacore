export function Retry(retries: number = 3, delay: number = 1000) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      for (let i = 0; i < retries; i++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          console.log(`Retrying ${i + 1} times...`);
          console.log(`Error: ${error}`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    };
  };
}
