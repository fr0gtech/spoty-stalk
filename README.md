# spoty-stalk
 
 (can also stalk soundcloud likes)
![Screenshot 2022-11-30 at 20-00-14 Screenshot](https://user-images.githubusercontent.com/119510346/204888118-d3502171-8b73-40d8-b168-f9aca5bf40ad.png)
A monorepo containing a frontend and backend for spoty-stalk. This app is pretty simple and put together quickly.

## Features
- [x] Source selection in menu
- [x] Scan all playlists (spotify)
- [X] Scan all likes (soundcloud)
- [x] Keep track of changed playlists (add/remove)
- [x] Hide discover weekly songs
- [x] Show Top10 most added artist
- [x] Listen to previews
- much more can be done submit a pull request 

## How this works

We scan every minute for new or changed playlists of a user.

Spotify provides a `snapshot_id` that can be used to quickly check for changes without having to compare every song.

## Notes

There are some songs with artists that do not exist anymore or are "fake" aka leaks, these could be intereseting songs to track otherwise

```json
"Pissy Pamper":
  {
    id: 655,
    sid: null,
    name: 'Young Nudy/Playboi Cart',
    externalUrl: null,
    createdAt: 2022-11-30T17:47:11.819Z,
    updatedAt: 2022-11-30T17:47:11.819Z
  }

```

Also we do not delete any songs if they get deleted from a playlist once scanned, this could easly be fixed.

## What's inside?

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app
- `backend`: ts backend
- `database`: `prisma` db

### ENV

check `.env.example` and copy it to `.env` and change it to your needs

### Build

To build all apps and packages, run the following command:

```
yarn run build
```

### Develop

To develop all apps and packages, run the following command:

```
yarn run dev
```
