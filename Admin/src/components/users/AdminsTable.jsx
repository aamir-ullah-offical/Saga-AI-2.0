import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";          // ✅ toast

const AITableAdminView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [aiList, setAIList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "", password: "" });

  const [editRoleId, setEditRoleId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const [currentUserId, setCurrentUserId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ───────── helpers ───────── */
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/auth/profile", authHeader);
      setCurrentUserId(data._id);
    } catch (err) {
      toast.error("Failed to fetch profile");
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/users", authHeader);
      setAIList(data);
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ───────── User CRUD ───────── */
  const handleEdit = (user) => {
    setEditId(user._id);
    setEditData({ name: user.name, email: user.email, password: "" });
  };

  const handleSave = async (id) => {
    const load = toast.loading("Saving…");
    try {
      const payload = {
        name: editData.name,
        email: editData.email,
        ...(editData.password && { password: editData.password }),
      };
      await axios.put(`http://localhost:5000/api/users/${id}`, payload, authHeader);
      toast.success("User updated", { id: load });
      setEditId(null);
      fetchUsers();
    } catch (err) {
      toast.error("Update failed", { id: load });
      console.error(err);
    }
  };

  const handleDelete = (id) => {
    toast.custom(
      (t) => (
        <div className="bg-white shadow-lg rounded-lg p-4 flex items-center gap-4">
          <span className="text-sm">Delete this user?</span>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const load = toast.loading("Deleting…");
              try {
                await axios.delete(`http://localhost:5000/api/users/${id}`, authHeader);
                toast.success("Deleted", { id: load });
                fetchUsers();
              } catch (err) {
                toast.error("Delete failed", { id: load });
                console.error(err);
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-600 text-xs font-semibold px-3 py-1 rounded border"
          >
            Cancel
          </button>
        </div>
      ),
      { id: `confirm-${id}`, duration: 60000, position: "top-center" }
    );
  };

  /* ───────── Role PATCH ───────── */
  const handleRoleEdit = (user) => {
    setEditRoleId(user._id);
    setSelectedRole(user.role);
  };

  const handleRoleSave = async (id) => {
    const load = toast.loading("Updating role…");
    try {
      await axios.patch(
        `http://localhost:5000/api/users/${id}/role`,
        { role: selectedRole },
        authHeader
      );
      toast.success("Role updated", { id: load });
      setEditRoleId(null);
      fetchUsers();
    } catch (err) {
      toast.error("Role update failed", { id: load });
      console.error(err);
    }
  };

  /* ───────── filter ───────── */
  const filtered = aiList
    .filter((u) => u._id !== currentUserId)
    .filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  /* ───────── UI ───────── */
  return (
    <motion.div
      className="bg-white shadow-md rounded-xl p-6 border border-gray-200 mb-8 relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-[#2C4964]">All Admins</h2>
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="border border-gray-300 rounded px-4 py-2 text-sm w-72"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => navigate("/add-admin")}
            className="bg-[#1977cc] text-white px-4 py-2 rounded-md text-sm hover:bg-[#155fa0]"
          >
            + Add Admin
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F3F7FB]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2C4964]">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2C4964]">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2C4964]">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2C4964]">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2C4964]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((u, idx) => (
              <tr key={u._id}>
                <td className="px-6 py-4 text-sm text-gray-700">{idx + 1}</td>

                {/* Name */}
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  {editId === u._id ? (
                    <input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="border px-2 py-1 rounded w-full text-sm"
                    />
                  ) : (
                    u.name
                  )}
                </td>

                {/* Email */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {editId === u._id ? (
                    <input
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="border px-2 py-1 rounded w-full text-sm"
                    />
                  ) : (
                    u.email
                  )}
                </td>

                {/* Role */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {editRoleId === u._id ? (
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="border px-2 py-1 rounded w-full text-sm"
                    >
                      <option value="admin">admin</option>
                      <option value="user">user</option>
                    </select>
                  ) : (
                    u.role
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-sm flex flex-wrap gap-2">
                  {/* edit/save/cancel name+email */}
                  {editId === u._id ? (
                    <>
                      <button
                        onClick={() => handleSave(u._id)}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(u)}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 text-sm"
                    >
                      Edit
                    </button>
                  )}

                  {/* role edit/save/cancel */}
                  {editRoleId === u._id ? (
                    <>
                      <button
                        onClick={() => handleRoleSave(u._id)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-sm"
                      >
                        Save Role
                      </button>
                      <button
                        onClick={() => setEditRoleId(null)}
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleRoleEdit(u)}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-sm"
                    >
                      Edit Role
                    </button>
                  )}

                  {/* delete */}
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-400 py-6">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AITableAdminView;
