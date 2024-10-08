/* eslint-disable react-hooks/exhaustive-deps */
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RefObject, useEffect, useRef, useState } from "react";
import { wsBaseURL } from "src/constants/general";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { decodeJWT, getAccessToken } from "src/utils/general";
import { v4 as uuidv4 } from "uuid";
import Message from "./Message";
import ModalLayout from "src/layouts/ModalLayout";

const Chat = () => {
  const jwt = decodeJWT();
  const accessToken = getAccessToken();

  const [query, setQuery] = useState<string>("");
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const [messageHistory, setMessageHistory] = useState<any[]>([]);
  const ref = useRef() as RefObject<HTMLUListElement>;

  const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } =
    useWebSocket(`${wsBaseURL}/ws`, {
      retryOnError: true,
      shouldReconnect: () => true,
      onOpen: () => {
        return (getWebSocket() as any)?.send(
          JSON.stringify({
            token: accessToken,
            session_id: "",
            request_id: uuidv4(),
            action: "lets_go_unorderly",
            params: {
              data: {},
            },
          })
        );
      },
    });

  useEffect(() => {
    if (lastJsonMessage) {
      const parsedMessage = JSON.parse(String(lastJsonMessage));
      if (parsedMessage.data?.start_unorderly)
        sessionStorage.chatbotSessionID = parsedMessage.metadata.session_id;
      else if (parsedMessage.error?.type !== "401_UNAUTHORIZED")
        setMessageHistory([...messageHistory, parsedMessage.data]);
    }
  }, [lastJsonMessage, setMessageHistory]);

  useEffect(() => {
    if (!showChatbot) (getWebSocket() as any)?.close();
  }, [showChatbot]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messageHistory change
    ref?.current?.addEventListener("DOMNodeInserted", (event) => {
      const { currentTarget: target } = event as any;
      target?.scroll({ top: target.scrollHeight, behavior: "smooth" });
    });
  }, [messageHistory]);

  const handleClickSendMessage = () => {
    const message = {
      token: accessToken,
      session_id: sessionStorage.chatbotSessionID,
      request_id: uuidv4(),
      action: "lets_go_unorderly",
      params: {
        data: {
          request: {
            author: jwt?.name,
            response: query,
            context: "text",
          },
        },
      },
    };
    setQuery("");
    setMessageHistory([...messageHistory, message.params.data.request]);
    sendJsonMessage(message);
  };

  const handleOnClose = () => {
    setShowChatbot(false);
    setMessageHistory([]);
    setQuery("");
  };

  return (
    <>
      <button
        className="group relative pl-3 text-white inline-flex items-center text-base font-medium dark:hover:text-signin duration-100 focus:outline-none border-x-1 dark:border-checkbox"
        onClick={() => {
          setShowChatbot(!showChatbot);
        }}
      >
        <img
          src="/general/chatbot/unorderly-white.png"
          alt="uno"
          className="w-16"
        />
        <span className="hidden group-hover:block absolute top-8 left-0 p-2 w-max text-xs dark:text-white dark:bg-filter black-shadow rounded-sm z-20">
          Unorderly Query Search
        </span>
      </button>
      <ModalLayout showModal={showChatbot} onClose={handleOnClose}>
        <section className="flex flex-col flex-grow gap-5">
          <img
            src="/general/chatbot/unorderly-white.png"
            alt="uno"
            className="w-24"
          />
          <section className="flex flex-col flex-grow content-start gap-5 w-full h-full break-words border-1 dark:border-filter/60 overflow-x-hidden overflow-y-auto scrollbar">
            <section className="grid content-start w-full h-full overflow-auto scrollbar">
              <ul
                ref={ref}
                className="grid content-start gap-5 p-4 text-sm w-full h-[25rem] overflow-auto scrollbar"
              >
                {messageHistory.map((message: any, messageIndex: number) => {
                  return (
                    <Message
                      key={messageIndex}
                      messageHistory={messageHistory}
                      setMessageHistory={setMessageHistory}
                      message={message}
                      setShowChatbot={setShowChatbot}
                      setQuery={setQuery}
                    />
                  );
                })}
              </ul>
              <article className="relative flex items-center w-full border-t-1 dark:border-checkbox">
                <input
                  type="input"
                  spellCheck="false"
                  autoComplete="off"
                  placeholder="Enter your query in natural language"
                  value={query}
                  onKeyUpCapture={(e) => {
                    if (e.key === "Enter" && query !== "")
                      handleClickSendMessage();
                  }}
                  onChange={(e) => setQuery(e.target.value)}
                  className="p-4 pr-12 w-full h-16 bg-transparent border-t border-b dark:border-know/60 know focus:outline-none"
                />
                <button
                  disabled={query === "" || readyState !== ReadyState.OPEN}
                  className="absolute right-10 top-6 dark:disabled:text-filter dark:text-signin dark:hover:text-signin/30 duration-100"
                  onClick={handleClickSendMessage}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </article>
            </section>
          </section>
        </section>
      </ModalLayout>
    </>
  );
};

export default Chat;
