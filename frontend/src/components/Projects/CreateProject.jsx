import React, { useEffect, useState } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/api/axios";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Adjust this import to match your project's UI components.
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const createSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Project name is required")
      .min(3, "Project name must be at least 3 characters")
      .max(60, "Project name cannot exceed 60 characters"),

    description: z.string(),

    teamId: z.string().min(1, "Please select a team"),

    status: z.enum(["planning", "active", "completed", "archived"]),

    startDate: z.string(),

    dueDate: z.string()
  })
  .refine(
    (data) =>
      !data.startDate || !data.dueDate || data.dueDate >= data.startDate,
    {
      message: "Due date cannot be before the start date",
      path: ["dueDate"]
    }
  );

const CreateProject = ({
  onProjectCreated,
  onCancel,
  successMessage,
  setSuccessMessage
}) => {
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [teamsError, setTeamsError] = useState("");
  const createForm = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: "",
      description: "",
      teamId: "",
      status: "planning",
      startDate: "",
      dueDate: ""
    }
  });

  // TODO: Replace this endpoint with your actual teams API.
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setTeamsLoading(true);
        setTeamsError("");

        const response = await api.get("/team");

        setTeams(response.data.teams ?? []);
      } catch (error) {
        setTeamsError(
          error.response?.data?.message ||
            "Failed to load teams. Please try again."
        );
      } finally {
        setTeamsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const onSubmit = async (data) => {
    try {
      createForm.clearErrors("root");
      setSuccessMessage("");

      const payload = {
        ...data,
        startDate: data.startDate || null,
        dueDate: data.dueDate || null
      };

      const response = await api.post("/project/create", payload);

      if (response.data.success) {
        createForm.reset();

        onProjectCreated?.(response.data.project);
      } else {
        throw new Error(response.data.message || "Failed to create project.");
      }
    } catch (error) {
      console.error("Project creation error:", error);

      createForm.setError("root.serverError", {
        type: "server",
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to create project. Please try again."
      });
    }
  };

  const inputClassName =
    "w-full focus-visible:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-200";

  return (
    <div className="mt-3 rounded-lg bg-white p-4 shadow-sm sm:p-7">
      <h2 className="mb-5 text-lg font-semibold">Create New Project</h2>

      <form onSubmit={createForm.handleSubmit(onSubmit)} className="space-y-4">
        {successMessage && (
          <div
            role="status"
            className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            ✓ {successMessage}
          </div>
        )}

        {createForm.formState.errors.root?.serverError && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {createForm.formState.errors.root.serverError.message}
          </div>
        )}

        {/* Project Name */}
        <Controller
          name="name"
          control={createForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="project-name">Project Name</FieldLabel>

              <Input
                {...field}
                id="project-name"
                placeholder="Enter project name"
                aria-invalid={fieldState.invalid}
                className={inputClassName}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={createForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="project-description">Description</FieldLabel>

              <Textarea
                {...field}
                id="project-description"
                placeholder="Describe the project"
                aria-invalid={fieldState.invalid}
                className={inputClassName}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Team Selection */}
        <Controller
          name="teamId"
          control={createForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="project-team">Assign Team</FieldLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={teamsLoading || teams.length === 0}
              >
                <SelectTrigger
                  id="project-team"
                  aria-invalid={fieldState.invalid}
                  className={inputClassName}
                >
                  <SelectValue
                    placeholder={
                      teamsLoading ? "Loading teams..." : "Select a team"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team._id} value={team._id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

              {teamsError && (
                <p role="alert" className="text-sm text-red-600">
                  {teamsError}
                </p>
              )}

              {!teamsLoading && !teamsError && teams.length === 0 && (
                <p className="text-sm text-gray-500">
                  No teams available. Create a team first.
                </p>
              )}

              <p className="text-xs text-gray-500">
                Team members will be added to the project automatically.
              </p>
            </Field>
          )}
        />

        {/* Project Status */}
        <Controller
          name="status"
          control={createForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="project-status">Project Status</FieldLabel>

              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="project-status"
                  aria-invalid={fieldState.invalid}
                  className={inputClassName}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Start Date */}
        <Controller
          name="startDate"
          control={createForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="project-start-date">Start Date</FieldLabel>

              <Input
                {...field}
                id="project-start-date"
                type="date"
                aria-invalid={fieldState.invalid}
                className={inputClassName}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Due Date */}
        <Controller
          name="dueDate"
          control={createForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="project-due-date">Due Date</FieldLabel>

              <Input
                {...field}
                id="project-due-date"
                type="date"
                aria-invalid={fieldState.invalid}
                className={inputClassName}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:px-5">
          <Button
            type="button"
            onClick={onCancel}
            disabled={createForm.formState.isSubmitting}
            className="w-full bg-gray-200 text-sm text-gray-800 hover:bg-gray-300 sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={
              createForm.formState.isSubmitting ||
              teamsLoading ||
              teams.length === 0
            }
            className="w-full bg-orange-400 text-sm text-white hover:bg-orange-500 sm:w-auto"
          >
            {createForm.formState.isSubmitting
              ? "Creating..."
              : "Create Project"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
