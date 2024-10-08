import { Fragment, useState } from "react";
import { KeyStringVal } from "../../../../types/general";
import DependencyDetails from "./DependencyDetails";

export const dependencyHeader = [
  { display_name: "Dependency Name", property_name: "name" },
  { display_name: "Version", property_name: "version" },
];

export const dependencies = [
  {
    name: "d1",
    version: "v1",
  },
  {
    name: "d2",
    version: "v1",
  },
  {
    name: "d3",
    version: "v1",
  },
  {
    name: "d4",
    version: "v1",
  },
  {
    name: "d5",
    version: "v1",
  },
];

const DependenciesList = ({
  selectedOrg,
  selectedRepo,
  selectedBranch,
  selectedPackageManager,
  dependencies,
}: {
  selectedOrg: string;
  selectedRepo: string;
  selectedBranch: string;
  selectedPackageManager: string;
  dependencies: KeyStringVal;
}) => {
  const [selectedDependency, setSelectedDependency] = useState<string>("");

  return (
    <section className="grid content-start gap-3 px-4 w-full overflow-auto scrollbar">
      <h4 className="w-max">
        {selectedPackageManager} dependencies (
        {dependencies && Object.keys(dependencies).length})
      </h4>
      <ul className="grid max-h-[25rem] text-sm overflow-auto scrollbar">
        {Object.entries(dependencies) ? (
          Object.entries(dependencies).map((keyVal) => {
            return (
              <Fragment key={keyVal[0]}>
                <li
                  className={`p-4 cursor-pointer ${
                    selectedDependency === keyVal[0]
                      ? "dark:bg-filter/60"
                      : "dark:hover:bg-filter/30 duartion-200"
                  } border-t-1 dark:border-checkbox/30`}
                  onClick={() => setSelectedDependency(keyVal[0])}
                >
                  {keyVal[0]}: {keyVal[1]}
                </li>

                {selectedDependency === keyVal[0] && (
                  <DependencyDetails
                    selectedOrg={selectedOrg}
                    selectedRepo={selectedRepo}
                    selectedBranch={selectedBranch}
                    selectedPackageManager={selectedPackageManager}
                    dependency={keyVal[0]}
                    selectedDependency={selectedDependency}
                    setSelectedDependency={setSelectedDependency}
                  />
                )}
              </Fragment>
            );
          })
        ) : (
          <p>No dependencies found</p>
        )}
      </ul>
    </section>
  );
};

export default DependenciesList;
