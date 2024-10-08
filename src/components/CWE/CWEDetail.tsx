import React from "react";
import PageLayout from "src/layouts/PageLayout";
import { parseURL } from "src/utils/general";
import ReturnPage from "../Button/ReturnPage";
import { GetCWEDetail } from "src/services/general/cwe";
import Summary from "./Summary";
import Relationships from "./Relationships";
import ModesOfIntro from "./ModesOfIntro";
import CommonSequences from "./CommonSequences";
import DemonstrativeExamples from "./DemonstrativeExamples";
import ObservedExamples from "./ObservedExamples";
import PotentialMitigations from "./PotentialMitigations";
import MappingNotes from "./MappingNotes";
import DetectionMethods from "./DetectionMethods";
import TaxonomyMappings from "./TaxonomyMappings";
import Notes from "./Notes";
import RelatedAttackPatterns from "./RelatedAttackPatterns";
import References from "./References";
import ContentHistory from "./ContentHistory";
import ApplicablePlatforms from "./ApplicablePlatforms";
import FunctionalAreas from "./FunctionalAreas";
import AlternateTerms from "./AlternateTerms";
import WeaknessOrdinalities from "./WeaknessOrdinalities";

const CWEDetail = () => {
  const parsed = parseURL();

  const selectedCWE = String(parsed.cwe_id);

  const { data: cweDetail } = GetCWEDetail(selectedCWE);

  return (
    <PageLayout>
      <section className="flex flex-col flex-grow content-start gap-3 p-4 w-full h-full overflow-auto scrollbar">
        <ReturnPage />
        {cweDetail ? (
          Object.keys(cweDetail.data).length > 0 ? (
            <section className="flex flex-col flex-grow content-start gap-5 p-6 text-left text-sm dark:text-white dark:bg-panel black-shadow">
              <Summary selectedCWE={selectedCWE} />
              <Relationships selectedCWE={selectedCWE} />
              <ModesOfIntro selectedCWE={selectedCWE} />
              <AlternateTerms selectedCWE={selectedCWE} />
              <ApplicablePlatforms selectedCWE={selectedCWE} />
              <CommonSequences selectedCWE={selectedCWE} />
              <DemonstrativeExamples selectedCWE={selectedCWE} />
              <ObservedExamples selectedCWE={selectedCWE} />
              <PotentialMitigations selectedCWE={selectedCWE} />
              <WeaknessOrdinalities selectedCWE={selectedCWE} />
              <DetectionMethods selectedCWE={selectedCWE} />
              <FunctionalAreas selectedCWE={selectedCWE} />
              <MappingNotes selectedCWE={selectedCWE} />
              <Notes selectedCWE={selectedCWE} />
              <TaxonomyMappings selectedCWE={selectedCWE} />
              <RelatedAttackPatterns selectedCWE={selectedCWE} />
              <References selectedCWE={selectedCWE} />
              <ContentHistory selectedCWE={selectedCWE} />
            </section>
          ) : (
            <p>No data available</p>
          )
        ) : null}
      </section>
    </PageLayout>
  );
};

export default CWEDetail;
