import React from "react";
import SummaryLayout from "src/layouts/SummaryLayout";
import Categories from "./Categories";
import { parseURL } from "src/utils/general";
import { cyberRiskItems } from "src/constants/summaries";

const CyberRisk = () => {
  const parsed = parseURL();

  const NavItem = cyberRiskItems[String(parsed.nav)];

  return (
    <SummaryLayout name="Cyber Risk Assessment">
      {!parsed.nav ? <Categories /> : <NavItem />}
    </SummaryLayout>
  );
};

export default CyberRisk;
