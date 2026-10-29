import React from "react";
import { Plus, X } from "lucide-react";
const createBtnTemplate = ({ description, showForm, setShowForm }) => {
  return (
    <div className="px-7 py-2 rounded-sm bg-white flex justify-between items-center">
      <div className="flex flex-col">
        <span className="text-xl font-semibold">Teams Directory</span>

        <span className="text-sm text-gray-400">{description}</span>
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
  );
};

export default createBtnTemplate;
