import {Component, input, output} from "@angular/core";
import {IonButton, IonSpinner} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";

@Component({
  selector: "cp-buttons",
  imports: [
    IonButton,
    IonSpinner,
    TranslatePipe
  ],
  templateUrl: "./buttons.component.html",
  styleUrl: "./buttons.component.scss",
})
export class ButtonsComponent {
  public title = input<string>('');
  public isLoader = input(false);
  public disabled = input(false);
  public submit = output();
}
