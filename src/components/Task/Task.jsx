import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./Task.css";

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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="task">
      <div className="task-content">
        <span className="inputType">{inputType}</span>
        {isEditingQuestion ? (
          <input
            className="edit-input"
            type="text"
            value={editedQuestion}
            onChange={handleQuestionChange}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <span className="question" onClick={() => setIsEditingQuestion(true)}>
            {question}
          </span>
        )}

        <div className="answer-section">
          <strong>Answer: </strong>
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
            <input
              className="edit-input"
              type="text"
              value={answer}
              onChange={(e) => onEdit(id, { answer: e.target.value })}
            />
          )}

        </div>
      </div>
      <div className="task-buttons">
        <button onClick={() => setIsEditingQuestion(true)} className="edit-button">Edit</button>
        <button onClick={() => onDelete(id)} className="delete-button">X</button>
      </div>
    </div>
  );
};
