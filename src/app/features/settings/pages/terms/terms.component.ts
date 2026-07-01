import {Component, inject} from "@angular/core";
import {SettingsFacade} from "@settings/facade/settings.facade";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {NgxExtendedPdfViewerModule} from "ngx-extended-pdf-viewer";
import {TranslatePipe} from "@shared/pipes/translate-pipe";

@Component({
  selector: "cp-terms",
  imports: [
    HeaderSecondaryComponent,
    NgxExtendedPdfViewerModule,
    TranslatePipe
  ],
  templateUrl: "./terms.component.html",
  styleUrl: "./terms.component.scss",
  providers: [SettingsFacade],
})
export class TermsComponent {
  protected settingsFacade = inject(SettingsFacade);
  protected pdfUrl = 'assets/files/privacy.pdf';
}
