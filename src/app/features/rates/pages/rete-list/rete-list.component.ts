import { Component, OnInit } from "@angular/core";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";

@Component({
  selector: "cp-rete-list",
  templateUrl: "./rete-list.component.html",
  styleUrls: ["./rete-list.component.scss"],
  imports: [
    UserItemComponent
  ]
})
export class ReteListComponent implements OnInit {
  ngOnInit() {}
}
