'use client';


import {EventTable} from "@/app/ics/components/EventTable";

export default function ICSPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">ICS Events</h1>
            <EventTable />
        </div>
    );
}
