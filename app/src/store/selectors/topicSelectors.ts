import { GeneralTopicName, topics } from "@/data";
import { createSelector } from "@reduxjs/toolkit";
import { getState } from "./baseSelectors";

const getTopicState = createSelector([getState], (state) => state.topicModel);
export const getGeneralTopics = createSelector(
  [getTopicState],
  (topicState) => {
    return Object.keys(topicState.availableTopics).map(
      (generalTopic) => generalTopic,
    ) as GeneralTopicName[];
  },
);

export const getTopics = createSelector([getTopicState], (topicState) => {
  return topicState.availableTopics ?? topics;
});

export const getChosenGeneralTopic = createSelector(
  [getTopicState],
  (topicState) => {
    return topicState.chosenGeneralTopic;
  },
);

export const getTopicInfos = createSelector(
  [getChosenGeneralTopic, getTopics],
  (generalTopic, topics) => {
    return generalTopic && topics[generalTopic];
  },
);

export const getChosenPackName = createSelector(
  [getTopicState],
  (topicState) => topicState.chosenPackName,
);
export const getQuestionAnswerPairs = createSelector(
  [getTopicInfos, getChosenPackName],
  (topicInfos, packname) => {
    return packname && topicInfos?.packs[packname];
  },
);
