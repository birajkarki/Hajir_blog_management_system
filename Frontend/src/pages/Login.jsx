import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { loginSchema } from "../schemas";
import ApiRequest from "../utils/apiRequest";
import { toast } from "react-toastify";
import { useContext, useEffect } from "react";
import { Context } from "../context/Context";

const Login = () => {
  const navigate = useNavigate();

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const initialValues = {
    email: "",
    password: "",
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const req = await ApiRequest.post("/user/login", values);
        setIsAuthenticated(true);
        navigate("/");
        toast.success(req.data.message);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
  });

  const handleRegister = () => {
    navigate("/register");
  };

  const handleForgetPassword = () => {
    navigate("/forget");
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);


  

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-500 to-purple-500">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">
          Login
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
          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.password && touched.password ? (
            <p className="text-red-500 text-sm">{errors.password}</p>
          ) : null}
          <button
            type="submit"
            className="bg-indigo-500 text-white p-3 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">
            Don't have an account?{" "}
            <button
              className="text-indigo-500 font-semibold hover:underline"
              onClick={handleRegister}
            >
              Register
            </button>
          </p>
          <button
            className="text-indigo-500 text-sm mt-2 hover:underline"
            onClick={handleForgetPassword}
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
