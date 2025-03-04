import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DndContext, PointerSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column } from "./components/Column/Column";
import { Input_Component } from "./components/Input/Input";
import { Forms } from "./components/Forms/Forms";
import { Button, Flex, Card} from 'antd';

import "./App.css";

export default function App() {
  const defaultFormId = uuidv4(); // Unique ID for the default form

  const [forms, setForms] = useState([
    {
      id: defaultFormId,
      name: "Default Form",
      tasks: [
        { id: uuidv4(), question: "Has the interviewee experienced any sexual violence recently?", inputType: "open-ended", answer: ""},
        { id: uuidv4(), question: "Has the interviewee experienced any sexual violence in the past?", inputType: "open-ended", answer: ""},
        { id: uuidv4(), question: "Flight risk", inputType: "radio", radioOptions: ["Yes","No","Maybe"], answer: ""},
      ],
    },
  ]);

  const [activeFormId, setActiveFormId] = useState(defaultFormId); // Set default form as active

  const addTask = (question, inputType, radioOptions) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === activeFormId
          ? {
              ...form,
              tasks: [
                ...form.tasks,
                {
                  id: uuidv4(),
                  question,
                  inputType,
                  radioOptions: inputType === "radio" ? radioOptions : undefined, // Only set radioOptions if inputType is radio
                  answer: "",
                },
              ],
            }
          : form
      )
    );
  };

  const handleDeleteTask = (id) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === activeFormId
          ? { ...form, tasks: form.tasks.filter((task) => task.id !== id) }
          : form
      )
    );
  };

  const handleEditTask = (id, updates) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === activeFormId
          ? {
              ...form,
              tasks: form.tasks.map((task) =>
                task.id === id ? { ...task, ...updates } : task
              ),
            }
          : form
      )
    );
  };

  const addForm = (name) => {
    const newForm = { id: uuidv4(), name, tasks: [] };
    setForms((prevForms) => [...prevForms, newForm]);
  };

  const setActiveForm = (id) => {
    setActiveFormId(id);
  };

  const updateFormName = (newName) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === activeFormId
          ? { ...form, name: newName } // Update the name of the active form
          : form
      )
    );
  };  

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === activeFormId
          ? {
              ...form,
              tasks: arrayMove(
                form.tasks,
                form.tasks.findIndex((task) => task.id === active.id),
                form.tasks.findIndex((task) => task.id === over.id)
              ),
            }
          : form
      )
    );
  };

  const activeForm = forms.find((form) => form.id === activeFormId);

  // Function to export all forms as JSON
  const handleExportJson = () => {
    const jsonData = JSON.stringify(forms, null, 2); // Convert forms array to JSON with pretty print
    const blob = new Blob([jsonData], { type: "application/json" }); // Create a blob of JSON data
    const url = URL.createObjectURL(blob); // Create a URL for the blob

    // Create a temporary link element to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = "forms_data.json"; // Set default download file name
    link.click(); // Trigger the download
    URL.revokeObjectURL(url); // Clean up the URL object after download
  };

  const handleImportJson = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedForms = JSON.parse(e.target.result);
          if (Array.isArray(importedForms)) {
            setForms(importedForms.map(form => ({
              ...form,
              id: form.id || uuidv4(),
              tasks: form.tasks.map(task => ({
                ...task,
                id: task.id || uuidv4(),
              })),
            })));
            setActiveFormId(importedForms[0]?.id || defaultFormId);
          }
        } catch (error) {
          console.error("Invalid JSON file.", error);
        }
      };
      reader.readAsText(file);
    };
    input.click(); // Triggers the file selection dialog
  };

  return (
    <div className="App">
      <h1>My Forms</h1>
      <Flex style={{ gap: "20px" }}>
        <Flex vertical={true} align="center" gap="small">
          <Card style={{ width: 300 }}>
            <Flex vertical={true} gap="small">
              <Button type="primary" onClick={handleImportJson}>
                Load Form
              </Button>
              <Button onClick={handleExportJson}>
                Save Form
              </Button>
            </Flex>
          </Card>
          <Forms
            forms={forms}
            currentFormId={activeFormId}
            setCurrentFormId={setActiveForm}
            addForm={addForm}
            deleteForm={(id) => {
              setForms((prevForms) => prevForms.filter((form) => form.id !== id));
              if (id === activeFormId && forms.length > 1) {
                setActiveFormId(forms[0].id); // Switch to the first available form
              }
            }}
          />
          <Input_Component onSubmit={addTask} />
        </Flex>
        <div style={{ flex: "2" }}>
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <Column tasks={activeForm?.tasks || []} onDelete={handleDeleteTask} onEdit={handleEditTask} formName={activeForm?.name} updateFormName={updateFormName}/>
          </DndContext>
        </div>
      </Flex>
    </div>
  );
}
