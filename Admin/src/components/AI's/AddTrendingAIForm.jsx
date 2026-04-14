// AddTrendingAIForm.jsx  – FINAL
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const urlRegex = /^https?:\/\/.+/i;

export default function AddTrendingAIForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    useCases: [""],
    coverage: "",
    pricing: "",
    features: [""],
    link: "",
    aiImage: null,
  });

  const [preview, setPreview] = useState(null);

  /* ─── helpers ───────────────────────── */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "aiImage") {
      setFormData((p) => ({ ...p, aiImage: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleArrayChange = (i, key, val) =>
    setFormData((p) => {
      const arr = [...p[key]];
      arr[i] = val;
      return { ...p, [key]: arr };
    });

  const addArrayField = (key) =>
    setFormData((p) => ({ ...p, [key]: [...p[key], ""] }));

  const removeArrayField = (i, key) =>
    setFormData((p) => {
      const arr = [...p[key]];
      arr.splice(i, 1);
      return { ...p, [key]: arr.length ? arr : [""] };
    });

  /* ─── submit ─────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!urlRegex.test(formData.link.trim())) {
      toast.error("Please enter a valid URL (http:// or https://)");
      return;
    }

    const data = new FormData();
    ["title", "shortDescription", "coverage", "pricing", "link"].forEach((k) =>
      data.append(k, formData[k].trim())
    );
    if (formData.aiImage) data.append("aiImage", formData.aiImage);

    // ⬇️  IMPORTANT: send comma‑separated lists, NOT JSON.stringify
    data.append(
      "useCases",
      formData.useCases.filter(Boolean).map((s) => s.trim()).join(",")
    );
    data.append(
      "features",
      formData.features.filter(Boolean).map((s) => s.trim()).join(",")
    );

    data.append("trending", "true");

    const tId = toast.loading("Submitting…");
    try {
      await axios.post("http://localhost:5000/api/ai", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Trending AI tool added!", { id: tId, duration: 2500 });
      navigate(-1);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to add AI tool.",
        { id: tId }
      );
    }
  };

  /* ─── UI ─────────────────────────────── */
  return (
    <div className="max-w-4xl mx-auto p-8 mt-2 bg-white shadow-lg rounded-xl border">
      {/* back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1 text-sm text-sky-600 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-6 text-center text-[#2C4964]">
        Add Trending AI Tool
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title + Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Title</span>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Short Description</span>
            <input
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded"
            />
          </label>
        </div>

        {/* Use Cases */}
        <div>
          <span className="block text-sm font-medium text-gray-700">Use Cases</span>
          {formData.useCases.map((uc, i) => (
            <div key={i} className="flex gap-2 mt-2">
              <input
                value={uc}
                onChange={(e) => handleArrayChange(i, "useCases", e.target.value)}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <button
                type="button"
                onClick={() => removeArrayField(i, "useCases")}
                className="text-red-600 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField("useCases")}
            className="mt-2 text-blue-600 font-semibold"
          >
            + Add Use Case
          </button>
        </div>

        {/* Coverage + Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Industry Coverage</span>
            <input
              name="coverage"
              value={formData.coverage}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Pricing</span>
            <input
              name="pricing"
              value={formData.pricing}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded"
            />
          </label>
        </div>

        {/* Features */}
        <div>
          <span className="block text-sm font-medium text-gray-700">Features</span>
          {formData.features.map((ft, i) => (
            <div key={i} className="flex gap-2 mt-2">
              <input
                value={ft}
                onChange={(e) => handleArrayChange(i, "features", e.target.value)}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <button
                type="button"
                onClick={() => removeArrayField(i, "features")}
                className="text-red-600 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField("features")}
            className="mt-2 text-blue-600 font-semibold"
          >
            + Add Feature
          </button>
        </div>

        {/* Link + Logo */}
        <label className="block">
          <span className="text-sm font-medium text-gray-700">AI Website Link</span>
          <input
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://example.com"
            required
            className="mt-1 w-full px-4 py-2 border rounded"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Upload Logo</span>
          <input
            type="file"
            name="aiImage"
            accept="image/*"
            onChange={handleChange}
            required
            className="mt-1"
          />
        </label>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-4 h-24 object-contain border rounded"
          />
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-[#2C4964] hover:bg-[#1f3547] text-white font-semibold rounded"
        >
          Submit Trending AI Tool
        </button>
      </form>
    </div>
  );
}
