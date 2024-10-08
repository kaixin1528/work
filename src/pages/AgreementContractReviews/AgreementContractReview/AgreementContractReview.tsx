import React, { useState } from "react";
import AgreementMetadata from "./AgreementContractReviewMetadata";
import ReturnPage from "src/components/Button/ReturnPage";
import PageLayout from "src/layouts/PageLayout";
import { parseURL } from "src/utils/general";
import AgreementReview from "./AgreementReview/AgreementReview";
import DocumentTabs from "./DocumentTabs";
import Sections from "./Sections";

const AgreementContractReview = () => {
  const parsed = parseURL();

  const [selectedTab, setSelectedTab] = useState<string>("Agreement Review");

  const agreementID = String(parsed.agreement_id) || "";

  return (
    <PageLayout>
      <main className="flex flex-col flex-grow gap-5 px-5 pt-5 h-full w-full overflow-auto scrollbar">
        <article className="flex items-center gap-5">
          <ReturnPage />
          <h4 className="capitalize">Agreement & Contract Review</h4>
        </article>
        <AgreementMetadata agreementID={agreementID} />
        <DocumentTabs
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        {selectedTab === "Agreement Review" ? (
          <AgreementReview agreementID={agreementID} />
        ) : (
          <Sections agreementID={agreementID} />
        )}
      </main>
    </PageLayout>
  );
};

export default AgreementContractReview;
