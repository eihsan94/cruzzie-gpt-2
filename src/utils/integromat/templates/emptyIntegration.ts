export const EmptyJsonParse = {
  name: "Empty integration",
  flow: [
    {
      id: 2,
      module: "json:ParseJSON",
      version: 1,
      metadata: {
        designer: {
          x: -46,
          y: 47,
          messages: [
            {
              category: "last",
              severity: "warning",
              message:
                "A transformer should not be the last module in the route.",
            },
          ],
        },
      },
    },
  ],
  metadata: {
    version: 1,
    scenario: {
      roundtrips: 1,
      maxErrors: 3,
      autoCommit: true,
      autoCommitTriggerLast: true,
      sequential: false,
      confidential: false,
      dataloss: false,
      dlq: false,
      freshVariables: false,
    },
    designer: {
      orphans: [],
    },
  },
};
