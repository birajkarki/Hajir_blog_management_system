import { Field } from "formik";
import React from "react";

const FormikCheckBox = ({
  name,
  label,
  type,
  onChange,
  required,
  ...props
}) => {
  return (
    <div>
      <Field name={name} label={label}>
        {({ field, form, meta }) => {
          return (
            // meta has value error and touched
            <div>
              <label htmlFor={name}>
                {label}:
                {required ? <span style={{ color: "red" }}>*</span> : null}
              </label>
              <input
                {...field}
                {...props}
                type="checkbox"
                id={name}
                onChange={onChange ? onChange : field.onChange}
                checked={meta.value}
              />
              {meta.touched ? (
                meta.error ? (
                  <div style={{ color: "red" }}>{meta.error}</div>
                ) : null
              ) : null}
            </div>
          );
        }}
      </Field>
    </div>
  );
};

export default FormikCheckBox;
