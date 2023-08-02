import { useAppSelector } from "@/store";
import {
  getChosenGeneralTopic,
  getChosenPackName,
} from "@/store/selectors/topicSelectors.ts";
import {
  getCurrentPairs,
  getNumberOfQuestions,
  getQuestionAnserIndex,
  getRoomID,
} from "@/store/selectors/gameSelectors.ts";
import { Button } from "@/components/ui/button.tsx";
import { useCallback } from "react";
import {
  QuestionNext,
  QuestionPrevious,
} from "@/serverEvents/functions/questionAnswer.ts";

export const QuestionTracker = () => {
  const topic = useAppSelector(getChosenGeneralTopic);
  const packname = useAppSelector(getChosenPackName);
  const index = useAppSelector(getQuestionAnserIndex);
  const numberOfQuestions = useAppSelector(getNumberOfQuestions);
  const roomId = useAppSelector(getRoomID);
  const pairs = useAppSelector(getCurrentPairs);

  const handleNextQuestion = useCallback(() => {
    QuestionNext.in(roomId);
  }, [roomId]);

  const handlePreviousQuestion = useCallback(() => {
    QuestionPrevious.in(roomId);
  }, [roomId]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row w-full gap-x-20">
        <Button
          className="transition"
          disabled={index === 0}
          onClick={handlePreviousQuestion}
        >
          Vorherige Frage
        </Button>
        <div className="text-2xl">
          Frage {index + 1} / {numberOfQuestions}
        </div>
        <Button disabled={!pairs?.[index + 1]} onClick={handleNextQuestion}>
          Nächste Frage
        </Button>
      </div>

      <small>
        aus {topic}: {packname}
      </small>
    </div>
  );
};
