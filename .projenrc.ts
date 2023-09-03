// .projenrc.ts
import { TypescriptApplicationProject } from '@gplassard/projen-extensions';

// opinionated wrapper around projen TypeScriptProject
const project = new TypescriptApplicationProject({
  name: 'does-user-have-internet',
  releaseRank: 3,
  devDeps: ['cdktf-cli', 'cdktf', 'constructs', '@cdktf/provider-aws', '@cdktf/provider-datadog'],
  peerDeps: ['cdktf', 'constructs', '@cdktf/provider-aws', '@cdktf/provider-datadog'],
  gitignore: ['*.tfstate*', 'cdktf.out'],
});
project.synth();
