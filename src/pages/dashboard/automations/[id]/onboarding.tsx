/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Box,
  Button,
  Card,
  Container,
  Heading,
  HStack,
  Image,
  Input,
  Link,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { type AutomationAction, type AutomationTrigger } from "@prisma/client";
import { isEqual } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import {
  DataOutputsColumn,
  type SupportedDataOutputColumns,
} from "~/additionalAction/dataOutputsForAutomationUseCase";
import AutomationAdditionalForm from "~/components/AutomationAdditionalForm/AutomationAdditionalForm";
import ChooseChannels, {
  channelHeaderName,
} from "~/components/ChooseChannels/ChooseChannels";
import { Confetti } from "~/components/Confetti";
import StepForm, { type FormElement } from "~/components/Form/StepForm";
import { primaryButtonColor } from "~/styles/style";
import {
  AdditionalDataFormat,
  type ColumnDefinition,
  ColumnInputType,
  type InputOption,
  type AdditionalDataInput,
  type TAutomationTrigger,
  type TAutomationAction,
  type ChannelData,
} from "~/types/types";
import { api } from "~/utils/api";
import { genOAuthLink } from "~/utils/oAuth/genOAuthLink";

export default function Onboarding() {
  const router = useRouter();
  const {
    data: automation,
    isSuccess,
    isLoading,
    error,
  } = api.automation.getById.useQuery(router.query.id as string);
  const {
    // mutate: updateAutomation,
    // isSuccess: isUpdateSuccess,
    // isLoading: isUpdateLoading,
    // error: updateError,
  } = api.automation.update.useMutation();
  const { mutateAsync: updateTrigger, isLoading: isTriggerLoading } =
    api.automationTrigger.updateTriggerChannel.useMutation();
  const { mutateAsync: updateAction, isLoading: isActionLoading } =
    api.automationAction.updateActionChannel.useMutation();

  const [name, setName] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const [trigger, setTrigger] = useState<TAutomationTrigger>();
  const [actions, setActions] = useState<TAutomationAction[]>([]);
  const [automationCreated, setAutomationCreated] = useState(false);

  const handleTriggerUpdate = async () => {
    if (
      trigger &&
      !isEqual(
        trigger.appChannels,
        automation?.automationUseCase.automationTrigger?.appChannels
      )
    ) {
      const { id, appChannels } = trigger;
      await updateTrigger({
        params: {
          id,
        },
        body: {
          ...trigger,
          appChannels,
        },
      });
    }
  };
  const handleActionUpdate = async (action: TAutomationAction) => {
    const prevAction = automation?.automationUseCase.automationActions.find(
      (a) => a.id === action.id
    );
    if (!isEqual(action.appChannels, prevAction?.appChannels)) {
      const { id, appChannels } = action;
      await updateAction({
        params: {
          id,
        },
        body: {
          ...action,
          appChannels,
        },
      });
    }
  };

  const handleOAuth = async ({
    oAuth2,
    currStep,
    appName,
    triggerId,
    actionId,
  }: {
    oAuth2: string;
    currStep: number | undefined;
    appName: string;
    triggerId?: string;
    actionId?: string;
  }) => {
    if (automation) {
      const state = JSON.stringify({
        automationId: automation.id,
        automationName: name,
        triggerId,
        actionId,
        redirectUrl: `${window.location.origin}/dashboard/automations/${
          automation.id
        }/onboarding?currStep=${currStep as number}`,
      });
      await router.push(genOAuthLink({ appName, oAuth2, state }));
    }
  };

  const formElements: FormElement[] = [
    // {
    //   el: (
    //     <VStack gap={4}>
    //       <Heading>Lets Automate</Heading>
    //       <Text align="center">
    //         We will begin automate{" "}
    //         <strong>{automation?.automationUseCase.name}</strong> with Cruzzie.
    //       </Text>
    //     </VStack>
    //   ),
    //   nextButtonLabel: "I'm ready let's begin 👉🏻",
    // },
    {
      el: (
        <VStack>
          {trigger && (
            <VStack gap={8} textTransform={"capitalize"}>
              {!trigger.creds ? (
                <HStack>
                  <Heading>Connect to Your</Heading>
                  <Heading>{trigger.appName}</Heading>
                  <Image
                    w="30px"
                    alt={trigger.imageUrl}
                    src={trigger.imageUrl}
                  />
                </HStack>
              ) : (
                <VStack gap={8}>
                  <HStack>
                    <Heading>Choose your</Heading>
                    <Heading>{trigger.appName}</Heading>
                    <Image
                      w="30px"
                      alt={trigger.imageUrl}
                      src={trigger.imageUrl}
                    />
                    <Heading>
                      {channelHeaderName({ appName: trigger.appName })}
                    </Heading>
                  </HStack>
                  <ChooseChannels
                    defaultSelectedChannels={trigger.appChannels || []}
                    creds={trigger.creds}
                    appName={trigger.appName}
                    multiple={false} // Set to false for single selection
                    onSelect={(selectedChannels) => {
                      setTrigger({
                        ...trigger,
                        appChannels: selectedChannels,
                      });
                    }}
                  />
                </VStack>
              )}
            </VStack>
          )}
        </VStack>
      ),
      nextButton: (
        handleNext: React.MouseEventHandler<HTMLButtonElement> | undefined,
        currStep: number | undefined
      ) =>
        trigger?.creds ? (
          <Button
            isLoading={isTriggerLoading}
            {...primaryButtonColor}
            onClick={async (e) => {
              await handleTriggerUpdate();
              handleNext?.(e);
            }}>
            Go to next step
          </Button>
        ) : (
          <Button
            {...primaryButtonColor}
            onClick={async () => {
              const { id, appName, oAuth2 } = trigger as AutomationTrigger;
              await handleOAuth({ oAuth2, currStep, triggerId: id, appName });
            }}>
            Connect to {trigger?.appName}
          </Button>
        ),
    },
    ...actions.map(
      (action, j) => ({
        el: (
          <VStack>
            {action.creds ? (
              <VStack textTransform={"capitalize"} gap={8}>
                <HStack>
                  <Heading>Choose your</Heading>
                  <Heading>{action.appName}</Heading>
                  <Image w="30px" alt={action.imageUrl} src={action.imageUrl} />
                  <Heading>
                    {channelHeaderName({ appName: action.appName })}
                  </Heading>
                </HStack>
                {action.additionalActions?.map((a, i: number) => (
                  <VStack key={i} gap={4}>
                    <ChooseChannels
                      defaultSelectedChannels={action.appChannels || []}
                      creds={action.creds as string}
                      appName={action.appName}
                      multiple={false} // Set to false for single selection
                      onSelect={(selectedChannels) => {
                        const protoActions = [...actions];
                        protoActions[j] = {
                          ...action,
                          appChannels: selectedChannels,
                        };
                        setActions(protoActions);
                      }}
                    />
                  </VStack>
                ))}
              </VStack>
            ) : (
              <HStack textTransform={"capitalize"}>
                <Heading>Connect to Your</Heading>
                <HStack>
                  <Heading>{action.appName}</Heading>
                  <Image w="30px" alt={action.imageUrl} src={action.imageUrl} />
                </HStack>
              </HStack>
            )}
          </VStack>
        ),
        nextButton: (
          handleNext: React.MouseEventHandler<HTMLButtonElement> | undefined,
          currStep: number | undefined
        ) =>
          action.creds ? (
            <Button
              isLoading={isActionLoading}
              isDisabled={action.appChannels?.length === 0}
              {...primaryButtonColor}
              onClick={async (e) => {
                await handleActionUpdate(action);
                handleNext?.(e);
                setAutomationCreated(true);
              }}>
              Go to next step
            </Button>
          ) : (
            <Button
              {...primaryButtonColor}
              onClick={async () => {
                await handleOAuth({
                  oAuth2: action.oAuth2,
                  currStep,
                  actionId: action.id,
                  appName: action.appName,
                });
              }}>
              Connect to {action.appName}
            </Button>
          ),
      })
      // ...actions.map(
      //   ({
      //     creds,
      //     appName,
      //     imageUrl,
      //     id,
      //     oAuth2,
      //     additionalActions,
      //     // dataOutputs,
      //     // ...rest
      //   }) =>
      //     // j
      //     ({
      //       el: (
      //         <VStack>
      //           {creds ? (
      //             <HStack textTransform={"capitalize"}>
      //               {additionalActions?.map((a, i: number) => (
      //                 <VStack key={i} gap={4}>
      //                   {/* <AutomationAdditionalForm
      //                     additionalDataInput={a}
      //                     creds={JSON.parse(creds as string)}
      //                     onChange={(data) => {
      //                       console.log(data);
      //                       const additionalDataArr = JSON.parse(
      //                         additionalData as string
      //                       );
      //                       additionalDataArr[i] = data;
      //                       if (actions) {
      //                         const protoActions = [...actions];
      //                         (protoActions[j] = {
      //                           creds,
      //                           appName,
      //                           imageUrl,
      //                           id,
      //                           oAuth2,
      //                           additionalData: JSON.stringify(additionalDataArr),
      //                           dataOutputs,
      //                           ...rest,
      //                         }),
      //                           setActions(protoActions);
      //                       }
      //                     }}
      //                   /> */}
      //                   {/* {a.value && (
      //                     <Card
      //                       p="2em"
      //                       w="full"
      //                       border="1px solid rgba(0,0,0,.3)">
      //                       {renderAdditionalDataHandler(
      //                         {
      //                           ...a,
      //                         },
      //                         trigger?.appName as string,
      //                         (e) => {
      //                           const d = dataOutputs
      //                             ? JSON.parse(dataOutputs as string)
      //                             : ([] as {
      //                                 td: string;
      //                                 value: string | number | boolean;
      //                               }[]);
      //                           const currIndex = d.findIndex(
      //                             (v: { columnHandlerIndex: number }) =>
      //                               v.columnHandlerIndex === e.columnHandlerIndex
      //                           );
      //                           const protoDataOutputs = [...d];
      //                           if (currIndex !== -1) {
      //                             protoDataOutputs[currIndex] = e;
      //                           } else {
      //                             protoDataOutputs.push(e);
      //                           }
      //                           if (actions) {
      //                             const protoActions = [...actions];
      //                             (protoActions[j] = {
      //                               creds,
      //                               appName,
      //                               imageUrl,
      //                               id,
      //                               oAuth2,
      //                               additionalData,
      //                               dataOutputs: JSON.stringify(protoDataOutputs),
      //                               ...rest,
      //                             }),
      //                               setActions(protoActions);
      //                           }
      //                         }
      //                       )}
      //                     </Card>
      //                   )} */}
      //                 </VStack>
      //               ))}
      //             </HStack>
      //           ) : (
      //             <HStack textTransform={"capitalize"}>
      //               <Heading>Next, Connect to Your</Heading>
      //               <HStack>
      //                 <Heading>{appName}</Heading>
      //                 <Image w="30px" alt={imageUrl} src={imageUrl} />
      //               </HStack>
      //             </HStack>
      //           )}
      //         </VStack>
      //       ),
      //       nextButton: (
      //         handleNext: React.MouseEventHandler<HTMLButtonElement> | undefined,
      //         currStep: number | undefined
      //       ) =>
      //         creds ? (
      //           <Button
      //             isDisabled={additionalActions?.every(
      //               (item: any) => !item.value
      //             )}
      //             {...primaryButtonColor}
      //             onClick={handleNext}>
      //             Go to next step
      //           </Button>
      //         ) : (
      //           <Button
      //             {...primaryButtonColor}
      //             onClick={() =>
      //               handleOAuth({ oAuth2, currStep, actionId: id, appName })
      //             }>
      //             Connect to {appName}
      //           </Button>
      //         ),
      //     })
    ),
    // {
    //   el: (
    //     <VStack gap={4}>
    //       <VStack>
    //         <Heading>Name Your Automation!</Heading>
    //         <Text>Pick a memorable so that you do not forget 😉</Text>
    //       </VStack>
    //       <Input
    //         value={name}
    //         onChange={(e) => setName(e.target.value)}
    //         placeholder="eg: Slack self intro automation"
    //       />
    //     </VStack>
    //   ),
    //   disabledNext: !name,
    // },
    {
      el: (
        <VStack gap={4}>
          <Heading>Congratulation your automation is ready</Heading>
          <Button {...primaryButtonColor}>
            {/* <Link href="/automations">Go to automations</Link> */}
            <Link href="/">Return to Chat</Link>
          </Button>
          {/* <Text>
            today make the logic endpoint to work
            <Heading>{automation?.automationUseCase.logicEndpoint}</Heading>
          </Text> */}
          {/* <Text align="center">
            We will begin automate{" "}
            <strong>{automation?.automationUseCase.name}</strong> with Cruzzie.
          </Text> */}
        </VStack>
      ),
      noButton: true,
      // nextButtonLabel: "I'm ready let's begin 👉🏻",
    },
  ];

  const onUpdateAutomation = () => {
    // api.automation.update.mutate({})
    // if (automation) {
    //   updateAutomation({
    //     params: { id: automation.id },
    //     body: automation
    //   })
    // } else {
    //   alert('error updating')
    // }
  };

  useEffect(() => {
    if (isSuccess && automation) {
      setName(automation.name);
      setTrigger(
        automation.automationUseCase.automationTrigger as TAutomationTrigger
      );
      setActions(
        automation.automationUseCase.automationActions as TAutomationAction[]
      );
      if (router.query.currStep) {
        const currStep = router.query.currStep as string;
        setCurrentStep(parseInt(currStep));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [automation, isSuccess]);

  return (
    <Container h="100vh" maxW="7xl">
      {automationCreated && (
        <Box pos="fixed" top="0" left="0" bg="blue" zIndex={99}>
          <Confetti />
        </Box>
      )}
      <VStack h="full" justify={"center"}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text color="red">
            Something went wrong {JSON.stringify(error.data)}
          </Text>
        ) : (
          <Box>
            <StepForm
              currStep={currentStep}
              formElements={formElements}
              submitButton={
                <Button
                  {...primaryButtonColor}
                  onClick={onUpdateAutomation}
                  rightIcon={<ArrowRightIcon />}
                  // isLoading={isLoading}
                  disabled={!name}>
                  {/* {t("shared.button.create", { itemName: t("shared.vocab.test") })} */}
                  Create Your Automation
                </Button>
              }
            />
          </Box>
        )}
        <Box fontSize={"xs"} w="full">
          {/* <Text>{name}</Text> */}
          {/* <Text>{automation?.automationUseCase.logicEndpoint}</Text> */}
          {/* <pre>{JSON.stringify(trigger, null, 2)}</pre> */}
          {/* <pre>{JSON.stringify(actions, null, 2)}</pre> */}
        </Box>
      </VStack>
    </Container>
  );
}

// const renderAdditionalDataHandler = (
//   { inputDataFormat }: AdditionalDataInput,
//   appName: string,
//   onChange: (e: {
//     columnHandlerIndex: number;
//     td: ColumnDefinition["td"];
//     value: string | number | boolean;
//   }) => void
// ) => {
//   if (inputDataFormat) {
//     const onChangeHandler = (e: {
//       columnHandlerIndex: number;
//       td: ColumnDefinition["td"];
//       value: string | number | boolean;
//     }) => {
//       onChange(e);
//     };
//     switch (inputDataFormat.type) {
//       case AdditionalDataFormat.TABLE:
//         const { columns } = inputDataFormat;
//         const theads = columns.map(({ th }, i) => (
//           <Th textAlign={"center"} key={i}>
//             {th}
//           </Th>
//         ));
//         const tdata = columns.map(({ td, type, options }, i) => (
//           <Td key={i}>
//             <HStack justify={"center"}>
//               {renderTdInput(td, type, options || [], appName, (e) =>
//                 onChangeHandler({ columnHandlerIndex: i, ...e })
//               )}
//             </HStack>
//           </Td>
//         ));
//         return (
//           <VStack w="full" gap={2}>
//             <Heading size="md">
//               Choose the data that you want to insert inside this table
//             </Heading>
//             <TableContainer w="full">
//               <Table>
//                 <Thead>
//                   <Tr>{theads}</Tr>
//                 </Thead>
//                 <Tbody>
//                   <Tr>{tdata}</Tr>
//                 </Tbody>
//               </Table>
//             </TableContainer>
//           </VStack>
//         );
//       default:
//         return <></>;
//     }
//   }
// };

// const renderTdInput = (
//   td: ColumnDefinition["td"],
//   type: ColumnInputType,
//   options: InputOption[],
//   appName: string,
//   onChange: (e: {
//     td: ColumnDefinition["td"];
//     value: string | number | boolean;
//   }) => void
// ) => {
//   const supportedColumns = DataOutputsColumn[appName]
//     ?.columns as SupportedDataOutputColumns[];
//   switch (type) {
//     case ColumnInputType.SELECT:
//       return (
//         <Select placeholder="Select option">
//           {options?.map(({ label, value }, i) => (
//             <option key={i} value={value}>
//               {label}
//             </option>
//           ))}
//         </Select>
//       );
//     case ColumnInputType.TEXT:
//       return (
//         <Select
//           onChange={(e) =>
//             onChange({
//               td,
//               value: e.target.value,
//             })
//           }
//           placeholder="Select option"
//           maxW="fit-content"
//           textTransform={"capitalize"}>
//           {supportedColumns?.map(({ label, historyKey }, i) => (
//             <option
//               key={i}
//               value={historyKey}
//               style={{
//                 backgroundImage:
//                   "url(https://zapier-images.imgix.net/storage/services/6cf3f5a461feadfba7abc93c4c395b33_2.png?auto=format&fit=crop&ixlib=react-9.7.0&q=50&w=30&h=30&dpr=2)",
//               }}>
//               {label} from {appName}
//             </option>
//           ))}
//         </Select>
//       );
//     default:
//       return <Text size="sm">We do not support this type of data</Text>;
//   }
// };
