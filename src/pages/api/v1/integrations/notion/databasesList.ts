/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import axios from "axios";

import { Client } from "@notionhq/client";
import { type NextApiRequest, type NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { accessToken } = req.query;
  try {
    const notion = new Client({
      auth: accessToken as string,
    });
    const response = await notion.search({
      filter: {
        value: "database",
        property: "object",
      },
    });

    return res
      .status(200)
      .json({ response: response.results as any[], error: null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: null, error });
  }
};

export default handler;
