import { Component } from "@angular/core";
import {AvatarComponent} from "@shared/components/avatar/avatar.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";

@Component({
  selector: "cp-individual-lesson",
  imports: [
    AvatarComponent,
    TranslatePipe
  ],
  templateUrl: "./individual-lesson.component.html",
  styleUrl: "./individual-lesson.component.scss",
})
export class IndividualLessonComponent {}
