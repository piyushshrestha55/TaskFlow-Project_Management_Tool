import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  UserPlus,
  UserRound,
  ShieldCheck,
  Trash2,
  X,
  LoaderCircle,
  Users
} from "lucide-react";
import { Button } from "../ui/button";
import api from "@/api/axios";

const ManageTeam = ({ team, onClose, onTeamUpdated }) => {
  const [members, setMembers] = useState(team?.members ?? []);
  const [email, setEmail] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deletingTeam, setDeletingTeam] = useState(false);
  useEffect(() => {
    setMembers(team?.members ?? []);
  }, [team]);

  const updateMembers = (nextMembers) => {
    setMembers(nextMembers);

    onTeamUpdated?.({
      ...team,
      members: nextMembers
    });
  };

  const isAlreadyMember = (userId) =>
    members.some((member) => {
      const existingId = member.userId?._id ?? member.userId;
      return String(existingId) === String(userId);
    });

  // Search registered users by email.
  const handleSearch = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setFoundUser(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter an email address.");
      return;
    }

    setSearching(true);

    try {
      const response = await api.get("/users/search", {
        params: { email: normalizedEmail }
      });

      const user = response.data?.user;

      if (
        !response.data?.success ||
        !user ||
        typeof user !== "object" ||
        !user._id
      ) {
        setError("No registered user found with that email.");
        return;
      }

      if (user.email?.trim().toLowerCase() !== normalizedEmail) {
        setError("No registered user found with that email.");
        return;
      }

      if (isAlreadyMember(user._id)) {
        setError("This user is already a member of the team.");
        return;
      }

      setFoundUser(user);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No registered user found with that email.");
      } else {
        setError(
          err.response?.data?.message || "Unable to search for this user."
        );
      }
    } finally {
      setSearching(false);
    }
  };

  // Add the selected registered user to the team.
  const handleAddMember = async () => {
    if (!foundUser) return;

    setAdding(true);
    setError("");
    setSuccess("");
    try {
      const response = await api.post(`/team/${team._id}/members`, {
        memberId: foundUser._id
      });

      const nextMembers = response.data.team?.members
        ? response.data.team.members
        : [
            ...members,
            {
              userId: foundUser,
              role: "member"
            }
          ];

      updateMembers(nextMembers);
      setSuccess(`${foundUser.name} was added to the team.`);
      setFoundUser(null);
      setEmail("");
    } catch (err) {
      setError(err.message || "Unable to add this member.");
    } finally {
      setAdding(false);
    }
  };

  // Updating a members role.
  const handleRoleChange = async (member, newRole) => {
    const userId = member.userId?._id ?? member.userId;

    if (!userId || member.role === newRole) return;

    setUpdatingId(String(userId));
    setError("");
    setSuccess("");

    try {
      const response = await api.patch(
        `/team/${team._id}/members/${userId}/role`,
        {
          role: newRole
        }
      );

      const nextMembers = response.data.team?.members
        ? response.data.team.members
        : members.map((item) => {
            const itemId = item.userId?._id ?? item.userId;

            return String(itemId) === String(userId)
              ? { ...item, role: newRole }
              : item;
          });

      updateMembers(nextMembers);
      setSuccess("Member role updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update member role.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Remove a member without deleting their user account.
  const handleRemoveMember = async (member) => {
    const userId = member.userId?._id ?? member.userId;
    const memberName = member.userId?.name ?? "this member";

    if (!userId) return;

    const confirmed = window.confirm(`Remove ${memberName} from this team?`);

    if (!confirmed) return;

    setRemovingId(String(userId));
    setError("");
    setSuccess("");

    try {
      const response = await api.delete(`/team/${team._id}/members/${userId}`);

      const nextMembers = response.data.team?.members
        ? response.data.team.members
        : members.filter((item) => {
            const itemId = item.userId?._id ?? item.userId;
            return String(itemId) !== String(userId);
          });

      updateMembers(nextMembers);
      setSuccess(`${memberName} was removed from the team.`);
    } catch (err) {
      setError(err.message || "Unable to remove this member.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleRemoveTeam = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${team.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingTeam(true);
    setError("");
    setSuccess("");

    try {
      await api.delete(`/team/delete/${team._id}`);

      // Tell the parent that this team was deleted.
      onTeamUpdated?.({
        ...team,
        _deleted: true
      });

      onClose?.();
    } catch (err) {
      console.error("Delete team failed:", err.response?.data || err);

      setError(err.response?.data?.message || "Unable to delete this team.");
    } finally {
      setDeletingTeam(false);
    }
  };
  if (!team) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="mt-6 w-full overflow-hidden rounded-2xl border
        border-gray-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b
        border-gray-100 p-5 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center
            rounded-xl bg-orange-50 text-orange-500"
          >
            <Users size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800">Manage Team</h2>
            <p className="text-sm text-gray-500">
              {team.name} · {members.length} members
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close team management"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-7 p-5 sm:p-6">
        {/* Add member */}
        <div>
          <h3 className="mb-1 font-semibold text-gray-800">
            Add a team member
          </h3>
          <p className="mb-4 text-sm text-gray-500">
            Search for an existing registered user by email.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2
                  -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFoundUser(null);
                  setError("");
                  setSuccess("");
                }}
                placeholder="Enter registered user's email"
                required
                className="w-full rounded-xl border border-gray-200
                  py-3 pl-10 pr-3 text-sm outline-none
                  transition focus:border-orange-400
                  focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <Button
              type="submit"
              disabled={searching || !email.trim()}
              className="bg-orange-400 text-white hover:bg-orange-500 cursor-pointer"
            >
              {searching ? (
                <LoaderCircle className="mr-2 animate-spin" size={17} />
              ) : (
                <Search className="mr-2" size={17} />
              )}
              Search user
            </Button>
          </form>

          {foundUser && (
            <div
              className="mt-4 flex flex-col gap-4 rounded-xl
              border border-orange-200 bg-orange-50/50 p-4
              sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                {foundUser.avatar ? (
                  <img
                    src={foundUser.avatar}
                    alt=""
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-11 w-11 items-center
                    justify-center rounded-full bg-orange-100
                    text-orange-600"
                  >
                    <UserRound size={20} />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-800">
                    {foundUser.name}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {foundUser.email}
                  </p>
                  <p className="truncate text-xs text-gray-400">
                    @{foundUser.username}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleAddMember}
                disabled={adding}
                className="bg-orange-400 text-white hover:bg-orange-500"
              >
                {adding ? (
                  <LoaderCircle className="mr-2 animate-spin" size={17} />
                ) : (
                  <UserPlus className="mr-2" size={17} />
                )}
                Add member
              </Button>
            </div>
          )}
        </div>

        {/* Status messages */}
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3
            text-sm text-red-600"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="rounded-lg bg-green-50 p-3
            text-sm text-green-700"
          >
            {success}
          </p>
        )}

        {/* Member management */}
        <div>
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Team members</h3>
            <p className="mt-1 text-sm text-gray-500">
              Change roles or remove members from this team.
            </p>
          </div>

          <div className="space-y-3">
            {members.map((member, index) => {
              const user = member.userId;
              const userId = user?._id ?? user;
              const role = member.role?.toLowerCase() ?? "member";
              const isUpdating = updatingId === String(userId);
              const isRemoving = removingId === String(userId);

              return (
                <div
                  key={String(userId ?? index)}
                  className="flex flex-col gap-4 rounded-xl border
                    border-gray-100 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-10 w-10 shrink-0
                        items-center justify-center rounded-full
                        bg-gray-100 text-gray-500"
                      >
                        <UserRound size={18} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p
                        className="truncate text-sm font-semibold
                        text-gray-800"
                      >
                        {user?.name ?? "Unknown user"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user?.email ?? ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="sr-only" htmlFor={`role-${userId}`}>
                      Role for {user?.name ?? "member"}
                    </label>

                    <select
                      id={`role-${userId}`}
                      value={role}
                      disabled={isUpdating || isRemoving}
                      onChange={(event) =>
                        handleRoleChange(member, event.target.value)
                      }
                      className="min-w-28 rounded-lg border
                        border-gray-200 bg-white px-3 py-2
                        text-sm text-gray-700 outline-none
                        focus:border-orange-400 disabled:opacity-50"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>

                    {isUpdating ? (
                      <LoaderCircle
                        size={18}
                        className="animate-spin text-orange-500"
                      />
                    ) : role === "admin" ? (
                      <ShieldCheck size={18} className="text-orange-500" />
                    ) : null}

                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member)}
                      disabled={isUpdating || isRemoving}
                      aria-label={`Remove ${user?.name ?? "member"}`}
                      title="Remove member"
                      className="rounded-lg p-2 text-red-500
                        hover:bg-red-50 disabled:opacity-50"
                    >
                      {isRemoving ? (
                        <LoaderCircle size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {members.length === 0 && (
              <p
                className="rounded-xl border border-dashed
                border-gray-200 py-8 text-center text-sm text-gray-400"
              >
                No members in this team yet.
              </p>
            )}
          </div>
        </div>
        {/* Deleting section */}
        <div className="border-t border-red-100 pt-5">
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
            <h3 className="font-semibold text-red-700">Danger zone</h3>

            <p className="mt-1 text-sm text-gray-600">
              Permanently delete this team. This action cannot be undone.
            </p>

            <Button
              type="button"
              onClick={handleRemoveTeam}
              disabled={deletingTeam}
              className="mt-4 bg-red-600 text-white hover:bg-red-700"
            >
              {deletingTeam ? (
                <LoaderCircle className="mr-2 animate-spin" size={17} />
              ) : (
                <Trash2 className="mr-2" size={17} />
              )}
              Delete Team
            </Button>
          </div>
        </div>
        <div className="flex justify-end border-t border-gray-100 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

export default ManageTeam;
