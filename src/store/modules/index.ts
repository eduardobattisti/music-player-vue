import camelCase from 'lodash/camelCase';

const requireModule = require.context(
  '.', true, /\.ts$/,
);

const modules = {};

requireModule.keys().forEach((fileName) => {
  if (fileName !== './index.ts') {
    const moduleConfig = requireModule(fileName);
    const moduleName = camelCase(fileName.replace(/(\.\/|.*\/|\.ts)/g, ''));
    modules[moduleName] = moduleConfig.default || moduleConfig;
  }
});

export default modules;
