import { Subject } from "rxjs";
import { SnackbarMessage } from "../models/snackbar-message";

export class SnackbarService {
    private readonly messagesSubject$ = new Subject<SnackbarMessage[]>();

    public messages$ = this.messagesSubject$.asObservable();
    
    private messages: SnackbarMessage[] = [];


    constructor() { }

    public open(message: SnackbarMessage) {        
        if (!message.type) {
            message.type = 'message';
        }

        this.messages.push(message);
        if (message.durationMs) {
            setTimeout(() => {
                this.close(message.id)
            }, message.durationMs)
        }

        this.messagesSubject$.next(this.messages);
    }

    public close(id: number) {
        this.messages = this.messages.filter((m) => m.id !== id);
        this.messagesSubject$.next(this.messages);
    }
}