import React from "react";
import { GetGRCDocumentMetadata } from "src/services/grc";

const RegionsVerticals = ({
  documentType,
  documentID,
}: {
  documentType: string;
  documentID: string;
}) => {
  const { data: documentMetadata } = GetGRCDocumentMetadata(
    documentType,
    documentID
  );

  return (
    <>
      {documentMetadata && (
        <section className="grid gap-3 text-sm">
          {documentMetadata.regions?.length > 0 && (
            <article className="flex flex-wrap items-center gap-2">
              <span>Regions</span>
              {documentMetadata.regions.map((tag: string, index: number) => {
                return (
                  <span key={index} className="px-4 dark:bg-org rounded-full">
                    {tag}
                  </span>
                );
              })}
            </article>
          )}
          {documentMetadata.verticals?.length > 0 && (
            <article className="flex flex-wrap items-center gap-2">
              <span>Verticals</span>
              {documentMetadata.verticals.map((tag: string, index: number) => {
                return (
                  <span key={index} className="px-4 dark:bg-org rounded-full">
                    {tag}
                  </span>
                );
              })}
            </article>
          )}
          {documentMetadata.scanners?.length > 0 && (
            <article className="flex flex-wrap items-center gap-2">
              <span>Scanners</span>
              {documentMetadata.scanners.map(
                (scanner: string, index: number) => {
                  return (
                    <span key={index} className="px-4 dark:bg-org rounded-full">
                      {scanner}
                    </span>
                  );
                }
              )}
            </article>
          )}
        </section>
      )}
    </>
  );
};

export default RegionsVerticals;
