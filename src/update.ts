import path from 'path';
import { promises } from 'fs';

const update = async () => {
  try {
    const res = await fetch('https://api.raydium.io/v2/sdk/liquidity/mainnet.json');
    const data = await res.json();

    // Define the file path where you want to save the pools.json
    const filePath = path.join('./', 'pools.json');

    // Convert the data to a JSON string
    const jsonData = JSON.stringify(data, null, 2);

    try {
      await promises.access(filePath);
      // If the file exists, delete it
      await promises.unlink(filePath);
      console.log('Existing file deleted.');
    } catch (error) {
      // If the file does not exist, no action is needed
      console.log('No existing file to delete.');
    }

    // Write the JSON data to the file
    await promises.writeFile(filePath, jsonData);
    console.log('Data saved to pools.json');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

update();
