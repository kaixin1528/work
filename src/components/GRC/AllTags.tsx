import { faXmark, faTag, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import {
  GetDocumentTags,
  CreateDocumentTag,
  DeleteDocumentTag,
} from "src/services/grc";
import { KeyStringVal } from "src/types/general";

const AllTags = ({
  documentType,
  selectedTags,
  setSelectedTags,
  selectedRegAuth,
}: {
  documentType: string;
  selectedTags: string[];
  setSelectedTags: (selectedTags: string[]) => void;
  selectedRegAuth?: string;
}) => {
  const [addTag, setAddTag] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<string>("");

  const { data: documentTags } = GetDocumentTags(documentType, selectedRegAuth);
  const createDocumentTag = CreateDocumentTag(documentType);
  const deleteDocumentTag = DeleteDocumentTag(documentType);

  return (
    <ul className="flex flex-wrap items-center gap-3">
      {documentTags?.map((tag: KeyStringVal) => {
        return (
          <li
            key={tag.tag_id}
            className={`flex items-center gap-3 pl-4 pr-2 py-1 cursor-pointer dark:text-white ${
              selectedTags.includes(tag.tag_id)
                ? "dark:bg-signin/80"
                : "dark:bg-org dark:hover:bg-org/60 duration-100"
            } rounded-full`}
            onClick={() => {
              if (selectedTags.includes(tag.tag_id))
                setSelectedTags(
                  selectedTags.filter((tagID) => tag.tag_id !== tagID)
                );
              else setSelectedTags([...selectedTags, tag.tag_id]);
            }}
          >
            <p>{tag.tag_title}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTags(
                  selectedTags.filter((tagID) => tagID !== tag.tag_id)
                );
                deleteDocumentTag.mutate({
                  tagID: tag.tag_id,
                });
              }}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="w-4 h-4 dark:text-org dark:hover:bg-checkbox/60 dark:bg-checkbox duration-100 rounded-full"
              />
            </button>
          </li>
        );
      })}
      {!addTag ? (
        <button
          className="flex items-center gap-2 dark:text-checkbox dark:hover:text-checkbox/60 duration-100"
          onClick={() => {
            setAddTag(true);
            setNewTag("");
          }}
        >
          <FontAwesomeIcon icon={faTag} />
          <h4>Add Tag</h4>
        </button>
      ) : (
        <article className="flex items-stretch w-max divide-x dark:divide-account border-1 dark:border-org rounded-sm">
          <article className="relative flex items-center gap-2 py-2 px-4 ring-0 dark:ring-search focus:ring-2 dark:focus:ring-signin dark:bg-account rounded-sm">
            <FontAwesomeIcon
              icon={faTag}
              className="w-4 h-4 dark:text-checkbox"
            />
            <input
              spellCheck="false"
              autoComplete="off"
              name="new tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              type="input"
              className="py-1 w-20 h-3 focus:outline-none dark:placeholder:text-checkbox dark:text-white dark:bg-transparent dark:bg-account dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent"
            />
          </article>
          <button
            disabled={newTag === ""}
            className="px-2 dark:disabled:text-filter dark:hover:bg-checkbox dark:disabled:bg-org/20 dark:bg-org duration-100"
            onClick={() => {
              setAddTag(false);
              setNewTag("");
              createDocumentTag.mutate({
                title: newTag,
              });
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button
            className="px-2 dark:text-account dark:hover:bg-checkbox dark:bg-org duration-100"
            onClick={() => setAddTag(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </article>
      )}
    </ul>
  );
};

export default AllTags;
