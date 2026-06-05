const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch the project and local packages
config.watchFolders = [
  projectRoot,
  path.resolve(workspaceRoot, 'packages/shared-types'),
  path.resolve(workspaceRoot, 'packages/qr-utils'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 2. Robust blocklist for Windows (\) and Unix (/)
config.resolver.blockList = [
  // Exclude other apps' node_modules to avoid scanning loops
  /.*\/apps\/(?!mobile).*\/node_modules\/.*/,
  /.*\\apps\\(?!mobile).*\\node_modules\\.*/,
];

// 3. Precise nodeModulesPaths with normalization for Windows
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
].map(p => path.normalize(p));

// 4. Important for monorepo resolution
config.resolver.disableHierarchicalLookup = true;

// 5. Reduce resource usage to prevent crashes
config.maxWorkers = 1; 

module.exports = config;
