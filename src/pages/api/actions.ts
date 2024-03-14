/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextApiRequest, type NextApiResponse } from "next";
import { useCasesFromAppsQuery } from "~/server/api/prismaQuery/useCaseQuery";
import { prisma } from "~/server/db";
import { containsValidApps } from "~/utils/supportedApps";

// Make a next api request and response for the automation usecase
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // check if the request is a GET request
  if (req.method === "GET") {
    // get query body from the request
    const { apps } = req.query;
    if (!apps) {
      return res.status(400).json({ err: "NOT_SUPPORTED_NO_APPS" });
    }
    const appsLowerCase = (apps as string[]).map((app) => app.toLowerCase());
    console.log({ apps: appsLowerCase });
    if (apps) {
      if (apps.length > 2) {
        return res
          .status(200)
          .json({ response: null, err: "NOT_SUPPORTED_MORE_THAN_2_APPS" });
      }
      if (containsValidApps(appsLowerCase)) {
        const allUseCases = await prisma.useCase.findMany(
          useCasesFromAppsQuery(appsLowerCase)
        );

        const useCases = allUseCases.filter(
          (useCase) => useCase.apps.length === apps.length
        );

        return res.status(200).json({
          response: useCases,
          err: null,
        });
      }
      return res.status(200).json({ response: null, err: "NOT_SUPPORTED" });
    } else {
      return res.status(400).json({ err: "NOT_SUPPORTED_NO_APPS" });
    }
  }
  // Send 404 if the request it is not GET request
  res.status(404).end("Not Found");
}
