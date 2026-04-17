"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreateEvent() {
  const [event, setEvent] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();

  const handleEventCreate = async (e) => {
    e.preventDefault();

    if (!event || isCreating) return;

    setIsCreating(true);

    try {
      const response = await fetch("/api/createEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: event }),
      });

      if (response.ok) {
        router.push("/events");
        toast.success("Event created successfully!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("An error occurred while creating event");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Create New Event
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Schedule and announce a new upcoming event
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form onSubmit={handleEventCreate} className="space-y-6" noValidate>

            <div>
              <label htmlFor="event" className="block text-sm font-medium text-slate-700">
                Event Description
              </label>
              <div className="mt-1">
                <textarea
                  id="event"
                  name="event"
                  rows={4}
                  required
                  placeholder="Describe the new event..."
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all resize-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!event || isCreating}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Publishing..." : "Publish Event"}
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
