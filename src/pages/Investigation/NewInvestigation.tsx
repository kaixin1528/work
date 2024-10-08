/* eslint-disable no-restricted-globals */
import {
  faLockOpen,
  faLock,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { NewDiary } from "../../types/investigation";
import { images } from "../../constants/investigation";
import { useGeneralStore } from "../../stores/general";
import { validVariants } from "../../constants/general";
import { motion } from "framer-motion";
import ModalLayout from "../../layouts/ModalLayout";
import { queryClient } from "src/App";
import { useNavigate } from "react-router-dom";
import { CreateInvestigation } from "src/services/investigation/diary/diary";
import RegularInput from "src/components/Input/RegularInput";

const NewInvestigation = () => {
  const navigate = useNavigate();

  const { error, setError, env } = useGeneralStore();

  const [showNewDiary, setShowNewDiary] = useState<boolean>(false);
  const [nav, setNav] = useState<number>(1);
  const [newDiary, setNewDiary] = useState<NewDiary>({
    name: "",
    description: "",
    is_private: false,
    image_url: "",
  });
  const [newDiaryInfo, setNewDiaryInfo] = useState<any>(null);

  const createDiary = CreateInvestigation(env);

  return (
    <>
      <button
        className="flex items-center gap-2 px-4 py-2 text-sm dark:text-white green-gradient-button rounded-sm"
        onClick={() => {
          setShowNewDiary(true);
          setError({ url: "", message: "" });
          setNav(1);
          setNewDiary({
            ...newDiary,
            name: "",
            description: "",
            image_url: "",
          });
        }}
      >
        <h4 className="flex items-center gap-1">
          <img src="/general/new.svg" alt="new" className="h-7" />
          New Investigation
        </h4>
      </button>
      <ModalLayout
        showModal={showNewDiary}
        onClose={() => setShowNewDiary(false)}
      >
        <section className="grid gap-5">
          {[1, 2].includes(nav) && (
            <article className="flex items-center gap-1">
              <img src="/general/new.svg" alt="new" className="h-10" />
              <h3 className="text-base text-left">New Investigation</h3>
            </article>
          )}

          {/* first page */}
          {nav === 1 ? (
            <section className="grid gap-3">
              <article className="grid gap-1">
                <h4 className="dark:text-checkbox justify-self-start">
                  What’s the investigation about?
                </h4>
                <article className="relative flex items-center py-2 px-4 ring-0 dark:ring-search focus:ring-2 dark:focus:ring-signin dark:bg-account rounded-sm">
                  <input
                    name="diary title"
                    spellCheck="false"
                    autoComplete="off"
                    value={newDiary.name}
                    onBlur={(e) => {
                      if (
                        e.target.value.length > 60 ||
                        e.target.value.search(/[^a-z_\- 0-9]/) !== -1
                      )
                        setError({
                          url: "/investigation/diary",
                          message:
                            "Label can only contain lowercase letters, numbers, hyphens, spaces, and underscores, and must be 60 characters or less",
                        });
                      else setError({ url: "", message: "" });
                    }}
                    onChange={(e) =>
                      setNewDiary({
                        ...newDiary,
                        name: e.target.value,
                      })
                    }
                    type="input"
                    className="py-1 w-full h-6 focus:outline-none dark:placeholder:text-checkbox dark:bg-transparent dark:bg-account dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent"
                  />
                </article>
                {error.url.includes("/investigation/diary") &&
                  error.message !== "" && (
                    <motion.article
                      variants={validVariants}
                      initial="hidden"
                      animate={error.message !== "" ? "visible" : "hidden"}
                      className="p-2 mt-2 break-words text-xs text-left dark:bg-inner border dark:border-error rounded-sm"
                    >
                      <p>{error.message}</p>
                    </motion.article>
                  )}
              </article>
              <RegularInput
                label="Description (Optional)"
                keyName="description"
                inputs={newDiary}
                setInputs={setNewDiary}
              />
              <article className="flex items-center gap-5 mt-5 text-xs">
                <button
                  className={`flex items-center p-2 gap-2 ${
                    !newDiary.is_private &&
                    "dark:bg-admin/20 border dark:border-admin"
                  }`}
                  onClick={() =>
                    setNewDiary({
                      ...newDiary,
                      is_private: false,
                    })
                  }
                >
                  <FontAwesomeIcon
                    icon={faLockOpen}
                    className="dark:text-admin"
                  />
                  PUBLIC
                </button>
                <button
                  className={`flex items-center p-2 gap-2 ${
                    newDiary.is_private &&
                    "dark:bg-lock/20 border dark:border-lock"
                  }`}
                  onClick={() =>
                    setNewDiary({
                      ...newDiary,
                      is_private: true,
                    })
                  }
                >
                  <FontAwesomeIcon icon={faLock} className="dark:text-lock" />
                  PRIVATE
                </button>
              </article>
              <p>
                *{" "}
                {newDiary.is_private
                  ? "Only you and your collaborators can access"
                  : "Visible to your whole team"}{" "}
              </p>
              <button
                disabled={
                  newDiary.name === "" ||
                  newDiary.name.length > 60 ||
                  newDiary.name.search(/[^a-z_\- 0-9]/) !== -1
                }
                className="mt-5 px-4 py-1 justify-self-end gradient-button rounded-sm"
                onClick={() => setNav(2)}
              >
                Next
              </button>
            </section>
          ) : nav === 2 ? (
            <section className="grid gap-3">
              <h4 className="text-base dark:text-checkbox">
                Select from Gallery
              </h4>

              <article className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pr-4 h-[20rem] overflow-auto scrollbar">
                {images.map((url: string) => {
                  return (
                    <span
                      key={url}
                      style={{
                        backgroundImage: `url(${url})`,
                      }}
                      className={`relative h-32 cursor-pointer bg-blend-multiply dark:hover:bg-signin/60 bg-no-repeat bg-cover bg-center ${
                        newDiary.image_url === url
                          ? "border-2 dark:border-signin"
                          : ""
                      }`}
                      onClick={() =>
                        setNewDiary({ ...newDiary, image_url: url })
                      }
                    ></span>
                  );
                })}
              </article>

              {error.url.includes("/investigation/diary") &&
                error.message !== "" && (
                  <motion.article
                    variants={validVariants}
                    initial="hidden"
                    animate={error.message !== "" ? "visible" : "hidden"}
                    className="p-2 mx-auto break-words text-xs text-left dark:bg-inner border dark:border-error rounded-sm"
                  >
                    <p>{error.message}</p>
                  </motion.article>
                )}

              <button
                disabled={
                  newDiary.name === "" ||
                  newDiary.image_url === "" ||
                  createDiary.status === "loading"
                }
                className="mt-5 px-4 py-2 justify-self-end green-gradient-button rounded-sm"
                onClick={() => {
                  setError({ url: "", message: "" });
                  setNav(3);
                  createDiary.mutate(
                    {
                      newDiary: {
                        ...newDiary,
                        description: newDiary.description,
                      },
                    },
                    {
                      onSuccess: (data) => {
                        if (data) {
                          setNewDiaryInfo(data);
                          queryClient.invalidateQueries(["get-investigations"]);
                        }
                      },
                    }
                  );
                }}
              >
                Start New Investigation
              </button>
            </section>
          ) : nav === 3 ? (
            createDiary.status === "loading" ? (
              <p className="py-10 mx-auto">Please wait a moment...</p>
            ) : (
              <section className="grid gap-5 py-10 text-center text-base font-light">
                <span
                  style={{
                    backgroundImage: `url(${newDiaryInfo?.image_url})`,
                  }}
                  className="mx-auto w-12 h-12 bg-no-repeat bg-cover bg-center rounded-full"
                ></span>

                <h4>Your new investigation has just been created!</h4>
                <button
                  className="flex items-center gap-2 px-4 py-2 mx-auto dark:bg-signin/30 dark:hover:bg-signin/60 duration-100 border dark:border-signin rounded-sm"
                  onClick={() =>
                    navigate(
                      `/investigation/diary/details?diary_id=${newDiaryInfo?.diary_id}`
                    )
                  }
                >
                  <p>Go to investigation</p>
                  <FontAwesomeIcon icon={faArrowRightLong} />
                </button>
              </section>
            )
          ) : null}
        </section>
      </ModalLayout>
    </>
  );
};

export default NewInvestigation;
