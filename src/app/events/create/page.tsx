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
    <div className="h-screen flex items-center">
      <form
        onSubmit={handleEventCreate}
        className="flex flex-col gap-3 w-md mx-auto border rounded border-gray-500 px-5 py-3"
      >
        <h2 className="font-medium text-center text-2xl mb-3">
          Create new Event
        </h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="event" className="font-medium text-lg">
            Description
          </label>
          <textarea
            title="Event Description"
            id="event"
            placeholder="Enter Event Description"
            className="border p-2 rounded"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={!event || isCreating}
          onClick={() => router.back()}
          className="p-2 bg-blue-500 hover:bg-blue-600 rounded cursor-pointer mt-2"
        >
          Create
        </button>
      </form>
    </div>
  );
}
