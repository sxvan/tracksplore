import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy {
  constructor(private router: Router) {
    document.body.className = 'bg-home';
  }

  ngOnDestroy(): void {
    document.body.className = '';
  }

  navigate(url: string) {
    this.router.navigateByUrl(url);
  }
}
