import "./Forms.css";

export const Forms = ({ forms, currentFormId, setCurrentFormId, addForm, deleteForm }) => {
  const handleAddForm = () => {
    const name = prompt("Enter new form name:");
    if (name) addForm(name);
  };

  return (
    <div className="forms-container">
      <h2 className="forms-title">Forms</h2>
      <ul className="forms-list">
        {forms.map((form) => (
          <li key={form.id} className={`form-item ${form.id === currentFormId ? "active" : ""}`}>
            <button className="form-button" onClick={() => setCurrentFormId(form.id)}>
              {form.name}
            </button>
            {forms.length > 1 && (
              <button className="delete-form" onClick={() => deleteForm(form.id)}>🗑️</button>
            )}
          </li>
        ))}
      </ul>
      <button onClick={handleAddForm} className="add-form-button">➕ Add Form</button>
    </div>
  );
};
