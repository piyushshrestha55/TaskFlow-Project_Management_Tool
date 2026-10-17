import UserTemplate from "@/components/UserTemplate";
import { Plus, X } from "lucide-react";
import React, { useState } from "react";
import CreateTeam from "@/components/Teams/createTeam";
import { useLoaderData } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import TeamCard from "@/components/Teams/teamCard";

const Team = () => {
  const { teams: initialTeams } = useLoaderData();
  const [teams, setTeams] = useState(initialTeams ?? []);
  const [showForm, setShowForm] = useState(false);
  console.log(teams);
  return (
    <div className="min-h-screen">
      <UserTemplate title="Team Management" />

      <div className="w-full min-h-screen bg-gray-100 px-10 py-6">
        <div className="px-7 py-2 rounded-sm bg-white flex justify-between items-center">
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
              transition-colors hover:-translate-y-0.5"
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
              <CreateTeam
                onTeamCreated={(newTeam) => {
                  setTeams((prev) => [...prev, newTeam]);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Render your teams list here using the teams state */}
        <TeamCard teams={teams} setTeams={setTeams} />
      </div>
    </div>
  );
};

export default Team;
