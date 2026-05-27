import { Component, computed, inject, input } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Camera, EncodingType } from '@capacitor/camera';
import { AuthService } from '../../../auth/services/auth-service';
import { TopBar } from '../../../shared/components/top-bar/top-bar';
import { ProfileService } from '../../services/profile-service';
import { MatDialog } from '@angular/material/dialog';
import { EditName } from '../../dialogs/edit-name/edit-name';
import { EditPassword } from '../../dialogs/edit-password/edit-password';


@Component({
  selector: 'profile-page',
  imports: [TopBar, MatCard, MatCardContent, MatCardActions, MatButton, MatIcon, MatIconButton],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage {
  id = input<string>();

  readonly #profileService = inject(ProfileService);
  readonly #authService = inject(AuthService);
  readonly #dialog = inject(MatDialog);

  readonly loggedUserResource = this.#authService.loggedUserResource;
  readonly userIdResource = this.#profileService.getUserResource(this.id);

  readonly userResource = computed(() => this.id() && this.id() !== this.loggedUserResource.value()?.user.id ? this.userIdResource : this.loggedUserResource);

  readonly user = computed(() =>
    this.userResource().hasValue() ? this.userResource().value()?.user : undefined,
  );

  async takePhoto() {
    const result = await Camera.takePhoto({
      quality: 90,
      encodingType: EncodingType.JPEG,
      targetWidth: 400,
    });

    if(result) {
      const photoBase64 = `data:image/${result.metadata?.format ?? 'jpeg'};base64,${result.thumbnail}`;
      this.saveAvatar(photoBase64);
    }
  }

  async getGalleryPhoto() {
    const { results: [result]} = await Camera.chooseFromGallery({
      quality: 90,
      targetWidth: 400,
    });

    if(result) {
      const photoBase64 = `data:image/${result.metadata?.format ?? 'jpeg'};base64,${result.thumbnail}`;
      this.saveAvatar(photoBase64);
    }
  }

  editName() {
    const dialogRef = this.#dialog.open(EditName, {
      data: this.user()?.name,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.#authService.reloadUser();
      }
    });
  }

  editPassword() {
    this.#dialog.open(EditPassword);
  }

  private saveAvatar(avatar: string) {
    this.#profileService.updateAvatar(avatar).subscribe(() => {
      this.#authService.reloadUser();
    });
  }
}
