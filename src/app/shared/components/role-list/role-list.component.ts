import {Component, input, model, output} from "@angular/core";
import {EUserRole} from "@models/user.model";
import {IOptions} from "@models/common.model";
import {IonButton} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";

@Component({
  selector: "cp-role-list",
  imports: [
    IonButton,
    TranslatePipe
  ],
  templateUrl: "./role-list.component.html",
  styleUrl: "./role-list.component.scss",
})
export class RoleListComponent {
  public roles = input<IOptions<EUserRole>[]>();
  public selectedRoles = model<EUserRole[]>([]);
  public multiSelect = input<boolean>(false);

  public roleChange(role: EUserRole): void {
    this.selectedRoles.update(roles =>
      roles.includes(role)
        ? roles.filter(r => r !== role)
        : [...roles, role]
    );
  }
}
