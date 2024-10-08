import React from "react";
import Assets from "./Assets";
import InventoryEvolution from "./InventoryEvolution";
import Entropy from "./Entropy";
import Lineage from "./Lineage";
import Accounts from "src/pages/Summaries/Accounts";

const AssetService = () => {
  return (
    <section className="grid gap-5">
      <h3 className="text-lg">Assets and Services</h3>
      <Accounts showAll />
      <Assets />
      <InventoryEvolution />
      <Entropy />
      <Lineage />
    </section>
  );
};

export default AssetService;
