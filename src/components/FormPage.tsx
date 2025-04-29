import React, { useEffect, useState } from 'react';
import { getForm } from '../utils/api';
import { FormResponse, FormSection } from '../types/formTypes';
import FormSectionComponent from './FormSection';


interface FormPageProps {
  rollNumber: string;
}

const FormPage: React.FC<FormPageProps> = ({ rollNumber }) => {
  const [formData, setFormData] = useState<FormResponse | null>(null);

  useEffect(() => {
    async function fetchForm() {
      try {
        const response = await getForm(rollNumber);
        setFormData(response.data);
      } catch (error) {
        alert('Failed to fetch form');
      }
    }
    fetchForm();
  }, [rollNumber]);

  if (!formData) return <div>Loading form...</div>;

  return (
    <div className="form-container">
      <h2>{formData.form.formTitle}</h2>
      <FormSectionComponent sections={formData.form.sections} />
    </div>
  );
};

export default FormPage;
