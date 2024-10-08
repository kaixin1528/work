/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";

import {
  PdfLoader,
  PdfHighlighter,
  Popup,
  AreaHighlight,
} from "react-pdf-highlighter";
import { KeyStringVal } from "src/types/general";
import "./style/AreaHighlight.css";
import "./style/StrikeThrough.css";
import Loader from "src/components/Loader/Loader";
import AgreementSidePanel from "./AgreementSidePanel";
import { GetAgreement } from "src/services/agreement-contract-review";
import {
  DeleteRedlining,
  GetDocumentStatus,
  GetRedliningList,
} from "src/services/grc";
import { GetPdfPreview } from "src/services/regulation-policy/circular";
import Tip from "./Tip";
import RedliningList from "./RedliningList";
import { StrikeThrough } from "./StrikeThrough";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const AgreementReview = ({ agreementID }: { agreementID: string }) => {
  const [selectedHighlight, setSelectedHighlight] = useState("");

  const pdfHighlighter = useRef<any>(null);

  const documentType = "contractual_agreements";

  const { data: documentStatus } = GetDocumentStatus(documentType, agreementID);
  const { data: pdfPreview } = GetPdfPreview(agreementID, "", documentType);
  const { data: agreement } = GetAgreement(agreementID);
  const { data: redliningList } = GetRedliningList(agreementID);

  const url = pdfPreview?.bucket_url;
  const highlights = agreement?.data?.reduce(
    (pCat: string[], cCat: any) => [
      ...pCat,
      ...cCat.sub_categories.reduce(
        (pQ: any, cQ: any) => [
          ...pQ,
          ...cQ.sources.reduce(
            (pSource: any, cSource: any) => [...pSource, cSource],
            []
          ),
        ],
        []
      ),
    ],
    []
  ) as any[];
  const filteredHighlights = [
    ...(highlights?.find(
      (highlight: KeyStringVal) => highlight.id === selectedHighlight
    )?.position || []),
    ...(redliningList || []),
  ];

  const scrollToHighlightFromHash = () => {
    const highlight =
      filteredHighlights?.length > 0 &&
      filteredHighlights.find(
        (highlight) => highlight.id === selectedHighlight
      );

    if (highlight) {
      pdfHighlighter?.current?.scrollTo(highlight);
    }
  };

  useEffect(() => {
    scrollToHighlightFromHash();
  }, [selectedHighlight]);

  const HighlightPopup = ({
    id,
    new_edits,
  }: {
    id: string;
    new_edits: string;
  }) => {
    const deleteRedlining = DeleteRedlining(agreementID);

    return (
      <>
        <p className="px-4 py-1 text-xs bg-no">{new_edits}</p>
        <button
          className="justify-self-end px-3 py-1 bg-reset hover:bg-reset/60 duration-100 rounded-full"
          onClick={() =>
            deleteRedlining.mutate({
              redliningID: id,
            })
          }
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </>
    );
  };

  return (
    <>
      {documentStatus?.status === "failed" ? (
        <section className="grid place-content-center gap-10 w-full h-full text-center">
          <img src="/errors/503.svg" alt="error" className="mx-auto h-72" />
          <h4>
            Oops! something went wrong! We will reach out to you shortly to help
            resolve the issue. Thanks for your patience.
          </h4>
        </section>
      ) : documentStatus?.status === "parsing" ? (
        <article className="flex items-center place-content-center gap-5">
          <img
            src={`/grc/frameworks-placeholder.svg`}
            alt="placeholder"
            className="w-40 h-40"
          />
          <article className="grid gap-3">
            <h4>
              Your document has been received and is currently being processed
            </h4>
            <img
              src="/grc/data-parsing.svg"
              alt="data parsing"
              className="w-10 h-10"
            />
          </article>
        </article>
      ) : (
        <section className="flex content-start gap-5 p-4 w-full h-full">
          <section className="flex flex-row content-start gap-5 w-full h-full overflow-auto scrollbar">
            <RedliningList
              agreementID={agreementID}
              highlights={redliningList}
              selectedHighlight={selectedHighlight}
              setSelectedHighlight={setSelectedHighlight}
            />
            <section
              style={{
                width: "150vw",
                position: "relative",
              }}
              className="w-full h-full dark:bg-card overflow-auto scrollbar"
            >
              <PdfLoader url={url} beforeLoad={<Loader />}>
                {(pdfDocument) => (
                  <PdfHighlighter
                    pdfDocument={pdfDocument}
                    enableAreaSelection={(event) => event.altKey}
                    onScrollChange={() => {}}
                    ref={pdfHighlighter}
                    scrollRef={(scrollTo) => {
                      scrollToHighlightFromHash();
                    }}
                    highlightTransform={(
                      highlight,
                      index,
                      setTip,
                      hideTip,
                      viewportToScaled,
                      screenshot,
                      isScrolledTo
                    ) => {
                      const isRedlining = highlight.new_edits;

                      const component = isRedlining ? (
                        <StrikeThrough
                          isScrolledTo={highlight.id === selectedHighlight}
                          position={highlight.position}
                          comment={highlight.new_edits}
                        />
                      ) : (
                        <AreaHighlight
                          isScrolledTo={highlight.id === selectedHighlight}
                          highlight={highlight}
                          onChange={(boundingRect) => {}}
                        />
                      );

                      return (
                        <Popup
                          popupContent={<HighlightPopup {...highlight} />}
                          onMouseOver={(popupContent) =>
                            setTip(highlight, (highlight) => popupContent)
                          }
                          onMouseOut={hideTip}
                          key={index}
                          children={component}
                        />
                      );
                    }}
                    highlights={filteredHighlights}
                    onSelectionFinished={(
                      position,
                      content,
                      hideTipAndSelection,
                      transformSelection
                    ) => (
                      <Tip
                        documentID={agreementID}
                        content={content}
                        position={position}
                        onOpen={transformSelection}
                        onConfirm={(comment: any) => {
                          hideTipAndSelection();
                        }}
                      />
                    )}
                  />
                )}
              </PdfLoader>
            </section>
          </section>
          <AgreementSidePanel
            agreementID={agreementID}
            data={agreement?.data}
            selectedHighlight={selectedHighlight}
            setSelectedHighlight={setSelectedHighlight}
          />
        </section>
      )}
    </>
  );
};

export default AgreementReview;
