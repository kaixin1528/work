/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";

import {
  PdfLoader,
  PdfHighlighter,
  Popup,
  AreaHighlight,
  Highlight,
} from "react-pdf-highlighter";
import type { ScaledPosition } from "react-pdf-highlighter";
import { KeyStringVal } from "src/types/general";
import "./style/AreaHighlight.css";
import "./style/Highlight.css";
import Loader from "src/components/Loader/Loader";
import AgreementSidePanel from "./PrivacySidePanel";
import { GetPdfPreview } from "src/services/regulation-policy/circular";
import { GetPrivacyReviewMappings } from "src/services/third-party-risk/privacy-review";

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) => null;

const PrivacyReview = ({ auditID }: { auditID: string }) => {
  const [selectedHighlight, setSelectedHighlight] = useState("");

  const pdfHighlighter = useRef<any>(null);

  const documentType = "third_party_review";

  const { data: pdfPreview } = GetPdfPreview(auditID, "", documentType);
  const { data: mappings } = GetPrivacyReviewMappings(auditID);

  const url = pdfPreview?.bucket_url;
  const highlights = mappings?.data?.reduce(
    (pCat: string[], cCat: any) => [
      ...pCat,
      ...cCat.sub_categories.reduce(
        (pSub: any, cSub: any) => [
          ...pSub,
          ...cSub.questions.reduce(
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
      ),
    ],
    []
  ) as any[];
  const filteredHighlights =
    highlights?.find(
      (highlight: KeyStringVal) => highlight.id === selectedHighlight
    )?.position || [];

  const scrollToHighlightFromHash = () => {
    const highlight = filteredHighlights?.length > 0 && filteredHighlights[0];

    if (highlight) {
      pdfHighlighter?.current?.scrollTo(highlight);
    }
  };

  useEffect(() => {
    scrollToHighlightFromHash();
  }, [selectedHighlight]);

  return (
    <section className="flex content-start gap-5 w-full h-full overflow-auto scrollbar">
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
                const isTextHighlight = !Boolean(highlight.content?.image);

                const component = isTextHighlight ? (
                  <Highlight
                    isScrolledTo={highlight.id === selectedHighlight}
                    position={highlight.position}
                    comment={highlight.comment}
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
              onSelectionFinished={function (
                position: ScaledPosition,
                content: {
                  text?: string | undefined;
                  image?: string | undefined;
                },
                hideTipAndSelection: () => void,
                transformSelection: () => void
              ): any {}}
            />
          )}
        </PdfLoader>
      </section>
      <AgreementSidePanel
        data={mappings?.data}
        selectedHighlight={selectedHighlight}
        setSelectedHighlight={setSelectedHighlight}
      />
    </section>
  );
};

export default PrivacyReview;
