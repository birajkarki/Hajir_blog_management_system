import { Field } from "formik";
import React from "react";

const FormikRadio = ({
  name,
  label,
  onChange,
  required,
  genders,
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
              {genders.map((item, i) => {
                return (
                  <div key={i}>
                    <label htmlFor={item.value}>{item.label}</label>
                    <input
                      {...field}
                      {...props}
                      id={item.value}
                      type="radio"
                      value={meta.value}
                      //   value={formik.values.firstName}
                      onChange={onChange ? onChange : field.onChange}
                      checked={meta.value === item.value}
                      //   onChange={(e) => {
                      //     formik.setFieldValue("firstName", e.target.value);
                      //   }}
                    />
                    <label htmlFor={item.value}>{item.label}</label>
                  </div>
                );
              })}
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

export default FormikRadio;
