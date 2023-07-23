import { useAppDispatch, useAppSelector } from "@/store";
import { getTopics } from "@/store/selectors/topicSelectors.ts";
import { useCallback, useMemo } from "react";
import { GeneralTopicInfo, GeneralTopicName } from "@/data";
import { useNavigate } from "react-router-dom";
import { useFilter } from "@/hooks/useFilter.tsx";
import { Input } from "@/components/ui/input.tsx";
import { setChosenGeneralTopic } from "@/store/reducers/topics.ts";
import { CardWithPicture } from "@/components/ui/CardWithPicture/CardWithPicture.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

export const GeneralTopic = () => {
  const topics = useAppSelector(getTopics);
  const mappedTopics = useMemo(
    () => Object.entries(topics) as [GeneralTopicName, GeneralTopicInfo][],
    [topics],
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filter, setFilter, filtered] = useFilter(mappedTopics);

  const handleGeneralTopicSelection = useCallback(
    (topic: GeneralTopicName) => {
      dispatch(setChosenGeneralTopic(topic));
      navigate("/questionSet");
    },
    [dispatch, navigate],
  );

  return (
    <div className="grid auto-rows-auto items-center gap-y-5">
      <div className="text-2xl">
        Wähle nun ein Thema, über das Du Fragen beantworten möchtest
      </div>
      <div className="w-1/4 mb-5">
        <Input
          placeholder="Filtern"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <ScrollArea className="h-[600px] w-full rounded-md p-4">
        <div className="grid grid-cols-3 gap-5">
          {mappedTopics.map(([generalTopicName, infos]) => {
            const isFiltered = !Object.values(filtered).find((name) => {
              return Object.values(name).includes(generalTopicName);
            });
            return (
              <CardWithPicture
                image={infos.titlePicture}
                onClickCard={() =>
                  handleGeneralTopicSelection(generalTopicName)
                }
                cardClasses={isFiltered ? "opacity-50 saturate-50" : ""}
              >
                <p className="text-center w-full transition-opacity">
                  {generalTopicName}
                </p>
              </CardWithPicture>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
