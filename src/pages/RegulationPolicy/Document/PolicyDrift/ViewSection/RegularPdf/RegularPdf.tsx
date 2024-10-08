/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from "react";

import {
  PdfLoader,
  PdfHighlighter,
  Popup,
  AreaHighlight,
} from "react-pdf-highlighter";
import type { ScaledPosition } from "react-pdf-highlighter";
import "./style/RegularHighlight.css";
import Loader from "src/components/Loader/Loader";
import RegularHighlight from "./RegularHighlight";

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) => null;

const RegularPdf = ({
  url,
  highlights,
}: {
  url: string;
  highlights: any[];
}) => {
  const pdfHighlighter = useRef<any>(null);

  const scrollToHighlightFromHash = () => {
    if (highlights?.length > 0) {
      pdfHighlighter?.current?.scrollTo(highlights[0]);
    }
  };

  return (
    <section
      style={{
        height: "70vh",
        width: "25vw",
        position: "relative",
      }}
      className="w-full h-full dark:bg-card"
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
            ): any {}}
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
                <RegularHighlight
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
  );
};

export default RegularPdf;
