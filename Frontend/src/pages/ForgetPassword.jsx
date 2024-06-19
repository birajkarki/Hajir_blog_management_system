import { useFormik } from "formik";
import { forgetSchema } from "../schemas";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiRequest from "../utils/apiRequests";

const ForgetPassword = () => {

  const navigate = useNavigate();
  const initialValues = {
    email: "",
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: forgetSchema,
    onSubmit: async (values) => {
      try {
        const res = await ApiRequest.post("/user/forget", values);
        navigate("/");
        toast.success(res.data.message)
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-500 to-purple-500">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">
          Forget your Password?
        </h1>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && touched.email ? (
            <p className="text-red-500 text-sm">{errors.email}</p>
          ) : null}
          <button
            type="submit"
            className="bg-indigo-500 text-white p-3 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
