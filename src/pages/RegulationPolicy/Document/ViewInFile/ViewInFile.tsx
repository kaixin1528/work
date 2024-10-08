/* eslint-disable react-hooks/exhaustive-deps */
import { faEye, faEyeSlash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import HighlightedPdf from "./HighlightedPdf";
import { Disclosure, Transition } from "@headlessui/react";

const ViewInFile = ({
  generatedID,
  section,
  bbox,
  editSections,
  setEditSections,
  documentModified,
  setDocumentModified,
  documentType,
  isNotModal,
  opened,
  setOpened,
  scrollAtTop,
}: {
  generatedID: string;
  section: any;
  bbox: any;
  editSections?: any;
  setEditSections?: any;
  documentModified?: string[];
  setDocumentModified?: (documentModified: string[]) => void;
  documentType?: string;
  isNotModal?: boolean;
  opened?: boolean;
  setOpened?: (opened: boolean) => void;
  scrollAtTop?: boolean;
}) => {
  const [viewSectionPdf, setViewInFilePdf] = useState<string>("");
  const [highlights, setHighlights] = useState<any[]>([]);

  const userGenerated = section.metadata?.user_generated === true;

  const handleOnClose = () => {
    setViewInFilePdf("");
    sessionStorage.removeItem("search_id");
  };

  useEffect(() => {
    if (sessionStorage.search_id)
      setViewInFilePdf(String(sessionStorage.search_id));
  }, [sessionStorage]);

  useEffect(() => {
    setHighlights(bbox);
  }, [bbox]);

  return (
    <>
      {isNotModal ? (
        <Disclosure>
          {({ open }) => {
            return (
              <section className="text-sm">
                <Disclosure.Button
                  className="flex items-center place-content-end gap-2 w-full"
                  onClick={() => {
                    if (opened != null && setOpened) setOpened(!opened);
                  }}
                >
                  <FontAwesomeIcon
                    icon={userGenerated ? faUser : opened ? faEyeSlash : faEye}
                    className="dark:text-black"
                  />
                  <h4>
                    {userGenerated
                      ? `Added by ${section.metadata.user_email}`
                      : "View in file"}{" "}
                  </h4>
                </Disclosure.Button>
                <Transition
                  show={opened}
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="grid gap-2 p-3 w-full break-words dark:bg-black/60 rounded-md">
                    {bbox?.length > 0 ? (
                      <HighlightedPdf
                        url={bbox[0].bucket_url}
                        generatedID={generatedID}
                        highlights={highlights}
                        setHighlights={setHighlights}
                        editSections={editSections}
                        setEditSections={setEditSections}
                        documentModified={documentModified}
                        setDocumentModified={setDocumentModified}
                        documentType={documentType}
                        scrollAtTop={scrollAtTop}
                      />
                    ) : (
                      <p>Document not available</p>
                    )}
                  </Disclosure.Panel>
                </Transition>
              </section>
            );
          }}
        </Disclosure>
      ) : (
        <>
          <button
            disabled={userGenerated}
            className="flex items-center gap-2"
            onClick={() => setViewInFilePdf(generatedID)}
          >
            <FontAwesomeIcon
              icon={userGenerated ? faUser : faEye}
              className="dark:text-black"
            />
            <h4 className="w-max">
              {userGenerated
                ? `Added by ${section.metadata.user_email}`
                : "View in file"}{" "}
            </h4>
          </button>
          <ModalLayout
            showModal={viewSectionPdf === generatedID}
            onClose={handleOnClose}
          >
            {bbox?.length > 0 ? (
              <HighlightedPdf
                url={bbox[0].bucket_url}
                generatedID={generatedID}
                highlights={highlights}
                setHighlights={setHighlights}
                editSections={editSections}
                setEditSections={setEditSections}
                documentModified={documentModified}
                setDocumentModified={setDocumentModified}
                documentType={documentType}
                scrollAtTop={scrollAtTop}
              />
            ) : (
              <p>Document not available</p>
            )}
          </ModalLayout>
        </>
      )}
    </>
  );
};

export default ViewInFile;
