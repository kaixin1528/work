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
import PdfSidebar from "./PdfSidebar";
import "./style/AreaHighlight.css";
import "./style/Highlight.css";
import Loader from "src/components/Loader/Loader";

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) => null;

const PDF = ({
  url,
  highlights,
  selectedHighlight,
  setSelectedHighlight,
  type,
}: {
  url: string;
  highlights: any;
  selectedHighlight: string;
  setSelectedHighlight: (selectedHighlight: string) => void;
  type: string;
}) => {
  const [query, setQuery] = useState<string>("");
  const pdfHighlighter = useRef<any>(null);

  const filteredHighlights =
    type === "source"
      ? highlights
      : highlights?.find(
          (highlight: KeyStringVal) => highlight.id === selectedHighlight
        )?.bbox || [];

  const scrollToHighlightFromHash = () => {
    const highlight = filteredHighlights?.find(
      (highlight: KeyStringVal) => highlight.id === selectedHighlight
    );

    if (highlight) {
      pdfHighlighter?.current?.scrollTo(highlight);
    }
  };

  useEffect(() => {
    scrollToHighlightFromHash();
  }, [selectedHighlight]);

  return (
    <section className="flex flex-row content-start gap-5 p-4 w-full h-full overflow-auto scrollbar">
      <PdfSidebar
        highlights={highlights}
        query={query}
        setQuery={setQuery}
        selectedHighlight={selectedHighlight}
        setSelectedHighlight={setSelectedHighlight}
        type={type}
      />
      <section
        style={{
          height: "120vh",
          width: "100%",
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
    </section>
  );
};

export default PDF;
