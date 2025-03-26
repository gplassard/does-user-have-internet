// .projenrc.ts
import { TypescriptApplicationProject } from '@gplassard/projen-extensions';

// opinionated wrapper around projen TypeScriptProject
const project = new TypescriptApplicationProject({
  name: 'does-user-have-internet',
  releaseRank: 3,
  devDeps: ['cdktf-cli', 'cdktf', 'constructs', '@cdktf/provider-aws', '@cdktf/provider-datadog', '@gplassard/cdktf-extensions'],
  peerDeps: ['cdktf-cli', 'cdktf', 'constructs', '@cdktf/provider-aws', '@cdktf/provider-datadog', '@gplassard/cdktf-extensions'],
  gitignore: ['*.tfstate*', 'cdktf.out'],
  nodeVersion: '20.19.0',
});
project.addScripts({
  cdktf: 'cdktf',
});
project.synth();
