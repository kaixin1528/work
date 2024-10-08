/* eslint-disable no-restricted-globals */
import {
  faEllipsis,
  faPaperPlane,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, RefObject, useRef, useState } from "react";
import { userColors } from "../../../../../constants/general";
import {
  decodeJWT,
  getCustomerID,
  lastUpdatedAt,
  sortNumericData,
} from "../../../../../utils/general";
import { KeyStringVal } from "src/types/general";
import EmojiSelector from "src/components/General/EmojiSelector";
import { CommentBody } from "src/components/General/CommentBody";
import { GetAllUsers } from "src/services/settings/users";
import { User } from "src/types/settings";
import { Popover, Transition } from "@headlessui/react";
import {
  GetGRCNotes,
  AddGRCNote,
  UpdateGRCNote,
  DeleteGRCNote,
} from "src/services/grc";
const Notes = ({
  documentID,
  anchorID,
}: {
  documentID: string;
  anchorID: string;
}) => {
  const jwt = decodeJWT();
  const customerID = getCustomerID();

  const [addNewNote, setAddNewNote] = useState<boolean>(false);
  const [newNote, setNewNote] = useState<string>("");
  const [editNoteID, setEditNoteID] = useState<string>("");
  const [deleteNoteID, setDeleteNoteID] = useState<string>("");
  const [editCurrentNote, setEditCurrentNote] = useState<string>("");
  const editRef = useRef() as RefObject<HTMLTextAreaElement>;

  const { data: notes } = GetGRCNotes(documentID, anchorID);
  const addNote = AddGRCNote(documentID, anchorID);
  const updateNote = UpdateGRCNote(documentID, anchorID);
  const deleteNote = DeleteGRCNote(documentID);
  const { data: allUsers } = GetAllUsers(customerID, false);

  const userEmails = allUsers?.reduce(
    (pV: string[], cV: User) => [...pV, cV.user_email],
    []
  );

  const sortedNotes = sortNumericData(notes, "updated_at", "desc");

  const handleAddNote = () => {
    setNewNote("");
    addNote.mutate({
      note: {
        notes: newNote,
      },
    });
  };
  const handleEditNote = (note: KeyStringVal) => {
    setEditNoteID("");
    setEditCurrentNote("");
    updateNote.mutate({
      note: {
        notes_id: note.notes_id,
        notes: editCurrentNote,
      },
    });
  };

  return (
    <section className="flex flex-col flex-grow content-start gap-5 p-4 mt-3 text-xs dark:bg-card overflow-x-hidden overflow-y-auto scrollbar">
      {/* add new note */}
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
                <FontAwesomeIcon icon={faPaperPlane} className="w-3 h-3" />
              </button>
            </article>
          </article>
        </section>
      ) : (
        <button
          className="grid justify-items-center px-4 py-4 dark:bg-filter/30 dark:hover:bg-filter/60 duration-100 border dark:border-filter rounded-sm"
          onClick={() => setAddNewNote(true)}
        >
          <article className="flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} />
            <p>Add new note</p>
          </article>
        </button>
      )}
      <ul className="flex flex-col flex-grow gap-5 pb-5 overflow-x-hidden overflow-y-auto scrollbar">
        {sortedNotes?.map((note: any) => {
          const userEmail = allUsers?.find(
            (user: KeyStringVal) => note.author_id === user.user_id
          )?.user_email;
          return (
            <li key={note.notes_id} className="relative flex items-start gap-2">
              <article className="grid h-full">
                <span
                  className={`grid content-center w-8 h-8 capitalize text-center text-sm dark:text-white font-medium bg-gradient-to-b ${
                    userColors[userEmail[0].toLowerCase()]
                  } shadow-sm dark:shadow-checkbox rounded-full`}
                >
                  {userEmail[0]}
                </span>
              </article>

              {/* edit note */}
              {editNoteID === note.notes_id ? (
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
                      showBelow
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
                      <h4 className="dark:text-white">{userEmail}</h4>
                      <p className="text-[0.65rem] dark:text-checkbox">
                        {lastUpdatedAt(note.updated_at)}
                      </p>
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
                                disabled={userEmail !== jwt?.name}
                                className="text-left dark:hover:text-gray-300/50 dark:disabled:text-gray-300/30 duration-100"
                                onClick={() => {
                                  setEditNoteID(note.notes_id);
                                  setEditCurrentNote(note.notes);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                disabled={userEmail !== jwt?.name}
                                className="pt-1 text-left dark:hover:text-gray-300/50 dark:disabled:text-gray-300/30 duration-100"
                                onClick={() => setDeleteNoteID(note.notes_id)}
                              >
                                Delete
                              </button>
                            </article>
                          </Popover.Panel>
                        </Transition>
                      </Popover>
                      {/* delete confirmation */}
                      {deleteNoteID === note.notes_id && (
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
                                  setDeleteNoteID("");
                                  deleteNote.mutate({
                                    noteID: note.notes_id,
                                  });
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

                  <CommentBody text={note.notes} userEmails={userEmails} />
                </article>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Notes;
