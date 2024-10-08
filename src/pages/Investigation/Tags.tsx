/* eslint-disable no-restricted-globals */
import { faXmark, faTag, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  CreateTag,
  DeleteTag,
  GetAllTags,
} from "../../services/investigation/investigation";
import { AllTag } from "../../types/investigation";
import { parseURL } from "../../utils/general";
import { queryClient } from "src/App";
import { useGeneralStore } from "src/stores/general";

const Tags = () => {
  const parsed = parseURL();

  const { env } = useGeneralStore();

  const [addTag, setAddTag] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<string>("");

  const { data: allTags } = GetAllTags(env);
  const createTag = CreateTag(env);
  const deleteTag = DeleteTag(env);

  const filteredTags = allTags
    ? allTags.filter((tag: AllTag) => tag.diary_id === parsed.diary_id)
    : [];

  return (
    <section className="flex flex-wrap items-center gap-5 text-xs">
      {/* list of tags */}
      <ul className="flex flex-wrap items-center gap-3">
        {filteredTags?.map((tag: AllTag) => {
          return (
            <li
              key={tag.tag_id}
              className="flex items-center gap-3 pl-4 pr-1 py-1 dark:text-white dark:bg-org rounded-full"
            >
              <p>{tag.tag_name}</p>

              {/* delete tag */}
              <button onClick={() => deleteTag.mutate({ tagID: tag.tag_id })}>
                <FontAwesomeIcon
                  icon={faXmark}
                  className="w-4 h-4 dark:text-org dark:hover:bg-checkbox/60 dark:bg-checkbox duration-100 rounded-full"
                />
              </button>
            </li>
          );
        })}
      </ul>

      {/* add tag */}
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
              // create tag
              createTag.mutate(
                {
                  tag: {
                    tag_name: newTag,
                  },
                },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries(["get-all-tags"]);
                    setAddTag(false);
                    setNewTag("");
                  },
                }
              );
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
    </section>
  );
};

export default Tags;
