/* eslint-disable no-restricted-globals */
import { useLocation, useNavigate } from "react-router-dom";
import { useGraphStore } from "../../../../../stores/graph";
import { parseURL, sortNumericData } from "../../../../../utils/general";
import MultiLineChart from "../../../../../components/Chart/MultiLineChart";
import ViewInGraph from "src/components/Button/ViewInGraph";
import { useGeneralStore } from "src/stores/general";
import { GetVPCCounts } from "src/services/dashboard/infra";
import { useState } from "react";

const VPC = ({ selectedNodeID }: { selectedNodeID: string }) => {
  const navigate = useNavigate();
  const parsed = parseURL();
  const { pathname } = useLocation();

  const { env } = useGeneralStore();
  const { setGraphSearch, setGraphSearching, setGraphSearchString } =
    useGraphStore();

  const [sectionProps, setSectionProps] = useState({});

  const { data: vpcCounts, status: vpcCountStatus } = GetVPCCounts(
    env,
    parsed.integration,
    selectedNodeID
  );

  const sortedVpcCounts = sortNumericData(
    vpcCounts?.resource_counts,
    "timestamp",
    "asc"
  );

  return (
    <section className="grid gap-5 pr-20">
      <header className="flex items-center gap-5 justify-self-end dark:text-checkbox">
        <ViewInGraph
          requestData={{
            query_type: "view_in_graph",
            id: selectedNodeID,
          }}
        />
        <button
          className="flex items-center gap-2 text-xs dark:text-checkbox"
          onClick={() => {
            setGraphSearch(true);
            setGraphSearching(false);
            setGraphSearchString(
              `node_property:${
                parsed.integration === "aws"
                  ? `vpc_id=${selectedNodeID}`
                  : "network=default"
              }`
            );
            navigate(
              `/dashboard/en/details?integration=${parsed.integration}&section=firewall`,
              { state: { previousPath: pathname } }
            );
          }}
        >
          <svg
            width="16"
            height="12"
            viewBox="0 0 16 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
          >
            <path
              d="M0.971878 5.65644C0.971878 3.71525 1.75864 1.95918 3.03134 0.686486L2.34228 0C0.894745 1.44753 0 3.44785 0 5.65644C0 7.86502 0.894745 9.86534 2.34228 11.3129L3.02876 10.6264C1.75864 9.35369 0.971878 7.59762 0.971878 5.65644Z"
              fill="#7993B0"
            />
            <path
              d="M12.691 5.65622C12.691 6.95206 12.1665 8.12449 11.3154 8.97552L11.7757 9.43575C12.7424 8.46901 13.3415 7.13461 13.3415 5.65879C13.3415 4.18298 12.7424 2.84857 11.7757 1.88184L11.3154 2.34206C12.1639 3.19053 12.691 4.36553 12.691 5.66136V5.65622Z"
              fill="#7993B0"
            />
            <path
              d="M15.0253 5.65644C15.0253 7.59762 14.2385 9.35369 12.9658 10.6264L13.6523 11.3129C15.0998 9.86534 15.9946 7.86502 15.9946 5.65644C15.9946 3.44785 15.1024 1.44753 13.6549 0L12.9684 0.686486C14.2411 1.95918 15.0278 3.71525 15.0278 5.65644H15.0253Z"
              fill="#7993B0"
            />
            <path
              d="M4.22205 9.43357L4.68228 8.97334C3.83382 8.12487 3.30674 6.94988 3.30674 5.65404C3.30674 4.3582 3.83125 3.18578 4.68228 2.33474L4.22205 1.87451C3.25532 2.84125 2.65625 4.17565 2.65625 5.65147C2.65625 7.12728 3.25532 8.46169 4.22205 9.42842V9.43357Z"
              fill="#7993B0"
            />
            <path
              d="M10.5208 3.13428L9.68262 3.97246C10.1146 4.4044 10.3794 4.99833 10.3794 5.65653C10.3794 6.31474 10.112 6.90866 9.68262 7.34061L10.5208 8.17879C11.1661 7.53344 11.5647 6.64127 11.5647 5.65653C11.5647 4.6718 11.1661 3.77963 10.5208 3.13428Z"
              fill="#7993B0"
            />
            <path
              d="M5.47649 8.17879L6.31467 7.34061C5.88272 6.90866 5.6179 6.31474 5.6179 5.65653C5.6179 4.99833 5.88529 4.4044 6.31467 3.97246L5.47649 3.13428C4.83114 3.77963 4.43262 4.6718 4.43262 5.65653C4.43262 6.64127 4.83114 7.53344 5.47649 8.17879Z"
              fill="#7993B0"
            />
            <path
              d="M7.99925 7.1323C8.81432 7.1323 9.47507 6.47155 9.47507 5.65648C9.47507 4.84141 8.81432 4.18066 7.99925 4.18066C7.18418 4.18066 6.52344 4.84141 6.52344 5.65648C6.52344 6.47155 7.18418 7.1323 7.99925 7.1323Z"
              fill="#7993B0"
            />
          </svg>
          <p>
            View{" "}
            {parsed.integration === "aws"
              ? "Security Groups"
              : "Google Firewall"}{" "}
            graph
          </p>
        </button>
      </header>
      {vpcCountStatus === "success" && !vpcCounts && (
        <p className="mt-5 dark:text-white mx-auto">No data available</p>
      )}
      {sortedVpcCounts?.length > 0 && (
        <MultiLineChart
          data={sortedVpcCounts}
          xKey="timestamp"
          yLabel="Count"
          sectionProps={sectionProps}
          setSectionProps={setSectionProps}
        />
      )}
    </section>
  );
};

export default VPC;
