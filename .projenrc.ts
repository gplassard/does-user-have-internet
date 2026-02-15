// .projenrc.ts
import { TypescriptApplicationProject, NODEJS_VERSIONS } from '@gplassard/projen-extensions';
import { JobPermission } from 'projen/lib/github/workflows-model';

// opinionated wrapper around projen TypeScriptProject
const project = new TypescriptApplicationProject({
  name: 'does-user-have-internet',
  releaseRank: 3,
  devDeps: ['cdktf-cli', 'cdktf', 'constructs', '@cdktf/provider-aws', '@cdktf/provider-datadog', '@gplassard/cdktf-extensions'],
  peerDeps: ['cdktf-cli', 'cdktf', 'constructs', '@cdktf/provider-aws', '@cdktf/provider-datadog', '@gplassard/cdktf-extensions'],
  gitignore: ['*.tfstate*', 'cdktf.out'],
  nodeVersion: NODEJS_VERSIONS.NODEJS_20_X,
});

const cleanupWorkflow = project.github?.addWorkflow('cleanup');
cleanupWorkflow?.on({
  schedule: [{ cron: '0 0 * * *' }],
  workflowDispatch: {},
});
cleanupWorkflow?.addJobs({
  cleanup: {
    runsOn: ['ubuntu-latest'],
    permissions: {
      actions: JobPermission.WRITE,
    },
    steps: [
      {
        name: 'Delete old workflow runs',
        run: 'gh run list --repo ${{ github.repository }} --limit 100 --json databaseId -q ".[].databaseId" | sed "1,10d" | xargs -I {} gh run delete --repo ${{ github.repository }} {}',
        env: {
          GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
        },
      },
    ],
  },
});
project.addScripts({
  cdktf: 'cdktf',
});
project.synth();
