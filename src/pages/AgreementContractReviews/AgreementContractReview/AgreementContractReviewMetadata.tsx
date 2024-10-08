import { GetAgreementContractReviewMetadata } from "src/services/agreement-contract-review";
import { convertToUTCShortString } from "src/utils/general";

const AgreementContractReviewMetadata = ({
  agreementID,
}: {
  agreementID: string;
}) => {
  const { data: metadata } = GetAgreementContractReviewMetadata(agreementID);

  return (
    <>
      {metadata && (
        <header className="grid content-start">
          <header className="flex flex-wrap items-start justify-between gap-x-20 gap-y-5 break-words cursor-pointer text-left text-base dark:text-white">
            <h4 className="w-3/5 text-xl font-medium">
              {metadata.agreement_name}
            </h4>
            <p className="flex items-center gap-2">
              <span className="px-3 py-1 bg-signin rounded-md">
                {metadata.counts}
              </span>{" "}
              items to review |{" "}
              {convertToUTCShortString(Number(metadata.agreement_date))}
            </p>
          </header>
          {metadata.tags?.length > 0 && (
            <article className="flex flex-wrap items-center gap-2">
              <span>Tags</span>
              {metadata.tags.map((tag: string, index: number) => {
                return (
                  <span key={index} className="px-4 dark:bg-org rounded-full">
                    {tag}
                  </span>
                );
              })}
            </article>
          )}
        </header>
      )}
    </>
  );
};

export default AgreementContractReviewMetadata;
