import { Injectable } from "@angular/core";
import {Haptics, ImpactStyle} from "@capacitor/haptics";

@Injectable({
  providedIn: "root",
})
export class HapticService {
  public async impact(style: ImpactStyle = ImpactStyle.Light): Promise<void> {
    try {
      await Haptics.impact({ style });
    } catch {
      // Ігноруємо в браузері (ionic serve)
    }
  }}
