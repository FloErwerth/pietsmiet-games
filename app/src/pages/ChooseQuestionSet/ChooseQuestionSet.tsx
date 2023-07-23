import { useAppDispatch, useAppSelector } from "@/store";
import {
  getChosenGeneralTopic,
  getTopicInfos,
} from "@/store/selectors/topicSelectors.ts";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CardWithPicture } from "@/components/ui/CardWithPicture/CardWithPicture";
import { setChosenPackName } from "@/store/reducers/topics.ts";
import { setRoomID } from "@/store/reducers/game.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { useFilter } from "@/hooks/useFilter.tsx";
import { Input } from "@/components/ui/input.tsx";

const generateRoomId = () => (Math.random() * 90000 + 10000).toFixed(0);

export const ChooseQuestionSet = () => {
  const chosenTopic = useAppSelector(getChosenGeneralTopic);
  const infos = useAppSelector(getTopicInfos);
  const navigate = useNavigate();
  const extractedInfos = useMemo(
    () =>
      Object.entries(infos?.packs ?? []).map(([packName, { videoId }]) => {
        return { packName, videoId: videoId };
      }),
    [infos],
  );
  const [filter, setFilter, filtered] = useFilter(
    extractedInfos.map((entry) => entry.packName),
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!chosenTopic) {
      navigate("/");
    }
  }, []);

  const handleSelectQuestionPack = useCallback(
    (packName: string) => {
      const roomId = generateRoomId();
      dispatch(setChosenPackName(packName));
      dispatch(setRoomID(roomId));
      navigate(`/play/${roomId}`);
    },
    [dispatch, navigate],
  );

  const getYoutubePictureSrc = useCallback((id: string) => {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }, []);

  return (
    <div className="grid auto-rows-auto gap-y-10">
      {chosenTopic && (
        <div className="text-2xl">
          Wähle ein Frageset zur Kategorie {chosenTopic}
        </div>
      )}
      <div className="w-1/4 mb-5">
        <Input
          placeholder="Filtern"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      {infos && (
        <ScrollArea className="h-[600px] w-full rounded-md p-4">
          <div className="grid grid-cols-3 gap-5">
            {extractedInfos.map(({ packName, videoId }) => {
              const isFiltered = !filtered.includes(packName);
              return (
                <CardWithPicture
                  onClickCard={() => handleSelectQuestionPack(packName)}
                  image={getYoutubePictureSrc(videoId)}
                  cardClasses={isFiltered ? "opacity-50 saturate-50" : ""}
                >
                  <p className="text-center w-full">{packName}</p>
                </CardWithPicture>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
