import React, { useState } from 'react';
import { FormField, FormSection } from '../types/formTypes';


interface FormSectionComponentProps {
  sections: FormSection[];
}

const FormSectionComponent: React.FC<FormSectionComponentProps> = ({ sections }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const currentSection = sections[currentSectionIndex];

  const handleChange = (field: FormField, value: string | string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      [field.fieldId]: value,
    }));

    // Real-time clearing of errors
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field.fieldId]: '',
    }));
  };

  const validateSection = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    currentSection.fields.forEach((field) => {
      const value = formData[field.fieldId];

      if (field.required && (!value || value.trim() === '')) {
        newErrors[field.fieldId] = 'This field is required';
      }
      if (field.minLength && value && value.length < field.minLength) {
        newErrors[field.fieldId] = field.validation?.message || `Minimum ${field.minLength} characters required`;
      }
      if (field.maxLength && value && value.length > field.maxLength) {
        newErrors[field.fieldId] = field.validation?.message || `Maximum ${field.maxLength} characters allowed`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection()) {
      setCurrentSectionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    setCurrentSectionIndex((prevIndex) => prevIndex - 1);
  };

  const handleSubmit = () => {
    if (validateSection()) {
      console.log('Collected Form Data:', formData);
      alert('Form submitted successfully! Check console.');
    }
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'date':
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.fieldId] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            data-testid={field.dataTestId}
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            value={formData[field.fieldId] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            data-testid={field.dataTestId}
          />
        );
      case 'dropdown':
        return (
          <select
            value={formData[field.fieldId] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            data-testid={field.dataTestId}
          >
            <option value="">Select...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <>
            {field.options?.map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name={field.fieldId}
                  value={option.value}
                  checked={formData[field.fieldId] === option.value}
                  onChange={(e) => handleChange(field, e.target.value)}
                  data-testid={option.dataTestId}
                />
                {option.label}
              </label>
            ))}
          </>
        );
      case 'checkbox':
        return (
          <>
            {field.options?.map((option) => (
              <label key={option.value}>
                <input
                  type="checkbox"
                  name={field.fieldId}
                  value={option.value}
                  checked={Array.isArray(formData[field.fieldId]) && formData[field.fieldId].includes(option.value)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const value = option.value;
                    const existingValues = formData[field.fieldId] || [];
                    if (checked) {
                      handleChange(field, [...existingValues, value]);
                    } else {
                      handleChange(
                        field,
                        existingValues.filter((v: string) => v !== value)
                      );
                    }
                  }}
                  data-testid={option.dataTestId}
                />
                {option.label}
              </label>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="form-container">
      <h3>{currentSection.title}</h3>
      <p>{currentSection.description}</p>

      {currentSection.fields.map((field) => (
        <div key={field.fieldId} className="form-field">
          <label>{field.label}</label>
          {renderField(field)}
          {errors[field.fieldId] && (
            <div className="error-text">{errors[field.fieldId]}</div>
          )}
        </div>
      ))}

      <div className="button-group">
        {currentSectionIndex > 0 && (
          <button onClick={handlePrev}>
            Prev
          </button>
        )}
        {currentSectionIndex < sections.length - 1 ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default FormSectionComponent;