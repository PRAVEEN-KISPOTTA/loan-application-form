// LoanApplicationForm.js
import React from "react";
import Form from "@rjsf/core";
import Ajv from "ajv";
// import { ThemeProvider } from "styled-components";

// Import your schema
import loanSchema from './LoanSchema.json';

const LoanApplicationForm = () => {
  const uiSchema = {
    loanDetails: {
      creditScore: {
        "ui:widget": "range",
        "ui:help": "Choose a credit score between 0 and 850"
      },
      loanAmount: {
        "ui:widget": "range",
        "ui:help": "Choose the required loan amount"
      },
      guarantors: {
        "ui:widget": "checkboxes",
        "ui:options": {
          inline: true
        }
      }
    }
  };

  const handleSubmit = ({ formData }) => {
    console.log("Form submitted with data:", formData);
  };

  const validate = new Ajv({ allErrors: true }).compile(loanSchema);

  return (
    <div>
      <h1>Loan Application Form</h1>
      <Form
  schema={loanSchema}  // Pass the updated loan schema
  uiSchema={uiSchema}
  onSubmit={handleSubmit}
  validator={validate}
/>

    </div>
  );
};

export default LoanApplicationForm;
