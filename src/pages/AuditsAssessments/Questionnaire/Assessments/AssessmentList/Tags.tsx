import { faTag, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { GetDocumentTags } from "src/services/grc";
import { KeyStringVal } from "src/types/general";

const Tags = ({ inputs, setInputs }: { inputs: any; setInputs: any }) => {
  const { data: allTags } = GetDocumentTags("frameworks");

  const filteredTags = allTags?.filter(
    (curTag: KeyStringVal) =>
      !inputs.tags.some((tag: KeyStringVal) => tag.tag_id === curTag.tag_id)
  );

  return (
    <article className="flex flex-wrap items-center gap-3">
      <ul className="flex flex-wrap items-center gap-2">
        {inputs.tags?.map((tag: KeyStringVal, index: number) => {
          return (
            <li
              key={index}
              className="flex items-center gap-3 pl-4 pr-2 py-1 cursor-pointer dark:text-white dark:bg-org rounded-full"
              onClick={() => {
                if (
                  inputs.tags.some(
                    (curTag: KeyStringVal) => curTag.tag_id === tag.tag_id
                  )
                )
                  setInputs({
                    ...inputs,
                    tags: inputs.tags.filter(
                      (curTag: KeyStringVal) => curTag.tag_id !== tag.tag_id
                    ),
                  });
                else setInputs({ ...inputs, tags: [...inputs.tags, tag] });
              }}
            >
              <p>{tag.tag_title || tag.title}</p>
              <button
                onClick={(e) =>
                  setInputs({
                    ...inputs,
                    tags: inputs.tags.filter(
                      (curTag: KeyStringVal) => curTag.tag_id !== tag.tag_id
                    ),
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
          <Menu.Items className="absolute left-2 grid w-max -mr-5 mt-2 gap-2 origin-top-right focus:outline-none text-sm dark:text-white dark:bg-account rounded-sm">
            {allTags?.length > 0 ? (
              <nav className="grid content-start w-full max-h-60 overflow-auto scrollbar">
                {filteredTags?.map((tag: KeyStringVal) => {
                  return (
                    <button
                      key={tag.tag_id}
                      className="flex items-center gap-3 px-4 pr-10 py-2 w-full text-left dark:bg-account dark:hover:bg-mention duration-100"
                      onClick={() =>
                        setInputs({ ...inputs, tags: [...inputs.tags, tag] })
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
              <section className="grid gap-2 px-5 py-3 w-max origin-top-right focus:outline-none text-xs dark:text-white dark:bg-account rounded-sm">
                <h4>No new tags</h4>
              </section>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </article>
  );
};

export default Tags;
