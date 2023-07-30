import { useAppSelector } from "@/store";
import {
  getChosenGeneralTopic,
  getChosenPackName,
} from "@/store/selectors/topicSelectors.ts";
import {
  getNumberOfQuestions,
  getQuestionAnserIndex,
} from "@/store/selectors/gameSelectors.ts";

export const QuestionTracker = () => {
  const topic = useAppSelector(getChosenGeneralTopic);
  const packname = useAppSelector(getChosenPackName);
  const index = useAppSelector(getQuestionAnserIndex);
  const numberOfQuestions = useAppSelector(getNumberOfQuestions);
  return (
    <p className={"play-page-tracker"}>
      Frage {index + 1} / {numberOfQuestions} aus {topic}: {packname}
    </p>
  );
};
