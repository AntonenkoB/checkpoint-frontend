import {Component, OnInit, signal} from '@angular/core';

import {FormsModule} from '@angular/forms';
import {IonButton} from '@ionic/angular/standalone';
import {Field, form, maxLength} from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [FormsModule, IonButton, Field]
})
export class LoginPage implements OnInit {
  public name = signal({name: ''});
  public nameFocus = signal(false);
  public nameForm = form(this.name, (schemaPath) => {
    maxLength(schemaPath.name, 24)
  });

  constructor() { }

  ngOnInit() {
  }

  public changeNane(name: any): void {
    console.log(name)

    // this.name.set(name)
  }
}
