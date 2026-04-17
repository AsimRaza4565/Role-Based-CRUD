"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function UpdateEvent(props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const EventId = searchParams.get("id");
  const [description, setDescription] = useState(
    searchParams.get("description") || ""
  );

  const handleEventUpdate = async (e) => {
    e.preventDefault();
    if (!description) return;

    try {
      const response = await fetch(`/api/updateEvent/${EventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description }),
      });

      if (response.ok) {
        toast.success("Event updated");
        router.push("/events");
      } else {
        await response.json();
        toast.error("Failed to update Event");
      }
    } catch (error) {
      toast.error("An error occurred while updating Event");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Update Event
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Edit and modify your scheduled event
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form onSubmit={handleEventUpdate} className="space-y-6" noValidate>

            <div>
              <label htmlFor="updateRole" className="block text-sm font-medium text-slate-700">
                Event Description
              </label>
              <div className="mt-1">
                <textarea
                  id="updateRole"
                  name="updateRole"
                  rows={4}
                  required
                  placeholder="Describe the event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all resize-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!description}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
            
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel and return
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
