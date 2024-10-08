/* eslint-disable react-hooks/exhaustive-deps */
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  AddDistributionOption,
  GetDistributionOptions,
  GetSubscriptions,
  Subscribe,
  Unsubscribe,
} from "src/services/general/general";
import { KeyStringVal } from "src/types/general";
import { decodeJWT } from "src/utils/general";
import { handleSubscribe } from "src/utils/summaries";

const SubscriptionDetails = ({
  subscription,
}: {
  subscription: KeyStringVal;
}) => {
  const jwt = decodeJWT();

  const [selectedFrequencies, setSelectedFrequencies] = useState<string[]>([]);

  const { data: subscriptions } = GetSubscriptions(true);
  const subscribe = Subscribe();
  const unsubscribe = Unsubscribe();
  const { data: distributionOptions } = GetDistributionOptions();
  const addDistributionOption = AddDistributionOption();

  const distributionOptionID =
    distributionOptions?.length > 0
      ? distributionOptions[0].distribution_option_id
      : "";

  useEffect(() => {
    if (subscriptions?.length > 0 && selectedFrequencies.length === 0) {
      const frequencies = subscriptions
        .filter(
          (curSubscription: KeyStringVal) =>
            curSubscription.artifact_type === subscription.artifact_type &&
            curSubscription.artifact_category ===
              subscription.artifact_category &&
            curSubscription.artifact_name === subscription.artifact_name
        )
        .reduce(
          (pV: string[], cV: KeyStringVal) => [
            ...pV,
            cV.subscription_frequency,
          ],
          []
        );
      setSelectedFrequencies(frequencies);
    }
  }, [subscriptions]);

  return (
    <li
      key={subscription.artifact_name}
      className="grid md:flex items-center gap-3"
    >
      <header className="flex items-center gap-3">
        <FontAwesomeIcon icon={faArrowRightLong} />
        <h4>{subscription.artifact_name}</h4>
      </header>
      <nav className="flex flex-wrap items-center gap-2">
        {["daily", "weekly", "monthly"].map((frequency) => {
          return (
            <button
              key={frequency}
              disabled={
                subscribe.status === "loading" ||
                unsubscribe.status === "loading"
              }
              className={`py-1 px-4 capitalize text-xs ${
                selectedFrequencies.includes(frequency)
                  ? "dark:bg-no/20 border dark:border-no"
                  : "dark:bg-filter/20 dark:hover:bg-filter/40 duration-100 border dark:border-filter"
              } rounded-full`}
              onClick={() => {
                if (selectedFrequencies.includes(frequency)) {
                  setSelectedFrequencies(
                    selectedFrequencies.filter(
                      (curFrequency) => curFrequency !== frequency
                    )
                  );
                  unsubscribe.mutate({
                    artifactType: subscription?.artifact_type,
                    artifactCategory: subscription?.artifact_category,
                    artifactName: subscription?.artifact_name,
                    frequency: frequency,
                  });
                } else {
                  setSelectedFrequencies([...selectedFrequencies, frequency]);
                  handleSubscribe(
                    distributionOptionID,
                    frequency,
                    addDistributionOption,
                    subscribe,
                    jwt,
                    subscription?.artifact_type,
                    subscription?.artifact_category,
                    subscription?.artifact_name
                  );
                }
              }}
            >
              {frequency}
            </button>
          );
        })}
      </nav>
    </li>
  );
};

export default SubscriptionDetails;
