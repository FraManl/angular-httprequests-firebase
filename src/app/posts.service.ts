import { Component, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Post } from './post.model';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostsService {
  // different error handling pattern, especially if we have multiple components interested in that error; using subject is useful for inter-component communication (its like super event-emitter)
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    // Send Http request (rememnber in angular, this is an observable, need to subscribe to it)
    // body is automatically converted into json data
    // requests are only sent when we subscribe to them
    const postData: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(
        'https://ng-http-requests-5d674-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        postData,
        // optional : configure request and its response object, to retrieve the entire object response body for instance
        // now body is what will be sent into responseData
        { observe: 'body' }
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
        },
        (error) => {
          // we subscribe to that error message, in all the places we're interested in that message
          this.error.next(error.message);
        }
      );
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    // append multiple search params to params object
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');
    // using xjs operators map through pipe to convert an observable into an array
    // return the entire observable (when using this folder configuration, then subscribe inside component)
    return (
      this.http
        // even better way of defining the type of the response, is using <> next to get method (but could also do this in map()); this is the response body type
        .get<{ [key: string]: Post }>(
          'https://ng-http-requests-5d674-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
          // header control
          {
            headers: new HttpHeaders({ 'Customer-Header': 'Hello' }),
            params: searchParams,
          }
        )
        .pipe(
          // this map block should belong/be outsourced inside a service, for DRY-sake and clarity
          map((responseData) => {
            const postsArray: Post[] = [];
            for (const key in responseData) {
              // push the id inside the inner object using spread and {}
              if (responseData.hasOwnProperty(key)) {
                postsArray.push({ ...responseData[key], id: key });
              }
            }
            return postsArray;
          })
          // Another error handling pattern is using catchError operator like so
          //   catchError((errorRes) => {
          //     return throwError(errorRes);
          //   })
        )
      // We will move the subscription from the service to app Component
      // .subscribe((posts) => {})
    );
  }

  deletePosts() {
    return (
      this.http
        .delete(
          'https://ng-http-requests-5d674-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
          { observe: 'events', responseType: 'json' }
        )
        // we can chain a method here, without disturbing our subscribe subject in the component
        // tap() allow to have very granular control over errors, depending on the response event type (sent...)
        .pipe(
          tap((event) => {
            console.log(event);
            // if (event.type === HttpEventType.Sent) {
            //   console.log(event.body);
            // }
            if (event.type === HttpEventType.Response) {
              console.log(event.body);
            }
          })
        )
    );
  }
}
