/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Button,
  Card,
  Container,
  GridItem,
  HStack,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { type AutomationAction, type AutomationTrigger } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import AutomationActionItem from "~/components/AutomationAppItem/AutomationActionItem";
import AutomationTriggerItem from "~/components/AutomationAppItem/AutomationTriggerItem";
import { Layout } from "~/components/Layout";
import { api } from "~/utils/api";

export default function Dashboard() {
  const router = useRouter();
  const [editTitle, setEditTitle] = useState(false);
  const [titleWrite, setTitleWrite] = useState("");
  const [title, setTitle] = useState("");
  const { data, isLoading } = api.automation.getById.useQuery(
    router.query.id as string
  );

  const updateTitle = () => {
    setEditTitle(false);
    setTitle(titleWrite);
  };

  useEffect(() => {
    if (data) {
      setTitle(data.name);
    }
  }, [data]);

  return (
    <Layout>
      <Container maxW={"7xl"} py="2em">
        <VStack>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Card
              w="full"
              bg="white"
              shadow={"2xl"}
              p="2em"
              borderRadius={"2em"}>
              <HStack>
                {editTitle ? (
                  <>
                    <Input
                      w="fit-content"
                      // variant={"unstyled"}
                      onChange={(e) => setTitleWrite(e.target.value)}
                      size="lg"
                      defaultValue={title}
                      fontSize={"2xl"}
                    />
                    <Button onClick={updateTitle}>Save</Button>
                  </>
                ) : (
                  <>
                    <Text fontSize={"2xl"}>{title}</Text>
                    <FiEdit
                      color="green.500"
                      onClick={() => setEditTitle(true)}
                      cursor="pointer"
                    />
                  </>
                )}
              </HStack>
              {data && (
                <>
                  <Text>{data.automationUseCase.name}</Text>
                  <SimpleGrid
                    columns={{
                      base: 1,
                      md:
                        (
                          data.automationUseCase
                            .automationActions as AutomationAction[]
                        ).length + 1,
                    }}>
                    <GridItem>
                      <AutomationTriggerItem
                        trigger={
                          data.automationUseCase
                            .automationTrigger as AutomationTrigger
                        }
                      />
                    </GridItem>
                    <GridItem>
                      {(
                        data.automationUseCase
                          .automationActions as AutomationAction[]
                      ).map((action, i) => {
                        return <AutomationActionItem action={action} key={i} />;
                      })}
                    </GridItem>
                  </SimpleGrid>
                </>
              )}
              {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            </Card>
          )}
        </VStack>
      </Container>
    </Layout>
  );
}
