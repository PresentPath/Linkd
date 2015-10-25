[![Circle CI](https://circleci.com/gh/PresentPath/Linkd.svg?style=svg)](https://circleci.com/gh/PresentPath/Linkd)

# < > Linkd
_Share and discuss bookmarks with friends!_

Check it out: [linkd.herokuapp.com](https://linkd.herokuapp.com)

**Usage**

1. Log in using your google account
2. Create groups to share bookmarks with
3. Create folders to organize your links
4. Discuss links with friends!

**Table of Contents**

- [GIF](#gif)
- [Technologies](#technologies)
- [Interesting Aspect - Flux Refactor](#interesting-aspect)


## GIF
![screenshot](https://cloud.githubusercontent.com/assets/7910250/10273830/3edddfb2-6aeb-11e5-8c36-c8bd239482dd.gif)


## Technologies
**Server-side**

- Node.js - server-side JS runtime
- Express.js - server framework for Node.js
- Mocha, Chai, Supertest - testing framework & libraries
- MySQL - relational database
- Sequelize - promise-based ORM
- Passport (Google strategy) - authentication middleware

**Client-side**

- React.js w/ JSX - view library
- Flux - application architecture
- Sass - CSS preprocessor

**Other**

- Webpack - module bundler
- CircleCI - continuous integration
- Heroku - hosting platform
- Bluebird - promise library

## Interesting Aspect
### To Flux or Not To Flux...
The first implementation of the front end did not use Flux for two reasons:

1. we weren't convinced Flux was necessary
2. lack of prescription allows room for interesting thought experiments and opportunities for gaining valuable context/insight
	- how should we manage state to fit our needs?
	- what architecture makes sense to us?

Since we had several sibling components that needed to have access to shared state, we decided to put all of our state on our topmost App component and have the state trickle down to child components using props.

This worked fine, and we built a fully functional frontend for our app, but things felt messy and there was this sort of visceral feeling of 'blegh' regarding how the data was being managed. It was time to bring in Flux.

The Flux architecture is so clean and beautiful:

- Clear separation of concerns between various constituents of your app:
	- views (strictly for rendering and handling user input, no logic)
	- dispatcher (manages data flow from input sources to stores)
	- action creators (declarative wrapper for the dispatcher)
	- stores (hold application state and logic)
	- web API utilities (handle server requests)
- Single-directional data flow in such a way that is fairly straightforward and easy to reason about. Much better than the uni-directional flow we initially had from top to bottom of our React component tree.

![flux-diagram](./client/dist/assets/flux-diagram.png)

- The dispatcher alone is a pretty sweet software construct, simple yet powerful - [see implementation](https://github.com/facebook/flux/blob/master/dist/Flux.js)

Even without the use of a Flux library, the refactor was pretty quick, straightforward, painless, and fun! Bugs that crept up along the way were easy to find and fix because the path was clear in terms of where to look. Building the first implementation without Flux gave great insight and perspective that allowed for deeper appreciation for the Flux architecture. 
