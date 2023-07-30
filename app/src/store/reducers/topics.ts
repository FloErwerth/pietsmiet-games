import { createAction, createReducer } from "@reduxjs/toolkit";
import { GeneralTopicName, topics, Topics } from "@/data";

export const setChosenGeneralTopic = createAction<GeneralTopicName>(
  "topic/set_chosen_topic",
);
export const setChosenPackName = createAction<string>("topic/set_difficulty");
export const resetSelections = createAction("topic/reset_selections");

export type TopicState = {
  availableTopics: Topics;
  chosenGeneralTopic: GeneralTopicName | undefined;
  chosenPackName: string | undefined;
};
const initalTopicState: TopicState = {
  availableTopics: topics,
  chosenGeneralTopic: undefined,
  chosenPackName: undefined,
};
const topicsReducer = createReducer<TopicState>(initalTopicState, (builder) => {
  builder
    .addCase(setChosenGeneralTopic, (state, action) => {
      state.chosenGeneralTopic = action.payload;
    })
    .addCase(setChosenPackName, (state, action) => {
      state.chosenPackName = action.payload;
    })
    .addCase(resetSelections, () => {
      return initalTopicState;
    });
});

export default topicsReducer;
