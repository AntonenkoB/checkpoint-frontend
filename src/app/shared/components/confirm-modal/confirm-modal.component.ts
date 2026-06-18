import {Component, input, OnInit, output} from "@angular/core";
import {IonButton} from "@ionic/angular/standalone";

@Component({
  selector: "cp-confirm-modal",
  templateUrl: "./confirm-modal.component.html",
  styleUrls: ["./confirm-modal.component.scss"],
  imports: [
    IonButton,
  ]
})
export class ConfirmModalComponent implements OnInit {
  public title = input<string>();
  public btnConfirm = input<string>();
  public btnCansel = input<string>();
  public isDelete = input<boolean>(false);
  public confirm = output();
  public cansel = output();
  constructor() {}

  ngOnInit() {}
}
