// subscribe to a specific artifact type (ie. summaries, investigation)
// and a specific artifact name (ie. report name, diary id)
export const handleSubscribe = (
  distributionOptionID: string,
  frequency: string,
  addDistributionOption: any,
  subscribe: any,
  decoded: { name: string },
  artifactType: string,
  artifactCategory: string,
  artifactName: string
) => {
  // if distribution option doesn't exist, add a distribution option
  // before subscribing to the artifact
  if (distributionOptionID === "")
    addDistributionOption.mutate(
      {
        distribution: {
          delivery_destination_type: "email",
          destination_user_handle: jwt?.name,
        },
      },
      {
        onSuccess: (data: { distribution_option_id: string }) =>
          subscribe.mutate({
            subscription: {
              artifact_type: artifactType,
              artifact_category: artifactCategory,
              artifact_name: artifactName,
              subscription_frequency: frequency,
              distribution_option_id: data.distribution_option_id || "",
            },
          }),
      }
    );
  // if distribution option already exists, directly subscribe
  else
    subscribe.mutate({
      subscription: {
        artifact_type: artifactType,
        artifact_category: artifactCategory,
        artifact_name: artifactName,
        subscription_frequency: frequency,
        distribution_option_id: distributionOptionID,
      },
    });
};
