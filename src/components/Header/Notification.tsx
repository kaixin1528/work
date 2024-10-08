import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import {
  GetNotifications,
  UpdateNotificationStatus,
  ClearAllNotifications,
  HasNotification,
} from "../../services/general/general";
import { lastUpdatedAt } from "../../utils/general";
import { useGraphStore } from "src/stores/graph";
import { notificationTypes, userColors } from "src/constants/general";
import { queryClient } from "src/App";
import { useNavigate } from "react-router-dom";
import { useInvestigationStore } from "src/stores/investigation";
import { useGRCStore } from "src/stores/grc";

const Notif = () => {
  const navigate = useNavigate();

  const { setElementType, setGraphInfo, setSelectedPanelTab } = useGraphStore();
  const {
    setShowEvidencePanel,
    setSelectedEvidencePanelTab,
    setSelectedEvidenceID,
  } = useInvestigationStore();
  const {
    setGRCQuestionIDNotif,
    setSelectedGRCAssessment,
    setShowGRCPanel,
    setSelectedAnchorID,
    setSelectedGRCPanelTab,
  } = useGRCStore();

  const [showMore, setShowMore] = useState<boolean>(false);

  const { data: hasNotification } = HasNotification();
  const notifications = GetNotifications();
  const updateNotification = UpdateNotificationStatus();
  const clearAllNotifications = ClearAllNotifications();

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`group relative
          ${open ? "" : "text-opacity-90"}
          focus:outline-none group relative inline-flex items-start text-base font-medium`}
          >
            <FontAwesomeIcon
              icon={faBell}
              className="w-5 h-5 mt-1 dark:text-checkbox"
              onClick={() => notifications.mutate({})}
            />
            {hasNotification && (
              <span className="grid content-center -ml-1 w-2 h-2 text-[0.55rem] dark:bg-signin rounded-full"></span>
            )}
            <span className="hidden group-hover:block absolute top-10 right-0 p-2 w-max text-xs dark:bg-filter black-shadow rounded-sm z-20">
              Notifications
            </span>
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
            <Popover.Panel className="absolute right-0 mt-2 w-max text-sm z-30">
              {({ close }) => (
                <article
                  className={`grid content-start ${
                    showMore ? "h-[30rem]" : "h-max"
                  } w-[26rem] dark:bg-info overflow-auto scrollbar`}
                >
                  <header className="sticky top-0 flex justify-between gap-5 px-5 py-4  dark:bg-info z-10">
                    <h4>Your notifications</h4>
                    <button
                      disabled={notifications?.data?.length === 0}
                      className="px-4 text-xs dark:text-checkbox dark:hover:text-white dark:hover:bg-filter dark:disabled:text-gray-500 dark:disabled:hover:bg-transparent rounded-full duration-100"
                      onClick={() => {
                        clearAllNotifications.mutate({ state: "hidden" });
                        close();
                      }}
                    >
                      Clear All
                    </button>
                  </header>
                  <nav className="relative grid gap-2 px-5 pb-5 w-full text-xs">
                    {notifications?.data
                      ?.slice(0, showMore ? notifications.data.length - 4 : 4)
                      .map((notification: any) => {
                        return (
                          <button
                            id={notification.notification_id}
                            key={notification.notification_id}
                            className="flex items-start gap-5 py-2 px-4 cursor-pointer duration-100 dark:bg-tooltip/60 dark:hover:bg-tooltip focus:outline-none"
                            onClick={(e) => {
                              updateNotification.mutate(
                                {
                                  notificationID: notification.notification_id,
                                },
                                {
                                  onSuccess: (data) => {
                                    switch (notification.type) {
                                      case "UNORDERLY_DIARY_SUMMARY":
                                        sessionStorage.page = "Investigation";
                                        setShowEvidencePanel(true);
                                        setSelectedEvidenceID(
                                          notification.meta.evidence_id
                                        );
                                        setSelectedEvidencePanelTab("Notes");
                                        navigate(
                                          `/investigation/diary/details?diary_id=${notification.meta.diary_id}`
                                        );
                                        break;
                                      case "ALERT_NOTIFICATION":
                                        sessionStorage.page =
                                          "Enterprise Knowledge Graph";
                                        navigate(
                                          `/graph/alert-analysis/details?graph_artifact_id=${notification.meta.graph_artifact_id}&event_cluster_id=${notification.meta.event_cluster_id}`
                                        );
                                        break;
                                      case "CONTRACTUAL_OBLIGATION":
                                        sessionStorage.page =
                                          "Agreement & Contract Review";
                                        setShowGRCPanel(true);
                                        setSelectedAnchorID(
                                          notification.meta.anchor_id
                                        );
                                        setSelectedGRCPanelTab("Discussion");
                                        navigate(
                                          `/agreement-contract-review/agreement/details?agreement_id=${notification.meta.document_id}`
                                        );
                                        break;
                                      case "COMPLIANCE":
                                        if (
                                          notification.meta.status !== "error"
                                        ) {
                                          if (notification.meta.assessment_id) {
                                            sessionStorage.page =
                                              "Audits & Assessments";
                                            sessionStorage.GRCCategory =
                                              "questionnaire";
                                            if (notification.meta.answer_id)
                                              setGRCQuestionIDNotif(
                                                notification.meta.answer_id
                                              );
                                            setSelectedGRCAssessment({
                                              name: notification.meta
                                                .assessment_name,
                                              assessment_id:
                                                notification.meta.assessment_id,
                                            });
                                            sessionStorage.assessment_id =
                                              notification.meta.assessment_id;
                                            navigate(
                                              "/audits-assessments/summary"
                                            );
                                          } else {
                                            sessionStorage.page =
                                              "Regulation & Policy";
                                            if (notification.meta.version_id) {
                                              sessionStorage.GRCCategory =
                                                "policies";
                                              navigate(
                                                `/regulation-policy/document/details?document_type=${notification.meta.document_type}&document_id=${notification.meta.document_id}&policy_version_id=${notification.meta.version_id}`
                                              );
                                            } else {
                                              sessionStorage.GRCCategory =
                                                "frameworks";
                                              navigate(
                                                `/regulation-policy/document/details?document_type=${notification.meta.document_type}&document_id=${notification.meta.document_id}`
                                              );
                                            }
                                          }
                                        }
                                        break;
                                      default:
                                        queryClient.invalidateQueries([
                                          "get-notifications",
                                        ]);
                                        setElementType(
                                          data.meta.graph_element_type
                                        );
                                        setSelectedPanelTab("Notes");
                                        setGraphInfo({
                                          root: data.meta.graph_element_id,
                                          depth: 0,
                                          showOnlyAgg: false,
                                          showPanel: true,
                                        });
                                        navigate("/graph/summary");
                                        sessionStorage.page =
                                          "Enterprise Knowledge Graph";
                                    }
                                  },
                                }
                              );
                              close();
                            }}
                          >
                            <FontAwesomeIcon
                              icon={notificationTypes[notification.type]?.icon}
                              className={`mt-1 ${
                                notificationTypes[notification.type]?.iconColor
                              }`}
                            />
                            <section className="grid gap-2 text-left">
                              {notification.type ===
                              "UNORDERLY_DIARY_SUMMARY" ? (
                                <p className="break-all">
                                  {notification.description}
                                </p>
                              ) : notification.type === "ALERT_NOTIFICATION" ? (
                                <article className="flex flex-wrap items-center gap-1 break-all">
                                  {notification.meta.sender_user_email && (
                                    <article className="flex items-center gap-2">
                                      <span
                                        className={`grid content-center w-4 h-4 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                                          userColors[
                                            notification.meta.sender_user_email[0].toLowerCase()
                                          ]
                                        } shadow-sm dark:shadow-checkbox rounded-full`}
                                      >
                                        {notification.meta.sender_user_email[0]}
                                      </span>
                                      <p>
                                        <span>
                                          {notification.meta.sender_user_email}
                                        </span>{" "}
                                        shared:
                                      </p>
                                    </article>
                                  )}
                                  <img
                                    src={`/graph/alerts/${notification.meta.severity?.toLowerCase()}.svg`}
                                    alt={notification.meta.severity}
                                    className="w-4 h-4"
                                  />
                                  <p>
                                    {notificationTypes[notification.type]?.text}
                                  </p>
                                  <article className="flex items-center gap-1">
                                    <img
                                      src={`/graph/nodes/${notification.meta.integration_type.toLowerCase()}/${notification.meta.resource_type.toLowerCase()}.svg`}
                                      alt={notification.meta.resource_type}
                                      className="w-4 h-4"
                                    />{" "}
                                    <p>
                                      {notification.meta.graph_artifact_id}{" "}
                                    </p>
                                  </article>
                                </article>
                              ) : notification.type ===
                                "CONTRACTUAL_OBLIGATION" ? (
                                <p>{notification.description}</p>
                              ) : notification.type === "COMPLIANCE" &&
                                (notification.meta.answer_id ||
                                  notification.meta.assessment_id) ? (
                                <article className="grid gap-2">
                                  <p>{notification.description}</p>
                                  <span>
                                    Assessment:{" "}
                                    {notification.meta.assessment_name}
                                  </span>
                                  {notification.meta.question && (
                                    <article className="flex flex-wrap items-center gap-2">
                                      View
                                      <article className="flex items-start gap-2">
                                        <img
                                          src="/grc/questionnaire.svg"
                                          alt="questionnaire"
                                          className="w-4 h-4"
                                        />
                                        <h4>{notification.meta.question}</h4>
                                      </article>
                                    </article>
                                  )}
                                </article>
                              ) : notification.type === "COMPLIANCE" ? (
                                <article className="grid gap-2">
                                  <p>{notification.description}</p>
                                  {notification.meta?.status !== "error" && (
                                    <article className="flex flex-wrap items-center gap-2">
                                      View
                                      <article className="flex items-start gap-2">
                                        <img
                                          src={`/grc/${notification.meta.document_type}.svg`}
                                          alt={notification.meta.document_type}
                                          className="w-4 h-4"
                                        />
                                        <h4>
                                          {notification.meta.document_title}
                                        </h4>
                                      </article>
                                    </article>
                                  )}
                                </article>
                              ) : (
                                <article className="grid gap-2 text-left leading-5">
                                  {/* notification info */}
                                  <article className="grid gap-1">
                                    <p className="font-medium dark:text-white">
                                      {notification.initiator}{" "}
                                      <span className="font-normal dark:text-gray-400">
                                        {
                                          notificationTypes[notification.type]
                                            ?.text
                                        }{" "}
                                        on{" "}
                                        <span className="font-medium uppercase dark:text-checkbox">
                                          {notification.meta.graph_element_id}
                                        </span>
                                      </span>
                                    </p>{" "}
                                  </article>
                                </article>
                              )}
                              {/* how long ago since the notification is posted */}
                              {notification.time && (
                                <p className="dark:text-gray-400 text-[0.68rem]">
                                  {lastUpdatedAt(notification.time)}
                                </p>
                              )}
                            </section>
                          </button>
                        );
                      })}
                    {notifications?.data?.length > 4 && (
                      <button
                        className="px-4 py-2 dark:bg-filter/30 dark:hover:bg-filter/60 duration-100 border dark:border-filter rounded-sm"
                        onClick={() => setShowMore(!showMore)}
                      >
                        {showMore
                          ? "Show less "
                          : `${notifications.data.length - 4} more `}
                        notifications
                      </button>
                    )}
                  </nav>
                </article>
              )}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default Notif;
