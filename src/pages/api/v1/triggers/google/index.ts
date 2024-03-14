import { type NextApiRequest, type NextApiResponse } from "next";

// next js server api handler function for the automation usecase api endpoint
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await new Promise((resolve) => setTimeout(resolve, 0));
  return res
    .status(200)
    .json({ response: "hello from google triggers", err: "" });
};

export default handler;
