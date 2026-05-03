import {Component, inject, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {MarketFacade} from "../../market.facade";
import {TranslatePipe} from "@shared/pipes/translate-pipe";

@Component({
  selector: "cp-lessons-type",
  templateUrl: "./lessons-type.component.html",
  styleUrls: ["./lessons-type.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    TranslatePipe
  ],
  providers: [MarketFacade]
})
export class LessonsTypeComponent implements OnInit {
  public marketFacade = inject(MarketFacade);
  constructor() {}

  ngOnInit() {}
}
