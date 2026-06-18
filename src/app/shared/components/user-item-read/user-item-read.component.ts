import {Component, input} from "@angular/core";
import {AvatarComponent} from "@shared/components/avatar/avatar.component";
import {IUser} from "@models/user.model";

@Component({
  selector: "cp-user-item-read",
  templateUrl: "./user-item-read.component.html",
  styleUrls: ["./user-item-read.component.scss"],
  imports: [
    AvatarComponent
  ]
})
export class UserItemReadComponent {
  public user = input<IUser>();

  public getCreativeName(): string {
    return this.user()?.creative_name ?? this.user()?.first_name ?? ''
  }

  public getName(): string {
    return this.user()?.creative_name
      ? `${this.user()?.first_name ?? ''} ${this.user()?.last_name ?? ''}`
      : this.user()?.last_name ?? ' '
  }
}
