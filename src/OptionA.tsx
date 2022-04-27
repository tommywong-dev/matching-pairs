import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Grid,
  Group,
  MantineColor,
  Stack,
  Text,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useListState } from "@mantine/hooks";
import { X } from "tabler-icons-react";

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

const OptionA = () => {
  const [questions, questionsHandler] = useListState<Question>([]);
  const [answers, answersHandler] = useListState<Answer>([]);

  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [pairs, pairsHandler] = useListState<{
    question: Question;
    answer: Answer;
  }>([]);

  const handleSelectQuestion = (id: string) => {
    if (selectedQuestion === id) {
      setSelectedQuestion("");
    } else {
      setSelectedQuestion(id);
    }
  };

  const handleSelectAnswer = (id: string) => {
    // add question and answer as pair
    const questionToPair = questions.findIndex(
      (question) => question.id === selectedQuestion
    );
    const answerToPair = answers.findIndex((answer) => answer.id === id);
    pairsHandler.append({
      question: questions[questionToPair],
      answer: answers[answerToPair],
    });

    // remove answered question from selection list
    questionsHandler.remove(questionToPair);
    answersHandler.remove(answerToPair);

    // reset selected question
    setSelectedQuestion("");
  };

  const handleRemovePair = (index: number) => {
    // remove from pairs
    pairsHandler.remove(index);

    // readd them to selection list
    questionsHandler.append(pairs[index].question);
    answersHandler.append(pairs[index].answer);
  };

  useEffect(() => {
    questionsHandler.setState(dummyQuestions);
    answersHandler.setState(dummyAnswers);
  }, []);

  const toSubmit = pairs.length >= 4;

  return (
    <Box className="App-header">
      <Text variant="gradient" size="xl" sx={{ marginBottom: "1rem" }}>
        Select the matching pairs
      </Text>
      <Group spacing={3} mb="md" sx={{ width: "min(80vw, 600px)" }}>
        {pairs.map((pair, index) => (
          <Badge
            key={pair.question.id + pair.answer.id}
            color={pair.question.color}
            rightSection={
              <ActionIcon
                size="xs"
                color={pair.question.color}
                radius="xl"
                variant="transparent"
                onClick={() => handleRemovePair(index)}
              >
                <X size={10} />
              </ActionIcon>
            }
          >
            {pair.question.label}: {pair.answer.label}
          </Badge>
        ))}
      </Group>
      <Grid sx={{ width: "min(90vw, 600px)" }}>
        <Grid.Col span={6}>
          <Stack>
            {toSubmit ? null : <Text color="blue">Questions</Text>}
            {questions.map((question) => (
              <Button
                key={question.id}
                variant={selectedQuestion === question.id ? "filled" : "light"}
                color={selectedQuestion === question.id ? question.color : ""}
                onClick={() => handleSelectQuestion(question.id)}
              >
                {question.label}
              </Button>
            ))}
          </Stack>
        </Grid.Col>
        <Grid.Col span={6}>
          <Stack>
            {toSubmit ? null : <Text color="blue">Answers</Text>}
            {answers.map((answer) => {
              const questionColor: any =
                questions.find((question) => question.id === selectedQuestion)
                  ?.color || "";
              return (
                <Button
                  variant="light"
                  color={questionColor}
                  key={answer.id}
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
        <Button variant="gradient" size="xl">
          Submit
        </Button>
      ) : null}
    </Box>
  );
};

export default OptionA;
