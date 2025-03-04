import "./Forms.css";

import { Button, Flex, Typography, Card} from 'antd';

const { Title, Paragraph, Text, Link } = Typography;

export const Forms = ({ forms, currentFormId, setCurrentFormId, addForm, deleteForm }) => {
  const handleAddForm = () => {
    const name = prompt("Enter new form name:");
    if (name) addForm(name);
  };

  return (
    <Card style={{ width: 300 }}>
      <Typography.Title level={4}>Forms</Typography.Title>
      <Flex vertical={true}gap="middle">
        <Flex vertical={true}>
          {forms.map((form) => (
            <li key={form.id} className={`form-item ${form.id === currentFormId ? "active" : ""}`}>
              <button className="form-button" onClick={() => setCurrentFormId(form.id)}>
                {form.name}
              </button>
              {forms.length > 1 && (
                <Button type="text" onClick={() => deleteForm(form.id)}>X</Button>
              )}
            </li>
          ))}
        </Flex>
        <Flex align="center" justify="center">
          <Button type="primary" onClick={handleAddForm}>Add Form</Button>
        </Flex>
      </Flex>
    </Card>
  );
};
