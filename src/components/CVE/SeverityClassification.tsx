import React from "react";
import ScoreKeyPair from "src/components/CVE/ScoreKeyPair";
import SeverityKeyPair from "src/components/CVE/SeverityKeyPair";
import CVSSVector from "./CVSSVector";
import { GetCVEDetail } from "src/services/general/cve";

const SeverityClassification = ({ selectedCVE }: { selectedCVE: string }) => {
  const { data: cveDetail } = GetCVEDetail(selectedCVE);

  const cvss3 = cveDetail?.data?.cve_metrics_cvss_metric_v31;
  const cvss2 = cveDetail?.data?.cve_metrics_cvss_metric_v2;

  return (
    <section className="grid gap-3">
      <h4 className="py-2 text-base full-underlined-label">
        Severity Classifications & Scores
      </h4>
      <section className="grid gap-10">
        {[cvss3, cvss2].map((cvss, index: number) => {
          if (cvss?.length === 0) return null;
          return (
            <section key={index} className="grid gap-5 w-full">
              <h4 className="text-base">
                CVSS Version {cvss[0].cvssdata_version}
              </h4>
              <CVSSVector
                cvssVector={cvss[0].cvssdata_vector_string
                  .replace("CVSS:3.1/", "")
                  .replace("CVSS:2.0/", "")
                  .split("/")}
              />
              <section className="flex flex-wrap items-center gap-x-10 gap-y-5 w-full">
                <ScoreKeyPair
                  label="Base Score"
                  value={cvss[0].cvssdata_base_score}
                />
                <ScoreKeyPair
                  label="Exploitability Score"
                  value={cvss[0].exploitability_score}
                />
                <SeverityKeyPair
                  label="Base Severity"
                  value={
                    cvss[0].cvssdata_base_severity || cvss[0].base_severity
                  }
                />
                <SeverityKeyPair
                  label="Confidentiality Impact"
                  value={cvss[0].cvssdata_confidentiality_impact}
                />
                <SeverityKeyPair
                  label="Integrity Impact"
                  value={cvss[0].cvssdata_integrity_impact}
                />
                <SeverityKeyPair
                  label="Availability Impact"
                  value={cvss[0].cvssdata_availability_impact}
                />
                <SeverityKeyPair
                  label={`${index === 0 ? "Attack" : "Access"} Complexity`}
                  value={
                    cvss[0].cvssdata_attack_complexity ||
                    cvss[0].cvssdata_access_complexity
                  }
                />
              </section>
            </section>
          );
        })}
      </section>
    </section>
  );
};

export default SeverityClassification;
