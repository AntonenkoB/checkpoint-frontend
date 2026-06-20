import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NavParams} from '@ionic/angular/standalone';
import {AvatarUploadComponent} from './avatar-upload.component';
import {commonTestProviders} from '@testing/test-providers';

describe('AvatarUploadComponent', () => {
  let component: AvatarUploadComponent;
  let fixture: ComponentFixture<AvatarUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarUploadComponent],
      providers: [
        ...commonTestProviders(),
        {provide: NavParams, useValue: {get: () => undefined, data: {}}},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarUploadComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
