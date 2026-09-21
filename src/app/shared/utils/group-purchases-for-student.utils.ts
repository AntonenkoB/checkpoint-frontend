import {IPurchase, IPurchaseGroup} from "@rates/models/rates.model";

export function groupPurchasesByTeacher(
  purchases: readonly IPurchase[],
): IPurchaseGroup[] {
  const groups = new Map<number | null, IPurchaseGroup>();

  for (const purchase of purchases) {
    const key = purchase.teacher?.id ?? null;
    const group = groups.get(key);

    if (group) {
      group.purchases.push(purchase);
    } else {
      groups.set(key, { teacher: purchase.teacher, purchases: [purchase] });
    }
  }

  return Array.from(groups.values());
}