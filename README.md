# VideoRecordTaskSetup

To start the app:

1. clone the project;
2. run: npm install
3. run: ng serve

## Video storage

For video storage at this project - IndexedBD is used.
Video blobs (with url, size, date etc) is saving at IndexedDB, NGXS send request there - save urls and render video. This approach lets us reload the page, open app in new tab with access to all videos. After app testing - dont forget to clean your IndexedDB.

![App Screenshot](assets/screenshots/1.jpg)
![App Screenshot](assets/screenshots/2.jpg)
![App Screenshot](assets/screenshots/3.jpg)
![App Screenshot](assets/screenshots/4.jpg)
![App Screenshot](assets/screenshots/5.jpg)
![App Screenshot](assets/screenshots/6.jpg)
