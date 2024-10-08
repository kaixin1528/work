/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import AddedPdf from "./AddedPdf/AddedPdf";
import RemovedPdf from "./RemovedPdf/RemovedPdf";
import RegularPdf from "./RegularPdf/RegularPdf";

const ViewInFile = ({
  viewSectionPdf,
  setViewInFilePdf,
  sourceBbox,
  targetBbox,
  isEqual,
}: {
  viewSectionPdf: string;
  setViewInFilePdf: (viewSectionPdf: string) => void;
  sourceBbox: any;
  targetBbox: any;
  isEqual: boolean;
}) => {
  const [sourceHighlights, setSourceHighlights] = useState<any[]>([]);
  const [targetHighlights, setTargetHighlights] = useState<any[]>([]);

  const sourceURL = sourceBbox[0]?.bucket_url;
  const targetURL = targetBbox[0]?.bucket_url;

  const handleOnClose = () => {
    setViewInFilePdf("");
    sessionStorage.removeItem("search_id");
  };

  useEffect(() => {
    if (sessionStorage.search_id) setViewInFilePdf(sessionStorage.search_id);
  }, [sessionStorage]);

  useEffect(() => {
    setSourceHighlights(sourceBbox);
    setTargetHighlights(targetBbox);
  }, [viewSectionPdf, sourceBbox, targetBbox]);

  return (
    <>
      <ModalLayout showModal={true} onClose={handleOnClose}>
        {sourceURL || targetURL ? (
          <section className="grid md:grid-cols-2 gap-10 mt-5">
            {isEqual ? (
              <>
                <RegularPdf url={sourceURL} highlights={sourceHighlights} />
                <RegularPdf url={targetURL} highlights={targetHighlights} />
              </>
            ) : (
              <>
                <RemovedPdf url={sourceURL} highlights={sourceHighlights} />
                <AddedPdf url={targetURL} highlights={targetHighlights} />
              </>
            )}
          </section>
        ) : (
          <p>Document not available</p>
        )}
      </ModalLayout>
    </>
  );
};

export default ViewInFile;
