/* eslint-disable react-hooks/exhaustive-deps */
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect } from "react";

const ModalLayout: React.FC<{
  showModal: boolean;
  onClose: any;
}> = ({ showModal, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (event: {
      key: string;
      preventDefault: () => void;
    }) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <Transition appear show={showModal} as={Fragment}>
      <Dialog
        as="article"
        className="fixed inset-0 overflow-auto scrollbar z-10"
        onClose={onClose}
        onClick={(e: { stopPropagation: () => void }) => e.stopPropagation()}
      >
        <article className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 z-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <section className="inline-block w-4/6 md:w-3/5 max-h-[40rem] 2xl:max-h-[60rem] p-8 my-10 text-sm text-left dark:text-white align-middle transition-all transform dark:bg-box black-shadow rounded-md overflow-auto scrollbar">
              <section className="grid w-full h-full">
                <button
                  className="justify-self-end w-4 h-4 dark:text-checkbox dark:hover:text-checkbox/60 duration-100"
                  onClick={onClose}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>

                {children}
              </section>
            </section>
          </Transition.Child>
        </article>
      </Dialog>
    </Transition>
  );
};

export default ModalLayout;
