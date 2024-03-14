/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// import axios from "axios";
// import React, { useEffect, useState } from "react";

// export default function Test() {
//   const [res, setRes] = useState<unknown>();

//   useEffect(() => {
//     axios
//       .get(
//         "/api/v1/integrations/slack/subscribeToEvent?channelId=C01J2QZLZ0N&automationTriggerId="
//       )
//       .then((res) => {
//         setRes(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   return (
//     <div>
//       <>
//         aa
//         {res && (
//           <>
//             <h1>Subscribed to Slack channel</h1>
//             <pre>{JSON.stringify(res, null, 2)}</pre>
//           </>
//         )}
//       </>
//     </div>
//   );
// }
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import LoadingAnimation from "~/components/Loading/LoadingAnimation";

const fetchSlackEvents = async () => {
  const response = await axios.post(
    "http://127.0.0.1:8000/api/v1/slack/events"
  );
  return response.data;
};

export default function Test() {
  const { isLoading, data, error } = useQuery(["slack"], fetchSlackEvents);

  if (error) {
    console.log(error);
  }

  return (
    <div>
      <>
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <>
            <h1>Subscribed to Slack channel</h1>
            <pre>{JSON.stringify(error || data, null, 2)}</pre>
          </>
        )}
      </>
    </div>
  );
}
