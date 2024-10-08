/* eslint-disable no-restricted-globals */
import {
  faArrowRightLong,
  faComment,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { GoToDiary } from "../../services/investigation/investigation";
import {
  CommentType,
  DiaryType,
  FilterDiaries,
  GeneralEvidenceType,
  NoteType,
} from "../../types/investigation";
import { useGeneralStore } from "src/stores/general";
const SearchDiaries = ({ searchResults }: { searchResults: FilterDiaries }) => {
  const navigate = useNavigate();

  const { env } = useGeneralStore();

  const gotToDiary = GoToDiary(env);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 content-start gap-x-20 gap-y-12 mb-6 w-full h-full dark:text-white">
      {/* diaries */}
      <section className="grid content-start gap-5">
        <h3 className="tracking-widest text-xl border-b-1 dark:border-checkbox">
          DIARIES ({searchResults.diaries.length})
        </h3>
        {searchResults.diaries.length > 0 ? (
          <ul className="grid gap-3 max-h-[20rem] overflow-auto scrollbar">
            {searchResults.diaries.map((diary: DiaryType) => {
              return (
                <li
                  key={diary.diary_id}
                  className="flex items-center gap-3 cursor-pointer dark:hover:bg-filter/30 duration-100 rounded-sm"
                  onClick={() =>
                    navigate(
                      `/investigation/diary/details?diary_id=${diary.diary_id}`
                    )
                  }
                >
                  {/* background image section */}
                  <span
                    style={{
                      backgroundImage: `url(${diary.image_url})`,
                    }}
                    className="w-10 h-10 bg-no-repeat bg-cover bg-center rounded-full"
                  ></span>
                  <h4 className="max-w-[15rem] lg:max-w-[30rem] truncate text-ellipsis">
                    {diary.name}
                  </h4>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="dark:text-checkbox">No results found</p>
        )}
      </section>

      {/* queries */}
      <section className="grid content-start gap-5">
        <h3 className="tracking-widest text-xl border-b-1 dark:border-checkbox">
          QUERIES ({searchResults.search_queries.length})
        </h3>
        {searchResults.search_queries.length > 0 ? (
          <ul className="grid gap-3 max-h-[20rem] overflow-auto scrollbar">
            {searchResults.search_queries.map((query: GeneralEvidenceType) => {
              return (
                <li key={query.evidence_id} className="flex items-center gap-3">
                  <img
                    src={`/investigation/evidence-type/${query.evidence_type.toLowerCase()}.svg`}
                    alt={query.evidence_type.toLowerCase()}
                    className="w-4 h-4 dark:text-checkbox"
                  />
                  <article className="flex items-start gap-2 py-1 px-4 max-w-[15rem] lg:max-w-[30rem] truncate text-ellipsis dark:bg-signin/20 border dark:border-signin rounded-sm">
                    {query.evidence_type === "FIREWALL_SEARCH" && (
                      <img
                        src={`/general/integrations/${query.results.cloud}.svg`}
                        alt={String(query.results.cloud)}
                        className="w-4 h-4"
                      />
                    )}
                    <p>{query.query_string}</p>
                  </article>
                  <button
                    className="flex items-center gap-2 dark:hover:text-filter duration-100 tracking-wide font-extralight"
                    onClick={() =>
                      navigate(
                        `/investigation/diary/details?diary_id=${query.diary_id}`
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faArrowRightLong} />
                    <p>DIARY</p>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="dark:text-checkbox">No results found</p>
        )}
      </section>

      {/* comments */}
      <section className="grid content-start gap-5">
        <h3 className="tracking-widest text-xl border-b-1 dark:border-checkbox">
          COMMENTS ({searchResults.comments.length})
        </h3>
        {searchResults.comments.length > 0 ? (
          <ul className="grid gap-3 max-h-[20rem] overflow-auto scrollbar">
            {searchResults.comments.map((comment: CommentType) => {
              return (
                <li
                  key={comment.comment_id}
                  className="flex items-center gap-3"
                >
                  <FontAwesomeIcon
                    icon={faComment}
                    className="dark:text-contact"
                  />
                  <h4 className="max-w-[15rem] lg:max-w-[30rem] truncate text-ellipsis">
                    {comment.body}
                  </h4>
                  <button
                    className="flex items-center gap-2 dark:hover:text-filter duration-100 tracking-wide font-extralight"
                    onClick={() =>
                      gotToDiary.mutate({
                        evidenceID: comment.evidence_id,
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faArrowRightLong} />
                    <p>DIARY</p>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="dark:text-checkbox">No results found</p>
        )}
      </section>

      {/* notes */}
      <section className="grid content-start gap-5">
        <h3 className="tracking-widest text-xl border-b-1 dark:border-checkbox">
          NOTES ({searchResults.notes.length})
        </h3>
        {searchResults.notes.length > 0 ? (
          <ul className="grid gap-3 max-h-[20rem] overflow-auto scrollbar">
            {searchResults.notes.map((note: NoteType) => {
              return (
                <li key={note.note_id} className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faNoteSticky}
                    className="dark:text-note"
                  />
                  <h4 className="max-w-[15rem] lg:max-w-[30rem] truncate text-ellipsis">
                    {note.content}
                  </h4>
                  <button
                    className="flex items-center gap-2 dark:hover:text-filter duration-100 tracking-wide font-extralight"
                    onClick={() =>
                      gotToDiary.mutate({
                        evidenceID: note.evidence_id,
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faArrowRightLong} />
                    <p>DIARY</p>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="dark:text-checkbox">No results found</p>
        )}
      </section>
    </section>
  );
};

export default SearchDiaries;
