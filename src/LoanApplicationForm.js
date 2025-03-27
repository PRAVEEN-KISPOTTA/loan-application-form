import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { useMemo } from "react";
import loanSchema from './LoanSchema.json';

//array field template for add/remove buttons
const CustomArrayFieldTemplate = (props) => {
  return (
    <div className="array-field mb-4">
      <div className="array-items">
        {props.items.map((element, index) => (
          <div key={element.key} className="array-item card mb-3 p-3">
            <div className="array-item-content">
              {element.children}
              {element.hasRemove && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm mt-2"
                  onClick={element.onDropIndexClick(element.index)}
                >
                  {props.uiSchema["ui:options"]?.removeButtonText || "Remove"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {props.canAdd && (
        <button
          type="button"
          className="btn btn-primary mt-2"
          onClick={props.onAddClick}
        >
          {props.uiSchema["ui:options"]?.addButtonText || "Add Item"}
        </button>
      )}
    </div>
  );
};

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
          orderable: false,
          addButtonText: "Add Director",
          removeButtonText: "Remove Director"
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
          orderable: false,
          addButtonText: "Add Guarantor",
          removeButtonText: "Remove Guarantor"
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
    alert("From Submitted");
    console.log("Form submitted:", formData);
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
          ArrayFieldTemplate: CustomArrayFieldTemplate,
          FieldTemplate: (props) => (
            <div className="form-group mb-3">
              <label className="form-label fw-bold">
                {props.schema.title}
                {props.required && <span className="text-danger"> *</span>}
              </label>
              {props.children}
              {props.errors}
              {props.schema.description && (
                <small className="form-text text-muted">
                  {props.schema.description}
                </small>
              )}
            </div>
          )
        }}
      />
    </div>
  );
};

export default LoanApplicationForm;