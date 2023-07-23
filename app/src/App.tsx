import { Route, Routes } from "react-router-dom";
import { MainPage } from "@/pages/MainPage/MainPage.tsx";
import { GeneralTopic } from "@/pages/GeneralTopic/GeneralTopic.tsx";
import { ChooseQuestionSet } from "@/pages/ChooseQuestionSet/ChooseQuestionSet.tsx";
import { PlayPage } from "@/pages/PlayPage/PlayPage.tsx";

export const App = () => {
  return (
    <Routes>
      <Route element={<MainPage />} path={"/"}></Route>
      <Route element={<GeneralTopic />} path={"/generalTopic"} />
      <Route element={<ChooseQuestionSet />} path={"/questionSet"}></Route>
      <Route path={"/play/:id"} element={<PlayPage />}></Route>
    </Routes>
  );
};
