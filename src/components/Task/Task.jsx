import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input, Button, Flex, Typography, Card} from 'antd';
import "./Task.css";

const { Title, Paragraph, Text, Link } = Typography;

export const Task = ({ task, onDelete, onEdit }) => {
  const { id, question, inputType, radioOptions, answer } = task;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // Handle text input changes
  const handleQuestionChange = (e) => setEditedQuestion(e.target.value);

  // Save changes on blur
  const handleBlur = () => {
    setIsEditingQuestion(false);
    onEdit(id, { question: editedQuestion });
  };

  const handleRadioSelect = (value) => {
    onEdit(id, { answer: value });
  };

  return (
    <Card style={{ width: 300 }} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Flex vertical={false} gap ="middle" align="center" justify="space-between">
        <Flex vertical={true}>
          <Text strong>{inputType}</Text>
          {isEditingQuestion ? (
            <Input
              type="text"
              value={editedQuestion}
              onChange={handleQuestionChange}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            <Text onClick={() => setIsEditingQuestion(true)}>
              {question}
            </Text>
          )}

          <div>
            <Text strong>Answer: </Text>
            {inputType === "radio" && radioOptions ? (
              <div className="rating-scale">
                {radioOptions.map((option, index) => (
                  <label key={index} className="rating-option">
                    <input
                      type="radio"
                      name={`rating-${id}`} // Ensures only one option is selected per task
                      value={option}
                      checked={answer === option}
                      onChange={() => handleRadioSelect(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            ) : (
              <Input
                type="text"
                value={answer}
                onChange={(e) => onEdit(id, { answer: e.target.value })}
              />
            )}

          </div>
        </Flex>
        <Flex vertical={false}>
          <Button type="primary" onClick={() => setIsEditingQuestion(true)}>Edit</Button>
          <Button danger type="text" onClick={() => onDelete(id)}>X</Button>
        </Flex>
      </Flex>
    </Card>
  );
};
