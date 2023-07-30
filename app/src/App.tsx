import { Route, Routes } from "react-router-dom";
import { MainPage } from "@/pages/MainPage/MainPage.tsx";
import { GeneralTopic } from "@/pages/GeneralTopic/GeneralTopic.tsx";
import { ChooseQuestionSet } from "@/pages/ChooseQuestionSet/ChooseQuestionSet.tsx";
import { PlayPage } from "@/pages/PlayPage/PlayPage.tsx";

export const App = () => {
  return (
    <div className="pl-4 pr-4 md:pl-8 md:pr-8 lg:pr-12 lg:pl-12 xl:pr-16 xl:pl-16">
      <Routes>
        <Route element={<MainPage />} path={"/"}></Route>
        <Route element={<GeneralTopic />} path={"/generalTopic"} />
        <Route element={<ChooseQuestionSet />} path={"/questionSet"}></Route>
        <Route path={"/play/:id"} element={<PlayPage />}></Route>
      </Routes>
    </div>
  );
};
