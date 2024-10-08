/* eslint-disable no-restricted-globals */
import { faXmark, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  GetDocumentTags,
  AddDocumentTag,
  RemoveDocumentTag,
} from "src/services/grc";
import { KeyStringVal } from "src/types/general";

const DocumentTags = ({
  documentType,
  documentID,
}: {
  documentType: string;
  documentID: string;
}) => {
  const { data: allTags } = GetDocumentTags(documentType);
  const { data: documentTags } = GetDocumentTags(documentType, "", documentID);
  const addDocumentTag = AddDocumentTag(documentType);
  const deleteDocumentTag = RemoveDocumentTag(documentType);

  return (
    <section className="flex flex-wrap items-center gap-3 text-xs">
      {documentTags?.length > 0 && (
        <ul className="flex flex-wrap items-center gap-3">
          {documentTags.map((tag: KeyStringVal) => {
            return (
              <li
                key={tag.tag_id}
                className="flex items-center gap-3 pl-4 pr-1 py-1 dark:bg-org rounded-full"
              >
                <p>{tag.tag_title}</p>

                {/* remove tag */}
                <button
                  onClick={() =>
                    deleteDocumentTag.mutate({
                      documentID: documentID,
                      tags: [tag.tag_id],
                    })
                  }
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="w-4 h-4 dark:text-org dark:hover:bg-checkbox/60 dark:bg-checkbox duration-100 rounded-full"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Menu as="article" className="relative inline-block text-left">
        <Menu.Button className="flex items-center gap-2 group dark:text-checkbox">
          <FontAwesomeIcon icon={faTag} />
          <h4>Add Tag</h4>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-2 grid w-max -mr-5 mt-2 gap-2 origin-top-right focus:outline-none text-sm dark:text-white dark:bg-account z-50 rounded-sm">
            {allTags?.length > 0 ? (
              <nav className="grid content-start w-full max-h-60 z-50 overflow-auto scrollbar">
                {allTags?.map((tag: KeyStringVal) => {
                  return (
                    <button
                      key={tag.tag_id}
                      className="flex items-center gap-3 px-4 pr-10 py-2 w-full text-left dark:bg-account dark:hover:bg-mention duration-100"
                      onClick={() =>
                        addDocumentTag.mutate({
                          documentID: documentID,
                          tags: [tag.tag_id],
                        })
                      }
                    >
                      <FontAwesomeIcon
                        icon={faTag}
                        className="dark:text-checkbox"
                      />
                      <p className="grid text-xs">{tag.tag_title}</p>
                    </button>
                  );
                })}
              </nav>
            ) : (
              <section className="grid gap-2 px-5 py-3 w-max origin-top-right focus:outline-none text-xs dark:text-white dark:bg-account z-50 rounded-sm">
                <h4>No new tags</h4>
              </section>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </section>
  );
};

export default DocumentTags;
