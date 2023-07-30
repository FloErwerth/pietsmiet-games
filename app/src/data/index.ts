import {got_question_pack} from "./questionPacks/game_of_thrones/game_of_thrones";
import {QuestionPack} from "./questionPacks/types";
import {tierwelt_question_pack} from "./questionPacks/tierwelt/tierwelt";
import {Pictures} from "./pictures";

const GeneralTopics = ["Game of Thrones", "Tierwelt", "Deutsches Recht", "Physik", "Biologie", "Chemie", "Allgemeinwissen", "Erfindungen", "Unbeantwortete Fragen", "Weltgeschichte"] as const;
export type Topics = { [generalTopic in typeof GeneralTopics[number]]: GeneralTopicInfo };
export type GeneralTopicInfo = { numberOfQuestionSets: number; titlePicture: string; packs: QuestionPack };
export type GeneralTopicName = keyof typeof topics;

export const topics: Topics  = {
    ["Game of Thrones"]: {
        numberOfQuestionSets: 3,
        titlePicture: Pictures.GOT_Titel,
        packs: got_question_pack,
    },
    ["Tierwelt"]: {
        numberOfQuestionSets: 2,
        titlePicture: Pictures.Tierreich_Titel,
        packs: tierwelt_question_pack,
    },
    ["Deutsches Recht"]: {
        numberOfQuestionSets: 4,
        titlePicture: Pictures.Deutsches_Recht_Titel,
        packs: got_question_pack,
    },["Physik"]: {
        numberOfQuestionSets: 4,
        titlePicture: Pictures.Deutsches_Recht_Titel,
        packs: got_question_pack,
    },["Biologie"]: {
        numberOfQuestionSets: 4,
        titlePicture: Pictures.Deutsches_Recht_Titel,
        packs: got_question_pack,
    },["Chemie"]: {
        numberOfQuestionSets: 4,
        titlePicture: Pictures.Deutsches_Recht_Titel,
        packs: got_question_pack,
    },["Allgemeinwissen"]: {
        numberOfQuestionSets: 4,
        titlePicture: Pictures.Deutsches_Recht_Titel,
        packs: got_question_pack,
    },["Erfindungen"]: {
        numberOfQuestionSets: 4,
        titlePicture: Pictures.Deutsches_Recht_Titel,
        packs: got_question_pack,
    },["Unbeantwortete Fragen"]: {
        numberOfQuestionSets: 4,
        titlePicture: Pictures.Deutsches_Recht_Titel,
        packs: got_question_pack,
    },
    ["Weltgeschichte"]: {
        numberOfQuestionSets: 4,
        titlePicture: Pictures.Deutsches_Recht_Titel,
        packs: got_question_pack,
    },
} as const;
