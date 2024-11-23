import {EventRow} from "@/features/ics/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/ui/dialog";

interface EventDetailsDialogProps {
    event: EventRow | null;
    onClose: () => void;
}

export const EventDetailsDialog = ({ event, onClose }: EventDetailsDialogProps) => {
    if (!event) return null;

    return (
        <Dialog open={Boolean(event)} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Event Details</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <p><strong>Event ID:</strong> {event.event_id}</p>
                    <p><strong>Device ID:</strong> {event.device_id}</p>
                    <p><strong>Timestamp:</strong> {event.timestamp}</p>
                    <p><strong>Event Type:</strong> {event.event_type}</p>
                    <p><strong>Source IP:</strong> {event.source_ip}</p>
                    <p><strong>Destination IP:</strong> {event.destination_ip}</p>
                    <p><strong>Modbus Function:</strong> {event.modbus_function}</p>
                    <p><strong>Modbus Data:</strong> {event.modbus_data}</p>
                    <p><strong>Alert:</strong> {event.alert}</p>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
};
