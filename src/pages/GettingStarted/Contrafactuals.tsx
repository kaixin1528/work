/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pointerVariants } from "src/constants/general";
import { GetContrafactuals } from "src/services/getting-started";
import { useGeneralStore } from "src/stores/general";
import { useSimulationStore } from "src/stores/simulation";
import { SimulationNodeObj } from "src/types/simulation";
import { convertToDate } from "src/utils/general";

const Contrafactuals = () => {
  const navigate = useNavigate();

  const { env } = useGeneralStore();
  const {
    setSelectedSimulationAccount,
    setSimulationSnapshotTime,
    setSelectedSimulationPackage,
    setSelectedSimulationScope,
    setSelectedSimulationTab,
    setSelectedSimulationNodeObj,
    setSelectedSimulationAnnotationType,
  } = useSimulationStore();

  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const { data: contrafactuals } = GetContrafactuals(env, 3);

  useEffect(() => {
    if (contrafactuals?.length > 0 && !selectedAccount)
      setSelectedAccount(contrafactuals[0]);
  }, [contrafactuals]);

  return (
    <motion.section
      variants={pointerVariants}
      className="flex flex-col flex-grow content-start gap-3 p-4 w-full h-full text-center text-sm bg-gradient-to-b dark:bg-main border-1 dark:border-filter overflow-auto scrollbar z-20"
    >
      <h3 className="text-xl">Contrafactuals</h3>
      <ul className="flex items-center gap-5 mx-auto text-sm overflow-auto scrollbar">
        {contrafactuals?.map((account: any) => {
          if (!["ALL", "AWS", "GCP"].includes(account.integration_type))
            return null;
          return (
            <li
              key={`${account.integration_type}-${account.customer_cloud_id}`}
              className={`flex flex-wrap items-center gap-2 py-2 px-4 cursor-pointer ${
                selectedAccount?.integration_type ===
                  account.integration_type &&
                selectedAccount?.customer_cloud_id === account.customer_cloud_id
                  ? "w-max selected-button rounded-sm"
                  : "border-none dark:hover:bg-signin/30 duration-100"
              }`}
              onClick={() => setSelectedAccount(account)}
            >
              <img
                src={`/general/integrations/${account.integration_type.toLowerCase()}.svg`}
                alt={account.integration_type}
                className="w-7 h-7"
              />
              <p>{account.source_account_id}</p>
            </li>
          );
        })}
      </ul>
      {contrafactuals ? (
        selectedAccount?.simulation_result.node_ids.length > 0 ? (
          <ul className="grid gap-5 px-4 py-2 w-max text-sm divide-y dark:divide-checkbox/30 overflow-auto scrollbar">
            {selectedAccount.simulation_result.node_ids.map(
              (nodeObj: SimulationNodeObj, index: number) => {
                return (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-10 pt-5"
                  >
                    <article className="flex items-center gap-2">
                      <img
                        src={`/graph/nodes/${nodeObj?.integration_type?.toLowerCase()}/${nodeObj?.node_class?.toLowerCase()}.svg`}
                        alt={nodeObj?.node_class}
                        className="w-6 h-6"
                      />
                      <h4>{nodeObj.source}</h4>
                    </article>
                    <section className="flex items-center gap-7 pr-4">
                      {["impact", "damage"].map((annotationType) => {
                        return (
                          <article
                            key={annotationType}
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => {
                              setSelectedSimulationAccount({
                                integration_id: selectedAccount.integration_id,
                                integration_type:
                                  selectedAccount.integration_type,
                                customer_cloud_id:
                                  selectedAccount.source_account_id,
                              });
                              setSelectedSimulationTab("Simulation Result");
                              setSelectedSimulationPackage(
                                selectedAccount.package_type
                              );
                              setSimulationSnapshotTime(
                                convertToDate(selectedAccount.record_time)
                              );
                              setSelectedSimulationNodeObj(nodeObj);
                              setSelectedSimulationScope(
                                selectedAccount.impact_type
                              );
                              setSelectedSimulationAnnotationType(
                                annotationType
                              );
                              navigate("/simulation/summary");
                            }}
                          >
                            <img
                              src={`/simulation/${annotationType}.svg`}
                              alt={annotationType}
                              className="w-4 h-4"
                            />
                            <p>
                              View{" "}
                              {annotationType === "impact"
                                ? "Impact"
                                : "Possible Damages"}
                            </p>
                          </article>
                        );
                      })}
                    </section>
                  </li>
                );
              }
            )}
          </ul>
        ) : (
          <p>You have no contrafactuals as of now</p>
        )
      ) : null}
    </motion.section>
  );
};

export default Contrafactuals;
