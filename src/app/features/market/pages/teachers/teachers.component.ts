import {Component, inject, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {MarketFacade} from "../../market.facade";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";

@Component({
  selector: "cp-teachers",
  templateUrl: "./teachers.component.html",
  styleUrls: ["./teachers.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    RecordStudentItemComponent,
    TranslatePipe
  ],
  providers: [MarketFacade]
})
export class TeachersComponent implements OnInit {
  public marketFacade = inject(MarketFacade);

  ngOnInit() {}
}
