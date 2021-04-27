const createDecorator: (...metadataKeys: string[]) => MethodDecorator = (
  ...metadataKeys
) => {
  return (target, propKey, descriptor) => {
    metadataKeys.map((metadataKey) => {
      const metadata = Reflect.getMetadata(metadataKey, target) || [];
      Reflect.defineMetadata(metadataKey, metadata.concat(propKey), target);
    });
  };
};

export default createDecorator;
