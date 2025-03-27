// LoanApplicationForm.js
import Form from "@rjsf/core"; // Default import instead of named export
import validator from "@rjsf/validator-ajv8";
import { useMemo } from "react";
import loanSchema from './LoanSchema.json';


const LoanApplicationForm = () => {
  const customValidator = useMemo(() => {
    const ajvValidator = validator;
    ajvValidator.customFormats = {
      gstin: (value) => /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z0-9]{1}Z[\dA-Z]{1}$/.test(value),
      pan: (value) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)
    };
    return ajvValidator;
  }, []);

  const uiSchema = {
    businessDetails: {
      directors: {
        "ui:options": {
          addable: true,
          removable: true,
          orderable: false
        },
        items: {
          tags: {
            "ui:widget": "checkboxes",
            "ui:options": {
              inline: true
            }
          }
        }
      }
    },
    loanDetails: {
      creditScore: {
        "ui:widget": "range",
        "ui:options": {
          min: 300,
          max: 850,
          step: 10
        }
      },
      loanAmount: {
        "ui:widget": "range",
        "ui:options": {
          min: 50000,
          max: 500000,
          step: 10000
        }
      },
      guarantors: {
        "ui:options": {
          addable: true,
          removable: true,
          orderable: false
        },
        items: {
          "ui:order": ["name", "panNumber", "relationship", "relationOther"],
          relationOther: {
            "ui:options": {
              hideOnEmpty: true
            }
          }
        }
      },
      bankStatements: {
        "ui:widget": "FileWidget",
        "ui:options": {
          multiple: true,
          accept: ".pdf,.jpg,.png"
        }
      }
    }
  };

  const handleSubmit = ({ formData }) => {
    console.log("Form submitted:", formData);
    // Add your submission logic here
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Loan Application</h1>
      <Form
        schema={loanSchema}
        uiSchema={uiSchema}
        validator={customValidator}
        onSubmit={handleSubmit}
        templates={{
          FieldTemplate: (props) => (
            <div className="form-group mb-3">
              <label className="form-label">{props.schema.title}</label>
              {props.children}
              {props.errors}
            </div>
          )
        }}
      />
    </div>
  );
};

export default LoanApplicationForm;