import { DataAwsSsmParameter } from '@cdktf/provider-aws/lib/data-aws-ssm-parameter';
import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { DatadogProvider } from '@cdktf/provider-datadog/lib/provider';
import { S3Backend, TerraformStack } from 'cdktf';
import { Construct } from 'constructs';
import { InternetAccessMonitor } from './monitors/InternetAccessMonitor';
import { UpdateGithubDataWorkflow } from './workflow/UpdateGithubDataWorkflow';

export class DoesUserHaveInternet extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new S3Backend(this, {
      bucket: 'terraform-state-eu-west-1-1475',
      key: 'does-user-have-internet/terraform.tfstate',
      region: 'eu-west-1',
    });
    const apiKeyParam = new DataAwsSsmParameter(this, 'ddApiKey', {
      name: 'datadog-dd-api-key',
    });
    const appKeyParam = new DataAwsSsmParameter(this, 'ddAppKey', {
      name: 'datadog-dd-app-key',
    });
    const slackWorkspaceParam = new DataAwsSsmParameter(this, 'slackWorkspaceName', {
      name: '/global/slack/workspace-name',
    });
    const teamParam = new DataAwsSsmParameter(this, 'team', {
      name: '/app/does-user-have-internet/team',
    });

    new AwsProvider(this, 'awsProvider', {});
    new DatadogProvider(this, 'datadogProvider', {
      apiUrl: 'https://api.datadoghq.eu',
      apiKey: apiKeyParam.value,
      appKey: appKeyParam.value,
    });

    new UpdateGithubDataWorkflow(this, 'UpdateGithubDataWorkflow', {
      tags: {
        scope: 'perso',
        app: 'doesuserhaveinternet',
        env: 'prod',
        infraAsCode: 'cdktf',
        team: teamParam.value,
        repo: 'gplassard/does-user-have-internet',
      },
    });

    // TODO make foreach work
    const usersIndex = Array.from(Array(4).keys()).map(i => i + 1);
    for (const userIndex of usersIndex) {
      const userIp = new DataAwsSsmParameter(this, `user${userIndex}Ip`, {
        name: `/app/does-user-have-internet/user${userIndex}-ip`,
      });
      const userPort = new DataAwsSsmParameter(this, `user${userIndex}Port`, {
        name: `/app/does-user-have-internet/user${userIndex}-port`,
      });
      const userExpected = new DataAwsSsmParameter(this, `user${userIndex}Expected`, {
        name: `/app/does-user-have-internet/user${userIndex}-expected`,
      });
      const userProvider = new DataAwsSsmParameter(this, `user${userIndex}Provider`, {
        name: `/app/does-user-have-internet/user${userIndex}-provider`,
      });
      const userName = new DataAwsSsmParameter(this, `user${userIndex}Name`, {
        name: `/app/does-user-have-internet/user${userIndex}-name`,
      });

      new InternetAccessMonitor(this, `user${userIndex}Monitor`, {
        name: userName.value,
        slackWorkspace: slackWorkspaceParam.value,
        ip: userIp.value,
        port: userPort.value,
        expectedResult: userExpected.value,
        tags: {
          'provider': userProvider.value,
          'server': 'box',
          'scope': 'perso',
          'app': 'doesuserhaveinternet',
          'env': 'prod',
          'infraAsCode': 'cdktf',
          'team': teamParam.value,
          'repo': 'gplassard/does-user-have-internet',
          'x-user': `user-${userIndex}`,
        },
      });
    }

  }

}
