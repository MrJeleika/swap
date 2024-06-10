import axios from 'axios';

export const getTokenBalance = async (address: string, token: string) => {
  const response = await axios({
    url: process.env.RPC_URL,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: {
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenAccountsByOwner',
      params: [
        address,
        {
          mint: token
        },
        {
          encoding: 'jsonParsed'
        }
      ]
    }
  });

  return response.data.result.value[0].account.data.parsed.info.tokenAmount.uiAmountString as string;
};
