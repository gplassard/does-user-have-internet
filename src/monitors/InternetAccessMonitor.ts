import { ServiceLevelObjective } from '@cdktf/provider-datadog/lib/service-level-objective';
import { SyntheticsTest } from '@cdktf/provider-datadog/lib/synthetics-test';
import { DatadogTags, toDatadogTags } from '@gplassard/cdktf-extensions';
import { Construct } from 'constructs';

export interface InternetAccessMonitorProps {
  ip: string;
  port: string;
  expectedResult: string;
  name: string;
  slackWorkspace: string;
  tags: DatadogTags & { provider: string; server: string };
}

export class InternetAccessMonitor extends Construct {

  constructor(scope: Construct, id: string, props: InternetAccessMonitorProps) {
    super(scope, id);

    const syntheticsTest = new SyntheticsTest(this, 'monitor', {
      name: `Internet access for ${props.name}`,
      type: 'api',
      subtype: 'tcp',
      locations: ['aws:eu-west-3', 'aws:ap-northeast-1', 'aws:us-east-1'],
      status: 'live',
      requestDefinition: {
        host: props.ip,
        port: props.port,
      },
      assertion: [
        { type: 'connection', operator: 'is', target: props.expectedResult },
      ],
      tags: toDatadogTags(props.tags),
      message: `
{{#is_alert}} 🚨🔥 ${props.name} doesn't have internet anymore ! 🔥🚨{{/is_alert}}
{{^is_alert}} ✅👌 ${props.name} has internet again ! 👌 ✅ {{/is_alert}}
@slack-${props.slackWorkspace}-datadog-${props.tags.scope}-${props.tags.env}
@workflow-DoesUserHaveInternet-Monitor
            `,
      optionsList: {
        tickEvery: 600,
        minLocationFailed: 2,
      },
    });

    new ServiceLevelObjective(this, 'Slo', {
      name: `Internet access for ${props.name}`,
      type: 'monitor',
      tags: toDatadogTags(props.tags),
      monitorIds: [syntheticsTest.monitorId],
      thresholds: [{
        timeframe: '30d',
        target: 99,
        warning: 99.9,
      }],
      timeframe: '30d',
      targetThreshold: 99,
      warningThreshold: 99.9,
    });
  }
}
