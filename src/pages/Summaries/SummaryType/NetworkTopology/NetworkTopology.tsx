import React from "react";
import SummaryLayout from "src/layouts/SummaryLayout";
import Accounts from "../../Accounts";
import SummaryHiearchy from "./SummaryHiearchy";

const NetworkTopology = () => {
  return (
    <SummaryLayout name="Network Topology">
      <Accounts />
      <SummaryHiearchy />
    </SummaryLayout>
  );
};

export default NetworkTopology;
