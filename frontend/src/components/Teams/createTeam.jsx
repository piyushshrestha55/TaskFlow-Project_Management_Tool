import React from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/api/axios";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const createSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(8, "Team name must be at least 8 characters")
    .max(40, "Team name cannot be longer than 40 characters"),
  description: z.string()
});

const CreateTeam = ({ onTeamCreated, onCancel }) => {
  const createForm = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const onSubmit = async (data) => {
    try {
      createForm.clearErrors("root");

      const response = await api.post("/team/create", data);

      onTeamCreated(response.data.team);
      createForm.reset();
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
    <div className="mt-3 rounded-lg bg-white p-7 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold">Create New Team</h2>

      <form onSubmit={createForm.handleSubmit(onSubmit)} className="space-y-4">
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
                className="w-full focus-visible:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-200"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={createForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                {...field}
                id="description"
                placeholder="Enter description"
                aria-invalid={fieldState.invalid}
                className="w-full focus-visible:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-200"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex justify-end gap-3 px-5">
          <Button
            type="button"
            onClick={onCancel}
            className="bg-orange-400 text-sm text-white hover:bg-orange-500"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={createForm.formState.isSubmitting}
            className="bg-orange-400 text-sm text-white hover:bg-orange-500"
          >
            {createForm.formState.isSubmitting ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeam;
