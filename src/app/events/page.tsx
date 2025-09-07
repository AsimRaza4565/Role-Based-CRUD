"use client";

import Navbar from "@/app/components/Navbar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Event {
  _id: string;
  description: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);

  const { data: session } = useSession();
  // console.log("permissions", session?.user?.permissions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await fetch("api/events");
        setEvents(await eventsData.json());
        console.log("eventsData", eventsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/deleteEvent/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Event deleted");
      } else {
        await response.json();
        toast.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("An error occurred while deleting event");
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-10 pb-5">
        {session?.user?.permissions?.includes("event-create") && (
          <Link href={"/events/create"}>
            <button
              type="button"
              className="px-3 py-1 mx-5 mt-2 mb-3 bg-blue-500 hover:bg-blue-600 border rounded cursor-pointer"
            >
              Post New Event
            </button>
          </Link>
        )}
        <h1 className="text-3xl text-center font-bold my-3">Events</h1>

        <div className="p-5 border-1 border-gray-500 rounded-md mx-5">
          <ul className="flex gap-3 flex-wrap">
            {events.map((event) => (
              <li
                key={event._id}
                className="flex w-full flex-col border rounded bg-amber-100 px-3 py-2"
              >
                <span className="text-lg font-medium mt-2">
                  {event.description}
                </span>
                <br />
                <div className="flex justify-end mt-3">
                  {session?.user?.permissions?.includes("event-update") && (
                    <Link
                      href={`/events/update?id=${event._id}&description=${event.description}`}
                    >
                      <button className="bg-yellow-500 px-4 py-2 text-sm rounded hover:bg-yellow-600 cursor-pointer text-white ml-2">
                        Edit
                      </button>
                    </Link>
                  )}

                  {session?.user?.permissions?.includes("event-delete") && (
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="bg-red-500 p-2 text-sm rounded hover:bg-red-600 cursor-pointer text-white ml-2"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
