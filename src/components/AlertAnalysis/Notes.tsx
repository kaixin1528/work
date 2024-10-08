/* eslint-disable no-restricted-globals */
import {
  faEllipsis,
  faNoteSticky,
  faPaperPlane,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, RefObject, useEffect, useRef, useState } from "react";
import { userColors } from "../../constants/general";
import {
  decodeJWT,
  getCustomerID,
  lastUpdatedAt,
  sortNumericData,
} from "../../utils/general";
import { useGeneralStore } from "src/stores/general";
import { KeyStringVal } from "src/types/general";
import EmojiSelector from "src/components/General/EmojiSelector";
import { CommentBody } from "src/components/General/CommentBody";
import { GetAllUsers } from "src/services/settings/users";
import { User } from "src/types/settings";
import { Popover, Transition } from "@headlessui/react";
import {
  AddAlertAnalysisNote,
  DeleteAlertAnalysisNote,
  EditAlertAnalysisNote,
  GetAlertAnalysisNotes,
} from "src/services/graph/alerts";
import { NoteType } from "src/types/graph";

const Notes = ({ alertAnalysisID }: { alertAnalysisID: string }) => {
  const jwt = decodeJWT();
  const customerID = getCustomerID();

  const { env } = useGeneralStore();

  const [addNewNote, setAddNewNote] = useState<boolean>(false);
  const [newNote, setNewNote] = useState<string>("");
  const [editNoteID, setEditNoteID] = useState<string>("");
  const [deleteNoteID, setDeleteNoteID] = useState<string>("");
  const [editCurrentNote, setEditCurrentNote] = useState<string>("");
  const editRef = useRef() as RefObject<HTMLTextAreaElement>;

  const notes = GetAlertAnalysisNotes(env, alertAnalysisID);
  const addNote = AddAlertAnalysisNote(env, alertAnalysisID);
  const updateNote = EditAlertAnalysisNote(env, alertAnalysisID);
  const deleteNote = DeleteAlertAnalysisNote(env, alertAnalysisID);
  const { data: allUsers } = GetAllUsers(customerID, false);

  const userEmails = allUsers?.reduce(
    (pV: string[], cV: User) => [...pV, cV.user_email],
    []
  );
  const sortedNotes = sortNumericData(notes.data, "last_updated_at", "desc");

  useEffect(() => {
    const hasUnorderly = notes.data?.findIndex((note: KeyStringVal) =>
      note.author_email.includes("unorderly")
    );
    if (![-1, 0].includes(hasUnorderly))
      notes.data?.unshift(...notes.data?.splice(hasUnorderly, 1));
  }, [notes]);

  const handleAddNote = () => {
    setNewNote("");
    setAddNewNote(false);
    addNote.mutate(
      {
        note: {
          content: newNote,
        },
      },
      {
        onSuccess: () => notes.mutate({}),
      }
    );
  };
  const handleEditNote = (note: NoteType) => {
    setEditNoteID("");
    setEditCurrentNote("");
    updateNote.mutate(
      {
        nodeID: note.id,
        note: {
          content: editCurrentNote,
        },
      },
      {
        onSuccess: () => notes.mutate({}),
      }
    );
  };

  return (
    <Popover className="relative">
      <Popover.Button
        onClick={() => notes.mutate({})}
        className="flex items-center justify-center px-2 py-2 dark:text-black dark:bg-checkbox dark:hover:bg-checkbox/60 duration-100 focus:outline-none rounded-full"
      >
        <FontAwesomeIcon icon={faNoteSticky} className="w-4 h-4" />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="pointer-events-auto absolute top-10 right-0 flex flex-col flex-grow w-[40rem] h-[40rem] break-words text-xs dark:bg-card z-10">
          <h4 className="p-2 m-4 text-base text-center bg-gradient-to-b dark:from-filter dark:to-filter/30">
            Notes
          </h4>
          {/* add new note */}
          <section className="p-5">
            {addNewNote ? (
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
                  <textarea
                    spellCheck="false"
                    autoComplete="off"
                    placeholder="Leave a note..."
                    value={newNote}
                    onKeyUpCapture={(e) => {
                      if (e.key === "Enter") handleAddNote();
                    }}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="relative block py-2 pr-3 w-full h-16 dark:placeholder:text-slate-400 placeholder:text-[0.85rem] text-[0.85rem] resize-none bg-gradient-to-b dark:from-[#09223B] dark:to-[#1C334A] border-none focus:ring-0"
                  />
                  <article className="flex items-center gap-3 px-3 mb-2 justify-self-end">
                    <button
                      className="dark:text-red-800 dark:hover:text-red-700 duration-100"
                      onClick={() => setAddNewNote(false)}
                    >
                      <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                    </button>
                    <EmojiSelector setInputString={setNewNote} showBelow />
                    <button
                      disabled={newNote === ""}
                      className="-mt-1 mr-2 text-xs dark:text-signin dark:hover:text-[#5fc4ef] dark:disabled:bg-transparent dark:disabled:text-gray-500 duration-100"
                      onClick={handleAddNote}
                    >
                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        className="w-3 h-3"
                      />
                    </button>
                  </article>
                </article>
              </section>
            ) : (
              <button
                className="grid justify-items-center px-4 py-4 w-full dark:bg-filter/30 dark:hover:bg-filter/60 duration-100 border dark:border-filter rounded-sm"
                onClick={() => setAddNewNote(true)}
              >
                <article className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faPlus} />
                  <p>Add new note</p>
                </article>
              </button>
            )}
          </section>
          <ul className="flex flex-col flex-grow gap-5 p-5 h-full overflow-x-hidden overflow-y-auto scrollbar">
            {sortedNotes?.map((note: NoteType, index: number) => {
              return (
                <li key={note.id} className="relative flex items-start gap-2">
                  {note.author_email.includes("unorderly") ? (
                    <img
                      src="/general/logos/uno-id.svg"
                      alt="uno"
                      className="w-7 h-7"
                    />
                  ) : (
                    <article className="grid h-full">
                      <span
                        className={`grid content-center w-8 h-8 capitalize text-center text-sm dark:text-white font-medium bg-gradient-to-b ${
                          userColors[note.author_email[0].toLowerCase()]
                        } shadow-sm dark:shadow-checkbox rounded-full`}
                      >
                        {note.author_email[0]}
                      </span>
                    </article>
                  )}

                  {/* edit note */}
                  {editNoteID === note.id ? (
                    <article className="grid gap-2 mx-2 w-full text-xs bg-gradient-to-b dark:from-[#09223B] dark:to-[#1C334A] focus-within:ring-1 dark:focus-within:ring-checkbox border dark:border-filter">
                      <textarea
                        ref={editRef}
                        spellCheck="false"
                        value={editCurrentNote}
                        onKeyUpCapture={(e) => {
                          if (e.key === "Enter") handleEditNote(note);
                        }}
                        onChange={(e) => setEditCurrentNote(e.target.value)}
                        className="relative block py-2 pr-3 w-full h-20 dark:placeholder:text-slate-400 placeholder:text-[0.85rem] text-[0.85rem] resize-none bg-gradient-to-b dark:from-[#09223B] dark:to-[#1C334A] border-none focus:ring-0"
                        placeholder="Leave a note.."
                        name="note"
                      />
                      <article className="flex items-center gap-3 px-3 py-1 mb-2 justify-self-end">
                        <button
                          className="dark:text-red-800 dark:hover:text-red-700 duration-100"
                          onClick={() => {
                            setEditNoteID("");
                            setEditCurrentNote("");
                          }}
                        >
                          <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                        </button>
                        <EmojiSelector
                          setInputString={setEditCurrentNote}
                          showBelow={
                            index < 4 ||
                            index < Math.ceil(notes.data?.length / 2)
                          }
                        />
                        <button
                          className="-mt-1 dark:text-signin dark:hover:text-[#5fc4ef] duration-100"
                          onClick={() => handleEditNote(note)}
                        >
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                      </article>
                    </article>
                  ) : (
                    <article className="grid w-full">
                      <header className="flex items-start justify-between pb-2">
                        <article className="grid content-start px-2">
                          <h4 className="dark:text-white">
                            {note.author_email}
                          </h4>
                          <article className="flex items-center gap-2 text-[0.65rem] dark:text-checkbox">
                            <p>{lastUpdatedAt(note.last_updated_at)}</p>
                          </article>
                        </article>
                        <article>
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
                            >
                              <Popover.Panel className="absolute px-4 mt-3 -right-2 z-10">
                                <article className="grid gap-1 px-4 py-2 text-xs divide-y dark:divide-checkbox bg-gradient-to-b dark:from-[#577399] dark:to-[#495867]">
                                  <button
                                    disabled={note.author_email !== jwt?.name}
                                    className="text-left dark:hover:text-gray-300/50 dark:disabled:text-gray-300/30 duration-100"
                                    onClick={() => {
                                      setEditNoteID(note.id);
                                      setEditCurrentNote(note.content);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    disabled={note.author_email !== jwt?.name}
                                    className="pt-1 text-left dark:hover:text-gray-300/50 dark:disabled:text-gray-300/30 duration-100"
                                    onClick={() => setDeleteNoteID(note.id)}
                                  >
                                    Delete
                                  </button>
                                </article>
                              </Popover.Panel>
                            </Transition>
                          </Popover>

                          {/* delete confirmation */}
                          {deleteNoteID === note.id && (
                            <article className="absolute inset-x-0 -top-10 mx-20 text-center z-10">
                              <article className="grid w-full max-w-sm p-6 dark:text-white align-middle dark:bg-panel overflow-hidden">
                                <h5 className="font-medium leading-6">
                                  Are you sure you want to delete this note?
                                </h5>

                                <article className="flex items-center gap-5 mt-4 mx-auto">
                                  <button
                                    type="button"
                                    className="px-4 py-1 text-xs font-medium dark:bg-filter border border-transparent  dark:hover:bg-filter/70 duration-100 focus:outline-none"
                                    onClick={() => setDeleteNoteID("")}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    className="px-4 py-1 text-xs font-medium dark:bg-validation border border-transparent  dark:hover:bg-validation/70 duration-100 focus:outline-none"
                                    onClick={() => {
                                      deleteNote.mutate(
                                        {
                                          noteID: note.id,
                                        },
                                        {
                                          onSuccess: () => notes.mutate({}),
                                        }
                                      );
                                    }}
                                  >
                                    Confirm delete
                                  </button>
                                </article>
                              </article>
                            </article>
                          )}
                        </article>
                      </header>

                      <CommentBody
                        text={note.content}
                        userEmails={userEmails}
                      />
                    </article>
                  )}
                </li>
              );
            })}
          </ul>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default Notes;
