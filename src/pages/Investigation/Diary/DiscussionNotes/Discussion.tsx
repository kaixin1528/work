/* eslint-disable no-restricted-globals */
import {
  faXmark,
  faPaperPlane,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition } from "@headlessui/react";
import { Fragment, RefObject, useRef, useState } from "react";
import { userColors } from "../../../../constants/general";
import { CommentBody } from "../../../../components/General/CommentBody";
import {
  decodeJWT,
  getAllEmails,
  getCustomerID,
  lastUpdatedAt,
  parseURL,
  sortNumericData,
} from "../../../../utils/general";
import { CommentType } from "../../../../types/investigation";
import { User } from "../../../../types/settings";
import { GetAllUsers } from "src/services/settings/users";
import { useGeneralStore } from "src/stores/general";
import EmojiSelector from "src/components/General/EmojiSelector";
import { AddTask } from "src/services/getting-started";
import { GetInvestigation } from "src/services/investigation/diary/diary";
import {
  GetEvidenceComments,
  AddEvidenceComment,
  EditEvidenceComment,
  DeleteEvidenceComment,
} from "src/services/investigation/diary/evidence/discussion";

const Discussion = ({ evidenceID }: { evidenceID: string }) => {
  const parsed = parseURL();
  const jwt = decodeJWT();
  const customerID = getCustomerID();

  const { env } = useGeneralStore();

  const [comment, setComment] = useState<string>("");
  const [mention, setMention] = useState<boolean>(false);
  const [editCommentID, setEditCommentID] = useState<string>("");
  const [deleteCommentID, setDeleteCommentID] = useState<string>("");
  const [editCurrentComment, setEditCurrentComment] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const inputRef = useRef() as RefObject<HTMLTextAreaElement>;
  const editRef = useRef() as RefObject<HTMLTextAreaElement>;

  const { data: allUsers } = GetAllUsers(customerID, false);

  const userEmails = allUsers?.reduce(
    (pV: string[], cV: User) => [...pV, cV.user_email],
    []
  );
  const filteredUsers = allUsers?.filter((user: User) =>
    user.user_email
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes(query.toLowerCase().replace(/\s+/g, ""))
  );

  const { data: diary } = GetInvestigation(env, parsed.diary_id);
  const { data: allComments } = GetEvidenceComments(env, evidenceID);
  const addEvidenceComment = AddEvidenceComment(env, evidenceID);
  const editEvidenceComment = EditEvidenceComment(env, evidenceID);
  const deleteEvidenceComment = DeleteEvidenceComment(env, evidenceID);
  const addTask = AddTask(env);

  const comments = allComments?.filter(
    (comment: CommentType) => comment.parent_comment_id === null
  );
  const sortedNotes = sortNumericData(comments, "last_updated_at", "desc");

  const closedDiary = diary?.status === "CLOSED";

  const handleAddTask = (comment: string) => {
    addTask.mutate({
      userEmails: getAllEmails(comment),
      taskType: "DIARY_EVIDENCE_PANEL",
      taskTitle: `You're mentioned by ${jwt?.name}`,
      taskMetadata: {
        url: `/investigation/diary/details?diary_id=${parsed.diary_id}`,
        diary_id: parsed.diary_id,
        diary_title: diary?.name,
        image_url: diary?.image_url,
        evidence_id: evidenceID,
        tab: "Discussion",
      },
    });
  };
  const handlePostComment = () => {
    setComment("");
    addEvidenceComment.mutate({
      comment: {
        evidence_id: evidenceID,
        parent_comment_id: null,
        author_email: jwt?.name,
        body: comment,
        tagged_users: getAllEmails(comment),
      },
    });
    setMention(false);
    handleAddTask(comment);
  };
  const handleEditComment = (comment: CommentType) => {
    setEditCommentID("");
    setEditCurrentComment("");
    editEvidenceComment.mutate({
      comment: {
        comment_id: comment.comment_id,
        comment_body: editCurrentComment,
        tagged_users: getAllEmails(editCurrentComment),
      },
    });
    setMention(false);
    handleAddTask(editCurrentComment);
  };
  const handleUserMentionQuery = (input: string) => {
    if (input === "@" || [" @", "\n@"].includes(input.slice(-2))) {
      setMention(true);
      setQuery("");
    } else if (
      ["@ ", "@\n"].includes(input.slice(-2)) ||
      input === "" ||
      (filteredUsers?.length === 0 && query === "")
    ) {
      setMention(false);
      setQuery("");
    }
    if (mention) setQuery(input.slice(input.lastIndexOf("@")));
  };
  const handleUserMention = (
    userEmail: string,
    note: string,
    setNote: (note: string) => void,
    ref: RefObject<HTMLTextAreaElement>
  ) => {
    setNote(`${note.slice(0, note.lastIndexOf("@"))}${userEmail} `);
    setQuery("");
    setMention(false);
    ref?.current?.focus();
  };

  return (
    <section className="flex flex-col flex-grow content-start gap-5 p-4 mt-3 text-xs dark:bg-card overflow-x-hidden overflow-y-auto scrollbar">
      {/* self comment */}
      {!closedDiary && (
        <section className="flex items-start gap-4 mr-2 dark:bg-card">
          <article className="grid h-full">
            <span
              className={`grid content-center w-8 h-8 capitalize text-center text-sm dark:text-white font-medium bg-gradient-to-b ${
                userColors[jwt?.name[0].toLowerCase()]
              } shadow-sm dark:shadow-checkbox rounded-full`}
            >
              {jwt?.name[0]}
            </span>
          </article>
          <article className="relative grid gap-3 w-full bg-gradient-to-b dark:from-[#09223B] dark:to-[#1C334A] focus-within:ring-1 dark:focus-within:ring-checkbox border dark:border-filter">
            {/* comment input field */}
            <textarea
              spellCheck="false"
              ref={inputRef}
              value={comment}
              onKeyUpCapture={(e) => {
                if (e.key === "Enter") handlePostComment();
              }}
              onChange={(e) => {
                handleUserMentionQuery(e.target.value);
                setComment(e.target.value);
              }}
              className="relative block py-2 pr-3 w-full h-16 dark:placeholder:text-slate-400 placeholder:text-[0.85rem] text-[0.85rem] resize-none bg-gradient-to-b dark:from-[#09223B] dark:to-[#1C334A] border-none focus:ring-0"
              placeholder="Leave a comment.."
              name="comment"
            />
            <article className="flex items-center gap-1 mb-2 justify-self-end">
              <EmojiSelector setInputString={setComment} showBelow />
              <button
                disabled={comment === ""}
                className="px-3 mr-2 text-xs dark:text-signin dark:hover:text-[#5fc4ef] dark:disabled:bg-transparent dark:disabled:text-gray-500 duration-100"
                onClick={handlePostComment}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="w-3 h-3" />
              </button>
            </article>
            {/* user tagging */}
            {mention && (
              <nav className="absolute top-16 grid items-end mt-1 my-2 w-11/12 max-h-[10rem] overflow-auto scrollbar z-10">
                {filteredUsers?.map((user: User) => {
                  return (
                    <button
                      key={user.user_email}
                      className="flex items-center gap-3 px-4 py-2 w-full text-left dark:bg-main dark:hover:bg-mention duration-100"
                      onClick={() =>
                        handleUserMention(
                          user.user_email,
                          comment,
                          setComment,
                          inputRef
                        )
                      }
                    >
                      <span
                        className={`grid content-center w-5 h-5 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                          userColors[user.user_email[0].toLowerCase()]
                        } shadow-sm dark:shadow-checkbox rounded-full`}
                      >
                        {user.user_email[0]}
                      </span>
                      <p className="grid">
                        {user.user_email}
                        <span className="text-[0.65rem] dark:text-checkbox">
                          {user.user_name}
                        </span>
                      </p>
                    </button>
                  );
                })}
              </nav>
            )}
          </article>
        </section>
      )}
      {/* list of comments */}
      <ul className="flex flex-col flex-grow gap-5 pb-5 overflow-x-hidden overflow-y-auto scrollbar">
        {sortedNotes?.length > 0 &&
          sortedNotes.map((comment: CommentType, index: number) => {
            return (
              <li
                key={comment.comment_id}
                className="relative flex items-start gap-2"
              >
                <article className="grid h-full">
                  {comment.author_email.includes("unorderly") ? (
                    <img
                      src="/general/logos/uno-id.svg"
                      alt="uno"
                      className="w-7 h-7"
                    />
                  ) : (
                    <span
                      className={`grid content-center w-8 h-8 capitalize text-center text-sm dark:text-white font-medium bg-gradient-to-b ${
                        userColors[comment.author_email[0].toLowerCase()]
                      } shadow-sm dark:shadow-checkbox rounded-full`}
                    >
                      {comment.author_email[0]}
                    </span>
                  )}
                </article>

                {/* edit comment */}
                {editCommentID === comment.comment_id ? (
                  <article className="grid gap-2 mx-2 w-full text-xs bg-gradient-to-b dark:from-[#09223B] dark:to-[#1C334A] focus-within:ring-1 dark:focus-within:ring-checkbox border dark:border-filter">
                    <textarea
                      ref={editRef}
                      spellCheck="false"
                      value={editCurrentComment}
                      onKeyUpCapture={(e) => {
                        if (e.key === "Enter") handleEditComment(comment);
                      }}
                      onChange={(e) => {
                        handleUserMentionQuery(e.target.value);
                        setEditCurrentComment(e.target.value);
                      }}
                      className="relative block py-2 pr-3 w-full h-20 dark:placeholder:text-slate-400 placeholder:text-[0.85rem] text-[0.85rem] resize-none bg-gradient-to-b dark:from-[#09223B] dark:to-[#1C334A] border-none focus:ring-0"
                      placeholder="Leave a comment.."
                      name="comment"
                    />
                    <article className="flex items-center gap-3 px-3 py-1 mb-2 justify-self-end">
                      <button
                        className="dark:text-red-800 dark:hover:text-red-700 duration-100"
                        onClick={() => {
                          setEditCommentID("");
                          setEditCurrentComment("");
                        }}
                      >
                        <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                      </button>
                      <EmojiSelector
                        setInputString={setEditCurrentComment}
                        showBelow={
                          index < 4 || index < Math.ceil(comments.length / 2)
                        }
                      />
                      <button
                        className="dark:text-signin dark:hover:text-[#5fc4ef] duration-100"
                        onClick={() => handleEditComment(comment)}
                      >
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </button>
                    </article>
                    {/* user tagging */}
                    {mention && (
                      <article className="absolute top-16 w-4/6 max-h-[11rem] z-10">
                        <nav className="mt-1 my-2 w-full h-[13rem] overflow-x-hidden overflow-y-auto no-scrollbar">
                          {filteredUsers?.map((user: User) => (
                            <button
                              key={user.user_email}
                              className="flex items-center gap-3 px-4 py-2 w-full text-left dark:bg-main dark:hover:bg-mention duration-100"
                              onClick={() =>
                                handleUserMention(
                                  user.user_email,
                                  editCurrentComment,
                                  setEditCurrentComment,
                                  editRef
                                )
                              }
                            >
                              <span
                                className={`grid content-center w-5 h-5 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                                  userColors[user.user_email[0].toLowerCase()]
                                } rounded-full shadow-sm dark:shadow-checkbox`}
                              >
                                {user.user_email[0]}
                              </span>
                              <p className="grid">
                                {user.user_email}{" "}
                                <span className="text-xs dark:text-checkbox">
                                  {user.user_name}
                                </span>
                              </p>
                            </button>
                          ))}
                        </nav>
                      </article>
                    )}
                  </article>
                ) : (
                  <article className="grid w-full">
                    <header className="flex items-start justify-between pb-2">
                      <article className="grid content-start px-2">
                        <h4 className="dark:text-white">
                          {comment.author_email}
                        </h4>
                        <article className="flex items-center gap-2 text-[0.65rem] dark:text-checkbox">
                          <p>{lastUpdatedAt(comment.last_updated_at)}</p>
                        </article>
                      </article>
                      <article>
                        {!closedDiary && (
                          <Popover className="relative">
                            <Popover.Button className="group px-3 py-2">
                              <FontAwesomeIcon icon={faEllipsis} />
                            </Popover.Button>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="opacity-0 translate-y-1"
                              enterTo="opacity-100 translate-y-0"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100 translate-y-0"
                              leaveTo="opacity-0 translate-y-1"
                              beforeEnter={() => setMention(false)}
                            >
                              <Popover.Panel className="absolute px-4 mt-3 -right-2 z-10">
                                <article className="grid gap-1 px-4 py-2 text-xs divide-y dark:divide-checkbox bg-gradient-to-b dark:from-[#577399] dark:to-[#495867]">
                                  <button
                                    disabled={
                                      comment.author_email !== jwt?.name
                                    }
                                    className="text-left dark:hover:text-gray-300/50 dark:disabled:text-gray-300/30 duration-100"
                                    onClick={() => {
                                      setEditCommentID(comment.comment_id);
                                      setEditCurrentComment(comment.body);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    disabled={
                                      comment.author_email !== jwt?.name
                                    }
                                    className="pt-1 text-left dark:hover:text-gray-300/50 dark:disabled:text-gray-300/30 duration-100"
                                    onClick={() =>
                                      setDeleteCommentID(comment.comment_id)
                                    }
                                  >
                                    Delete
                                  </button>
                                </article>
                              </Popover.Panel>
                            </Transition>
                          </Popover>
                        )}
                        {/* delete confirmation */}
                        {deleteCommentID === comment.comment_id && (
                          <article className="absolute inset-x-0 -top-10 mx-20 text-center z-10">
                            <article className="grid w-full max-w-sm p-6 dark:text-white align-middle dark:bg-panel overflow-hidden">
                              <h5 className="font-medium leading-6">
                                Are you sure you want to delete this note?
                              </h5>

                              <article className="flex items-center gap-5 mt-4 mx-auto">
                                <button
                                  type="button"
                                  className="px-4 py-1 text-xs font-medium dark:bg-filter border border-transparent  dark:hover:bg-filter/70 duration-100 focus:outline-none"
                                  onClick={() => setDeleteCommentID("")}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="px-4 py-1 text-xs font-medium dark:bg-validation border border-transparent  dark:hover:bg-validation/70 duration-100 focus:outline-none"
                                  onClick={() =>
                                    deleteEvidenceComment.mutate({
                                      commentID: comment.comment_id,
                                    })
                                  }
                                >
                                  Confirm delete
                                </button>
                              </article>
                            </article>
                          </article>
                        )}
                      </article>
                    </header>
                    <CommentBody text={comment.body} userEmails={userEmails} />
                  </article>
                )}
              </li>
            );
          })}
      </ul>
    </section>
  );
};

export default Discussion;
