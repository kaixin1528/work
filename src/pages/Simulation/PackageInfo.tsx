import React from "react";
import Loader from "src/components/Loader/Loader";
import { GetSimulationPackageInfo } from "src/services/simulation";
import { useSimulationStore } from "src/stores/simulation";

const PackageInfo = () => {
  const { selectedSimulationPackage } = useSimulationStore();

  const { data: getPackageInfo, status: packageInfoStatus } =
    GetSimulationPackageInfo(selectedSimulationPackage);

  return (
    <section className="relative grid content-start gap-5 p-6 w-full h-full text-sm overflow-auto scrollbar">
      {packageInfoStatus === "success" ? (
        Object.keys(getPackageInfo).length > 0 ? (
          <section className="grid content-start lg:grid-cols-2 gap-10">
            {Object.keys(getPackageInfo).map((annotationType: string) => {
              return (
                <article
                  key={annotationType}
                  className="grid content-start gap-5"
                >
                  <header className="flex items-center gap-2 px-4 py-2 capitalize text-base full-underlined-label">
                    <img
                      src={`/simulation/${annotationType}.svg`}
                      alt={annotationType}
                      className="w-7 h-7"
                    />
                    <h4>{annotationType}</h4>
                  </header>
                  <ul className="grid gap-3 px-4">
                    {Object.keys(getPackageInfo[annotationType]).map(
                      (scope) => {
                        return (
                          <li key={scope} className="grid gap-1 break-words">
                            <header className="flex items-center gap-2">
                              <img
                                src={`/simulation/scope/${scope}.svg`}
                                alt={scope}
                                className="w-7 h-7"
                              />
                              <h4 className="capitalize text-sm">
                                {scope.replaceAll("_", " ")}
                              </h4>
                            </header>
                            <p className="indent-9">
                              {getPackageInfo[annotationType][scope].info}
                            </p>
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
          <p>No package info available</p>
        )
      ) : packageInfoStatus === "loading" ? (
        <Loader />
      ) : (
        <article className="absolute top-1/3 left-1/2 -translate-x-1/2 grid gap-5">
          <h4 className="mx-auto">Please select a simulation package</h4>
          <img
            src="/simulation/simulation-graph-placeholder.svg"
            alt="simulated graph placeholder"
            className="px-10 w-[40rem]"
          />
        </article>
      )}
    </section>
  );
};

export default PackageInfo;
