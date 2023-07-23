import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { PropsWithChildren, useMemo } from "react";
import "./styles.css";

interface CardWithPictureProps extends PropsWithChildren {
  cardClasses?: string;
  image: string;
  onClickCard?: () => void;
  cutYoutubeEdges?: boolean;
}
export const CardWithPicture = ({
  children,
  cardClasses,
  image,
  onClickCard,
}: CardWithPictureProps) => {
  const combinedCardClasses = useMemo(
    () =>
      "cursor-pointer opacity-100 saturate-100 transition-all ".concat(
        cardClasses ?? "",
      ),
    [cardClasses],
  );

  return (
    <Card className={combinedCardClasses} onClick={onClickCard}>
      <CardHeader className="w-fit p-0">
        <img className="rounded-t" alt="Picture" src={image} />
      </CardHeader>
      <CardContent className="flex items-center p-0 h-10">
        {children}
      </CardContent>
    </Card>
  );
};
