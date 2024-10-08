/* eslint-disable no-restricted-globals */
import ResourcesOpen from "./ResourcesOpen";
import SummaryLayout from "../../../../layouts/SummaryLayout";
import RiskSummary from "./RiskSummary";
import Accounts from "../../Accounts";
import PublicIPs from "./PublicIPs";

const AccessibleOnInternet = () => {
  return (
    <SummaryLayout name="Accessible On the Internet">
      <section className="flex flex-col flex-grow content-start gap-5">
        <RiskSummary />
        <section className="flex flex-col flex-grow content-start gap-10 h-full p-4 dark:bg-card shadow-lg dark:shadow-black">
          <Accounts />
          <PublicIPs />
          <ResourcesOpen />
        </section>
      </section>
    </SummaryLayout>
  );
};

export default AccessibleOnInternet;
