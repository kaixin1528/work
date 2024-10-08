import React, { RefObject, useEffect, useRef, useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";

const EmojiSelector = ({
  setInputString,
  showBelow,
}: {
  setInputString: any;
  showBelow?: boolean;
}) => {
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const emojiRef = useRef() as RefObject<HTMLElement>;

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (!emojiRef?.current?.contains(event.target)) setShowEmoji(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [emojiRef]);

  return (
    <section ref={emojiRef} className="relative w-full h-full">
      <button onClick={() => setShowEmoji(!showEmoji)}>
        <FontAwesomeIcon icon={faSmile} className="text-qualifying" />
      </button>
      {showEmoji && (
        <article
          className={`absolute ${
            showBelow ? "top-5" : "bottom-7"
          } right-12 z-10`}
        >
          <EmojiPicker
            theme={Theme.DARK}
            height={400}
            width="120%"
            onEmojiClick={(emojiObject) => {
              setShowEmoji(false);
              setInputString(
                (prevInputString: string) =>
                  `${prevInputString}${emojiObject.emoji}`
              );
            }}
          />
        </article>
      )}
    </section>
  );
};

export default EmojiSelector;
