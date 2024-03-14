import { useState, useEffect } from "react";
import { type ChannelData } from "~/types/types";
import { getChannels } from "~/utils/integrations/common/getChannels";

export const useChannels = (creds: string, appName: string) => {
  const [channels, setChannels] = useState<ChannelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setIsLoading(true);
        const fetchedChannels = await getChannels(creds, appName);
        setChannels(fetchedChannels);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError(error);
        console.error("Error fetching channels:", error);
      }
    };
    void fetchChannels();
  }, [creds, appName]);

  return {
    isLoading,
    error,
    channels,
  };
};
