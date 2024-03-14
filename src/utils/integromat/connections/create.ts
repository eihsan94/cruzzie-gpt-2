import axios from "axios";

interface CreateConnectionProps {
  accountName: string;
  accountType: string;
  clientId?: string;
  clientSecret?: string;
  scopes: string[];
}

export const createConnections = async ({
  accountName,
  accountType,
  scopes,
  clientId,
  clientSecret,
}: CreateConnectionProps) => {
  const url = `https://eu1.make.com/api/v2/connections?teamId=334459`;

  const headers = {
    Authorization: "Token a054991d-830c-4484-9501-0e30cc3b1c6f",
  };

  const data = {
    accountName,
    accountType,
    scopes,
    clientId,
    clientSecret,
  };
  return axios.post(url, data, {
    headers,
  });
};
