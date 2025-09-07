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
  console.log("description", description);

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
      } else {
        // const error = await response.json();
        await response.json();
        toast.error("Failed to update Event");
      }
    } catch (error) {
      toast.error("An error occurred while updating Event");
    }
  };

  return (
    <div className="h-screen flex items-center">
      <form
        onSubmit={handleEventUpdate}
        className="flex flex-col gap-3 w-md mx-auto border rounded border-gray-500 px-5 py-7"
      >
        <h2 className="font-medium text-center text-2xl">Update Event</h2>
        <hr />
        <div className="flex flex-col">
          <label htmlFor="updateRole" className="font-medium mt-3 mb-2">
            Description
          </label>
          <textarea
            title="Update Event"
            id="updateRole"
            placeholder={description}
            className="border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={!description}
          onClick={() => router.back()}
          className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded cursor-pointer mt-3"
        >
          Update
        </button>
      </form>
    </div>
  );
}
