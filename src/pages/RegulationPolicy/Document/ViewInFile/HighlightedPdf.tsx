/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from "react";

import {
  PdfLoader,
  PdfHighlighter,
  Popup,
  AreaHighlight,
  Highlight,
} from "react-pdf-highlighter";
import type { ScaledPosition } from "react-pdf-highlighter";
import "./style/AreaHighlight.css";
import "./style/Highlight.css";
import Loader from "src/components/Loader/Loader";

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) => null;

const HighlightedPdf = ({
  url,
  generatedID,
  highlights,
  setHighlights,
  editSections,
  setEditSections,
  documentModified,
  setDocumentModified,
  documentType,
  scrollAtTop,
}: {
  url: string;
  generatedID: string;
  highlights: any[];
  setHighlights: (highlights: any[]) => void;
  editSections?: any;
  setEditSections?: any;
  documentModified?: string[];
  setDocumentModified?: (documentModified: string[]) => void;
  documentType?: string;
  scrollAtTop?: boolean;
}) => {
  const pdfHighlighter = useRef<any>(null);

  const scrollToHighlightFromHash = () => {
    if (highlights?.length > 0) {
      pdfHighlighter?.current?.scrollTo(highlights[0]);
    }
  };

  return (
    <section
      className={`flex flex-col flex-grow ${
        scrollAtTop ? "flex-col-reverse" : ""
      } gap-5 p-3 w-full h-full overflow-auto scrollbar`}
    >
      <section
        style={{
          height: "30rem",
          width: "100%",
          position: "relative",
        }}
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
              onSelectionFinished={function (
                position: ScaledPosition,
                content: {
                  text?: string | undefined;
                  image?: string | undefined;
                },
                hideTipAndSelection: () => void,
                transformSelection: () => void
              ): any {
                const highlight = {
                  bucket_url: url,
                  content: content,
                  pageNumber: position.pageNumber,
                  position: position,
                };
                if (documentType === "policies") {
                  if (
                    documentModified &&
                    setDocumentModified &&
                    !documentModified.includes(generatedID)
                  )
                    setDocumentModified([...documentModified, generatedID]);
                  setHighlights([...highlights, highlight]);
                  setEditSections({
                    ...editSections,
                    [generatedID]: {
                      ...editSections[generatedID],
                      page_metadata: [
                        ...(editSections[generatedID]?.page_metadata || []),
                        highlight,
                      ],
                    },
                  });
                }
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
                    isScrolledTo={true}
                    position={highlight.position}
                    comment={highlight.comment}
                  />
                ) : (
                  <AreaHighlight
                    isScrolledTo={true}
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
              highlights={highlights}
            />
          )}
        </PdfLoader>
      </section>
      <button
        className="px-4 py-1 mx-auto dark:bg-yellow-500/10 dark:hover:bg-yellow-500/30 duration-100 border dark:border-yellow-500 rounded-md"
        onClick={() => {
          if (highlights?.length > 0) {
            pdfHighlighter?.current?.scrollTo(highlights[0]);
          }
        }}
      >
        Scroll to content
      </button>
    </section>
  );
};

export default HighlightedPdf;
