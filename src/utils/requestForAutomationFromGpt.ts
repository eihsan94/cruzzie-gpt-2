/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from "axios";

function extractBody(text: string) {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = text.match(urlRegex);

  if (urls && urls.length > 0) {
    const url = urls[0].replace(/\.$/, "");

    console.log("Extracted URL:", url);
    return url;
  } else {
    console.log("No URLs found in the text.");
    throw new Error("No URLs found in the text.");
  }
}

// Function to make the API call using the extracted information
export async function callAPI(text: string) {
  const url = new URL(extractBody(text));
  console.log("Path:", url.pathname);
  console.log("Query string:", url.search);
  if (url) {
    try {
      const response = await axios.get(url.pathname + url.search, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data;
    } catch (error) {
      console.error(
        `Error making API call: ${(error as { message: string }).message}`
      );
    }
  } else {
    throw new Error("Failed to extract URL from the input text.");
  }
}
