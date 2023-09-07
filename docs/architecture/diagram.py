from diagrams import Diagram, Edge
from diagrams.aws.management import ParameterStore
from diagrams.onprem.iac import Terraform
from diagrams.onprem.vcs import Github
from diagrams.programming.framework import React
from diagrams.saas.logging import Datadog

with (Diagram("Does user have internet ?", show=True, filename="docs/architecture/architecture")):
    workflow = Datadog("Workflow")
    pull_request = Github("Pull request")

    ParameterStore("Configuration") \
        >> Edge(label="is used as inputs") >> Terraform("Stack") \
        >> Edge(label="deploys") >> Datadog("Monitors checking the users") \
        >> Edge(label="triggers") >> workflow

    workflow \
        >> Edge(label="creates") >> Github("Pull request with status files") \

    workflow \
        >> Edge(label="creates") >> pull_request
    workflow \
        >> Edge(label="triggers") >> Github("Github Action") \
        >> Edge(label="merges") >> pull_request \
        >> Edge(label="triggers") >> Github("Github Action") \
        >> Edge(label="builds") >> React("Website") \
        >> Edge(label="deployed") >> Github("Github Pages")
