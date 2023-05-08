import { SnackbarMessageType } from "./snackbar-message.type";

export interface SnackbarMessage {
    id: number;
    content: string;
    action: string;
    type?: SnackbarMessageType;
    durationMs?: number;
}