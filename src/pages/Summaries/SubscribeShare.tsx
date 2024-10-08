/* eslint-disable no-restricted-globals */
import { Popover, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import {
  GetSubscriptions,
  Subscribe,
  Unsubscribe,
  GetDistributionOptions,
  AddDistributionOption,
} from "src/services/general/general";
import { GetAllReports } from "src/services/summaries/summaries";
import { Publication, Subscription, KeyStringVal } from "src/types/general";
import { parseURL, decodeJWT } from "src/utils/general";
import { handleSubscribe } from "src/utils/summaries";

const SubscribeShare = () => {
  const parsed = parseURL();
  const jwt = decodeJWT();

  const { data: subscriptions } = GetSubscriptions(true);
  const subscribe = Subscribe();
  const unsubscribe = Unsubscribe();
  const { data: distributionOptions } = GetDistributionOptions();
  const addDistributionOption = AddDistributionOption();
  const { data: publications } = GetAllReports(true);

  const distributionOptionID =
    distributionOptions?.length > 0
      ? distributionOptions[0].distribution_option_id
      : "";

  const publication = publications?.find(
    (publication: Publication) =>
      publication.artifact_name.toLowerCase().replaceAll(" ", "_") ===
      parsed.summary
  );
  const frequencies = subscriptions
    ?.filter(
      (subscription: Subscription) =>
        subscription.artifact_name.toLowerCase().replaceAll(" ", "_") ===
        parsed.summary
    )
    .reduce(
      (pV: string[], cV: KeyStringVal) => [...pV, cV.subscription_frequency],
      []
    ) as string[];

  return (
    <article className="flex items-center gap-7">
      <Popover className="relative">
        <Popover.Button className="flex items-center gap-2 dark:text-checkbox focus:outline-none">
          <img
            src="/general/subscribe.svg"
            alt="subscribe"
            className="w-4 h-4"
          />
          <p>Subscribe</p>
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
          <Popover.Panel className="pointer-events-auto absolute top-5 left-0 break-words text-xs z-10">
            <nav className="grid content-start gap-2 p-2 w-full dark:bg-panel border dark:border-filter/20 overflow-auto scrollbar">
              {["daily", "weekly", "monthly"].map((frequency) => {
                return (
                  <button
                    key={frequency}
                    className={`px-3 py-1 capitalize text-left ${
                      frequencies?.includes(frequency)
                        ? "dark:bg-signin/30"
                        : "dark:hover:bg-signin/30 duration-100"
                    } rounded-full`}
                    onClick={() => {
                      if (!frequencies?.includes(frequency))
                        handleSubscribe(
                          distributionOptionID,
                          frequency,
                          addDistributionOption,
                          subscribe,
                          jwt,
                          publication?.artifact_type,
                          publication?.artifact_category,
                          publication?.artifact_name
                        );
                      else
                        unsubscribe.mutate({
                          artifactType: publication?.artifact_type,
                          artifactCategory: publication?.artifact_category,
                          artifactName: publication?.artifact_name,
                          frequency: frequency,
                        });
                    }}
                  >
                    {frequency}
                  </button>
                );
              })}
            </nav>
          </Popover.Panel>
        </Transition>
      </Popover>

      {/* share */}
      {/* <button className="flex items-center gap-2">
        <img src="/general/share.svg" alt="share" className="w-4 h-4" />
        <p>Share</p>
      </button> */}
    </article>
  );
};

export default SubscribeShare;
