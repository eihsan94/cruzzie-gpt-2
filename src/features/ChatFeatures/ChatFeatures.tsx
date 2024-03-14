/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Container, Card, Row, Text, Input, Loading } from "@nextui-org/react";
// import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { type Message, sendChatToChatGPT } from "~/utils/sendChatToChatGPT";
import { callAPI } from "~/utils/requestForAutomationFromGpt";
import { Button } from "@chakra-ui/react";
import UsecaseItem from "~/components/UsecaseItem/UsecaseItem";
import { type TUseCase } from "~/types/types";

interface Chat {
  avatarUrl: string;
  message: Message;
}

export function ChatFeatures() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const clearTextInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setPrompt("");
  };
  const { data: sessionData } = useSession();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // a function for detect the prompt when it has https://cruzzie.com/api/automation-usecase
  const isSendAutomationRequest = (prompt: string) => {
    const regex = /https:\/\/cruzzie.com\/api\//g;
    console.log(!!prompt.match(regex));
    return !!prompt.match(regex);
  };

  const postChats = (newChats: Chat[]) => {
    setChats(newChats);
  };

  const send = async () => {
    if (prompt !== "") {
      clearTextInput();
      setIsLoading(true);
      const newChats: Chat[] = [
        ...chats,
        {
          avatarUrl:
            sessionData?.user.image ||
            "https://i.pravatar.cc/150?u=a042581f4e29026704d",
          message: {
            role: "user",
            content: prompt,
          },
        },
      ];
      postChats(newChats);

      const message = await sendChatToChatGPT({
        prevMessages: chats.map((chat) => ({
          role: chat.message.role,
          content: Array.isArray(chat.message.content)
            ? "Here is the automation that I found good for you"
            : chat.message.content,
        })),
        prompt,
      });

      if (isSendAutomationRequest(message.content as string)) {
        const d = await callAPI(message.content as string);
        postChats([
          ...newChats,
          {
            avatarUrl: "/chatGpt.png",
            message: {
              role: "assistant",
              content: d?.err
                ? "Sorry, We do not support the use cases yet."
                : d.response,
            },
          },
        ]);
        setIsLoading(false);

        return;
      }
      postChats([
        ...newChats,
        {
          avatarUrl: "/chatGpt.png",
          message,
        },
      ]);
      setIsLoading(false);
    } else {
      alert("Please insert a prompt!");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    sendChatToChatGPT({ prevMessages: [], prompt: "" })
      .then((message) => {
        setChats([
          {
            avatarUrl: "/chatGpt.png",
            message: message,
          },
        ]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

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
          {chats.map(({ avatarUrl, message }, i) => (
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
                  {Array.isArray(message.content) ? (
                    <>
                      <Text css={{ marginBottom: ".5em" }}>
                        Here is the automation that I found good for you
                      </Text>
                      <Card variant="bordered" css={{ padding: "1em" }}>
                        {message.content.map((useCase: TUseCase, i: number) => (
                          <UsecaseItem key={i} useCase={useCase} />
                        ))}
                      </Card>
                    </>
                  ) : (
                    message.content
                  )}
                </Text>
              </Row>
            </Card>
          ))}
          {isLoading && (
            <Card
              style={{
                margin: "1em 0em",
              }}>
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
                  <Loading type="points-opacity" color={"currentColor"} />
                </Text>
              </Row>
            </Card>
          )}
        </Container>
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
            type={"text"}
            ref={inputRef}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onKeyDown={async (e) => {
              if (e.key === "Enter" && !isComposing && !isLoading) {
                await send();
              }
            }}
            onCompositionStart={() => {
              setIsComposing(true);
            }}
            onCompositionEnd={() => {
              setIsComposing(false);
            }}
            onChange={(e) => setPrompt(e.target.value)}
            width="100%"
            contentRightStyling={false}
            contentRight={
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              <Button
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={send}
                disabled={isLoading}>
                {isLoading ? <Loading /> : <FiSend />}
              </Button>
            }
          />
        </Container>
      </Card>
      <div ref={messagesEndRef} />
    </>
  );
}
