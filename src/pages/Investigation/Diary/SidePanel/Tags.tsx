/* eslint-disable no-restricted-globals */
import { faXmark, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { AllTag, DiaryTag } from "../../../../types/investigation";
import { parseURL } from "../../../../utils/general";
import { useGeneralStore } from "src/stores/general";
import {
  GetDiaryTags,
  AddDiaryTag,
  RemoveDiaryTag,
} from "src/services/investigation/diary/tags";
import { GetAllTags } from "src/services/investigation/investigation";

const Tags = () => {
  const parsed = parseURL();

  const { env } = useGeneralStore();

  const { data: allTags } = GetAllTags(env);
  const { data: diaryTags } = GetDiaryTags(env, parsed.diary_id);
  const addDiaryTag = AddDiaryTag(env);
  const removeDiaryTag = RemoveDiaryTag(env, parsed.diary_id);

  const diaryTagNames = diaryTags?.reduce(
    (pV: string[], cV: DiaryTag) => [...pV, cV.tag_name],
    []
  );

  const filteredTags = allTags
    ? allTags.filter((tag: AllTag) => !diaryTagNames?.includes(tag.tag_name))
    : [];

  return (
    <section className="grid gap-3 text-xs">
      {/* list of tags */}
      <ul className="flex flex-wrap items-center gap-3">
        {diaryTags?.map((tag: DiaryTag) => {
          return (
            <li
              key={tag.tag_id}
              className="flex items-center gap-3 pl-4 pr-1 py-1 dark:bg-org rounded-full"
            >
              <p>{tag.tag_name}</p>

              {/* remove diary tag */}
              <button
                onClick={() => removeDiaryTag.mutate({ tagID: tag.tag_id })}
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

      {/* add diary tag */}
      <Menu as="article" className="relative inline-block text-left">
        <Menu.Button className="flex items-center gap-2 ml-2 group dark:text-checkbox">
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
            {filteredTags?.length > 0 ? (
              <nav className="grid content-start w-full max-h-60 z-50 overflow-auto scrollbar">
                {filteredTags?.map((tag: AllTag) => {
                  return (
                    <button
                      key={tag.tag_id}
                      className="flex items-center gap-3 px-4 pr-10 py-2 w-full text-left dark:bg-account dark:hover:bg-mention duration-100"
                      onClick={() =>
                        addDiaryTag.mutate({
                          tag: {
                            diary_id: parsed.diary_id,
                            tag_id: tag.tag_id,
                          },
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faTag} />
                      <p className="grid text-xs">{tag.tag_name}</p>
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

export default Tags;
