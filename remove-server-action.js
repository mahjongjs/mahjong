export default function (babel) {
  const { types: t } = babel;

  return {
    name: 'ast-transform', // not required
    visitor: {
      ClassMethod(path) {
        if (
          path.node.decorators &&
          path.node.decorators.findIndex(
            (dec) => dec.expression.name === 'Server'
          ) !== -1
        ) {
          path.remove();
        }
      },
    },
  };
}
