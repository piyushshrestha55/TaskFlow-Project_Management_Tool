import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  FolderKanban,
  UserRound,
  ShieldCheck,
  CalendarDays,
  Clock,
  X,
  LoaderCircle,
  Settings2,
  Users,
  Trash2
} from "lucide-react";
import { Button } from "../ui/button";
import api from "@/api/axios";
const ManageProject = ({ project, onClose, onProjectUpdated, currentUser }) => {
  const [members, setMembers] = useState(project?.members ?? []);
  const [status, setStatus] = useState(project?.status ?? "planning");
  const [deletingProject, setDeletingProject] = useState(false);
  const [startDate, setStartDate] = useState(
    project?.startDate
      ? new Date(project.startDate).toISOString().split("T")[0]
      : ""
  );

  const [dueDate, setDueDate] = useState(
    project?.dueDate
      ? new Date(project.dueDate).toISOString().split("T")[0]
      : ""
  );

  const [updatingId, setUpdatingId] = useState(null);
  const [updatingField, setUpdatingField] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    if (!project) return;

    setMembers(project.members ?? []);
    setStatus(project.status ?? "planning");

    setStartDate(
      project.startDate
        ? new Date(project.startDate).toISOString().split("T")[0]
        : ""
    );

    setDueDate(
      project.dueDate
        ? new Date(project.dueDate).toISOString().split("T")[0]
        : ""
    );

    setError("");
    setSuccess("");
  }, [project]);

  if (!project) return null;

  const publishProjectUpdate = (updatedProject) => {
    setMembers(updatedProject.members ?? []);
    setStatus(updatedProject.status ?? "planning");

    setStartDate(
      updatedProject.startDate
        ? new Date(updatedProject.startDate).toISOString().split("T")[0]
        : ""
    );

    setDueDate(
      updatedProject.dueDate
        ? new Date(updatedProject.dueDate).toISOString().split("T")[0]
        : ""
    );

    onProjectUpdated?.(updatedProject);
  };

  // Update member role
  const handleRoleChange = async (member, newRole) => {
    const userId = member.userId?._id ?? member.userId;
    const currentRole = member.role?.toLowerCase() ?? "viewer";

    if (!userId || currentRole === newRole) return;

    setUpdatingId(String(userId));
    setError("");
    setSuccess("");

    try {
      const response = await api.patch(
        `/project/${project._id}/role/${userId}`,
        { role: newRole }
      );

      if (!response.data?.success || !response.data?.project) {
        throw new Error(response.data?.message || "Unable to update role.");
      }

      const updatedMembers = response.data.project.members;

      setMembers(updatedMembers);
      onProjectUpdated?.(response.data.project);

      setSuccess("Member role updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update member role."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Update project status
  const handleStatusChange = async (newStatus) => {
    if (!newStatus || newStatus === status) return;

    const previousStatus = status;

    setStatus(newStatus);
    setUpdatingField("status");
    setError("");
    setSuccess("");

    try {
      const response = await api.patch(`/project/${project._id}/status`, {
        status: newStatus
      });

      if (!response.data?.success || !response.data?.project) {
        throw new Error(response.data?.message || "Unable to update status.");
      }

      publishProjectUpdate(response.data.project);
      setSuccess("Project status updated successfully.");
    } catch (err) {
      setStatus(previousStatus);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update project status."
      );
    } finally {
      setUpdatingField(null);
    }
  };

  // Update project dates
  const handleDateChange = async (field, value) => {
    if (!value) {
      setError("Please select a valid date.");
      return;
    }

    const isStartDate = field === "startDate";
    const previousDate = isStartDate ? startDate : dueDate;

    const currentStartDate = isStartDate ? value : startDate;
    const currentDueDate = isStartDate ? dueDate : value;

    if (
      currentStartDate &&
      currentDueDate &&
      new Date(currentStartDate) > new Date(currentDueDate)
    ) {
      setError("Start date cannot be later than the due date.");
      return;
    }

    setUpdatingField(field);
    setError("");
    setSuccess("");

    if (isStartDate) {
      setStartDate(value);
    } else {
      setDueDate(value);
    }

    try {
      const endpoint = isStartDate
        ? `/project/${project._id}/start-Date`
        : `/project/${project._id}/due-Date`;

      const response = await api.patch(endpoint, {
        [field]: value
      });

      if (!response.data?.success || !response.data?.project) {
        throw new Error(response.data?.message || "Unable to update date.");
      }

      publishProjectUpdate(response.data.project);

      setSuccess(
        isStartDate
          ? "Project start date updated successfully."
          : "Project due date updated successfully."
      );
    } catch (err) {
      if (isStartDate) {
        setStartDate(previousDate);
      } else {
        setDueDate(previousDate);
      }

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update project date."
      );
    } finally {
      setUpdatingField(null);
    }
  };

  const handleRemoveProject = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingProject(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.delete(`/project/delete/${project._id}`);

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to delete project.");
      }

      onProjectUpdated?.({
        ...project,
        _deleted: true
      });

      onClose?.();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete project."
      );
    } finally {
      setDeletingProject(false);
    }
  };
  const getStatusStyle = (value) => {
    switch (value) {
      case "planning":
        return "bg-yellow-50 text-yellow-600";
      case "active":
        return "bg-blue-50 text-blue-600";
      case "completed":
        return "bg-green-50 text-green-600";
      case "archived":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-orange-50 text-orange-600";
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="mt-6 w-full overflow-hidden rounded-2xl
        border border-gray-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <FolderKanban size={22} />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-gray-800">Manage Project</h2>
            <p className="truncate text-sm text-gray-500">
              {project.name} · {members.length} members
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close project management"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-7 p-5 sm:p-6">
        {/* Project Settings */}
        <div>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Settings2 size={19} className="text-orange-500" />
              <h3 className="font-semibold text-gray-800">Project settings</h3>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Update your project status and schedule.
            </p>
          </div>

          {/* Status */}
          <div className="mb-5">
            <label
              htmlFor="project-status"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Project status
            </label>

            <div className="flex items-center gap-3">
              <select
                id="project-status"
                value={status}
                disabled={updatingField === "status"}
                onChange={(event) => handleStatusChange(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none focus:border-orange-400 disabled:opacity-50"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>

              {updatingField === "status" ? (
                <LoaderCircle
                  size={19}
                  className="animate-spin text-orange-500"
                />
              ) : (
                <span
                  className={`rounded-full px-3 py-2 text-xs font-medium capitalize ${getStatusStyle(status)}`}
                >
                  {status}
                </span>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="project-start-date"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <CalendarDays size={16} className="text-gray-400" />
                Start date
              </label>

              <div className="relative">
                <input
                  id="project-start-date"
                  type="date"
                  value={startDate}
                  max={dueDate || undefined}
                  disabled={updatingField === "startDate"}
                  onChange={(event) =>
                    handleDateChange("startDate", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none focus:border-orange-400 disabled:opacity-50"
                />

                {updatingField === "startDate" && (
                  <LoaderCircle
                    size={17}
                    className="absolute right-9 top-1/2 -translate-y-1/2 animate-spin text-orange-500"
                  />
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="project-due-date"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Clock size={16} className="text-gray-400" />
                Due date
              </label>

              <div className="relative">
                <input
                  id="project-due-date"
                  type="date"
                  value={dueDate}
                  min={startDate || undefined}
                  disabled={updatingField === "dueDate"}
                  onChange={(event) =>
                    handleDateChange("dueDate", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none focus:border-orange-400 disabled:opacity-50"
                />

                {updatingField === "dueDate" && (
                  <LoaderCircle
                    size={17}
                    className="absolute right-9 top-1/2 -translate-y-1/2 animate-spin text-orange-500"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
          >
            {success}
          </p>
        )}

        {/* Project Members */}
        <div>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Users size={19} className="text-orange-500" />
              <h3 className="font-semibold text-gray-800">Project members</h3>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Update member roles. Adding and removing members is managed
              through team settings.
            </p>
          </div>

          <div className="space-y-3">
            {members.map((member, index) => {
              const user = member.userId;
              const userId = user?._id ?? user;
              const role = member.role?.toLowerCase() ?? "viewer";
              const isUpdating = updatingId === String(userId);

              const isOwner =
                String(userId) ===
                String(project.ownerId?._id ?? project.ownerId);
              const isCurrentUser = String(userId) === String(currentUser);
              return (
                <div
                  key={String(userId ?? index)}
                  className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        <UserRound size={18} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {user?.name ?? "Unknown user"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user?.email ?? ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isOwner || isCurrentUser ? (
                      <span className="rounded-lg bg-orange-50 px-3 py-2 text-sm font-medium text-orange-600">
                        {isOwner ? "Project owner" : "You"}
                      </span>
                    ) : (
                      <>
                        <label
                          className="sr-only"
                          htmlFor={`project-role-${userId}`}
                        >
                          Role for {user?.name ?? "member"}
                        </label>

                        <select
                          id={`project-role-${userId}`}
                          value={role}
                          disabled={isUpdating}
                          onChange={(event) =>
                            handleRoleChange(member, event.target.value)
                          }
                          className="min-w-32 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 disabled:opacity-50"
                        >
                          <option value="manager">Manager</option>
                          <option value="member">Member</option>
                          <option value="viewer">Viewer</option>
                        </select>

                        {isUpdating ? (
                          <LoaderCircle
                            size={18}
                            className="animate-spin text-orange-500"
                          />
                        ) : role === "manager" ? (
                          <ShieldCheck size={18} className="text-orange-500" />
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {members.length === 0 && (
              <p className="rounded-xl border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
                No project members found.
              </p>
            )}
          </div>
        </div>
        {/* Deletion section */}
        <div className="border-t border-red-100 pt-5">
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
            <h3 className="font-semibold text-red-700">Danger zone</h3>

            <p className="mt-1 text-sm text-gray-600">
              Permanently delete this team. This action cannot be undone.
            </p>

            <Button
              type="button"
              onClick={handleRemoveProject}
              disabled={deletingProject}
              className="mt-4 bg-red-600 text-white hover:bg-red-700"
            >
              {deletingProject ? (
                <LoaderCircle className="mr-2 animate-spin" size={17} />
              ) : (
                <Trash2 className="mr-2" size={17} />
              )}
              Delete Project
            </Button>
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-end border-t border-gray-100 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

export default ManageProject;
