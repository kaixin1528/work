// get the timeline of when a node

import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

const prefix = "observability/graph/node-timeline";

// get the timeline of when a node
// is created/removed/modified and its audit log
export const GetNodeTimeline = (
  env: string,
  nodeType: string | (string | null)[] | null,
  id: string | (string | null)[] | null,
  uniqueID: string,
  type: string,
  pageNumber: number
) =>
  useQuery<any, unknown, any, (string | number | (string | null)[] | null)[]>(
    ["get-node-timeline", env, nodeType, id, uniqueID, type, pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}?env_id=${env}&node_class=${nodeType}&unique_id=${uniqueID}&type=${type}`,
          { page_number: pageNumber, page_size: pageSize },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled:
        env !== "" &&
        nodeType !== "" &&
        id !== "" &&
        uniqueID !== "" &&
        type !== "",
      keepPreviousData: false,
    }
  );

// get info of a node in timeline
export const GetNodeInfoInTimeline = (
  env: string,
  nodeType: string | (string | null)[] | null,
  id: string | (string | null)[] | null,
  uniqueID: string,
  changeType: string,
  eventID: string,
  type: string,
  timestamp: number
) =>
  useQuery<any, unknown, any, (string | number | (string | null)[] | null)[]>(
    [
      "get-node-info-in-timeline",
      env,
      nodeType,
      id,
      uniqueID,
      changeType,
      eventID,
      type,
      timestamp,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${changeType}?env_id=${env}&node_class=${nodeType}&unique_id=${uniqueID}${
            changeType === "audit"
              ? `&event_id=${eventID}&type=${type}`
              : `&timestamp=${timestamp}`
          }`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled:
        env !== "" &&
        nodeType !== "" &&
        id !== "" &&
        uniqueID !== "" &&
        ((changeType === "audit" && eventID !== "" && type !== "") ||
          (changeType === "diff" && timestamp !== 0)),
      keepPreviousData: false,
    }
  );
