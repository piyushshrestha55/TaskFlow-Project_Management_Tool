import { ArrowRight } from "lucide-react";
import React from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../components/ui/input";
import { Field, FieldError, FieldLabel } from "../components/ui/field";
import * as z from "zod";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";
const formSchema = z
  .object({
    name: z
      .string()
      .nonempty("Name is required")
      .max(30, "Name must be less than 30 characters long")
      .min(8, "Please use your full name"),
    username: z
      .string()
      .nonempty("Username is required")
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z
      .string()
      .nonempty("Email is required")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid Email Address"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string().nonempty("Confirm Password  is required")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"]
  });

const SignUp = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(import.meta.env.VITE_REGISTER_URI, {
        name: data.name.trim(),
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      console.log(response.data);
      form.reset();
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };
  return (
    <div className="w-full flex justify-center items-center px-4 py-10 sm:py-12 md:py-16 ">
      <div className="w-full max-w-md rounded-2xl py-6 px-6 shadow-2xl shadow-amber-100 sm:py-6 sm:px-8 flex flex-col  gap-y-5">
        <div className="w-full border-b-7 flex items-center justify-center border-purple-600 rounded-lg">
          <h1 className="mx-auto w-fit font-bold text-xl text-orange-500 pb-2 ">
            Register Now
          </h1>
        </div>
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-3">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </FieldLabel>

                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter your name"
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="username" className="flex gap-2">
                    Username <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="username"
                    placeholder="Enter your username"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email" className="flex gap-2">
                    Email <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="Enter your email"
                    id="email"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password" className="flex gap-2">
                    Password <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type={"password"}
                    id="password"
                    placeholder="Enter your password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirm" className="flex gap-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type={"password"}
                    id="confirm"
                    placeholder="Confirm your password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="w-full text-sm flex justify-end">
              <NavLink
                to="/login"
                className="text-gray-800 hover:text-black hover:underline flex gap-0.5"
              >
                Already have an account?{"  "}
                <span className="text-0.5">Log In</span>
              </NavLink>
            </div>
            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-3 text-white text-sm font-semibold rounded-sm  hover:-translate-y-0.5 bg-orange-400 hover:bg-orange-500"
              >
                Register
                <span>
                  <ArrowRight width={20} />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
