import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { CreateRedlining } from "src/services/grc";

const Tip = ({
  documentID,
  content,
  position,
  onConfirm,
  onOpen,
}: {
  documentID: string;
  content: any;
  position: any;
  onConfirm: any;
  onOpen: any;
}) => {
  const [add, setAdd] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  const createRedlining = CreateRedlining(documentID);

  return (
    <>
      {!add ? (
        <button
          className="px-4 py-1 bg-reset hover:bg-reset/90 duration-100 rounded-md"
          onClick={() => {
            onOpen();
            setAdd(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Redlining
        </button>
      ) : (
        <article className="grid gap-2 p-4 bg-black rounded-md">
          <h4>
            <FontAwesomeIcon icon={faPlus} /> Redlining
          </h4>
          <textarea
            placeholder="Your comment"
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            ref={(node) => {
              if (node) {
                node.focus();
              }
            }}
            className="p-2 w-[15rem] h-[10rem] text-sm bg-gradient-to-b from-panel/70 to-checkbox/90 border-t border-b border-know/60 know focus:outline-none focus:ring-0 resize-none overflow-auto scrollbar"
          />
          <button
            className="red-gradient-button"
            onClick={() => {
              setAdd(false);
              setText("");
              createRedlining.mutate({
                redlining: {
                  old_content: content,
                  new_edits: text,
                  page_metadata: {
                    page_num: position.pageNumber,
                    page_width: position.boundingRect.width,
                    page_height: position.boundingRect.height,
                    bounding_box: [
                      position.boundingRect.x1,
                      position.boundingRect.y1,
                      position.boundingRect.x2,
                      position.boundingRect.y2,
                    ],
                  },
                },
              });
            }}
          >
            Save
          </button>
        </article>
      )}
    </>
  );
};

export default Tip;
