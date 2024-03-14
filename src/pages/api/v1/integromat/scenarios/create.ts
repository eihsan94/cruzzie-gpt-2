import { type NextApiRequest, type NextApiResponse } from "next";
import { slackNotion } from "~/utils/integromat/templates";
import { createScenario } from "~/utils/integromat/scenarios/create";

// next js server api handler function for the automation usecase api endpoint
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await createScenario(slackNotion);
    return res.status(200).json({ response, err: "" });
  } catch (err) {
    return res.status(200).json({ response: null, err });
  }
};

export default handler;
