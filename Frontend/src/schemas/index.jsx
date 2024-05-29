import * as Yup from "yup"

export const loginSchema = Yup.object({
    email: Yup.string().email().required("Please enter your Email"),
    password:Yup.string().min(6).required("Please enter your password!")
})

export const registerSchema = Yup.object({
    username: Yup.string().min(2).max(25).required("Please provide your username"),
    email: Yup.string().email().required("Please enter your Email"),
    password:Yup.string().min(6).required("Please enter your password!"),
    confirmPassword:Yup.string().required().oneOf([Yup.ref("password"), null], "Password do not match!")

})

export const forgetSchema = Yup.object({
    email: Yup.string().email().required("Please enter your Email"),
})

export const resetSchema = Yup.object({
    password:Yup.string().min(6).required("Please enter your New Password!"),
    confirmPassword:Yup.string().required().oneOf([Yup.ref("password"), null], "Password do not match!")
})
