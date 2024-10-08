/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { baseURL } from "src/constants/general";
import {
  GetSlackClientID,
  GetSlackOTT,
} from "src/services/settings/integrations";

const SLACK = () => {
  const { data: getOTT, status: ottStatus } = GetSlackOTT();
  const { data: getClientID, status: clientIDStatus } = GetSlackClientID();

  return (
    <section className="grid content-start gap-5 py-6 h-full overflow-auto scrollbar">
      {ottStatus === "success" && clientIDStatus === "success" ? (
        getOTT && getClientID ? (
          <a
            href={`https://slack.com/oauth/v2/authorize?scope=channels%3Ajoin%2Cchannels%3Amanage%2Cchannels%3Awrite.invites%2Cim%3Awrite%2Cmpim%3Awrite%2Cmpim%3Awrite.invites%2Cusers%3Aread.email%2Cusers%3Aread%2Cchannels%3Ahistory%2Cmpim%3Ahistory&user_scope=&redirect_uri=${encodeURIComponent(
              `${baseURL}/settings/details?section=integrations&integration=SLACK`
            )}&client_id=${getClientID}&state=${getOTT}`}
            className="flex items-center gap-2 px-4 py-2 w-max dark:bg-signin/10 dark:hover:bg-signin/20 duration-100 border dark:border-signin rounded-sm"
          >
            <img
              src="/general/integrations/slack.svg"
              alt="slack"
              className="w-5 h-5"
            />
            Add to Slack
          </a>
        ) : (
          <article className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCheck} className="text-no" />
            <p>Added to Slack</p>
          </article>
        )
      ) : null}
    </section>
  );
};

export default SLACK;
