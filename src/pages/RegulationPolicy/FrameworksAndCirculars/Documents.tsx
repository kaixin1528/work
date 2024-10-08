/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState } from "react";
import { KeyNumVal, KeyStringVal } from "src/types/general";
import {
  convertToUTCShortString,
  checkSuperOrSiteAdmin,
  checkSuperOrGRCAdmin,
  convertToDate,
  convertToMin,
} from "src/utils/general";
import { useNavigate } from "react-router-dom";
import { attributeColors, pageSize } from "src/constants/general";
import TablePagination from "src/components/General/TablePagination";
import { GetFrameworksOrCirculars } from "src/services/regulation-policy/framework";
import Loader from "src/components/Loader/Loader";
import AllTags from "../../../components/GRC/AllTags";
import SelectFrameworks from "./SelectFrameworks";
import RegionFilter from "src/components/Filter/RegulationPolicy/RegionFilter";
import VerticalFilter from "src/components/Filter/RegulationPolicy/VerticalFilter";
import NewDocument from "./NewDocument/NewDocument";
import Sort from "../../../components/GRC/Sort";
import { frameworkSortingTypes } from "src/constants/grc";
import EditDocument from "./EditDocument";
import {
  SearchGRCRegion,
  SearchGRCVerticals,
} from "src/services/regulation-policy/overview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faPlus } from "@fortawesome/free-solid-svg-icons";
import { utcFormat } from "d3-time-format";
import RegAuthFilter from "src/components/Filter/RegulationPolicy/RegAuthFilter";

const Documents = ({ documentType }: { documentType: string }) => {
  const navigate = useNavigate();
  const isSuperOrSiteAdmin = checkSuperOrSiteAdmin();
  const isSuperOrGRCAdmin = checkSuperOrGRCAdmin();
  const isFramework = documentType === "frameworks";

  const [filters, setFilters] = useState<any>({
    regulatory_authority: "All",
    regions: [],
    verticals: [],
    mapped_to_policy: "",
    in_progress: false,
  });
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectFramework, setSelectFramework] = useState<boolean>(false);
  const [sort, setSort] = useState<KeyStringVal>({
    direction: "",
    order_by: "",
  });

  const { data: documents, status: documentsStatus } = GetFrameworksOrCirculars(
    documentType,
    filters.regulatory_authority,
    filters.regions,
    filters.verticals,
    filters.mapped_to_policy,
    pageNumber,
    selectedTags,
    sort
  );
  const searchRegions = SearchGRCRegion();
  const searchVerticals = SearchGRCVerticals();

  const filteredDocuments = filters.in_progress
    ? documents?.data?.filter((doc: KeyNumVal) => doc.estimated_time_left > 0)
    : documents?.data;
  const totalCount = documents?.pager.total_results || 0;
  const totalPages = documents?.pager.num_pages || 0;
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;
  const regulatoryAuthorities = [
    ...new Set(
      documents?.data?.reduce(
        (pV: string[], cV: KeyStringVal) => [...pV, cV.regulatory_authority],
        []
      )
    ),
  ] as string[];

  const goToDocument = (document: KeyStringVal) => {
    sessionStorage.GRCCategory = documentType;
    navigate(
      `/regulation-policy/document/details?document_type=${documentType}&document_id=${document.id}`
    );
  };

  return (
    <section className="flex flex-col flex-grow gap-5">
      {sessionStorage.select_framework ? (
        <SelectFrameworks
          regAuth={filters.regulatory_authority}
          setSelectFramework={setSelectFramework}
        />
      ) : (
        <>
          <RegAuthFilter
            label="Regulatory Authority"
            inputs={filters}
            setInputs={setFilters}
            isFramework={isFramework}
          />
          <section className="grid gap-3">
            <article className="flex items-center gap-5 divide-x dark:divide-checkbox">
              <button
                className="dark:hover:text-checkbox/60 duration-100"
                onClick={() =>
                  searchRegions.mutate(
                    {
                      region: "",
                    },
                    {
                      onSuccess: (data) => {
                        const regionCodes = data.reduce(
                          (pV: string[], cV: KeyStringVal) => [
                            ...pV,
                            cV.country_code_alpha_3,
                          ],
                          []
                        );
                        searchVerticals.mutate(
                          {
                            vertical: "",
                          },
                          {
                            onSuccess: (verticalData) => {
                              const verticals = verticalData.reduce(
                                (pV: string[], cV: KeyStringVal) => [
                                  ...pV,
                                  `${cV.industry}-${cV.sub_category}`,
                                ],
                                []
                              );
                              setFilters({
                                ...filters,
                                regions: regionCodes,
                                verticals: verticals,
                              });
                            },
                          }
                        );
                        setFilters({
                          ...filters,
                          regions: regionCodes,
                        });
                      },
                    }
                  )
                }
              >
                Select All
              </button>
              <button
                className="pl-5 dark:hover:text-checkbox/60 duration-100"
                onClick={() =>
                  setFilters({ ...filters, regions: [], verticals: [] })
                }
              >
                Deselect All
              </button>
            </article>
            <article className="flex flex-wrap items-center gap-x-20 gap-y-10">
              <RegionFilter
                label="Region"
                inputs={filters}
                setInputs={setFilters}
              />
              <VerticalFilter
                label="Vertical"
                inputs={filters}
                setInputs={setFilters}
              />
            </article>
          </section>
          <article className="flex items-center gap-5">
            {isFramework ? (
              <>
                {(isSuperOrSiteAdmin || isSuperOrGRCAdmin) && (
                  <NewDocument documentType={documentType} />
                )}
                {documents?.data?.length > 0 && (
                  <button
                    className="flex items-center gap-2 px-8 py-2 mx-auto text-base dark:text-white green-gradient-button rounded-sm"
                    onClick={() => {
                      setSelectFramework(true);
                      sessionStorage.select_framework = "true";
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <h4>Select Frameworks</h4>
                  </button>
                )}
              </>
            ) : (
              documents?.data?.length > 0 && (
                <NewDocument documentType={documentType} />
              )
            )}
          </article>
          <AllTags
            documentType="frameworks"
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
          <article className="flex items-center gap-5">
            <Sort
              sortingTypes={frameworkSortingTypes}
              sort={sort}
              setSort={setSort}
            />
            <article className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.in_progress}
                onChange={() =>
                  setFilters({ ...filters, in_progress: !filters.in_progress })
                }
                className="form-checkbox w-4 h-4 dark:ring-0 dark:text-no dark:focus:border-no focus:ring dark:focus:ring-offset-0 dark:focus:ring-no focus:ring-opacity-50 rounded-full"
              />
              <label>In progress</label>
            </article>
            {!isFramework && (
              <article className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.mapped_to_policy === "MappedToPolicy"}
                  onChange={() => {
                    if (filters.mapped_to_policy === "")
                      setFilters({
                        ...filters,
                        mapped_to_policy: "MappedToPolicy",
                      });
                    else setFilters({ ...filters, mapped_to_policy: "" });
                  }}
                  className="form-checkbox w-4 h-4 dark:ring-0 dark:text-no dark:focus:border-no focus:ring dark:focus:ring-offset-0 dark:focus:ring-no focus:ring-opacity-50 rounded-full"
                />
                <label>Has mapping</label>
              </article>
            )}
          </article>
          {documentsStatus === "loading" ? (
            <Loader />
          ) : documents?.data ? (
            <section className="flex flex-col flex-grow gap-5 overflow-auto scrollbar">
              {filteredDocuments?.length > 0 ? (
                <section className="flex flex-col flex-grow gap-3 pb-4 w-full h-full overflow-auto scrollbar">
                  {filters.regulatory_authority !== "All" && (
                    <TablePagination
                      totalPages={totalPages}
                      beginning={beginning}
                      end={end}
                      totalCount={totalCount}
                      pageNumber={pageNumber}
                      setPageNumber={setPageNumber}
                    />
                  )}
                  {filters.regulatory_authority === "All" ? (
                    <section className="flex flex-col flex-grow gap-5">
                      {regulatoryAuthorities?.map((auth) => {
                        const filtered = filteredDocuments?.filter(
                          (document: KeyStringVal) =>
                            document.regulatory_authority === auth ||
                            document.additional_regulatory_authorities?.includes(
                              auth
                            )
                        );
                        return (
                          <article key={auth} className="grid gap-3">
                            <h3 className="text-lg">{auth}</h3>
                            <ul className="flex flex-col flex-grow gap-3 pb-2 overflow-auto scrollbar">
                              {filtered?.map((document: any) => {
                                return (
                                  <li
                                    key={document.id}
                                    className="grid gap-3 p-4 cursor-pointer bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 dark:hover:to-white/30 duration-100 rounded-md"
                                    onClick={() => goToDocument(document)}
                                  >
                                    {document.status === "READY" ? (
                                      <span
                                        className={`text-sm ${
                                          attributeColors[
                                            document.status.toLowerCase()
                                          ]
                                        }`}
                                      >
                                        {document.status.replaceAll("_", " ")}
                                      </span>
                                    ) : (
                                      document.estimated_time_left > 0 && (
                                        <span className="px-3 py-1 w-max text-sm dark:bg-purple-500 rounded-full">
                                          <FontAwesomeIcon icon={faClock} />{" "}
                                          Check back in{" "}
                                          {utcFormat(
                                            `${
                                              convertToMin(
                                                document.estimated_time_left
                                              ) > 60
                                                ? "%H hr %M min"
                                                : convertToMin(
                                                    document.estimated_time_left
                                                  ) >= 1
                                                ? "%M min"
                                                : "%S sec"
                                            }`
                                          )(
                                            convertToDate(
                                              document.estimated_time_left
                                            )
                                          )}{" "}
                                        </span>
                                      )
                                    )}
                                    <header className="flex flex-wrap items-start justify-between gap-x-20 gap-y-5 break-words text-left text-base dark:text-white">
                                      <article className="flex items-start gap-2 w-3/5">
                                        <img
                                          src={document.thumbnail_uri}
                                          alt={document.regulatory_authority}
                                          className="w-6 h-6 rounded-full"
                                        />
                                        <h4 className="text-xl font-medium">
                                          {document.name}
                                        </h4>
                                      </article>
                                      <article className="flex flex-wrap items-center gap-5">
                                        <article>
                                          {document.regulatory_authority && (
                                            <span>
                                              {document.regulatory_authority}
                                            </span>
                                          )}{" "}
                                          {document.regulatory_date &&
                                            `| ${convertToUTCShortString(
                                              Number(document.regulatory_date)
                                            )}`}
                                        </article>
                                        {(!isFramework ||
                                          (isFramework &&
                                            (isSuperOrSiteAdmin ||
                                              isSuperOrGRCAdmin))) && (
                                          <EditDocument
                                            documentType={documentType}
                                            documentID={document.id}
                                          />
                                        )}
                                      </article>
                                    </header>
                                    {document.additional_regulatory_authorities
                                      ?.length > 0 && (
                                      <article className="flex flex-wrap items-center gap-2">
                                        <span>
                                          Additional Regulatory Authorities
                                        </span>
                                        {document.additional_regulatory_authorities.map(
                                          (auth: string, index: number) => {
                                            return (
                                              <span
                                                key={index}
                                                className="px-4 dark:bg-org rounded-full"
                                              >
                                                {auth}
                                              </span>
                                            );
                                          }
                                        )}
                                      </article>
                                    )}
                                    {document.tags?.length > 0 && (
                                      <article className="flex flex-wrap items-center gap-2">
                                        <span>Tags</span>
                                        {document.tags.map(
                                          (tag: string, index: number) => {
                                            return (
                                              <span
                                                key={index}
                                                className="px-4 dark:bg-card rounded-full"
                                              >
                                                {tag}
                                              </span>
                                            );
                                          }
                                        )}
                                      </article>
                                    )}
                                    {document.regions?.length > 0 && (
                                      <article className="flex flex-wrap items-center gap-2">
                                        <span>Regions</span>
                                        {document.regions.map(
                                          (tag: string, index: number) => {
                                            return (
                                              <span
                                                key={index}
                                                className="px-4 dark:bg-card rounded-full"
                                              >
                                                {tag}
                                              </span>
                                            );
                                          }
                                        )}
                                      </article>
                                    )}
                                    {document.verticals?.length > 0 && (
                                      <article className="flex flex-wrap items-center gap-2">
                                        <span>Verticals</span>
                                        {document.verticals.map(
                                          (tag: string, index: number) => {
                                            return (
                                              <span
                                                key={index}
                                                className="px-4 dark:bg-card rounded-full"
                                              >
                                                {tag}
                                              </span>
                                            );
                                          }
                                        )}
                                      </article>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </article>
                        );
                      })}
                    </section>
                  ) : (
                    <ul className="flex flex-col flex-grow gap-3 pb-2 overflow-auto scrollbar">
                      {filteredDocuments.map((document: any) => {
                        return (
                          <li
                            key={document.id}
                            className="grid gap-3 p-4 dark:bg-task dark:hover:bg-task/30 black-shadow"
                            onClick={() => goToDocument(document)}
                          >
                            <header className="flex flex-wrap items-start justify-between gap-x-20 gap-y-5 break-words cursor-pointer text-left text-base dark:text-white">
                              <article className="flex items-start gap-2 w-3/5">
                                <img
                                  src={document.thumbnail_uri}
                                  alt={document.regulatory_authority}
                                  className="w-6 h-6 rounded-full"
                                />
                                <h4 className="text-xl font-medium">
                                  {document.name}
                                </h4>
                              </article>
                              <article className="flex flex-wrap items-center gap-5">
                                <article>
                                  {document.regulatory_authority && (
                                    <span>{document.regulatory_authority}</span>
                                  )}{" "}
                                  {document.regulatory_date &&
                                    `| ${convertToUTCShortString(
                                      Number(document.regulatory_date)
                                    )}`}
                                </article>
                                {(!isFramework ||
                                  (isFramework &&
                                    (isSuperOrSiteAdmin ||
                                      isSuperOrGRCAdmin))) && (
                                  <EditDocument
                                    documentType={documentType}
                                    documentID={document.id}
                                  />
                                )}
                              </article>
                            </header>
                            {document.tags?.length > 0 && (
                              <article className="flex flex-wrap items-center gap-2">
                                <span>Tags</span>
                                {document.tags.map(
                                  (tag: string, index: number) => {
                                    return (
                                      <span
                                        key={index}
                                        className="px-4 dark:bg-org rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    );
                                  }
                                )}
                              </article>
                            )}
                            {document.regions?.length > 0 && (
                              <article className="flex flex-wrap items-center gap-2">
                                <span>Regions</span>
                                {document.regions.map(
                                  (tag: string, index: number) => {
                                    return (
                                      <span
                                        key={index}
                                        className="px-4 dark:bg-org rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    );
                                  }
                                )}
                              </article>
                            )}
                            {document.verticals?.length > 0 && (
                              <article className="flex flex-wrap items-center gap-2">
                                <span>Verticals</span>
                                {document.verticals.map(
                                  (tag: string, index: number) => {
                                    return (
                                      <span
                                        key={index}
                                        className="px-4 dark:bg-org rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    );
                                  }
                                )}
                              </article>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>
              ) : (
                <section className="flex items-center place-content-center gap-10 w-full h-full">
                  <img
                    src={`/grc/${documentType}-placeholder.svg`}
                    alt={`${documentType} placeholder`}
                    className="w-40 h-40"
                  />
                  <article className="grid gap-3">
                    <h4 className="text-xl font-extrabold">
                      {isFramework
                        ? "Regulatory Frameworks & Standards"
                        : "Circulars"}
                    </h4>
                    <h4>No {documentType} available</h4>
                    {isFramework ? (
                      <SelectFrameworks
                        regAuth={filters.regulatory_authority}
                        setSelectFramework={setSelectFramework}
                      />
                    ) : (
                      <NewDocument documentType={documentType} />
                    )}
                  </article>
                </section>
              )}
            </section>
          ) : null}
        </>
      )}
    </section>
  );
};

export default Documents;
