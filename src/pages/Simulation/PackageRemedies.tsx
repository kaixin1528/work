import React from "react";
import Loader from "src/components/Loader/Loader";
import { GetSimulationPackageRemedies } from "src/services/simulation";
import { useSimulationStore } from "src/stores/simulation";

const PackageRemedies = () => {
  const { selectedSimulationPackage } = useSimulationStore();

  const { data: getPackageRemedies, status: packageRemediesStatus } =
    GetSimulationPackageRemedies(selectedSimulationPackage);

  return (
    <section className="relative grid gap-5 p-6 w-full h-full text-sm overflow-auto scrollbar">
      {packageRemediesStatus === "success" ? (
        Object.keys(getPackageRemedies.remedies.data).length > 0 ? (
          <section className="grid content-start gap-5 overflow-auto scrollbar">
            {Object.keys(getPackageRemedies.remedies.data).map((nodeType) => {
              return (
                <article
                  key={nodeType}
                  className="grid content-start p-4 dark:bg-no/10 border dark:border-no rounded-sm"
                >
                  <h4>{nodeType}</h4>
                  <ul className="grid content-start list-disc px-4">
                    {getPackageRemedies.remedies.data[nodeType].map(
                      (scope: any) => {
                        return (
                          <li key={scope.scope}>
                            <h4 className="capitalize">
                              {scope.scope.replaceAll("_", " ")}
                            </h4>

                            <ul className="grid list-decimal px-4">
                              {scope.info.map((step: string) => {
                                return <li key={step}> {step}</li>;
                              })}
                            </ul>
                          </li>
                        );
                      }
                    )}
                  </ul>
                </article>
              );
            })}
          </section>
        ) : (
          <p>No package remedies available</p>
        )
      ) : packageRemediesStatus === "loading" ? (
        <Loader />
      ) : (
        <img
          src="/simulation/simulation-graph-placeholder.svg"
          alt="simulated graph placeholder"
          className="absolute top-1/3 left-1/2 -translate-x-1/2 px-10 w-[40rem]"
        />
      )}
    </section>
  );
};

export default PackageRemedies;
