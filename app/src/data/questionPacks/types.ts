export type QuestionPack = {
    [name: string]: {
        videoId: string;
        pairs: Array<{ question: string; answer: string }>;
    };
};
