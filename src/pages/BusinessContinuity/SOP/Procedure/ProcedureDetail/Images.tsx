import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ViewInFile from "src/pages/RegulationPolicy/Document/ViewInFile/ViewInFile";
import { GetGRCImages } from "src/services/grc";
import { KeyStringVal } from "src/types/general";

const Images = ({ versionID }: { versionID: string }) => {
  const { data: images } = GetGRCImages(versionID);
  return (
    <>
      {images ? (
        images.length > 0 ? (
          <ul className="flex flex-col flex-grow gap-5">
            {images?.map((image: KeyStringVal) => (
              <li
                key={image.image_id}
                className="grid gap-3 p-4 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-md"
              >
                <article className="flex items-center justify-between gap-5">
                  <button
                    className=""
                    onClick={() => {
                      let a = document.createElement("a");
                      a.href = image.image_signed_uri;
                      a.target = "_blank";
                      a.click();
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faDownload}
                      className="dark:text-black"
                    />{" "}
                    Download as File
                  </button>
                  <article className="flex items-center gap-5">
                    <ViewInFile
                      generatedID={image.image_id}
                      section={image}
                      bbox={image.page_metadata}
                    />
                    <span className="w-max border-t-1 dark:border-yellow-500">
                      Page {image.page_num}
                    </span>
                  </article>
                </article>
                <img src={image.image_signed_uri} alt="preview" />
                {image.image_description && (
                  <article className="grid gap-2 p-3 dark:bg-black rounded-md">
                    <h4 className="font-medium underlined-label">
                      Uno's Analysis
                    </h4>
                    <article className="grid gap-3">
                      {image.image_description
                        .split("\n\n")
                        .map((phrase, index) => {
                          return (
                            <p key={index} className="grid gap-1">
                              {phrase.split("\n").map((word, wordIndex) => (
                                <span key={wordIndex}>{word}</span>
                              ))}
                            </p>
                          );
                        })}
                    </article>
                  </article>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No images found</p>
        )
      ) : null}
    </>
  );
};

export default Images;
