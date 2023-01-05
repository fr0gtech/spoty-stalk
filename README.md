# spoty-stalk

![Peek 2022-12-11 16-42](https://user-images.githubusercontent.com/119510346/206913382-e2271999-ebd2-491b-9fce-c06a6c7b1efa.gif)

Stalk soundcloud likes and spotify public playlist adds. Featuring cross-platform music-player in browser.
Can shuffle over all spotify and soundcloud likes at the same time.

## Installation

`yarn` - installs all dependancies for the monorepo

We use [puppeteer](https://pptr.dev/) check out how to configure it for your system. [here](https://github.com/puppeteer/puppeteer/issues/3443) an issue talking about running puppeteer headlessly.

- Postgres and prisma are used together for data management.
- Install postgresql and create an empty database
- Install pino pretty for nice logs (optional)

### .env

The .env is pretty important for the backend to run having something missing will make the app fail.
The only exemption is IFTTT variable if you leave it blank the backend wont tweet new songs.

Full example: 

```bash
NEXT_PUBLIC_TITLE=pokeING
NEXT_PUBLIC_GITHUB_REPO=spoty-stalk
NEXT_PUBLIC_GITHUB_USER=fr0gtech

NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=ItGiMccJkllnO0X40Nht2yaGToI5TgXdfyDZU6IC9ZY=

SUBREDDIT=pokelawls

SOUNDCLOUD_USER=419804
SPOTIFY_USER=pcawejxb34imrcydlbkl50ou3

SPOTIFY_CLIENT_ID=f0e5018f2ea2d4234f7a9d8d0e6857b3
SPOTIFY_CLIENT_SECRET=ac7dcade9b424cb98bbf327efe392768
IFTTT=

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/spotystalk"
```

### Spotify app

Setup an app add the cliend id and secret to the env and add a redirect url in ur spotify app settings

`http://localhost:3000/api/callback/spotify`


### Prisma

This should do all prisma things for you
`cd packages/database && yarn db:clean:build`


### Running

backend: 
`cd apps/backend && ts-node app/app.ts | pino-pretty`
frontend:
`cd apps/web && next start`

### Production

there are some pm2:start script you can use but these are not the best. the app has no logging or anything for prod.

### Error
If you get an error like this:
```
Error: Could not find Chromium (rev. 1069273). This can occur if either         |
 1. you did not perform an installation before running the script (e.g. npm ins|
tall) or                                                                       |
 2. your cache path is incorrectly configured (which is: /root/.cache/puppeteer)|
.                                                                               |
For (2), check out our guide on configuring puppeteer at https://pptr.dev/guides%7C
/configuration.
```
try installing chrome with `node node_modules/puppeteer/install.js`


## Spotify design guidelines

We try to approve this app therefor we need to comply with spotifys design guidelines. Here a overview of implemented guidelines:

- Min Title length, if truncate we show full
- Spotify Logo has to be monochrome if not on black or white bg and 21px min
- Spotify conent cannot be seated next to not spotify content

## Notes

There are some songs with artists that do not exist anymore or are "fake" aka leaks, these could be intereseting songs to track otherwise but break the app at some points.

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
