import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import { pointerVariants, showVariants } from "src/constants/general";
import { actionColors } from "src/constants/summaries";
import { GetImportantChanges } from "src/services/getting-started";
import { useGeneralStore } from "src/stores/general";
import { useSummaryStore } from "src/stores/summaries";
import { KeyStringVal } from "src/types/general";
import { convertToUTCString } from "src/utils/general";

const ImportantChanges = () => {
  const navigate = useNavigate();

  const { env } = useGeneralStore();
  const { setPeriod, setSelectedReportAccount } = useSummaryStore();

  const { data: importantChanges } = GetImportantChanges(env, 3);

  return (
    <motion.section
      variants={pointerVariants}
      className="flex flex-col flex-grow content-start gap-3 p-4 w-full h-full text-center text-sm bg-gradient-to-b dark:bg-main border-1 dark:border-filter overflow-auto scrollbar z-20"
    >
      <h3 className="text-xl">Changes in the past day</h3>
      {importantChanges && (
        <p className="text-xs">
          {convertToUTCString(importantChanges.start)} -{" "}
          {convertToUTCString(importantChanges.end)}
        </p>
      )}
      {importantChanges ? (
        importantChanges.data?.length > 0 ? (
          <motion.ul
            variants={showVariants}
            initial="hidden"
            animate="visible"
            className="grid divide-y dark:divide-checkbox/20"
          >
            {importantChanges.data.map((change: KeyStringVal) => {
              if (!["ALL", "AWS", "GCP"].includes(change.integration_type))
                return null;

              return (
                <motion.li
                  variants={showVariants}
                  key={change.source_account_id}
                  className="grid gap-3 p-4 place-items-center cursor-pointer dark:hover:bg-filter/30 duration-100"
                  onClick={() => {
                    setPeriod(importantChanges.period);
                    setSelectedReportAccount({
                      integration_type: change.integration_type,
                      customer_cloud_id: change.source_account_id,
                    });
                    navigate(
                      `/summaries/details?summary=compute_and_services_modifications`
                    );
                  }}
                >
                  <article className="flex items-center gap-2">
                    <img
                      src={`/general/integrations/${change.integration_type.toLowerCase()}.svg`}
                      alt={change.integration_type}
                      className="w-7 h-7"
                    />
                    <p>{change.source_account_id}</p>
                  </article>
                  <ul className="flex items-center gap-5">
                    {["created", "modified", "removed"].map((action) => {
                      return (
                        <li
                          key={action}
                          className={`w-max ${actionColors[action]}`}
                        >
                          {change.node_counts[action]} {action}
                        </li>
                      );
                    })}
                  </ul>
                </motion.li>
              );
            })}
          </motion.ul>
        ) : (
          <p>You have no important changes as of now</p>
        )
      ) : null}
    </motion.section>
  );
};

export default ImportantChanges;
