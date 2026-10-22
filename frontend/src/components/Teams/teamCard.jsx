import React, { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, ShieldCheck, UserRound, Users } from "lucide-react";
import TeamDetails from "./TeamDetails";
const TeamCard = ({ teams, setTeams }) => {
  const [team, setTeam] = useState(null);
  const handleTeamUpdated = (updatedTeam) => {
    if (updatedTeam?._deleted) {
      setTeams((prevTeams) =>
        prevTeams.filter((t) => String(t._id) !== String(updatedTeam._id))
      );

      setTeam(null);
      return;
    }

    setTeams((prevTeams) =>
      prevTeams.map((t) =>
        String(t._id) === String(updatedTeam._id) ? updatedTeam : t
      )
    );

    setTeam(updatedTeam);
  };
  if (!teams?.length) {
    return (
      <div
        className="mt-8 rounded-2xl border border-dashed
        border-gray-300 bg-white px-6 py-16 text-center"
      >
        <Users className="mx-auto mb-3 text-orange-400" size={42} />
        <h3 className="text-lg font-semibold text-gray-800">No teams yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Create your first team to get started.
        </p>
      </div>
    );
  }
  return (
    <div>
      <div
        className="grid grid-cols-1 gap-5 py-6
      md:grid-cols-2 xl:grid-cols-3 "
      >
        {teams.map((team, index) => (
          <motion.div
            key={team._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.06 }}
            className="group overflow-hidden rounded-2xl border
            border-gray-200 bg-white shadow-sm
            transition-all duration-300
            hover:-translate-y-1 hover:border-orange-200
            hover:shadow-lg"
          >
            <div className="border-b border-gray-100 p-5">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-12 w-12 shrink-0
                items-center justify-center rounded-xl
                bg-orange-50 text-orange-500"
                >
                  <Users size={23} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    className="truncate text-base font-semibold
                  text-gray-800"
                  >
                    {team.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">
                    {team.members?.length ?? 0} team members
                  </p>
                </div>

                <button
                  type="button"
                  aria-label={`View ${team.name}`}
                  onClick={() => setTeam(team)}
                  className="rounded-lg p-2 text-gray-400
                  transition hover:bg-orange-50
                  hover:text-orange-500"
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div
                className="mb-4 flex items-center
              justify-between"
              >
                <h4 className="text-sm font-semibold text-gray-700">
                  Team members
                </h4>
                <span
                  className="rounded-full bg-orange-50
                px-2.5 py-1 text-xs font-medium text-orange-600"
                >
                  {team.members?.length ?? 0} members
                </span>
              </div>

              <div className="space-y-3">
                {(team.members ?? []).slice(0, 4).map((member, memberIndex) => {
                  const role = member.role ?? "member";
                  const isAdmin =
                    typeof role === "string" && role.toLowerCase() === "admin";
                  const user = member?.userId;
                  const userId = user?._id ?? user;

                  return (
                    <div
                      key={String(userId ?? memberIndex)}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="flex h-9 w-9 shrink-0
                        items-center justify-center rounded-full
                        bg-gray-100 text-gray-500"
                      >
                        <UserRound size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-sm
                          font-medium text-gray-700"
                        >
                          {user ? String(user.name) : "Unknown user"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {user ? user.email : "Email"}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full
    px-2 py-1 text-xs font-medium ${
      isAdmin ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
    }`}
                      >
                        {isAdmin && <ShieldCheck size={12} />}
                        {isAdmin ? "Admin" : "Member"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {(team.members?.length ?? 0) > 4 && (
                <p className="mt-3 text-xs text-gray-400">
                  +{team.members.length - 4} more members
                </p>
              )}

              {(team.members?.length ?? 0) === 0 && (
                <p className="py-4 text-center text-sm text-gray-400">
                  No members assigned yet.
                </p>
              )}
            </div>

            <div
              className="flex items-center justify-between
            border-t border-gray-100 bg-gray-50/70 px-5 py-3"
            >
              <span className="text-xs text-gray-400">Team workspace</span>
              <button
                type="button"
                onClick={() => setTeam(team)}
                className="text-sm font-semibold text-orange-500
                transition hover:text-orange-600"
              >
                View details →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      <TeamDetails
        team={team}
        onClose={() => setTeam(null)}
        onTeamUpdated={handleTeamUpdated}
      />
    </div>
  );
};

export default TeamCard;
