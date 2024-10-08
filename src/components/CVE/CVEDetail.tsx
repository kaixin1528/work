/* eslint-disable no-restricted-globals */
import ReturnPage from "src/components/Button/ReturnPage";
import { parseURL } from "src/utils/general";
import PageLayout from "src/layouts/PageLayout";
import UsageGraph from "./UsageGraph";
import { GetCVEDetail } from "src/services/general/cve";
import EPSSOverTime from "./EPSSOverTime";
import References from "./References";
import PackagesAffected from "./PackagesAffected";
import Weaknesses from "./Weaknesses";
import SeverityClassification from "./SeverityClassification";
import EPSS3D from "./EPSS3D";
import Summary from "./Summary";

const CVEDetail = () => {
  const parsed = parseURL();

  const selectedCVE = String(parsed.cve_id);

  const { data: cveDetail } = GetCVEDetail(selectedCVE);

  return (
    <PageLayout>
      <section className="flex flex-col flex-grow content-start gap-3 p-4 w-full h-full overflow-auto scrollbar">
        <ReturnPage />
        {cveDetail ? (
          Object.keys(cveDetail.data).length > 0 ? (
            <section className="flex flex-col flex-grow content-start gap-10 p-6 text-left text-sm dark:text-white dark:bg-panel black-shadow">
              <Summary selectedCVE={selectedCVE} />
              <SeverityClassification selectedCVE={selectedCVE} />
              <EPSSOverTime selectedCVE={selectedCVE} />
              <EPSS3D selectedCVE={selectedCVE} />
              <UsageGraph selectedCVE={selectedCVE} />
              <Weaknesses selectedCVE={selectedCVE} />
              <PackagesAffected selectedCVE={selectedCVE} />
              <References selectedCVE={selectedCVE} />
            </section>
          ) : (
            <p>No data available</p>
          )
        ) : null}
      </section>
    </PageLayout>
  );
};

export default CVEDetail;
