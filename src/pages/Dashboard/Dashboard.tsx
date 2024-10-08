/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { showVariants } from "../../constants/general";
import { GetActiveSources } from "../../services/dashboard/dashboard";
import CloudInfra from "./Cloud/CloudInfra";
import Region from "./Cloud/Regions/RegionPreview";
import EN from "./Cloud/EffectiveNetworking/ENPreview";
import PageLayout from "../../layouts/PageLayout";
import { useGeneralStore } from "src/stores/general";
import { useEffect, useState } from "react";

const Dashboard: React.FC = () => {
  const { env } = useGeneralStore();

  const [selectedCloud, setSelectedCloud] = useState<string>("");

  const { data: activeSources } = GetActiveSources(env);

  useEffect(() => {
    if (
      activeSources &&
      Object.keys(activeSources.clouds).length > 0 &&
      selectedCloud === ""
    )
      setSelectedCloud(
        Object.keys(activeSources.clouds)
          .find((cloud) => activeSources.clouds[cloud] === true)
          ?.toLowerCase() as string
      );
  }, [activeSources]);

  return (
    <PageLayout>
      {activeSources ? (
        Object.values(activeSources.clouds).some(
          (cloudStatus) => cloudStatus
        ) ? (
          <motion.main
            variants={showVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col flex-grow gap-7 px-4 pb-5 w-full h-full dark:text-white font-light z-10 overflow-x-hidden overflow-auto scrollbar"
          >
            <nav className="flex itemes-center gap-5 mx-auto">
              {Object.entries(activeSources.clouds).map((keyVal) => {
                if (!keyVal[1]) return null;
                const cloud = keyVal[0].toLowerCase();
                return (
                  <button
                    key={cloud}
                    className={`grid gap-1 px-10 py-1 ${
                      selectedCloud === cloud
                        ? "selected-button"
                        : "dark:hover:bg-signin/30"
                    } rounded-sm`}
                    onClick={() => setSelectedCloud(cloud)}
                  >
                    <img
                      src={`/general/integrations/${cloud}.svg`}
                      alt={cloud}
                      className="w-10 h-10"
                    />
                  </button>
                );
              })}
            </nav>
            {selectedCloud !== "" && (
              <section className="grid grid-rows-3 md:grid-rows-2 xl:grid-rows-1 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                <CloudInfra integration={selectedCloud} />
                <Region integration={selectedCloud} />
                <EN integration={selectedCloud} />
              </section>
            )}
          </motion.main>
        ) : (
          <section className="grid w-full h-full">
            <img
              src="/general/landing/dashboard-holding.svg"
              alt="dashboard holding"
              className="w-3/5 h-full mx-auto p-10"
            />
            <p className="-mt-5 text-xl dark:text-white mx-auto">
              Configuration is still in progress......
            </p>
          </section>
        )
      ) : null}
    </PageLayout>
  );
};

export default Dashboard;
