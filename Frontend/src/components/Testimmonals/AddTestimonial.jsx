// src/components/ReviewSection.jsx
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function ReviewSection() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    position: '',
    testimonialText: '',
    rating: 5,
    profileImage: null,
  });

  const imgPreview = useRef(null);

  /* helpers */
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFile = (e) =>
    setForm((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  const selectRating = (r) => setForm((prev) => ({ ...prev, rating: r }));

  /* live‑preview */
  useEffect(() => {
    if (form.profileImage) {
      const url = URL.createObjectURL(form.profileImage);
      imgPreview.current.src = url;
      return () => URL.revokeObjectURL(url);
    }
  }, [form.profileImage]);

  /* submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in first.');
      return;
    }

    const data = new FormData();
    data.append('name', form.name);
    data.append('position', form.position);
    data.append('testimonialText', form.testimonialText);
    data.append('rating', form.rating);
    if (form.profileImage) data.append('profileImage', form.profileImage);

    const tId = toast.loading('Submitting...');
    try {
      await axios.post('http://localhost:5000/api/testimonials', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      toast.success('Review submitted successfully!', { id: tId });
      setOpen(false);
      setForm({
        name: '',
        position: '',
        testimonialText: '',
        rating: 5,
        profileImage: null,
      });
    } catch {
      toast.error('Failed to submit review.', { id: tId });
    }
  };

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-sky-50 to-slate-100 py-20">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-300 opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rotate-45 rounded-full bg-orange-200 opacity-20 blur-2xl" />

      {/* heading + CTA */}
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#002244] via-sky-500 to-sky-300 bg-clip-text text-transparent">
          Add&nbsp;Your&nbsp;Thoughts
        </h2>
        <p className="mx-auto mt-4 max-w-md text-gray-600 sm:text-lg">
          We value every voice. Share a quick review and help shape our community.
        </p>
        <button
          onClick={() => {
            const token = localStorage.getItem('token');
            if (!token) {
              toast.error('Please log in first.');
              return;
            }
            setOpen(true);
          }}
          className="mt-10 inline-flex items-center gap-2 rounded-md bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 active:scale-95"
        >
          <FaPlus className="text-xs" />
          Add Review
        </button>
      </div>

      {/* modal */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-0 z-[1110] flex items-center justify-center p-4">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-3xl space-y-6 rounded-xl bg-white p-6 shadow-2xl sm:p-8"
            >
              <h3 className="text-center text-2xl font-bold text-slate-800">
                Write a Review
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* name */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-sky-300 outline-none"
                  />
                </div>

                {/* position */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Position / Title
                  </label>
                  <input
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-sky-300 outline-none"
                  />
                </div>

                {/* review */}
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Your Review
                  </label>
                  <textarea
                    name="testimonialText"
                    value={form.testimonialText}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="block w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-sky-300 outline-none"
                  />
                </div>

                {/* rating */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Rating
                  </label>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        onClick={() => selectRating(i + 1)}
                        className={`h-6 w-6 cursor-pointer ${
                          i < form.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* image */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-sky-600 file:px-4 file:py-1.5 file:text-white hover:file:brightness-110"
                  />
                  {form.profileImage && (
                    <img
                      ref={imgPreview}
                      alt="Preview"
                      className="mt-3 h-16 w-16 rounded-full border-2 border-sky-400 object-cover shadow"
                    />
                  )}
                </div>
              </div>

              {/* actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 active:scale-95"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </section>
  );
}
