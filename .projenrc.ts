// .projenrc.ts
import { TypescriptApplicationProject, NODEJS_VERSIONS } from '@gplassard/projen-extensions';

// opinionated wrapper around projen TypeScriptProject
const project = new TypescriptApplicationProject({
  name: 'does-user-have-internet',
  releaseRank: 3,
  devDeps: ['cdktf-cli', 'cdktf', 'constructs', '@cdktf/provider-aws', '@cdktf/provider-datadog', '@gplassard/cdktf-extensions'],
  peerDeps: ['cdktf-cli', 'cdktf', 'constructs', '@cdktf/provider-aws', '@cdktf/provider-datadog', '@gplassard/cdktf-extensions'],
  gitignore: ['*.tfstate*', 'cdktf.out'],
  nodeVersion: NODEJS_VERSIONS.NODEJS_20_X,
});
project.addScripts({
  cdktf: 'cdktf',
});
project.synth();
