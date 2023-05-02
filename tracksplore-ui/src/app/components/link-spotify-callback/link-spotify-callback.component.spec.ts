import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkSpotifyCallbackComponent } from './link-spotify-callback.component';

describe('LinkSpotifyCallbackComponent', () => {
  let component: LinkSpotifyCallbackComponent;
  let fixture: ComponentFixture<LinkSpotifyCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkSpotifyCallbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkSpotifyCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
