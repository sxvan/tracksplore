import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicTasteComponent } from './music-taste.component';

describe('MusicTasteComponent', () => {
  let component: MusicTasteComponent;
  let fixture: ComponentFixture<MusicTasteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MusicTasteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicTasteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
