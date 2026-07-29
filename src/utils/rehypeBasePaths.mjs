const base = process.env.GITHUB_ACTIONS === 'true' ? '/gatas-doc' : '';

const visit = (node) => {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'element' && node.properties) {
    for (const property of ['href', 'src']) {
      const value = node.properties[property];
      if (
        base &&
        typeof value === 'string' &&
        value.startsWith('/') &&
        !value.startsWith('//') &&
        !value.startsWith(base)
      ) {
        node.properties[property] = `${base}${value}`;
      }
    }
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) visit(child);
  }
};

export const rehypeBasePaths = () => (tree) => visit(tree);
