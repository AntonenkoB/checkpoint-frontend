import {AfterViewInit, Directive, ElementRef, inject} from "@angular/core";

@Directive({
  selector: "[cpSelectPlaceholder]",
})
export class SelectPlaceholder implements AfterViewInit {
  private el = inject(ElementRef);

  ngAfterViewInit() {
    setTimeout(() => {
      const shadow = this.el.nativeElement.shadowRoot;
      const placeholder = shadow?.querySelector('.select-placeholder');
      if (placeholder) {
        (placeholder as HTMLElement).style.opacity = '1';
      }
    }, 100);
  }
}
