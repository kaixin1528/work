/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import TablePagination from "src/components/General/TablePagination";
import { pageSize } from "src/constants/general";
import Loader from "src/components/Loader/Loader";
import UploadVendorResponses from "./UploadVendorResponses";
import { GetVendorResponses } from "src/services/third-party-risk/vendors-and-partners/vendors";
import Response from "./Response";
import NewVendorResponse from "./NewVendorResponse";
import ResponseMappings from "./ResponseMappings";

const VendorResponseList = ({ vendorID }: { vendorID: string }) => {
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data: vendorResponses, status: vendorResponseStatus } =
    GetVendorResponses(vendorID, pageNumber);

  const totalCount = vendorResponses?.pager.total_results || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="flex flex-col flex-grow gap-5">
      {vendorResponses?.data.length > 0 && (
        <>
          <UploadVendorResponses vendorID={vendorID} />
          <NewVendorResponse vendorID={vendorID} />
        </>
      )}
      <ResponseMappings vendorID={vendorID} />
      {vendorResponseStatus === "loading" ? (
        <Loader />
      ) : vendorResponses?.data.length > 0 ? (
        <section className="flex flex-col flex-grow gap-5">
          <TablePagination
            totalPages={totalPages}
            beginning={beginning}
            end={end}
            totalCount={totalCount}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
          <ul className="flex flex-col flex-grow gap-5">
            {vendorResponses?.data.map((vendorResponse: any, index: number) => {
              return (
                <Response
                  key={index}
                  vendorID={vendorID}
                  questionIndex={index}
                  question={vendorResponse}
                />
              );
            })}
          </ul>
        </section>
      ) : (
        <section className="flex items-center place-content-center gap-10 w-full h-full">
          <img
            src="/grc/frameworks-placeholder.svg"
            alt="frameworks placeholder"
            className="w-40 h-40"
          />
          <article className="grid gap-3">
            <h4 className="text-xl font-extrabold">Vendor Responses</h4>
            <h4>No vendor responses available</h4>
            <UploadVendorResponses vendorID={vendorID} />
          </article>
        </section>
      )}
    </section>
  );
};

export default VendorResponseList;
