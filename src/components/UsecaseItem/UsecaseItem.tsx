/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Img,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { primaryButtonColor } from "~/styles/style";
import { type TUseCase } from "~/types/types";
// import { type UseCase } from "~/types/types";
import { api } from "~/utils/api";

interface Props {
  useCase: TUseCase;
}

export default function UsecaseItem({ useCase }: Props) {
  const router = useRouter();
  const { mutateAsync, error, isLoading } = api.automation.create.useMutation();
  const setUpAutomation = async () => {
    const { actions, trigger, ...rest } = useCase;
    const res = await mutateAsync({
      name: "",
      automationUseCase: {
        automationTrigger: trigger,
        automationActions: actions.map((a) => ({
          ...a,
          creds: "",
        })),
        ...rest,
      },
    });
    if (res) {
      router.push(`/dashboard/automations/${res.response.id}/onboarding`);
    }
  };

  return (
    <Accordion allowMultiple>
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        <GridItem colSpan={4}>
          <AccordionItem>
            <AccordionButton display={"flex"} justifyContent="start">
              <div
                style={{
                  display: "flex",
                  marginRight: "1em",
                  paddingRight: "1em",
                }}>
                <Img
                  mr=".5em"
                  src={useCase.trigger.imageUrl}
                  alt={useCase.trigger.imageUrl}
                  width={30}
                />
                {useCase.actions.map((a, i) => (
                  <Img
                    mr=".5em"
                    key={i}
                    src={a.imageUrl}
                    alt={a.imageUrl}
                    width={30}
                  />
                ))}
              </div>
              <Heading size="sm" textAlign={"start"}>
                {useCase.name}
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} px={"2em"}>
              {useCase.trigger && (
                <HStack gap={3} mt=".5em">
                  <Img src={useCase.trigger.imageUrl} w="20px" />
                  <Box>
                    <Text fontSize="xs">When this happens</Text>
                    <Heading size="xs">Step 1: {useCase.trigger.event}</Heading>
                  </Box>
                </HStack>
              )}
              {useCase.actions?.map((a, i) => (
                <HStack key={i} gap={3} mt=".5em">
                  <Img src={a.imageUrl} w="20px" />
                  <Box>
                    <Text fontSize="xs">Then do this</Text>
                    <Heading size="xs">
                      Step {i + 1}: {a.event}
                    </Heading>
                  </Box>
                </HStack>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </GridItem>
        <GridItem colSpan={1} display="flex" alignItems={"center"}>
          <Button
            {...primaryButtonColor}
            onClick={setUpAutomation}
            isLoading={isLoading}>
            Try It
          </Button>
        </GridItem>
      </Grid>
      {error && <Text color="red">{error.message}</Text>}
    </Accordion>
  );
}
