/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type NextApiRequest, type NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";

const completion = async (req: NextApiRequest, res: NextApiResponse) => {
  const configuration = new Configuration({
    apiKey: env.NEXT_PUBLIC_OPEN_AI_API_SECRET,
  });
  const openai = new OpenAIApi(configuration);
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with client

  const response = openai.createCompletion(
    {
      model: "text-davinci-003",
      prompt: "tell me a 1000 word story about how bill gates become rich",
      max_tokens: 100,
      temperature: 0,
      stream: true,
    },
    { responseType: "stream" }
  );

  await response.then((resp) => {
    (resp.data as any).on("data", (data: Buffer) => {
      const lines = data
        .toString()
        .split("\n")
        .filter((line) => line.trim() !== "");
      for (const line of lines) {
        const message = line.replace(/^data: /, "");
        if (message === "[DONE]") {
          res.end();
          return;
        }
        const parsed = JSON.parse(message);
        res.write(`data: ${parsed.choices[0].text}\n\n`);
      }
    });
  });
  res.status(200).json({ response });
};

export default completion;
