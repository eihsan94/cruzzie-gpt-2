/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from "axios";
import { systemPromptV2 } from "./systemPrompts";

/* eslint-disable @typescript-eslint/restrict-template-expressions */
export interface Message {
  role: "system" | "user" | "assistant";
  content: string | JSX.Element;
}
export const systemPrompt: Message = {
  role: "system",
  content: systemPromptV2,
};

export const sendChatToChatGPT: ({
  prevMessages,
  prompt,
}: {
  prevMessages: Message[];
  prompt: string;
}) => Promise<Message> = async ({ prevMessages, prompt }) => {
  const url = "https://api.openai.com/v1/chat/completions";
  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      systemPrompt,
      ...prevMessages,
      { role: "user", content: prompt },
    ] as Message[],
    max_tokens: 200,
    // stream: true,
    temperature: 1,
    n: 1,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_API_SECRET}`,
  };

  const method = "POST";

  const res = await axios.post(url, data, {
    headers: headers,
    method: method,
  });
  return res.data.choices[0].message as Message;
};
