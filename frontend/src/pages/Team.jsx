import UserTemplate from "@/components/UserTemplate";
import { Plus, X } from "lucide-react";
import React, { useState } from "react";
import CreateTeam from "@/components/Teams/createTeam";
import CreateBtnImage from "@/components/createBtnTemplate";
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
        <CreateBtnImage
          description={
            "Create and manage organizational teams, organize members, and keep team information up to date."
          }
          showForm={showForm}
          setShowForm={setShowForm}
        />

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

        <TeamCard teams={teams} setTeams={setTeams} />
      </div>
    </div>
  );
};

export default Team;
