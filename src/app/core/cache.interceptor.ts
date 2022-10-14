import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpContextToken,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { HttpCacheService } from "./http-cache.service";

export const CACHABLE = new HttpContextToken(() => true);

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: HttpCacheService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.context.get(CACHABLE)) {
      return next.handle(req);
    }

    if (req.method !== "GET") {
      console.log(`Invalidating cache: ${req.method}`);
      this.cacheService.invalidateCache();
      return next.handle(req);
    }

    const cacheResponse: HttpResponse<any> = this.cacheService.get(req.url);

    if (cacheResponse) {
      console.log(`Returning a cached response: ${cacheResponse.url}`);
      console.log(cacheResponse);
      return of(cacheResponse);
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          console.log(`Adding item to cache: ${req.url}`);
          this.cacheService.put(req.url, event);
        }
      })
    );
  }
}
