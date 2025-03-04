import { useState } from "react";
import "./Input.css";
import { Input, Button, Flex } from 'antd';

export const Input_Component = ({ onSubmit }) => {
  const [inputType, setInputType] = useState("open-ended");
  const [question, setQuestion] = useState("");
  const [radioOptions, setRadioOptions] = useState(""); // State for custom radio options

  const handleSubmit = () => {
    if (!question) return; // Prevent submission if the question is empty

    // Split radioOptions string by commas to create an array
    const optionsArray = radioOptions.split(";").map((option) => option.trim()).filter((option) => option !== "");

    // Pass an object containing both inputType, question, and radioOptions to onSubmit
    onSubmit(question, inputType, optionsArray);

    // Reset fields after submit
    setQuestion("");
    setRadioOptions(""); 
  };

  return (
    <Flex
      gap="small"
      vertical={true}
    >
      <select
        className="select"
        value={inputType}
        onChange={(e) => setInputType(e.target.value)}
      >
        <option value="radio">Radio</option>
        <option value="open-ended">Open-ended</option>
      </select>

      <Input
        // variant="filled"
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your question"
      />

      {inputType === "radio" && (
        <Input
          type="text"
          value={radioOptions}
          onChange={(e) => setRadioOptions(e.target.value)}
          placeholder="Enter semicolon-separated radio options (e.g. Yes; No; Maybe)"
        />
      )}

      <Button
        type="primary"
        onClick={handleSubmit}
        // className="button"
      >
        Add
      </Button>
    </Flex>
  );
};
