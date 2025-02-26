import { useState } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "../Task/Task";
import "./Column.css";

export const Column = ({ tasks, formName, onDelete, onEdit, updateFormName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newFormName, setNewFormName] = useState(formName);

  const handleFormNameChange = (e) => {
    setNewFormName(e.target.value);
  };

  const handleSaveName = () => {
    if (newFormName !== formName) {
      updateFormName(newFormName); // Update the form name in the parent (App.js)
    }
    setIsEditing(false); // Stop editing
  };

  return (
    <div className="column">
      {/* Display the form name with the option to edit */}
      {isEditing ? (
        <div className="form-name-edit">
          <input
            type="text"
            value={newFormName}
            onChange={handleFormNameChange}
            autoFocus
          />
          <button onClick={handleSaveName}>Save</button>
        </div>
      ) : (
        <h2 className="form-name" onClick={() => setIsEditing(true)}>
          {formName}
        </h2>
      )}

      {/* If there are tasks, show them in a sortable context */}
      {tasks.length === 0 ? (
        <p className="no-tasks-message">No tasks yet. Add a task below!</p>
      ) : (
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <Task key={task.id} task={task} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </SortableContext>
      )}
    </div>
  );
};
