import {Directive, effect, inject, input, TemplateRef, ViewContainerRef} from "@angular/core";
import {Permission, PermissionMode} from "@shared/permissions/permissions.config";
import {ProfileFacade} from "@profile/facade/profile.facade";

@Directive({
  selector: "[cpCheckPermission]",
})
export class CheckPermission {
  readonly canDo     = input.required<Permission | Permission[]>();
  readonly canDoMode = input<PermissionMode>('all');

  private facade = inject(ProfileFacade);
  private tpl    = inject(TemplateRef);
  private vcr    = inject(ViewContainerRef);
  private shown  = false;

  constructor() {
    effect(() => {
      const perms   = this.canDo();
      const mode    = this.canDoMode();
      const arr     = Array.isArray(perms) ? perms : [perms];

      const granted = mode === 'any'
        ? this.facade.canAny(arr)()
        : this.facade.canAll(arr)();

      if (granted && !this.shown) {
        this.vcr.createEmbeddedView(this.tpl);
        this.shown = true;
      } else if (!granted && this.shown) {
        this.vcr.clear();
        this.shown = false;
      }
    });
  }
}
