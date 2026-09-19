import {NavigationExtras} from "@angular/router";
import {EAppPages, TRouter} from "@models/router.model";
import {EMarketPages} from "@market/models/market.model";

export const DEEP_LINK_SCHEME = 'checkpoint.ua';

export interface IDeepLink {
  host: string;
  segments: string[];
  params: Record<string, string>;
}

export interface IDeepLinkRoute {
  path: TRouter[];
  extras?: NavigationExtras;
}

/**
 * checkpoint.ua://market/payment-success/123 →
 */
export const parseDeepLink = (url: string): IDeepLink | null => {
  try {
    const parsed = new URL(url);

    if (parsed.protocol.replace(':', '') !== DEEP_LINK_SCHEME) {
      return null;
    }

    return {
      host: parsed.host,
      segments: parsed.pathname.split('/').filter(Boolean),
      params: Object.fromEntries(parsed.searchParams.entries()),
    };
  } catch (err) {
    console.warn('Deep link parse error:', url, err);
    return null;
  }
};

const ALLOWED_DEEP_LINKS: Partial<Record<EAppPages, string[]>> = {
  [EAppPages.Market]: [EMarketPages.PaymentSuccess],
};

export const resolveDeepLinkRoute = (link: IDeepLink): IDeepLinkRoute | null => {
  const allowedPages = ALLOWED_DEEP_LINKS[link.host as EAppPages];

  if (!allowedPages) {
    return null;
  }

  const [page, ...rest] = link.segments;

  if (!page || !allowedPages.includes(page)) {
    return null;
  }

  return {
    path: [link.host, page, ...rest] as TRouter[],
    extras: {queryParams: link.params},
  };
};
