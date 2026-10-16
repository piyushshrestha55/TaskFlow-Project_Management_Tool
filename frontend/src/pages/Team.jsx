import UserTemplate from "@/components/UserTemplate";
import { Plus, X } from "lucide-react";
import * as z from "zod";
import React, { useState } from "react";
import { useLoaderData } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api from "@/api/axios";
const createSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .max(40, "Team name cannot be longer than 40 characters")
    .min(8, "Team name must be at least of 8 characters"),
  description: z.string()
});
const Team = () => {
  const { teams: initialTeams } = useLoaderData();
  const [teams, setTeams] = useState(initialTeams ?? []);
  const createForm = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });
  const [showForm, setShowForm] = useState(false);
  console.log(`The data is`, teams);

  // Creation of the Team
  const onSubmit = async (data) => {
    try {
      createForm.clearErrors("root");
      const response = await api.post("/team/create", data);
      console.log("Team created:", response.data);
      setTeams((prev) => [...prev, response.data.team]);
      createForm.reset();
      setShowForm(false);
    } catch (error) {
      if (error.response?.status !== 401) {
        createForm.setError("root.serverError", {
          type: "server",
          message:
            error.response?.data?.message ||
            "Failed to create team. Please try again."
        });
      }
    }
  };

  return (
    <div className="min-h-screen">
      <UserTemplate title={"Team Management"} />
      <div className="w-full min-h-screen bg-gray-100 px-10 pt-4">
        <div className=" px-7 py-2 rounded-sm bg-white flex justify-between items-center ">
          <div className="flex flex-col">
            <span className="text-xl font-semibold">Teams Directory</span>
            <span className="text-sm text-gray-400">
              Manage organizational teams, inspect member allocations, and view
              assigned projects.
            </span>
          </div>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="flex gap-2 bg-orange-400 hover:bg-orange-500
              items-center rounded-lg px-3 py-2 text-white text-sm
              transition-colors"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? "Cancel" : "Create"}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-lg bg-white p-7 shadow-sm">
                <h2 className="text-lg font-semibold mb-5">Create New Team</h2>
                <form
                  onSubmit={createForm.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {createForm.formState.errors.root?.serverError && (
                    <div
                      role="alert"
                      className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
                    >
                      {createForm.formState.errors.root.serverError.message}
                    </div>
                  )}
                  <Controller
                    name="name"
                    control={createForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input
                          {...field}
                          id="name"
                          placeholder="Enter team name"
                          aria-invalid={fieldState.invalid}
                          className="w-full focus-visible:border-orange-400 focus:ring-2 focus-visible:ring-orange-200"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="description"
                    control={createForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="description">
                          Description
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id="description"
                          placeholder="Enter description"
                          aria-invalid={fieldState.invalid}
                          className="w-full focus-visible:border-orange-400 focus:ring-2 focus-visible:ring-orange-200"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <div className="flex justify-end px-5 gap-3">
                    <Button
                      type="button"
                      onClick={() => {
                        createForm.reset();
                        createForm.clearErrors();
                        setShowForm(false);
                      }}
                      className="bg-orange-400 hover:bg-orange-500 text-sm text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className={
                        "bg-orange-400 hover:bg-orange-500 text-sm text-white hover:font-semibold hover:-translate-y-0.5"
                      }
                    >
                      {createForm.formState.isSubmitting
                        ? "Creating..."
                        : "Create"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Team;
