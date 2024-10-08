/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { useNavigate } from "react-router-dom";
import TablePagination from "src/components/General/TablePagination";
import { pageSize } from "src/constants/general";
import { heatmapColors } from "src/constants/summaries";
import ListLayout from "src/layouts/ListLayout";
import ModalLayout from "src/layouts/ModalLayout";
import { GetQueryLookup } from "src/services/graph/search";
import { GetAllAccounts } from "src/services/settings/integrations";
import {
  GetAssetServices,
  GetASDetails,
  GetASResourceTypes,
} from "src/services/summaries/cyber-risk/assets-services";
import { useGraphStore } from "src/stores/graph";
import { useSummaryStore } from "src/stores/summaries";
import { KeyStringVal, ListHeader } from "src/types/general";
import { Account } from "src/types/settings";
import { getCustomerID, sortTextData } from "src/utils/general";
import { handleViewSnapshot } from "src/utils/graph";

const Assets = () => {
  const navigate = useNavigate();
  const customerID = getCustomerID();

  const { period } = useSummaryStore();
  const {
    setNavigationView,
    setGraphSearch,
    setGraphSearching,
    setGraphSearchString,
    setSnapshotTime,
  } = useGraphStore();

  const [selectedBucket, setSelectedBucket] = useState<string>("");
  const [selectedReferenceID, setSelectedReferenceID] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);

  const sourceAccountID = selectedBucket
    .split("+")[0]
    .replace("All Accounts", "all");
  const serviceType = selectedBucket.split("+")[1];

  const { data: allAccounts } = GetAllAccounts(customerID);
  const { data: assetServices } = GetAssetServices(period);
  const { data: serviceResourceTypes } = GetASResourceTypes(
    period,
    sourceAccountID,
    serviceType
  );
  const { data: assetServiceDetails } = GetASDetails(
    period,
    sourceAccountID,
    selectedReferenceID,
    pageNumber
  );
  const queryLookup = GetQueryLookup();

  const keys =
    assetServices?.length > 0
      ? Object.keys(assetServices[0])
          .filter((k) => k !== "service_type")
          .sort()
      : [];
  const allAccountsIndex = keys.findIndex((key) => key === "All Accounts");
  keys.unshift(...keys.splice(allAccountsIndex, 1));
  const overallMax = assetServices?.reduce(
    (allItems: number, currentItem: { [x: string]: number }) => {
      const allItemMax = keys.reduce((itemMax, k) => {
        return currentItem[k] > itemMax ? currentItem[k] : itemMax;
      }, 0) as number;
      return (allItemMax > allItems ? allItemMax : allItems) as number;
    },
    0
  );
  const sortedAssetServices = sortTextData(
    assetServices,
    "service_type",
    "asc"
  );
  const filteredAccounts = allAccounts
    ? [{ integration_type: "ALL", customer_cloud_id: "all" }, ...allAccounts]
    : [];
  const totalCount = assetServiceDetails?.pager.total_results || 0;
  const totalPages = assetServiceDetails?.pager.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  useEffect(() => {
    if (serviceResourceTypes?.length > 0 && selectedReferenceID === "")
      setSelectedReferenceID(serviceResourceTypes[0].reference_id);
  }, [serviceResourceTypes]);

  useEffect(() => {
    setPageNumber(1);
  }, [selectedReferenceID]);

  const handleOnClose = () => setSelectedBucket("");

  return (
    <section className="grid content-start gap-5 p-6 dark:bg-card black-shadow">
      <h4>Assets and Services</h4>
      <section className="flex items-start w-full h-full text-sm">
        <ul className="grid">
          {keys.map((key: string) => {
            const integration = filteredAccounts
              ?.find((account: Account) => account.customer_cloud_id === key)
              ?.integration_type?.toLowerCase();
            return (
              <li
                key={key}
                className="py-[1.31rem] pr-[1.3rem] text-center w-max text-ellipsis"
              >
                <header className="flex items-center gap-2">
                  {integration && (
                    <img
                      src={`/general/integrations/${integration}.svg`}
                      alt={integration}
                      className="w-4 h-4"
                    />
                  )}
                  {key.replaceAll("_", " ")}
                </header>
              </li>
            );
          })}
        </ul>
        {sortedAssetServices?.map((service: any) => {
          return (
            <article key={service.service_type} className="grid w-full h-full">
              <ul className="grid">
                {keys.map((key: string) => {
                  const pct = Math.floor(
                    Number((service[key] / overallMax).toFixed(1)) * 100
                  );
                  return (
                    <Fragment key={`${key}+${service.service_type}`}>
                      <li
                        className={`p-5 text-center ${heatmapColors[pct]} cursor-pointer dark:hover:bg-signin/30 duration-100 border-1 dark:border-checkbox rounded-sm`}
                        onClick={() => {
                          setSelectedReferenceID("");
                          setSelectedBucket(`${key}+${service.service_type}`);
                        }}
                      >
                        {service[key] || 0}
                      </li>
                      <ModalLayout
                        showModal={
                          selectedBucket === `${key}+${service.service_type}`
                        }
                        onClose={handleOnClose}
                      >
                        {serviceResourceTypes ? (
                          serviceResourceTypes.length > 0 ? (
                            <section className="grid gap-5 mt-5 w-full overflow-auto scrollbar">
                              <nav className="flex items-center gap-2 pb-2 w-full text-sm overflow-auto scrollbar">
                                {serviceResourceTypes.map(
                                  (resource: KeyStringVal) => {
                                    return (
                                      <article
                                        key={resource.reference_id}
                                        className={`flex flex-wrap items-center gap-2 p-2 w-max cursor-pointer ${
                                          selectedReferenceID ===
                                          resource.reference_id
                                            ? "selected-button"
                                            : "not-selected-button"
                                        }`}
                                        onClick={() =>
                                          setSelectedReferenceID(
                                            resource.reference_id
                                          )
                                        }
                                      >
                                        <img
                                          src={`/graph/nodes/${resource.integration_type.toLowerCase()}/${resource.resource_type.toLowerCase()}.svg`}
                                          alt={resource.resource_type}
                                          className="mx-auto w-6 h-6"
                                        />
                                        <p className="w-max">
                                          {resource.resource_type_name}
                                        </p>
                                      </article>
                                    );
                                  }
                                )}
                              </nav>
                              <TablePagination
                                totalPages={totalPages}
                                beginning={beginning}
                                end={end}
                                totalCount={totalCount}
                                pageNumber={pageNumber}
                                setPageNumber={setPageNumber}
                              />
                              <ListLayout
                                height="max-h-[30rem]"
                                listHeader={
                                  assetServiceDetails?.metadata.headers
                                }
                              >
                                {assetServiceDetails?.data.map((row: any) => {
                                  return (
                                    <tr
                                      key={row.resource_id}
                                      className="px-4 py-2 dark:even:bg-card"
                                    >
                                      {assetServiceDetails?.metadata.headers.map(
                                        (col: ListHeader) => {
                                          return (
                                            <td
                                              key={col.property_name}
                                              className="px-3 py-2 w-1/2"
                                            >
                                              <p
                                                className={`${
                                                  col.property_name ===
                                                  "resource_id"
                                                    ? "break-all hover:underline cursor-pointer"
                                                    : ""
                                                }`}
                                                onClick={() => {
                                                  if (
                                                    col.property_name ===
                                                    "resource_id"
                                                  )
                                                    queryLookup.mutate(
                                                      {
                                                        requestData: {
                                                          query_type:
                                                            "view_in_graph",
                                                          id: row[
                                                            col.property_name
                                                          ],
                                                        },
                                                      },
                                                      {
                                                        onSuccess: (
                                                          queryString
                                                        ) =>
                                                          handleViewSnapshot(
                                                            queryString,
                                                            setNavigationView,
                                                            setGraphSearch,
                                                            setGraphSearching,
                                                            setGraphSearchString,
                                                            navigate,
                                                            setSnapshotTime,
                                                            Number(
                                                              row.latest_timestamp
                                                            )
                                                          ),
                                                      }
                                                    );
                                                }}
                                              >
                                                {col.data_type === "json" ? (
                                                  <ReactJson
                                                    src={row[col.property_name]}
                                                    name={null}
                                                    quotesOnKeys={false}
                                                    displayDataTypes={false}
                                                    theme="harmonic"
                                                    collapsed={2}
                                                  />
                                                ) : (
                                                  String(row[col.property_name])
                                                )}
                                              </p>
                                            </td>
                                          );
                                        }
                                      )}
                                    </tr>
                                  );
                                })}
                              </ListLayout>
                            </section>
                          ) : (
                            <p>No data available</p>
                          )
                        ) : null}
                      </ModalLayout>
                    </Fragment>
                  );
                })}
                <li className="pt-2 text-center">{service.service_type}</li>
              </ul>
            </article>
          );
        })}
      </section>
    </section>
  );
};

export default Assets;
