/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Container,
  Card,
  Row,
  Text,
  Input,
  Button,
  Loading,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { SSE } from "sse";

interface Chat {
  avatarUrl: string;
  text: string;
}

export function ChatFeatures() {
  const [prompt, setPrompt] = useState<string>("");
  const resultRef = useRef<string>();
  const [result, setResult] = useState("");
  const [start, setStart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const clearTextInput = () => setPrompt("");
  const { data: sessionData } = useSession();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const send = () => {
    if (prompt !== "") {
      clearTextInput();
      setStart(true);
      setIsLoading(true);
      setResult("");
      const url = "https://api.openai.com/v1/completions";
      const data = {
        model: "davinci:ft-personal-2023-03-05-09-26-08",
        prompt: `${prompt}`,
        // temperature: 0.2,
        // top_p: 0.95,
        max_tokens: 50,
        stream: true,
        // n: 1,
      };
      setChats([
        ...chats,
        {
          avatarUrl: "/chatGpt.png",
          text: result || "Hello there how can I help you 👋",
        },
        {
          avatarUrl:
            sessionData?.user.image ||
            "https://i.pravatar.cc/150?u=a042581f4e29026704d",
          text: prompt,
        },
      ]);
      const source = new SSE(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_API_SECRET}`,
        },
        method: "POST",
        payload: JSON.stringify(data),
      });

      source.addEventListener("message", (e: any) => {
        if (e.data !== "[DONE]") {
          const payload = JSON.parse(e.data);
          const text = payload.choices[0].text;
          if (text !== "\n") {
            console.log("Text: ", text);
            resultRef.current = resultRef.current + text;
            setResult(resultRef.current || "");
          }
        } else {
          source.close();
        }
      });

      source.addEventListener("readystatechange", (e: any) => {
        if (e.readyState >= 2) {
          setIsLoading(false);
        }
      });

      source.stream();
    } else {
      alert("Please insert a prompt!");
    }
  };

  useEffect(() => {
    resultRef.current = result;
    scrollToBottom();
  }, [result]);

  return (
    <>
      <div
        style={{
          padding: "1em 0px 10em 0px",
        }}>
        <Container
          fluid
          style={{
            position: "relative",
          }}>
          {chats.map(({ avatarUrl, text }, i) => (
            <Card
              key={i}
              style={{
                margin: "1em 0em",
              }}>
              <Row css={{ padding: "1em" }}>
                <img
                  height={"40px"}
                  width={"40px"}
                  style={{ borderRadius: ".8em", margin: "0 1em 0 0" }}
                  src={avatarUrl}
                  alt={avatarUrl}
                  referrerPolicy="no-referrer"
                />
                <Text h6 size={15} css={{ m: 0, pt: "8px" }}>
                  {text}
                </Text>
              </Row>
            </Card>
          ))}
          <Card>
            <Row css={{ padding: "1em" }}>
              <img
                height={"40px"}
                width={"40px"}
                style={{ borderRadius: ".8em", margin: "0 1em 0 0" }}
                src={"/chatGpt.png"}
                alt={"/chatGpt.png"}
                referrerPolicy="no-referrer"
              />
              <Text h6 size={15} css={{ m: 0, pt: "8px" }}>
                {start
                  ? result || (
                      <Loading type="points-opacity" color={"currentColor"} />
                    )
                  : "Hello there how can I help you 👋"}
              </Text>
            </Row>
          </Card>
        </Container>
        <div ref={messagesEndRef} />
      </div>
      <Card
        style={{
          position: "absolute",
          bottom: "0px",
          left: "0px",
          width: "100%",
          opacity: 0.95,
          padding: "2em",
        }}>
        <Container
          style={{
            width: "100%",
          }}>
          <Input
            aria-label="input"
            placeholder="Ask me to integrate anything"
            value={prompt}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                send();
              }
            }}
            onChange={(e) => setPrompt(e.target.value)}
            width="100%"
            contentRightStyling={false}
            contentRight={
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              <Button
                auto
                onClick={send}
                light
                size={"xl"}
                disabled={isLoading}>
                {isLoading ? <Loading /> : <FiSend />}
              </Button>
            }
          />
        </Container>
      </Card>
    </>
  );
}
