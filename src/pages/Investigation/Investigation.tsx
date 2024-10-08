/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import { showVariants } from "../../constants/general";
import {
  FilterDiaries,
  GetInvestigations,
} from "../../services/investigation/investigation";
import DiarySummary from "./DiarySummary";
import {
  faXmark,
  faSearch,
  faLockOpen,
  faLock,
  faCheck,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NewInvestigation from "./NewInvestigation";
import SearchDiaries from "./SearchDiaries";
import Tags from "./Tags";
import { DiaryType, InvestigationTemplate } from "../../types/investigation";
import Loader from "../../components/Loader/Loader";
import Template from "./Template";
import PageLayout from "../../layouts/PageLayout";
import { useGeneralStore } from "src/stores/general";
import { GetInvestigationTemplates } from "src/services/investigation/templates";

const Investigation: React.FC = () => {
  const { env } = useGeneralStore();

  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("OPEN");
  const [query, setQuery] = useState<string>("");
  const [search, setSearch] = useState<boolean>(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState<string>("");
  const [previewTemplateID, setPreviewTemplateID] = useState<string>("");

  const { data: templates } = GetInvestigationTemplates(env);
  const { data: diaries } = GetInvestigations(env);
  const { data: searchResults, status: searchResultStatus } = FilterDiaries(
    env,
    search,
    query
  );

  const filteredDiaries = !search
    ? diaries?.filter(
        (diary: DiaryType) =>
          diary.is_private === isPrivate && diary.status === status
      )
    : [];

  const templateTypes = templates && Object.keys(templates);
  const filteredTemplates =
    templates && selectedTemplateType !== ""
      ? templates[selectedTemplateType]
      : [];

  useEffect(() => {
    if (templates && selectedTemplateType === "")
      setSelectedTemplateType(templateTypes[0]);
  }, [templates]);

  useEffect(() => {
    sessionStorage.page = "Investigation";
  }, []);

  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="grid content-start gap-10 p-4 w-full h-full text-sm overflow-auto scrollbar"
      >
        <section className="flex items-center justify-between gap-5">
          <article className="relative flex items-center gap-5">
            <input
              type="input"
              spellCheck="false"
              autoComplete="off"
              placeholder="Search anything..."
              value={query}
              onKeyUpCapture={(e) => {
                if (e.key === "Enter") setSearch(true);
              }}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearch(false);
              }}
              className="p-4 pr-12 w-[20rem] h-10 bg-gradient-to-b dark:bg-main border-t border-b dark:border-know/60 know focus:outline-none"
            />

            <article className="absolute right-5 flex items-center gap-2 divide-x dark:divide-checkbox">
              {query !== "" && (
                <button
                  onClick={() => {
                    setQuery("");
                    setSearch(false);
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} className="red-button" />
                </button>
              )}
              <button
                disabled={query === ""}
                className="pl-2 dark:text-signin dark:hover:text-signin/60 dark:disabled:text-secondary duration-100"
              >
                <FontAwesomeIcon
                  icon={faSearch}
                  onClick={() => setSearch(true)}
                />
              </button>
            </article>
          </article>
          <NewInvestigation />
        </section>

        {/* templates */}
        {!search && (
          <section className="grid gap-5">
            <header className="flex items-center gap-5">
              <h4 className="text-lg dark:text-white">Templates</h4>
              <ul className="flex items-center gap-2">
                {templateTypes?.map((templateType: string) => {
                  return (
                    <li
                      key={templateType}
                      className={`px-2 py-1 cursor-pointer ${
                        selectedTemplateType === templateType
                          ? "full-underlined-label"
                          : "hover:border-b dark:hover:border-signin"
                      }`}
                      onClick={() => setSelectedTemplateType(templateType)}
                    >
                      {templateType}
                    </li>
                  );
                })}
              </ul>
            </header>
            <section className="grid grid-flow-col auto-cols-max gap-5 pb-4 overflow-auto scrollbar">
              {filteredTemplates?.map((template: InvestigationTemplate) => {
                return (
                  <Fragment key={template.template_id}>
                    <button
                      className="grid content-start gap-3 w-44 h-full dark:text-white cursor-pointer group"
                      onClick={() => setPreviewTemplateID(template.template_id)}
                    >
                      <span
                        style={{
                          backgroundImage: `url(${template.image_url})`,
                        }}
                        className="relative w-full h-48 bg-blend-multiply dark:group-hover:bg-signin/60 bg-no-repeat bg-cover bg-center grayscale"
                      ></span>

                      <h2 className="">{template.name}</h2>
                    </button>

                    {/* show preview template if clicked */}
                    {previewTemplateID === template.template_id && (
                      <Template
                        template={template}
                        previewTemplateID={previewTemplateID}
                        setPreviewTemplateID={setPreviewTemplateID}
                      />
                    )}
                  </Fragment>
                );
              })}
            </section>
          </section>
        )}

        {/* status toggle */}
        {!search && (
          <section className="flex items-center gap-5 mx-auto divide-x dark:divide-checkbox">
            {/* private status toggle */}

            <article className="flex items-center gap-5 text-sm dark:text-white">
              <button
                className={`group relative flex items-center p-2 gap-2 ${
                  !isPrivate
                    ? "border-b dark:border-admin"
                    : "hover:border-b dark:hover:border-admin"
                }`}
                onClick={() => setIsPrivate(false)}
              >
                <FontAwesomeIcon
                  icon={faLockOpen}
                  className="dark:text-admin"
                />
                PUBLIC
                <span className="hidden group-hover:block absolute top-12 left-1/2 -translate-x-1/2 w-max dark:text-checkbox">
                  Visible to your whole team
                </span>
              </button>
              <button
                className={`group relative flex items-center p-2 gap-2 ${
                  isPrivate
                    ? "border-b dark:border-lock"
                    : "hover:border-b dark:hover:border-lock"
                }`}
                onClick={() => setIsPrivate(true)}
              >
                <FontAwesomeIcon icon={faLock} className="dark:text-lock" />
                PRIVATE
                <span className="hidden group-hover:block absolute top-12 left-1/2 -translate-x-1/2 w-max dark:text-checkbox">
                  Only you and your collaborators can access
                </span>
              </button>
            </article>

            {/* diary status toggle */}
            <article className="flex items-center gap-5 pl-7 text-xs dark:text-white">
              <button
                className={`flex items-center p-2 gap-2 ${
                  status === "OPEN"
                    ? "border-b dark:border-purple-500"
                    : "hover:border-b dark:hover:border-purple-500"
                }`}
                onClick={() => setStatus("OPEN")}
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="dark:text-purple-500"
                />
                OPEN
              </button>
              <button
                className={`flex items-center p-2 gap-2 ${
                  status === "CLOSED"
                    ? "border-b dark:border-no"
                    : "hover:border-b dark:hover:border-no"
                }`}
                onClick={() => setStatus("CLOSED")}
              >
                <FontAwesomeIcon icon={faCheck} className="dark:text-no" />
                CLOSED
              </button>
            </article>
          </section>
        )}

        {!search && (
          <article className="flex items-center gap-5 mx-auto">
            <svg
              width="71"
              height="1"
              viewBox="0 0 71 1"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                y1="0.5"
                x2="71"
                y2="0.5"
                stroke="#7894B0"
                strokeOpacity={0.6}
              />
            </svg>

            <p className="mx-auto w-max text-2xl dark:text-checkbox font-extralight tracking-widest">
              {" "}
              {filteredDiaries?.length}{" "}
              {filteredDiaries?.length === 1 ? "diary" : "diaries"} total
            </p>
            <svg
              width="71"
              height="1"
              viewBox="0 0 71 1"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                y1="0.5"
                x2="71"
                y2="0.5"
                stroke="#7894B0"
                strokeOpacity={0.6}
              />
            </svg>
          </article>
        )}

        {/* list of tags */}
        {!search && <Tags />}

        {/* list of diaries */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 content-start gap-x-10 gap-y-12 mb-6 w-full h-full dark:text-white">
          {filteredDiaries?.map((diary: DiaryType) => {
            return <DiarySummary key={diary.diary_id} diary={diary} />;
          })}
        </section>

        {search && searchResultStatus === "loading" && <Loader />}
        {/* search results by diaries, search queries, comments, notes */}
        {search && searchResults && (
          <SearchDiaries searchResults={searchResults} />
        )}
      </motion.main>
    </PageLayout>
  );
};

export default Investigation;
