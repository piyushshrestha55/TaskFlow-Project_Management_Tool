import React from "react";
import { motion } from "motion/react";
import {
  ChevronRight,
  FolderKanban,
  CalendarDays,
  UserRound,
  Clock
} from "lucide-react";

const ProjectCard = ({ projects }) => {
  if (!projects?.length) {
    return (
      <div
        className="mt-8 rounded-2xl border border-dashed
        border-gray-300 bg-white px-6 py-16 text-center"
      >
        <FolderKanban className="mx-auto mb-3 text-orange-400" size={42} />

        <h3 className="text-lg font-semibold text-gray-800">No projects yet</h3>

        <p className="mt-1 text-sm text-gray-500">
          Create your first project to get started.
        </p>
      </div>
    );
  }

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

  return (
    <div>
      <div
        className="grid grid-cols-1 gap-5 py-6
        md:grid-cols-2 xl:grid-cols-3"
      >
        {projects.map((project, index) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.25,
              delay: index * 0.06
            }}
            className="group overflow-hidden rounded-2xl border
            border-gray-200 bg-white shadow-sm
            transition-all duration-300
            hover:-translate-y-1 hover:border-orange-200
            hover:shadow-lg"
          >
            {/* Project Header */}
            <div className="border-b border-gray-100 p-5">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-12 w-12 shrink-0
                  items-center justify-center rounded-xl
                  bg-orange-50 text-orange-500"
                >
                  <FolderKanban size={23} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-gray-800">
                    {project.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    {project.members?.length ?? 0} project members
                  </p>
                </div>

                <ChevronRight
                  size={19}
                  className="text-gray-300 transition group-hover:text-orange-500"
                />
              </div>
            </div>

            {/* Project Information */}
            <div className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700">
                  Project overview
                </h4>

                <span
                  className={`rounded-full px-2.5 py-1
                  text-xs font-medium ${getStatusStyle(project.status)}`}
                >
                  {project.status || "Not started"}
                </span>
              </div>

              {/* Description */}
              <p className="mb-5 line-clamp-2 text-sm text-gray-500">
                {project.description || "No project description available."}
              </p>

              <div className="space-y-4">
                {/* Members */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0
                    items-center justify-center rounded-full
                    bg-gray-100 text-gray-500"
                  >
                    <UserRound size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Team members
                    </p>

                    <p className="text-xs text-gray-400">
                      {project.members?.length ?? 0} members assigned
                    </p>
                  </div>
                </div>

                {/* Start Date */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0
                    items-center justify-center rounded-full
                    bg-gray-100 text-gray-500"
                  >
                    <CalendarDays size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Start date
                    </p>

                    <p className="text-xs text-gray-400">
                      {project.startDate
                        ? new Date(project.startDate).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0
                    items-center justify-center rounded-full
                    bg-gray-100 text-gray-500"
                  >
                    <Clock size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Deadline
                    </p>

                    <p className="text-xs text-gray-400">
                      {project.deadline
                        ? new Date(project.deadline).toLocaleDateString()
                        : "No deadline"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              {project.progress !== undefined && (
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      Project progress
                    </span>

                    <span className="text-xs font-semibold text-orange-500">
                      {project.progress}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-orange-500
                      transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, Number(project.progress) || 0)
                        )}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between
              border-t border-gray-100 bg-gray-50/70 px-5 py-3"
            >
              <span className="text-xs text-gray-400">Project workspace</span>

              <span className="text-sm font-semibold text-orange-500">
                Project
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectCard;
