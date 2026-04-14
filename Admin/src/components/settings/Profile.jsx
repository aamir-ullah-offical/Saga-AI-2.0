import { useEffect, useState } from "react";
import { User, X, Check } from "lucide-react";
import SettingSection from "./SettingSection";
import axios from "axios";
import DangerZone from "./DangerZone";
import { toast } from "react-hot-toast";   // ✅ toast

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase();

  /* ───────── fetch profile ───────── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFormData(data);
        setOriginalData(data);
      } catch (err) {
        toast.error("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ───────── handlers ───────── */
  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleUpdate = async () => {
    const tId = toast.loading("Updating profile…");
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/users/me/update",
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Profile updated!", { id: tId, duration: 2500 });
      setOriginalData(data);
      setEditMode(false);
    } catch (err) {
      toast.error("Update failed", { id: tId });
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setEditMode(false);
    toast.dismiss(); // close any open toasts from editing
  };

  /* ───────── UI ───────── */
  if (loading) {
    return (
      <p className="text-center py-10 text-gray-500">
        Loading profile…
      </p>
    );
  }

  return (
    <>
      <SettingSection icon={User} title="Profile">
        <div className="flex flex-col sm:flex-row items-center mb-6 gap-6 bg-white text-gray-800 p-6 rounded-xl border border-gray-200 shadow-md">
          {/* avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-[#2C4964] text-white flex items-center justify-center text-2xl font-bold">
              {getInitials(formData.name)}
            </div>
          </div>

          {/* details */}
          {!editMode ? (
            <div className="space-y-2 text-gray-700 max-w-xl">
              <h3 className="text-xl font-semibold text-[#2C4964]">
                {formData.name}
              </h3>
              <p className="text-sm">{formData.email}</p>
            </div>
          ) : (
            <div className="w-full max-w-xl space-y-4 text-gray-800">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded px-3 py-2 border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded px-3 py-2 border border-gray-300"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleUpdate}
                  className="bg-[#2C4964] hover:bg-[#1f3547] text-white font-semibold py-2 px-4 rounded flex items-center gap-2"
                >
                  <Check size={16} /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded flex items-center gap-2"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 bg-[#2C4964] hover:bg-[#1f3547] text-white font-semibold py-2 px-6 rounded transition w-full sm:w-auto"
          >
            Edit Profile
          </button>
        )}
      </SettingSection>

      {/* danger zone */}
      <DangerZone />
    </>
  );
};

export default Profile;
