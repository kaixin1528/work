/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { diffTabs } from "../../../constants/dashboard";
import { showVariants } from "../../../constants/general";
import { Inventory } from "../../../types/dashboard";
import { useGraphStore } from "../../../stores/graph";
import { DiffBucket } from "../../../types/graph";
import { useGeneralStore } from "src/stores/general";
import { GetInfraSummary } from "src/services/dashboard/infra";
import { GetDiffSummary } from "src/services/graph/evolution";

const CloudInfra = ({ integration }: { integration: string }) => {
  const navigate = useNavigate();

  const { env } = useGeneralStore();
  const { setNavigationView, setDiffView, setDiffIntegrationType } =
    useGraphStore();

  const { data } = GetInfraSummary(env, integration);
  const { data: hourlyDiff } = GetDiffSummary(
    env,
    "hour",
    { month: 0 },
    "evolution",
    integration.toUpperCase()
  );

  return (
    <section className="flex flex-col flex-grow gap-3 p-4 h-full cursor-pointer font-light dark:bg-card shadow-md shadow-black">
      <h5 className="text-base dark:text-white">Cloud Infrastructure</h5>
      <motion.article
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 xl:pt-0 gap-5 items-stretch h-full"
      >
        <table className="mt-1 h-full text-sm dark:text-checkbox">
          <tbody>
            {diffTabs.map((tab) => {
              return (
                <tr
                  data-test="vpc"
                  key={tab.key}
                  className="mb-5 hover:scale-105 duration-100"
                  onClick={() => {
                    if (hourlyDiff) {
                      setNavigationView("evolution");
                      setDiffView("hour");
                      setDiffIntegrationType(integration.toUpperCase());
                      navigate("/graph/summary");
                    }
                  }}
                >
                  <td className="mt-[1.2rem] xl:mt-[0.7rem] w-5 h-5">
                    <img
                      src={tab.icon}
                      alt={`${tab.key} nodes`}
                      className="w-5 h-5"
                    />
                  </td>
                  <td className="pr-3 w-max text-lg text-right font-medium dark:text-white">
                    {hourlyDiff?.diff_buckets.reduce(
                      (pV: number, cV: DiffBucket) => pV + cV[tab.key],
                      0
                    )}
                  </td>
                  <td className="capitalize w-max">{tab.key}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <table className="h-full text-sm dark:text-checkbox">
          <tbody>
            {["Services", "Compute", "Data", "Networking"].map(
              (category: string) => {
                const categoryCount = data?.cloud_infras.inventory.reduce(
                  (pV: number, cV: Inventory) =>
                    cV.category === category ? pV + cV.count : pV,
                  0
                );

                const nodeType =
                  data?.cloud_infras.metadata.dash_mapping[category] &&
                  Object.keys(
                    data.cloud_infras.metadata.dash_mapping[category]
                  )[0];
                return (
                  <tr
                    data-test="group"
                    key={category}
                    className="pr-3 hover:scale-105 duration-100"
                    onClick={() => {
                      if (nodeType)
                        navigate(
                          `/dashboard/table/details?integration=${integration}&widget=infra&category=${category}&node_type=${nodeType}`
                        );
                    }}
                  >
                    <td className="mt-[0.9rem] xl:mt-[0.3rem] ">
                      <img
                        src={`/dashboard/infra/${category.toLowerCase()}.svg`}
                        alt={category}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="pr-3 dark:text-white text-right font-medium">
                      {categoryCount}
                    </td>
                    <td className="capitalize w-max">{category}</td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </motion.article>
    </section>
  );
};

export default CloudInfra;
