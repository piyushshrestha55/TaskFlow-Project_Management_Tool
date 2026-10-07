import { ArrowRight } from "lucide-react";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../components/ui/input";
import { Field, FieldError, FieldLabel } from "../components/ui/field";
import * as z from "zod";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";
import axios from "axios";
const formSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid Email Address"),
  password: z.string().nonempty("Password is required")
});
const LogIn = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(import.meta.env.VITE_AUTH_URI, {
        email: data.email.trim(),
        password: data.password
      });
      const { message, token } = response.data;

      console.log(message);

      if (!token) {
        throw new Error("No authentication token received");
      }
      localStorage.setItem("token", token);
      form.reset();
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };
  return (
    <div className="w-full flex justify-center items-center px-4 py-10 sm:py-12 md:py-16 ">
      <div className="w-full max-w-md rounded-2xl py-6 px-6 shadow-2xl shadow-amber-100 sm:py-6 sm:px-8 flex flex-col  gap-y-7">
        <div className="w-full border-b-7 flex items-center justify-center border-purple-600 rounded-lg">
          <h1 className="mx-auto w-fit font-bold text-xl text-orange-500 pb-2 ">
            Log In
          </h1>
        </div>
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-5">
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
            <div className="w-full text-sm flex justify-end">
              <NavLink
                to="/signup"
                className="text-gray-800 hover:text-black hover:underline flex gap-0.5"
              >
                Don't have an account?{"  "}
                <span className="text-0.5">Sign up</span>
              </NavLink>
            </div>
            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-3 py-2 text-white text-sm font-semibold rounded-sm  hover:-translate-y-0.5 bg-orange-400 hover:bg-orange-500"
              >
                Log In
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

export default LogIn;
