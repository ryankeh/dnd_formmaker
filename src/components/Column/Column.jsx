import { useState, useEffect } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "../Task/Task";
import "./Column.css";
import { Input, Button, Flex, Typography, Card} from 'antd';

const { Title, Paragraph, Text, Link } = Typography;

export const Column = ({ tasks, formName, onDelete, onEdit, updateFormName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newFormName, setNewFormName] = useState(formName);

  // Sync newFormName with formName when switching forms
  useEffect(() => {
    setNewFormName(formName);
  }, [formName]);

  const handleFormNameChange = (e) => {
    setNewFormName(e.target.value);
  };

  const handleSaveName = () => {
    if (newFormName !== formName) {
      updateFormName(newFormName); // Update form name in parent component
    }
    setIsEditing(false);
  };

  return (
    <Card style={{ width: 500 }} className="column">
      <Flex vertical={true} gap="middle">
        {isEditing ? (
          <Flex gap="middle">
            <Input
              type="text"
              value={newFormName}
              onChange={handleFormNameChange}
              onBlur={handleSaveName} // Save when clicking away
              autoFocus
            />
            <Button type="primary" onClick={handleSaveName}>Save</Button>
          </Flex>
        ) : (
          <Typography.Title editable level={4} className="form-name" onClick={() => setIsEditing(true)}>
            {formName}
          </Typography.Title>
        )}

        {tasks.length === 0 ? (
          <Flex justify="center"><Text type="secondary">No tasks yet. Add a task below!</Text></Flex>
        ) : (
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <Task key={task.id} task={task} onDelete={onDelete} onEdit={onEdit} />
            ))}
          </SortableContext>
        )}
      </Flex>
    </Card>
  );
};