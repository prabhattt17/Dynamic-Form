import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [formFields, setFormFields] = useState([]);
  const [showFieldTypeModal, setShowFieldTypeModal] = useState(false);
  const [showDropdownOptionsModal, setShowDropdownOptionsModal] =
    useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState("");
  const [fieldLabel, setFieldLabel] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [savedFormConfig, setSavedFormConfig] = useState(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem("formConfig");
    if (savedConfig) {
      setSavedFormConfig(JSON.parse(savedConfig));
    }
  }, []);

  const openFieldTypeModal = () => {
    setShowFieldTypeModal(true);
  };

  const closeFieldTypeModal = () => {
    setShowFieldTypeModal(false);
  };

  const openDropdownOptionsModal = () => {
    setShowDropdownOptionsModal(true);
  };

  const closeDropdownOptionsModal = () => {
    setShowDropdownOptionsModal(false);
  };

  const validateForm = () => {
    const errors = {};
    formFields.forEach((form, index) => {
      if (form.type !== "dropdown" && !form.label) {
        errors[index] = "Label is required";
      }
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addFormField = () => {
    closeFieldTypeModal();
    let label = fieldLabel;
    let newField = { label, type: selectedFieldType, value: "" }; 
    if (selectedFieldType === "dropdown") {
      openDropdownOptionsModal();
    } else {
      setFormFields([...formFields, newField]);
    }
  };

  const addDropdownWithOptions = () => {
    closeDropdownOptionsModal();
    let options = dropdownOptions.split(",").map((option) => option.trim());
    let label = fieldLabel;
    let newField = { label, type: "dropdown", options, value: "" }; 
    setFormFields([...formFields, newField]);
  };

  const saveFormConfig = () => {
    localStorage.setItem("formConfig", JSON.stringify(formFields));
  };

  const loadFormConfig = () => {
    const savedConfig = localStorage.getItem("formConfig");
    if (savedConfig) {
      setSavedFormConfig(JSON.parse(savedConfig));
    }
  };

  const clearFormConfig = () => {
    localStorage.removeItem("formConfig");
    setSavedFormConfig(null);
  };

  const removeFormField = (index) => {
    const updatedFields = [...formFields];
    updatedFields.splice(index, 1);
    setFormFields(updatedFields);
  };

  const handleFieldChange = (index, value) => {
    const updatedFields = [...formFields];
    updatedFields[index].value = value;
    setFormFields(updatedFields);
  };

  const submit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      console.log(formFields);
    }
  };

  const fieldWidth = "200px"; 

  const buttonStyle = {
    margin: "5px",
    padding: "10px 20px",
    borderRadius: "5px",
    backgroundColor: "lightblue",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    width: "100%",
  };

  const formStyle = {
    backgroundColor: "grey",
    padding: "50px",
    width: "500px",
    borderRadius: "10px",
    marginTop: "25vh",
    background:
      "linear-gradient(45deg, rgba(18, 104, 246, 0.00) 0%, rgba(18, 79, 180, 0.56) 100%)",
    boxShadow: "34px 24px 77px 0px rgba(8, 88, 208, 0.33)",
    fontWeight: 900,
  };

  const labelStyle = {
    width: "100px",
    marginRight: "10px",
    textAlign: "right",
  };

  const inputStyle = {
    width: "calc(100% - 130px)",
    height: "30px",
    margin: "10px",
  };

  return (
    <div className="App" style={formStyle}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "50px",
          color: "rgba(66, 133, 244, 0.55)",
          marginTop: "-20px",
          fontWeight: 600,
        }}
      >
        Form Generator
      </h1>
      <form onSubmit={submit}>
        {formFields.map((form, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <label style={labelStyle}>{form.label}:</label>
              {form.type === "dropdown" ? (
                <select
                  style={inputStyle}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                  value={form.value}
                >
                  {form.options.map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  style={inputStyle}
                  type={form.type}
                  placeholder={form.label}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                  value={form.value}
                />
              )}
              <button
                onClick={() => removeFormField(index)}
                style={buttonStyle}
              >
                Remove
              </button>
            </div>
          );
        })}
      </form>
      <button onClick={openFieldTypeModal} style={buttonStyle}>
        Add Form Field
      </button>
      <br />
      <button onClick={submit} style={buttonStyle}>
        Submit
      </button>
      <button onClick={saveFormConfig} style={buttonStyle}>
        Save Form Configuration
      </button>
      <button onClick={loadFormConfig} style={buttonStyle}>
        Load Form Configuration
      </button>
      <button onClick={clearFormConfig} style={buttonStyle}>
        Clear Form Configuration
      </button>
      {showFieldTypeModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Select Field Type</h2>
            <label>Label for the field:</label>
            <input
              type="text"
              onChange={(e) => setFieldLabel(e.target.value)}
            />
            {fieldErrors["label"] && (
              <span className="error">{fieldErrors["label"]}</span>
            )}
            <select onChange={(e) => setSelectedFieldType(e.target.value)}>
              <option value="text">Text Input</option>
              <option value="number">Number Input</option>
              <option value="password">Password Input</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio Button</option>
              <option value="dropdown">Dropdown</option>
            </select>
            <button onClick={addFormField} style={buttonStyle}>
              Add Field
            </button>
          </div>
        </div>
      )}
      {showDropdownOptionsModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Dropdown Options</h2>
            <label>Options (comma-separated):</label>
            <input
              type="text"
              onChange={(e) => setDropdownOptions(e.target.value)}
            />
            <button onClick={addDropdownWithOptions} style={buttonStyle}>
              Add Options
            </button>
          </div>
        </div>
      )}
      {savedFormConfig && (
        <div className="saved-config">
          <h2>Saved Form Configuration</h2>
          <pre>{JSON.stringify(savedFormConfig, null, 2)}</pre>
        </div>
      )}{" "}
    </div>
  );
}

export default App;
