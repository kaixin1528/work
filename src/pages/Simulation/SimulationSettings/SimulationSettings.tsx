/* eslint-disable no-restricted-globals */
import Accounts from "./Accounts";
import Packages from "./Packages";
import SnapshotDatepicker from "src/components/Datepicker/SnapshotDatepicker";
import { convertToMicrosec } from "src/utils/general";
import { useSimulationStore } from "src/stores/simulation";
import { handleRunSimulationImpact } from "src/utils/simulation";

const SimulationSettings = ({
  runSimulationImpact,
}: {
  runSimulationImpact: any;
}) => {
  const {
    selectedSimulationAccount,
    setSelectedSimulationAccount,
    selectedSimulationPackage,
    simulationSnapshotTime,
    setSimulationSnapshotTime,
    setSelectedSimulationTab,
  } = useSimulationStore();

  const curSnapshotTime = convertToMicrosec(simulationSnapshotTime);

  return (
    <aside className="hidden md:grid content-start gap-6 w-max h-full text-sm dark:text-white">
      {/* selects a specific account */}
      <article className="flex flex-col flex-grow gap-3">
        <h4 className="dark:text-checkbox">Select account:</h4>
        <Accounts
          selectedAccount={selectedSimulationAccount}
          setSelectedAccount={setSelectedSimulationAccount}
        />
      </article>

      {/* select snapshot time */}
      <article className="flex flex-col flex-grow gap-3">
        <h4 className="dark:text-checkbox">Select time:</h4>
        <SnapshotDatepicker
          snapshotTime={simulationSnapshotTime}
          setSnapshotTime={setSimulationSnapshotTime}
          simulation
        />
      </article>

      {/* select a simulation package */}
      <article className="flex flex-col flex-grow gap-3 overflow-auto scrollbar">
        <h4 className="dark:text-checkbox">Select package:</h4>
        <Packages />
      </article>

      <button
        disabled={
          !selectedSimulationAccount ||
          !simulationSnapshotTime ||
          selectedSimulationPackage === ""
        }
        className="px-4 py-2 gradient-button rounded-sm"
        onClick={() =>
          handleRunSimulationImpact(
            setSelectedSimulationTab,
            runSimulationImpact,
            selectedSimulationAccount,
            curSnapshotTime,
            selectedSimulationPackage
          )
        }
      >
        Run Simulation
      </button>
    </aside>
  );
};

export default SimulationSettings;
