/* eslint-disable no-restricted-globals */
import { useState } from "react";
import CVEList from "./CVEList";
import Layers from "./Layers";
import SummaryLayout from "../../../../layouts/SummaryLayout";
import Accounts from "../../Accounts";

const LayeredCake = () => {
  const [selectedLayer, setSelectedLayer] = useState<string>("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("");
  const [selectedCVE, setSelectedCVE] = useState<string>("");

  return (
    <SummaryLayout name="Layered Cake">
      <Accounts />
      <Layers
        selectedLayer={selectedLayer}
        selectedSeverity={selectedSeverity}
        setSelectedLayer={setSelectedLayer}
        setSelectedSeverity={setSelectedSeverity}
        setSelectedCVE={setSelectedCVE}
      />

      <section className="grid md:flex flex-grow items-start gap-10 text-sm">
        {/* list of cves of a selected layer */}
        {selectedLayer !== "" && selectedSeverity !== "" && (
          <CVEList
            selectedLayer={selectedLayer}
            selectedSeverity={selectedSeverity}
            selectedCVE={selectedCVE}
            setSelectedCVE={setSelectedCVE}
          />
        )}
      </section>
    </SummaryLayout>
  );
};

export default LayeredCake;
