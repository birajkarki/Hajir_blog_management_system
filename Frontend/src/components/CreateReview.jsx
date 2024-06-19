import React from "react";
import FormikSelect from "../FormFields/FormikSelect";

const CreateReview = () => {
  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        // enableReinitialize={true} this is done because in the case of fetching and setting initial values, formik takes the initial values one time only so this property allows reinitializtion of initial values after fetching, used in update methods
      >
        {(formik) => (
          <Form>
            {/* <FormikInput name="name" label="Name" type="text" required={true} /> */}
            <FormikInput
              name="name"
              label="FullName"
              type="string"
              required={true}
            />
            <FormikInput
              name="reviewText"
              label="Review"
              type="email"
              required={true}
            />
            <FormikSelect
              name="password"
              label="Password"
              type="password"
              required={true}
            ></FormikSelect>
            <button type="submit">
              <div>Create User</div>
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateReview;
