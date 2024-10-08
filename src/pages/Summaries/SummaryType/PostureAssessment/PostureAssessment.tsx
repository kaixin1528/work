/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListLayout from "src/layouts/ListLayout";
import { ListHeader } from "src/types/general";
import { convertToUTCString, sortRows } from "src/utils/general";
import { parseURL } from "src/utils/general";
import SummaryLayout from "../../../../layouts/SummaryLayout";
import ServiceDetails from "./ServiceDetails";
import queryString from "query-string";
import { attributeColors, initialSort } from "src/constants/general";
import KeyValuePair from "src/components/General/KeyValuePair";
import Accounts from "../../Accounts";
import { KeyStringVal } from "src/types/general";
import { GetPostureAssessmentSummary } from "src/services/summaries/posture-assessment";
import { useSummaryStore } from "src/stores/summaries";

const PostureAssessment = () => {
  const navigate = useNavigate();
  const parsed = parseURL();

  const { selectedReportAccount } = useSummaryStore();

  const [sort, setSort] = useState(initialSort);

  const integrationType = selectedReportAccount?.integration_type || "";
  const sourceAccountID = selectedReportAccount?.customer_cloud_id || "";

  const { data: postureAssessmentSummary } = GetPostureAssessmentSummary(
    integrationType,
    sourceAccountID
  );

  const sortedServices =
    postureAssessmentSummary && sortRows(postureAssessmentSummary.data, sort);

  return (
    <SummaryLayout name="Posture Assessment" hidePeriod>
      {!parsed.service_name ? (
        <section className="flex flex-col flex-grow gap-5 w-full h-full overflow-auto">
          <Accounts />
          {postureAssessmentSummary ? (
            postureAssessmentSummary.data.length > 0 ? (
              <section className="flex flex-col flex-grow gap-5 p-4 dark:bg-card black-shadow overflow-auto scrollbar">
                <article className="justify-self-end text-sm">
                  <KeyValuePair
                    label="Assessment run at"
                    value={convertToUTCString(
                      postureAssessmentSummary.data[0].run_time_musecs
                    )}
                  />
                </article>
                <ListLayout
                  listHeader={postureAssessmentSummary.metadata.headers}
                  height="max-h-[70rem]"
                  setSort={setSort}
                >
                  {sortedServices?.map(
                    (service: KeyStringVal, index: number) => {
                      return (
                        <tr
                          key={index}
                          className="px-4 py-2 text-sm cursor-pointer dark:even:bg-card dark:hover:bg-signin/30"
                          onClick={() =>
                            navigate(
                              `/summaries/details?${queryString.stringify(
                                parsed
                              )}&service_name=${service.service_name}`
                            )
                          }
                        >
                          {postureAssessmentSummary.metadata.headers.map(
                            (col: ListHeader) => {
                              return (
                                <td
                                  key={col.property_name}
                                  className="py-2 px-3"
                                >
                                  <p
                                    className={`break-all ${
                                      attributeColors[
                                        service[col.property_name]
                                      ]
                                    }`}
                                  >
                                    {col.property_name === "service_name"
                                      ? service.service_display_name ||
                                        service.service_name
                                      : service[col.property_name] || 0}
                                  </p>
                                </td>
                              );
                            }
                          )}
                        </tr>
                      );
                    }
                  )}
                </ListLayout>
              </section>
            ) : (
              <p>No data available</p>
            )
          ) : null}
        </section>
      ) : (
        <ServiceDetails
          integrationType={integrationType}
          sourceAccountID={sourceAccountID}
          service={String(parsed.service_name)}
        />
      )}
    </SummaryLayout>
  );
};

export default PostureAssessment;
