import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { Book } from "app/models/book";
import { DataService } from "./data.service";
import { BookTrackerError } from "app/models/bookTrackerError";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class BooksResolverService
  implements Resolve<Book[] | BookTrackerError>
{
  constructor(private dataService: DataService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<BookTrackerError | Book[]> {
    return this.dataService.getAllBooks().pipe(catchError((err) => of(err)));
  }
}
