export const slackNotion = {
  id: 1,
  name: "Save new Slack channel messages to databases in Notion",
  blueprint: {
    flow: [
      {
        id: 1,
        module: "slack:WatchMessages",
        version: 4,
        metadata: {
          designer: {
            x: 0,
            y: 0,
            messages: [
              {
                message: "Value must not be empty.",
                category: "setup",
                severity: "error",
              },
            ],
          },
        },
      },
      {
        id: 2,
        module: "notion:createAPage",
        version: 1,
        metadata: {
          designer: {
            x: 300,
            y: 0,
            messages: [
              {
                message: "Value must not be empty.",
                category: "setup",
                severity: "error",
              },
            ],
          },
        },
      },
    ],
    name: "Integration Slack, Notion",
    metadata: {
      instant: false,
      version: 1,
      designer: {
        orphans: [],
      },
      scenario: {
        dlq: false,
        dataloss: false,
        maxErrors: 3,
        autoCommit: true,
        roundtrips: 1,
        sequential: false,
        confidential: false,
        freshVariables: false,
        autoCommitTriggerLast: true,
      },
    },
  },
  scheduling: {
    type: "indefinitely",
    interval: 900,
  },
  concept: false,
  created: "2023-03-22T05:26:13.440Z",
  last_edit: "2023-03-22T05:26:13.440Z",
  metadata: {
    input_spec: [],
    output_spec: [],
  },
  idSequence: 3,
};
