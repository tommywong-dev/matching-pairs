import { Box, Button, Grid, MantineColor, Stack, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useListState, useSetState } from "@mantine/hooks";

interface QuestionPairs {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}

interface Question {
  id: string;
  label: string;
  color: MantineColor;
}
const dummyQuestions: Question[] = [
  {
    id: "q1",
    label: "Largest mammal",
    color: "orange",
  },
  {
    id: "q2",
    label: "Smallest mammal",
    color: "pink",
  },
  {
    id: "q3",
    label: "Largest insect",
    color: "red",
  },
  {
    id: "q4",
    label: "Smallest insect",
    color: "green",
  },
];

interface Answer {
  id: string;
  label: string;
}
const dummyAnswers: Answer[] = [
  {
    id: "a1",
    label: "Fairy flies",
  },
  {
    id: "a2",
    label: "Blue whale",
  },
  {
    id: "a3",
    label: "Tree weta",
  },
  {
    id: "a4",
    label: "Kitti's hog-nosed bat",
  },
];

const OptionB = () => {
  const [questions, questionsHandler] = useListState<Question>([]);
  const [answers, answersHandler] = useListState<Answer>([]);

  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [pairs, setPairs] = useSetState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
  });

  const handleSelectQuestion = (id: string) => {
    if (selectedQuestion === id) {
      setSelectedQuestion("");
    } else {
      setSelectedQuestion(id);
    }
  };

  const handleSelectAnswer = (id: string) => {
    // add question and answer as pair
    const questionToPair = questions.find(
      (question) => question.id === selectedQuestion
    );
    const answerToPair = answers.find((answer) => answer.id === id);
    if (!questionToPair || !answerToPair) return;
    setPairs({ [questionToPair.id]: answerToPair.id });

    // reset selected question
    setSelectedQuestion("");
  };

  const handleRemovePair = (question: string) => {
    setPairs({ [question]: "" });
  };

  useEffect(() => {
    questionsHandler.setState(dummyQuestions);
    answersHandler.setState(dummyAnswers);
  }, []);

  // if there's some pairs are empty, then don't submit
  const toSubmit = !Object.values(pairs).some((pair) => pair === "");

  return (
    <Box className="App-header">
      <Text variant="gradient" size="xl" sx={{ marginBottom: "1rem" }}>
        Select the matching pairs
      </Text>
      <Grid sx={{ width: "min(90vw, 600px)" }}>
        <Grid.Col span={6}>
          <Stack>
            {toSubmit ? null : <Text color="blue">Questions</Text>}
            {questions.map((question) => {
              const selectedOrAnswered =
                selectedQuestion === question.id ||
                pairs[question.id as keyof QuestionPairs] !== "";

              if (selectedOrAnswered)
                return (
                  <Button
                    key={question.id}
                    variant="filled"
                    color={question.color}
                    onClick={() => handleRemovePair(question.id)}
                  >
                    {question.label}
                  </Button>
                );
              else
                return (
                  <Button
                    key={question.id}
                    variant="light"
                    onClick={() => handleSelectQuestion(question.id)}
                  >
                    {question.label}
                  </Button>
                );
            })}
          </Stack>
        </Grid.Col>
        <Grid.Col span={6}>
          <Stack>
            {toSubmit ? null : <Text color="blue">Answers</Text>}
            {answers.map((answer) => {
              const selectedAsAnswer = Object.keys(pairs).find(
                (question) =>
                  pairs[question as keyof QuestionPairs] === answer.id
              );

              if (selectedAsAnswer)
                return (
                  <Button
                    key={answer.id}
                    variant="filled"
                    color={
                      questions.find(
                        (question) => question.id === selectedAsAnswer
                      )?.color
                    }
                    onClick={() => handleRemovePair(selectedAsAnswer)}
                  >
                    {answer.label}
                  </Button>
                );
              else
                return (
                  <Button
                    key={answer.id}
                    variant="light"
                    disabled={!selectedQuestion}
                    onClick={() => handleSelectAnswer(answer.id)}
                  >
                    {answer.label}
                  </Button>
                );
            })}
          </Stack>
        </Grid.Col>
      </Grid>

      {toSubmit ? (
        <Button variant="gradient" size="xl" mt="2rem">
          Submit
        </Button>
      ) : null}
    </Box>
  );
};

export default OptionB;
