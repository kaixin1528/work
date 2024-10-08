import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import { pointerVariants, showVariants } from "src/constants/general";
import { GetImportantAlerts } from "src/services/getting-started";
import { useGeneralStore } from "src/stores/general";
import { KeyStringVal } from "src/types/general";
import { convertToUTCString } from "src/utils/general";

const ImportantAlerts = () => {
  const navigate = useNavigate();

  const { env } = useGeneralStore();

  const { data: importantAlerts } = GetImportantAlerts(env, 3);

  return (
    <motion.section
      variants={pointerVariants}
      className="flex flex-col flex-grow content-start gap-3 p-4 w-full h-full text-center text-sm bg-gradient-to-b dark:bg-main border-1 dark:border-filter overflow-auto scrollbar z-20"
    >
      <h3 className="text-xl">Important Alerts</h3>
      {importantAlerts?.length > 0 ? (
        <motion.ul
          variants={showVariants}
          initial="hidden"
          animate="visible"
          className="grid divide-y dark:divide-checkbox/20"
        >
          {importantAlerts.map((alert: KeyStringVal) => {
            return (
              <motion.li
                variants={showVariants}
                key={`${alert.graph_artifact_id}-${alert.event_cluster_id}`}
                className="grid gap-2 p-4 place-items-center cursor-pointer dark:hover:bg-filter/30 duration-100"
                onClick={() =>
                  navigate(
                    `/graph/alert-analysis/details?graph_artifact_id=${alert.graph_artifact_id}&event_cluster_id=${alert.event_cluster_id}`
                  )
                }
              >
                <header className="flex items-center gap-2">
                  <img
                    src={`/graph/nodes/${alert.integration_type.toLowerCase()}/${alert.resource_type.toLowerCase()}.svg`}
                    alt={alert.resource_type}
                    className="w-5 h-5"
                  />
                  <p>{alert.graph_artifact_id}</p>
                </header>
                <article className="flex items-center gap-2 text-xs">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="w-3 h-3 dark:text-admin"
                  />
                  <p>{convertToUTCString(Number(alert.analysis_time))}</p>
                </article>
                <article className="flex items-start gap-2">
                  <img
                    src={`/graph/alerts/${alert.severity.toLowerCase()}.svg`}
                    alt={alert.severity}
                    className="w-5 h-5"
                  />
                  <p>{alert.description}</p>
                </article>
              </motion.li>
            );
          })}
        </motion.ul>
      ) : (
        <p>You have no important alerts as of now</p>
      )}
    </motion.section>
  );
};

export default ImportantAlerts;
