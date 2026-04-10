import {AfterViewInit, Directive, ElementRef, inject} from '@angular/core';

@Directive({
  selector: 'ion-checkbox[cpCustomCheckbox]'
})
export class CustomCheckbox implements AfterViewInit {
  private el = inject(ElementRef);

  ngAfterViewInit() {
    setTimeout(() => {
      const shadow = this.el.nativeElement.shadowRoot;
      const svg = shadow?.querySelector('svg[part="container"]');
      const path = shadow?.querySelector('path[part="mark"]');

      if (svg && path) {
        svg.setAttribute('viewBox', '-1 -1 18 18');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        path.setAttribute('d', 'M12.3334 5L7.00008 11.3333L3.66675 9');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
      }
    }, 100);
  }
}
