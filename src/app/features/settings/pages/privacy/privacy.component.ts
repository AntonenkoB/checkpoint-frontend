import {Component, inject} from "@angular/core";
import {NgxExtendedPdfViewerModule} from "ngx-extended-pdf-viewer";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {SettingsFacade} from "@settings/facade/settings.facade";

@Component({
  selector: "cp-privacy",
  imports: [
    NgxExtendedPdfViewerModule,
    HeaderSecondaryComponent,
    TranslatePipe
  ],
  templateUrl: "./privacy.component.html",
  styleUrl: "./privacy.component.scss",
  providers: [SettingsFacade],
})
export class PrivacyComponent {
  protected settingsFacade = inject(SettingsFacade);
  protected pdfUrl = 'assets/files/privacy.pdf';

}
