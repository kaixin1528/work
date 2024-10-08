/* eslint-disable react-hooks/exhaustive-deps */
import {
  faArrowLeftRotate,
  faChevronDown,
  faChevronRight,
  faInfo,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React, { RefObject, useEffect, useRef, useState } from "react";
import {
  attributeColors,
  chatVariants,
  listVariants,
  userColors,
} from "src/constants/general";
import { decodeJWT } from "src/utils/general";
import { Dna } from "react-loader-spinner";
import ModalLayout from "src/layouts/ModalLayout";
import TableLayout from "src/layouts/TableLayout";
import { KeyStringVal } from "src/types/general";
import { Disclosure } from "@headlessui/react";

const Chat = ({
  selectedAction,
  setSelectedAction,
  text,
  setText,
  messageHistory,
  setMessageHistory,
  getChatResponse,
}: {
  selectedAction: string;
  setSelectedAction: (selectedAction: string) => void;
  text: string;
  setText: (text: string) => void;
  messageHistory: any;
  setMessageHistory: any;
  getChatResponse: any;
}) => {
  const jwt = decodeJWT();

  const [selectedFile, setSelectedFile] = useState<number>(-1);
  const [selectedTab, setSelectedTab] = useState<string>("source");
  const ref = useRef() as RefObject<HTMLUListElement>;

  useEffect(() => {
    if (getChatResponse.data) {
      setMessageHistory([
        ...messageHistory,
        {
          author: "chat",
          status: getChatResponse.data.status,
          message: getChatResponse.data.result,
          ...(getChatResponse.data?.summary && {
            summary: getChatResponse.data?.summary,
          }),
          ...(getChatResponse.data?.headers && {
            headers: getChatResponse.data?.headers,
          }),
          ...(getChatResponse.data?.error && {
            error: getChatResponse.data?.error,
          }),
          ...(getChatResponse.data.metadata?.source_file && {
            source_file: getChatResponse.data.metadata.source_file,
          }),
          ...(getChatResponse.data.metadata?.source_text && {
            source_text: getChatResponse.data.metadata.source_text,
          }),
          ...(getChatResponse.data.metadata?.regulatory_file && {
            regulatory_file: getChatResponse.data.metadata.regulatory_file,
          }),
          ...(getChatResponse.data.metadata?.regulatory_text && {
            regulatory_text: getChatResponse.data.metadata.regulatory_text,
          }),
        },
      ]);
    }
  }, [getChatResponse.data, setMessageHistory]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messageHistory change
    ref?.current?.addEventListener("DOMNodeInserted", (event) => {
      const { currentTarget: target } = event as any;
      target?.scroll({ top: target.scrollHeight, behavior: "smooth" });
    });
  }, [messageHistory]);

  const handleEnter = () => {
    if (text !== "") {
      getChatResponse.mutate({
        queryString: text,
      });
      setMessageHistory([
        ...messageHistory,
        { author: jwt?.name, message: text },
      ]);
      setText("");
    }
  };
  const handleOnClose = () => {
    setSelectedFile(-1);
    setSelectedTab("source");
  };

  return (
    <motion.section
      variants={chatVariants}
      initial="hidden"
      animate={selectedAction === "chat" ? "visible" : "hidden"}
      className="absolute top-1/3 left-1/2 -translate-x-1/2 flex flex-col flex-grow place-self-center px-20 pb-20 w-screen h-full z-20"
    >
      <button onClick={() => setSelectedAction("")}>
        <FontAwesomeIcon icon={faArrowLeftRotate} />
      </button>
      {messageHistory.length > 0 && (
        <motion.ul
          variants={listVariants}
          initial="hidden"
          animate="visible"
          ref={ref}
          className="flex flex-col flex-grow content-start gap-5 p-4 py-6 mt-5 w-full h-full break-words bg-gradient-to-b dark:bg-main border-1 dark:border-filter overflow-x-hidden overflow-y-auto scrollbar"
        >
          {messageHistory.map((response: any, index: number) => {
            const endUser = response.author === jwt?.name;
            return (
              <li
                key={index}
                className={`flex items-start w-full break-words ${
                  endUser
                    ? "gap-2 flex-row-reverse justify-self-end"
                    : "gap-2 justify-self-start"
                }`}
              >
                <article className="w-max">
                  {endUser ? (
                    <span
                      className={`flex items-center justify-center mr-2 w-7 h-7 capitalize text-center text-sm font-medium bg-gradient-to-b ${
                        userColors[response.author[0].toLowerCase()]
                      } shadow-sm dark:shadow-checkbox rounded-full`}
                    >
                      {response.author[0]}
                    </span>
                  ) : (
                    <article className="w-max">
                      <img
                        src="/general/starters/chat.svg"
                        alt="chat"
                        className="w-12 h-12"
                      />
                    </article>
                  )}
                </article>
                <section className="grid gap-3">
                  <article
                    className={`${endUser ? "pt-1 pl-10" : "pt-3 pr-10"}`}
                  >
                    {!response.status && response.error ? (
                      <span className="p-2 break-words dark:bg-inner border dark:border-error rounded-sm">
                        {response.error}
                      </span>
                    ) : Array.isArray(response.message) ? (
                      <section className="grid gap-5">
                        {response.summary && (
                          <Disclosure>
                            {({ open }) => (
                              <>
                                <Disclosure.Button className="flex items-center gap-2 px-2 py-1 w-max cursor-pointer dark:bg-admin/30 dark:hover:bg-admin/60 duration-100 border dark:border-admin">
                                  <FontAwesomeIcon
                                    icon={open ? faChevronDown : faChevronRight}
                                    className="w-2 h-2"
                                  />
                                  <p>{open ? "Hide" : "Show"} Summary</p>
                                </Disclosure.Button>
                                <Disclosure.Panel className="p-4 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-md">
                                  <p>{response.summary}</p>
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                        )}
                        <TableLayout flexibleHeaders>
                          <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
                            <tr>
                              {response.headers?.map((col: KeyStringVal) => {
                                return (
                                  <th
                                    scope="col"
                                    key={col.property_name}
                                    className="p-3 text-left font-semibold"
                                  >
                                    {col.display_name}
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {response.message?.map(
                              (
                                row: { [key: string]: string | number | null },
                                index: number
                              ) => {
                                return (
                                  <tr
                                    key={index}
                                    data-test="table-row"
                                    className="relative p-5 gap-3 break-words dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70"
                                  >
                                    {response.headers?.map(
                                      (col: KeyStringVal, colIndex: number) => {
                                        return (
                                          <td
                                            key={`${index}-${colIndex}`}
                                            className="relative p-3 text-left"
                                          >
                                            <p
                                              className={`${
                                                attributeColors[
                                                  String(
                                                    row[col.property_name]
                                                  ).toLowerCase()
                                                ]
                                              }`}
                                            >
                                              {String(row[col.property_name])}
                                            </p>
                                          </td>
                                        );
                                      }
                                    )}
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </TableLayout>
                      </section>
                    ) : (
                      response.message
                    )}
                  </article>
                  {response.source_file && (
                    <>
                      <button
                        className="flex items-center gap-1 px-4 py-1 w-max text-sm dark:bg-admin/30 dark:hover:bg-admin/60 duration-100 border dark:border-admin rounded-lg"
                        onClick={() => setSelectedFile(index)}
                      >
                        <FontAwesomeIcon icon={faInfo} className="w-3 h-3" />
                        <p>View files</p>
                      </button>
                      <ModalLayout
                        showModal={selectedFile === index}
                        onClose={handleOnClose}
                      >
                        <section className="grid gap-3">
                          <nav className="flex items-center gap-1 mx-auto">
                            {["source", "regulatory"].map((tab) => (
                              <button
                                key={tab}
                                className={`capitalize px-3 py-1 border ${
                                  selectedTab === tab
                                    ? "dark:bg-admin/30 dark:hover:bg-admin/60 duration-100 dark:border-admin"
                                    : "dark:bg-filter/30 dark:hover:bg-filter/60 duration-100 dark:border-filter"
                                }`}
                                onClick={() => setSelectedTab(tab)}
                              >
                                {tab}
                              </button>
                            ))}
                          </nav>
                          <article className="grid gap-5">
                            {response[`${selectedTab}_file`] && (
                              <h2 className="text-center text-lg">
                                {
                                  response[`${selectedTab}_file`].split("/")[
                                    response[`${selectedTab}_file`].split("/")
                                      .length - 1
                                  ]
                                }
                              </h2>
                            )}
                            {selectedTab === "source" ? (
                              <ul className="grid gap-5 font-light">
                                {response.source_text?.map((text: string) => (
                                  <li
                                    key={text}
                                    className="p-4 leading-7 dark:bg-signin/60 rounded-md"
                                  >
                                    {text}
                                  </li>
                                ))}
                              </ul>
                            ) : response.regulatory_text ? (
                              <p className="p-4 leading-7 dark:bg-signin/60 rounded-md">
                                {response.regulatory_text}
                              </p>
                            ) : (
                              <p>No text available</p>
                            )}
                          </article>
                        </section>
                      </ModalLayout>
                    </>
                  )}
                </section>
              </li>
            );
          })}
          <li className="pb-10">
            {getChatResponse.status === "loading" && (
              <Dna
                visible={true}
                height="50"
                width="70"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
              />
            )}
          </li>
        </motion.ul>
      )}
      <article
        className={`relative ${
          messageHistory.length === 0 ? "absolute top-1/2" : ""
        }`}
      >
        <input
          type="input"
          value={text}
          placeholder="Agent Unorderly is here to assist you!"
          onKeyUpCapture={(e) => {
            if (e.key === "Enter") handleEnter();
          }}
          onChange={(e) => setText(e.target.value)}
          className="p-4 pr-12 w-full h-16 bg-gradient-to-b dark:bg-main border-t border-b dark:border-know/60 know focus:outline-none"
        />
        <button
          disabled={text === ""}
          className="absolute right-5 top-5 dark:disabled:text-filter dark:text-signin dark:hover:text-signin/30 duration-100"
          onClick={handleEnter}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </article>
    </motion.section>
  );
};

export default Chat;
