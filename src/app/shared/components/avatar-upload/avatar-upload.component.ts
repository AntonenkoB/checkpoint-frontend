import {Component, ElementRef, inject, signal, ViewChild} from '@angular/core';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IonButton, ModalController } from '@ionic/angular/standalone';

const MAX_SIZE_MB = 2;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  selector: 'cp-avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.scss'],
  imports: [ImageCropperComponent, IonButton],
})
export class AvatarUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private sanitizer = inject(DomSanitizer);
  private modalController = inject(ModalController);

  public imageFile = signal<File | null>(null);
  public croppedImage = signal<SafeUrl | null>(null);
  public croppedBlob = signal<Blob | null>(null);
  public error = signal<string | null>(null);

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.error.set(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      this.error.set('errors.invalid-format');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      this.error.set('errors.max-size');
      return;
    }

    this.imageFile.set(file);
  }

  onImageCropped(event: ImageCroppedEvent): void {
    if (event.objectUrl) {
      this.croppedImage.set(this.sanitizer.bypassSecurityTrustUrl(event.objectUrl));
    }
    if (event.blob) {
      this.croppedBlob.set(event.blob);
    }
  }

  onLoadImageFailed(): void {
    this.error.set('errors.load-failed');
    this.imageFile.set(null);
  }

  async onConfirm(): Promise<void> {
    if (!this.croppedBlob()) return;
    await this.modalController.dismiss({ blob: this.croppedBlob() });
  }

  async onCancel(): Promise<void> {
    await this.modalController.dismiss(null);
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
}