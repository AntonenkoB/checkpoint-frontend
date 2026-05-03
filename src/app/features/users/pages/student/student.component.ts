import {Component, inject, OnInit} from "@angular/core";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {StudentFacade} from "./student.facade";
import {DomSanitizer} from "@angular/platform-browser";
import {DOTS_SVG, PLUS_SVG} from "@models/svg.models";
import {IonButton} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";


@Component({
  selector: "cp-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.scss"],
  imports: [
    UserItemComponent,
    IonButton,
    TranslatePipe
  ],
  providers: [StudentFacade]
})
export class StudentComponent implements OnInit {
  public readonly sanitizer = inject(DomSanitizer);
  public studentFacade = inject(StudentFacade);
  public DOTS_SVG = this.sanitizer.bypassSecurityTrustHtml(DOTS_SVG);
  public PLUS_SVG = this.sanitizer.bypassSecurityTrustHtml(PLUS_SVG);


  constructor() {}

  ngOnInit() {
  }
}
