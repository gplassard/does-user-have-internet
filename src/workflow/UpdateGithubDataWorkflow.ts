import { WorkflowAutomation } from '@cdktf/provider-datadog/lib/workflow-automation';
import { DatadogTags, toDatadogTags } from '@gplassard/cdktf-extensions';
import { Construct } from 'constructs';
import * as spec from './workflow.json';

export interface UpdateGithubDataWorkflowProps {
  tags: DatadogTags;
}

export class UpdateGithubDataWorkflow extends Construct {
  constructor(scope: Construct, id: string, props: UpdateGithubDataWorkflowProps) {
    super(scope, id);
    new WorkflowAutomation(this, 'UpdateGithubDataWorkflow', {
      description: '',
      name: 'does-user-have-internet',
      published: true,
      specJson: JSON.stringify(spec),
      tags: toDatadogTags(props.tags),
    });
  }
}
