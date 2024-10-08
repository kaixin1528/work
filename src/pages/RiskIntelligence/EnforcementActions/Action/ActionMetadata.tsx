import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetEnforcementActionsMetadata } from "src/services/risk-intelligence/enforcement-actions";
import { convertToUTCShortString } from "src/utils/general";

const AuditMetadata = ({ actionID }: { actionID: string }) => {
  const { data: metadata } = GetEnforcementActionsMetadata(actionID);

  return (
    <>
      <header className="grid gap-5">
        {metadata && (
          <article className="grid gap-2">
            <header className="grid content-start text-xl border-b-1 border-white">
              <article className="flex items-center justify-between gap-20">
                <h4>{metadata.bank_name}</h4>
                <p>{metadata.enforcement_type_description}</p>
              </article>
              <article className="flex items-center justify-between gap-20">
                <span>
                  <FontAwesomeIcon icon={faUser} /> {metadata.first_name}{" "}
                  {metadata.last_name}
                </span>
              </article>
            </header>
            <article className="flex flex-wrap items-center justify-between gap-20">
              <article className="grid content-start">
                <h4 className="font-extrabold">Amount</h4>
                <span>${metadata.amount}</span>
              </article>
              {metadata.offense_date && (
                <article className="grid content-start">
                  <h4 className="font-extrabold">Start Date</h4>
                  <span>
                    {metadata.offense_date !== -1
                      ? convertToUTCShortString(metadata.offense_date)
                      : "N/A"}
                  </span>
                </article>
              )}
              {metadata.complete_date && (
                <article className="grid content-start">
                  <h4 className="font-extrabold">Complete Date</h4>
                  <span>
                    {metadata.complete_date !== -1
                      ? convertToUTCShortString(metadata.complete_date)
                      : "N/A"}
                  </span>
                </article>
              )}
              {metadata.expiration_date && (
                <article className="grid content-start">
                  <h4 className="font-extrabold">Expiration Date</h4>
                  <span>
                    {metadata.expiration_date !== -1
                      ? convertToUTCShortString(metadata.expiration_date)
                      : "N/A"}
                  </span>
                </article>
              )}
              <article className="grid content-start">
                <h4 className="font-extrabold">City, State</h4>
                <span>
                  {metadata.city_name}, {metadata.state_name}
                </span>
              </article>
              <article className="grid content-start">
                <span className="font-extrabold">Charter</span>
                {metadata.charter_number}
              </article>
              <article className="grid content-start">
                <span className="font-extrabold">Docket #</span>
                {metadata.docket_number}
              </article>
            </article>
          </article>
        )}
      </header>
    </>
  );
};

export default AuditMetadata;
