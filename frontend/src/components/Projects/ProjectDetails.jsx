import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  FolderKanban,
  CalendarDays,
  Clock,
  Users,
  UserRound,
  ShieldCheck,
  ChartNoAxesCombined
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { Button } from "../ui/button";

const ProjectDetails = ({ project, onClose, onProjectUpdated }) => {
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");

      if (!token || !project) {
        setIsManager(false);
        return;
      }

      const decoded = jwtDecode(token);
      const loggedUserId = decoded.id;

      const currentMember = project.members?.find((member) => {
        const memberId = member.userId?._id ?? member.userId;

        return String(memberId) === String(loggedUserId);
      });

      setIsManager(
        typeof currentMember?.role === "string" &&
          currentMember.role.toLowerCase() === "manager"
      );
    } catch (error) {
      console.error("Failed to validate project role:", error);
      setIsManager(false);
    }
  }, [project]);

  if (!project) return null;

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-600";

      case "in progress":
        return "bg-blue-50 text-blue-600";

      case "pending":
        return "bg-yellow-50 text-yellow-600";

      case "on hold":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-orange-50 text-orange-600";
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "Not specified"
      : parsedDate.toLocaleDateString();
  };

  return (
    <motion.section
      key={project._id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6 w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <FolderKanban size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">{project.name}</h2>

            <p className="mt-1 text-sm text-gray-500">
              Project details and information
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Close
        </button>
      </div>

      {/* Project Information */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-orange-50 p-4">
          <p className="text-sm text-gray-500">Project name</p>

          <p className="mt-1 font-semibold text-gray-800">{project.name}</p>
        </div>

        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-sm text-gray-500">Project status</p>

          <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(project.status)}`}
          >
            {project.status || "Not started"}
          </span>
        </div>

        <div className="rounded-xl bg-purple-50 p-4">
          <p className="text-sm text-gray-500">Total members</p>

          <p className="mt-1 font-semibold text-gray-800">
            {project.members?.length ?? 0}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="mb-3 text-base font-semibold text-gray-800">
          Project description
        </h3>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-sm leading-6 text-gray-600">
            {project.description || "No project description available."}
          </p>
        </div>
      </div>

      {/* Dates */}
      <div className="mb-6">
        <h3 className="mb-4 text-base font-semibold text-gray-800">
          Project timeline
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <CalendarDays size={19} />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">Start date</p>

              <p className="text-xs text-gray-400">
                {formatDate(project.startDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <Clock size={19} />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">Deadline</p>

              <p className="text-xs text-gray-400">
                {formatDate(project.deadline)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Members */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800">
            Project members
          </h3>

          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
            {project.members?.length ?? 0} members
          </span>
        </div>

        <div className="space-y-3">
          {(project.members ?? []).map((member, index) => {
            const role = member.role ?? "member";

            const isMemberManager =
              typeof role === "string" && role.toLowerCase() === "manager";

            const user = member.userId?._id ? member.userId : member.userId;

            const userId = user?._id ?? user;

            return (
              <div
                key={String(userId ?? index)}
                className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <UserRound size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {typeof user === "object"
                      ? (user.name ?? "Unknown user")
                      : "Unknown user"}
                  </p>

                  <p className="truncate text-xs text-gray-400">
                    {typeof user === "object"
                      ? (user.email ?? "Email not available")
                      : "Email not available"}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    isMemberManager
                      ? "bg-orange-50 text-orange-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {isMemberManager && <ShieldCheck size={12} />}

                  {isMemberManager ? "Manager" : "Member"}
                </span>
              </div>
            );
          })}

          {(project.members?.length ?? 0) === 0 && (
            <p className="py-6 text-center text-sm text-gray-400">
              No members assigned yet.
            </p>
          )}
        </div>

        {/* Manager Actions */}
        {isManager && (
          <div className="mt-5 flex justify-end">
            <Button className="bg-orange-500 text-white hover:bg-orange-600 hover:-translate-y-0.5">
              Manage Project
            </Button>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default ProjectDetails;
