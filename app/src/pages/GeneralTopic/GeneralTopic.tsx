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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const mappedTopics = useMemo(
    () => Object.entries(topics) as [GeneralTopicName, GeneralTopicInfo][],
    [topics],
  );
  const [filter, setFilter, filtered] = useFilter(mappedTopics);

  const handleGeneralTopicSelection = useCallback(
    (topic: GeneralTopicName) => {
      dispatch(setChosenGeneralTopic(topic));
      navigate("/questionSet");
    },
    [dispatch, navigate],
  );

  const sortedMappedTopics = useMemo(
    () =>
      mappedTopics.sort(([generalTopicName], [generalTopicName2]) => {
        const isFiltered = !Object.values(filtered).find((name) => {
          return Object.values(name).includes(generalTopicName);
        });
        if (filter) {
          return isFiltered ? 1 : -1;
        } else {
          return generalTopicName.localeCompare(generalTopicName2);
        }
      }),
    [filter, filtered, mappedTopics],
  );

  return (
    <div className="grid auto-rows-auto items-center gap-y-5 mt-5">
      <div className="text-xl">
        Wähle nun ein Thema, über das Du Fragen beantworten möchtest
      </div>
      <div className="w-full md:w-1/4">
        <Input
          placeholder="Filtern"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <ScrollArea className="h-[600px] w-full rounded-md pr-4">
        <div className="flex flex-col md:grid md:auto-rows-auto gap-y-5">
          {sortedMappedTopics.map(([generalTopicName, infos]) => {
            return (
              <CardWithPicture
                image={infos.titlePicture}
                onClickCard={() =>
                  handleGeneralTopicSelection(generalTopicName)
                }
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
