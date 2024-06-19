import { Field } from "formik";
import React from "react";

const FormikTextArea = ({
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
              <textarea
                {...field}
                {...props}
                type={type}
                id={name}
                value={meta.value}
                //   value={formik.values.firstName}
                onChange={onChange ? onChange : field.onChange}
                //   onChange={(e) => {
                //     formik.setFieldValue("firstName", e.target.value);
                //   }}
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

export default FormikTextArea;
