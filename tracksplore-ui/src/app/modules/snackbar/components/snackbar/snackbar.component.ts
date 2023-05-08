import { Component, OnDestroy, OnInit } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';
import { SnackbarMessage } from '../../models/snackbar-message';
import { Observable, Subscription, delay, tap } from 'rxjs';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent implements OnInit, OnDestroy {
  public messages: Observable<SnackbarMessage[]> = this.snackbarService.messages$.pipe();
  private snackbarMessagesSubscription?: Subscription;

  constructor(private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    
  }

  close(id: number) {
    this.snackbarService.close(id);
  }

  ngOnDestroy(): void {
    this.snackbarMessagesSubscription?.unsubscribe();
  }
}
