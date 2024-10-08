import { simulationPackages } from "src/constants/simulation";
import { useSimulationStore } from "src/stores/simulation";

const Packages = () => {
  const { selectedSimulationPackage, setSelectedSimulationPackage } =
    useSimulationStore();

  return (
    <ul className="flex flex-col flex-grow gap-1 px-2 py-1 w-full">
      {simulationPackages.map((pkg: string) => {
        return (
          <li key={pkg} className="flex items-center gap-2">
            <input
              type="radio"
              className="form-radio mr-1 w-4 h-4 self-start dark:bg-transparent dark:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50 rounded-full"
              checked={
                selectedSimulationPackage ===
                pkg.replaceAll(" ", "_").toLowerCase()
              }
              onChange={() =>
                setSelectedSimulationPackage(
                  pkg.replaceAll(" ", "_").toLowerCase()
                )
              }
            />
            <p>{pkg}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default Packages;
