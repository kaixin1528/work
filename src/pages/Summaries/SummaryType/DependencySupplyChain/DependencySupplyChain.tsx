/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import Orgs from "./Orgs";
import SummaryLayout from "../../../../layouts/SummaryLayout";

const DependencySupplyChain = () => {
  return (
    <SummaryLayout name="Dependency and Supply Chain">
      <Orgs />
    </SummaryLayout>
  );
};

export default DependencySupplyChain;
