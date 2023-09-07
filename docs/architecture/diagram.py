from diagrams import Diagram, Edge
from diagrams.aws.management import ParameterStore
from diagrams.onprem.iac import Terraform
from diagrams.onprem.vcs import Github
from diagrams.programming.framework import React
from diagrams.programming.language import Typescript
from diagrams.saas.logging import Datadog

with (Diagram("Does user have internet ?", show=False, filename="docs/architecture/architecture")):
    workflow = Datadog("Workflow")
    pull_request = Github("Pull request with status files")

    ParameterStore("Configuration") \
        >> Edge(label="is used as inputs") >> Typescript("CDK-TS") \
        >> Edge(label="produces") >> Terraform("Stack") \
        >> Edge(label="deploys") >> Datadog("Monitors verifying the connectivity") \
        >> Edge(label="triggers") >> workflow

    workflow \
        >> Edge(label="creates") >> pull_request

    workflow \
        >> Edge(label="triggers") >> Github("Github Action") \
        >> Edge(label="merges") >> pull_request \
        >> Edge(label="triggers") >> Github("Github Action") \
        >> Edge(label="builds") >> React("Website") \
        >> Edge(label="deployed") >> Github("Github Pages")
