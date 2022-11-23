import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loadedPosts = [];
  subscription: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  onCreatePost(postData: Post) {
    // Send Http request (rememnber in angular, this is an observable, need to subscribe to it)
    // body is automatically converted into json data
    // requests are only sent when we subscribe to them
    this.http
      .post<{ name: string }>(
        'https://ng-http-requests-5d674-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        postData
      )
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  onClearPosts() {
    // Send Http request
  }

  onFetchPosts() {
    // using xjs operators map through pipe to convert an observable into an array
    this.http
      // even better way of defining the type of the response, is using <> next to get method (but could also do this in map()); this is the response body type
      .get<{ [key: string]: Post }>(
        'https://ng-http-requests-5d674-default-rtdb.europe-west1.firebasedatabase.app/posts.json'
      )
      .pipe(
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
      )
      .subscribe((posts) => {
        console.log(posts);
      });
  }
}
