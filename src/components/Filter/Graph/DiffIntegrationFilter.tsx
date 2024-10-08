/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { useGraphStore } from "src/stores/graph";
import { useGeneralStore } from "src/stores/general";
import { GetDiffIntegrations } from "src/services/graph/evolution";
import { useEffect } from "react";

const DiffIntegrationFilter = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) => {
  const { env } = useGeneralStore();
  const {
    diffIntegrationType,
    setDiffIntegrationType,
    diffView,
    setDiffView,
    diffStartTime,
  } = useGraphStore();

  const { data: integrations } = GetDiffIntegrations(
    env,
    diffView,
    diffStartTime
  );

  useEffect(() => {
    if (integrations?.length > 0 && diffIntegrationType === "")
      setDiffIntegrationType(integrations[0]);
  }, [integrations]);

  return (
    <DropdownLayout label="Cloud" value={value}>
      {integrations?.map((item: string, index: number) => (
        <motion.button
          key={index}
          variants={filterVariants}
          className={`relative py-1 px-7 text-left break-all dark:hover:bg-checkbox/30 ${
            value === item ? "dark:bg-filter" : ""
          } duration-100`}
          onClick={() => {
            if (diffView === "snapshot") setDiffView("hour");
            setValue(item);
          }}
        >
          <p>{item}</p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default DiffIntegrationFilter;
