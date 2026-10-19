import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { UserRound, ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import { jwtDecode } from "jwt-decode";
import ManageTeam from "./ManageTeam";

const TeamDetails = ({ team, onClose, onTeamUpdated }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  console.log(team);
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !team) {
        setIsAdmin(false);
        return;
      }
      const decode = jwtDecode(token);
      const loggedUserId = decode.id;
      const currentMember = team.members?.find((member) => {
        const memberId = member.userId?._id ?? member.userId;
        return String(memberId) === String(loggedUserId);
      });
      setIsAdmin(currentMember?.role?.toLowerCase() === "admin");
    } catch (error) {
      console.error("Failed to validate team role:", error);
      setIsAdmin(false);
    }
  }, [team]);
  if (!team) return null;

  return (
    <motion.section
      key={team._id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6 rounded-2xl border w-full border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{team.name}</h2>
          <p className="mt-1 text-sm text-gray-500">Team details and members</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200
        px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Close
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-orange-50 p-4">
          <p className="text-sm text-gray-500">Team name</p>
          <p className="mt-1 font-semibold text-gray-800">{team.name}</p>
        </div>

        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-sm text-gray-500">Total members</p>
          <p className="mt-1 font-semibold text-gray-800">
            {team.members?.length ?? 0}
          </p>
        </div>
      </div>

      <h3 className="mb-4 text-base font-semibold text-gray-800">
        All team members
      </h3>

      <div className="space-y-3">
        {(team.members ?? []).map((member, index) => {
          const role = member.role ?? "member";
          const isAdmin =
            typeof role === "string" && role.toLowerCase() === "admin";

          return (
            <div
              key={member.userId?._id ?? index}
              className="flex items-center gap-3 rounded-xl
            border border-gray-100 p-3"
            >
              <div
                className="flex h-10 w-10 items-center
            justify-center rounded-full bg-gray-100
            text-gray-500"
              >
                <UserRound size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800">
                  {member.userId?.name ?? "Unknown user"}
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-1
              rounded-full px-3 py-1 text-xs font-medium ${
                isAdmin
                  ? "bg-orange-50 text-orange-600"
                  : "bg-blue-50 text-blue-600"
              }`}
              >
                {isAdmin && <ShieldCheck size={12} />}
                {isAdmin ? "Admin" : "Member"}
              </span>
            </div>
          );
        })}
        {(team.members?.length ?? 0) === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">
            No members assigned yet.
          </p>
        )}

        {isAdmin && (
          <div className="flex justify-end px-8 py-2">
            <Button
              onClick={() => setIsManageOpen(true)}
              className="bg-orange-400 text-white hover:bg-orange-500
        hover:font-semibold hover:-translate-y-0.5"
            >
              Manage Team
            </Button>
          </div>
        )}
      </div>
      {isAdmin && isManageOpen && (
        <ManageTeam
          team={team}
          onClose={() => setIsManageOpen(false)}
          onTeamUpdated={onTeamUpdated}
        />
      )}
    </motion.section>
  );
};

export default TeamDetails;
