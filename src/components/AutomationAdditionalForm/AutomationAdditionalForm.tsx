/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { VStack, HStack, Heading, Select, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import {
  additionalActionPrefetchFn,
  type OtherData,
} from "~/additionalAction/additionalActionPrefetchFn";
import {
  AdditionalDataFormat,
  type ColumnDefinition,
  type InputDataFormat,
  type AdditionalDataInput,
} from "~/types/types";

interface Props {
  // trigger or automation id
  creds: any;
  additionalDataInput: AdditionalDataInput;
  onChange: (args: AdditionalDataInput) => void;
}

export default function AutomationAdditionalForm({
  additionalDataInput,
  creds,
  onChange,
}: Props) {
  const { label, type, placeholder, options, prefetchFnEnum, value } =
    additionalDataInput;
  const [isLoading, setIsLoading] = useState(false);
  const [inputFormatType, setInputFormatType] = useState<AdditionalDataFormat>(
    AdditionalDataFormat.NONE
  );
  const [otherDataState, setOtherDataState] = useState<OtherData | undefined>();
  const [selections, setSelections] = useState<
    { value: string; label: string }[]
  >(options || []);

  const fetchSelections = async () => {
    if (selections.length === 0 && prefetchFnEnum) {
      setIsLoading(true);
      const { selections, inputDataFormatType, otherData } =
        await additionalActionPrefetchFn({
          prefetchFnEnum,
          creds,
        });
      setOtherDataState(otherData);
      setInputFormatType(inputDataFormatType);
      setSelections(selections);
      setIsLoading(false);
    }
  };

  const onChangeHandler = (e: any) => {
    const inputDataFormat: InputDataFormat = !otherDataState
      ? {
          type: inputFormatType as AdditionalDataFormat.NONE,
        }
      : {
          type: inputFormatType,
          columns: otherDataState.find((data) => data.id === e.target.value)
            ?.columns as ColumnDefinition[],
        };

    onChange({
      ...additionalDataInput,
      label,
      value: e.target.value,
      options: selections,
      inputDataFormat,
    });
  };

  return (
    <VStack gap={4}>
      <Heading>Next, {label}👇🏽</Heading>
      <HStack w="full">
        {type === "select" ? (
          <Select
            size="lg"
            placeholder={placeholder}
            onChange={onChangeHandler}
            value={value}
            onClick={fetchSelections}
            w="full"
            bg="gray.100">
            {isLoading && <option>Loading...</option>}
            {selections.map(({ label, value }, i: number) => (
              <option key={i} value={value}>
                {label}
              </option>
            ))}
          </Select>
        ) : (
          <div>
            <Text>{label}</Text>
            <Input placeholder={placeholder} type={type} />
          </div>
        )}
      </HStack>
    </VStack>
  );
}
