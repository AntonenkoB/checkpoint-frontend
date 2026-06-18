import {Directive, HostListener, inject, input} from "@angular/core";
import {ImpactStyle} from "@capacitor/haptics";
import {HapticService} from "@shared/services/haptic.service";

@Directive({
  selector: "[cpTouchFeedback]",
})
export class TouchFeedbackDirective {
  private hapticService = inject(HapticService);
  public hapticStyle = input<ImpactStyle, ImpactStyle | ""> (
    ImpactStyle.Light,
    {
      alias: 'cpTouchFeedback',
      transform: (value: ImpactStyle | "") => value === "" ? ImpactStyle.Light : value
    }
  );

  @HostListener('click')
  public async onClick(): Promise<void> {
    await this.hapticService.impact(this.hapticStyle());
  }
}
