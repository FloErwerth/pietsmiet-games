import { ChangeEvent, ElementRef, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setUser } from "@/store/reducers/game.ts";
import { getAvatar } from "@/store/selectors/gameSelectors.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { User, X } from "lucide-react";
import Compressor from "compressorjs";

export const AvatarWithUpload = () => {
  const inputRef = useRef<ElementRef<"input">>(null);
  const dispatch = useAppDispatch();
  const avatar = useAppSelector(getAvatar);

  const handleAvatarUploading = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const readFile = useCallback(
    (changeEvent: ChangeEvent<HTMLInputElement>) => {
      changeEvent.stopPropagation();
      changeEvent.preventDefault();
      if (changeEvent.target.files && changeEvent.target.files.length > 0) {
        const file = changeEvent.target.files[0];
        const blob = URL.createObjectURL(file);
        dispatch(setUser({ avatarURL: blob }));
        new Compressor(file, {
          maxHeight: 250,
          maxWidth: 250,
          quality: 1,
          success: (compressed) => {
            const imageUrl = URL.createObjectURL(compressed);
            dispatch(setUser({ avatarURL: imageUrl }));
          },
        });
      }
    },
    [dispatch],
  );

  const handleRemoveAvatar = useCallback(() => {
    dispatch(setUser({ avatarURL: undefined }));
  }, [dispatch]);

  return (
    <>
      <input
        onChange={readFile}
        ref={inputRef}
        className="hidden"
        accept="image/png,image/jpeg"
        type="file"
      />
      <div className="relative">
        {avatar && (
          <X
            onClick={handleRemoveAvatar}
            className="absolute -top-1 -right-1 cursor-pointer"
          />
        )}
        <Avatar className="relative w-[120px] h-[120px]">
          <AvatarImage src={avatar} />
          <AvatarFallback>
            <User className="w-1/2 h-1/2" />
          </AvatarFallback>
          <button
            className="absolute w-full h-full rounded-full"
            onClick={handleAvatarUploading}
          ></button>
        </Avatar>
      </div>
    </>
  );
};
