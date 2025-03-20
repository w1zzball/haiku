# Haiku Microblog

---

description of site

- [Link to live project](https://haiku-microblog-ff81dfcf5cfd.herokuapp.com/)

---

## Table of Contents

- [Haiku Microblog](#haiku-microblog)
  - [Table of Contents](#table-of-contents)
  - [UX/UI](#uxui)
      - [Target Audience](#target-audience)
      - [User Stories](#user-stories)
      - [Design](#design)
      - [Wireframes](#wireframes)
        - [Mobile](#mobile)
        - [Tablet](#tablet)
        - [PC](#pc)
  - [Database Structure](#database-structure)
      - [Essential Schema](#essential-schema)
        - [Profile](#profile)
        - [Post](#post)
        - [Likes](#likes)
      - [ERD](#erd)
  - [Features](#features)
      - [Implemented Features](#implemented-features)
      - [Future Additions](#future-additions)
  - [Agile Methodologies](#agile-methodologies)
      - [Acceptance Criteria/User Stories](#acceptance-criteriauser-stories)
      - [Kanban Board](#kanban-board)
  - [Deployment](#deployment)
  - [Testing](#testing)
      - [HTML](#html)
      - [CSS](#css)
      - [JavaScript](#javascript)
      - [Python / Unit tests](#python--unit-tests)
      - [Lighthouse](#lighthouse)
  - [Manual Testing](#manual-testing)
  - [Technologies Used](#technologies-used)
  - [Credits](#credits)

---

## UX/UI

#### Target Audience

-Writers and Poets: People who enjoy experimenting with words, exploring creative constraints, and crafting meaningful, concise expressions.

-Creative Thinkers: Artists, designers, and creative professionals who appreciate challenges as a way to foster innovation.

-Mindfulness Enthusiasts: Individuals seeking moments of calm, reflection, and mindfulness through the meditative nature of haiku-writing.

-Social Media Users Seeking Novelty: Those looking for a unique and refreshing alternative to traditional microblogging platforms.

-Educators and Students: Teachers and learners interested in using the platform as a tool to explore creative writing, language, and the beauty of constraints.

#### User Stories

(Expanded on in [associated project board](https://github.com/users/w1zzball/projects/7))

- User Story: As a new user, I want to sign up and create an account so that I can start sharing my haikus.

- As a user, I want to create a haiku post so that I can share my thoughts and creativity with the community.

- As a user, I want to see a feed of haikus so that I can enjoy and engage with the creativity of others.

- As a user, I want to like haikus so that I can show appreciation for the posts I enjoy.

- As a user, I want to comment on haikus so that I can express my thoughts and engage with the creator.

- As a user, I want insights on the performance of my haikus so that I can understand which posts resonate most with others.

- As a user, I want to search for haikus by keywords, themes, or authors so that I can find specific content.

#### Design

Given the simplicity and clarity of the haiku form, it feels natural that the website design should be likewise minimal and unobtrusive, as such I have opted for a light and clear style and an easy to read font

#### Wireframes

Initial wireframes made using Balsamiq

##### Mobile

The site was designed using a mobile first approach
![Mobile wireframe](./docs/images/wireframes/Mobile.webp)

##### Tablet

![Tablet wireframe](./docs/images/wireframes/Tablet.webp)

##### PC

![PC Wireframe](./docs/images/wireframes/PC.webp)

---

## Database Structure

#### Essential Schema

The core of the microblog uses two models profile and post.

##### Profile

The profile model extends the default user model supplied by django with fields for a user bio and user uploaded profile image hosted using Cloudinary. As it depends upon the user model it is created when the user model is created and similarly updated when the user is updated using the `@reciever` decorator in the model definition. It also is deleted if the corresponding user is deleted

| field       | value                                                | explanation            |
| ----------- | ---------------------------------------------------- | ---------------------- |
| user        | models.OneToOneField(User, on_delete=models.CASCADE) | instance of user model |
| bio         | models.TextField(max_length=500, blank=True)         | text field for bio     |
| profile_pic | CloudinaryField('image', default='placeholder')      | cloud hosted image     |

##### Post

The post model holds the users posts. It is linked to the posters profile and will be deleted upon deletion of the the posters profile, it also contains information on the posts creation date, and how many likes the post has

| field      | value                                                                                 | explanation                          |
| ---------- | ------------------------------------------------------------------------------------- | ------------------------------------ |
| body       | models.TextField()                                                                    | content of the post                  |
| created_at | models.DateTimeField(auto_now_add=True)                                               | timestamp when post was created      |
| author     | models.ForeignKey('profiles.Profile', on_delete=models.CASCADE, related_name='posts') | link to profile who created the post |
| likes      | models.PositiveIntegerField(default=0)                                                | number of likes on the post          |

##### Likes

The Likes model saves when a user likes a post

| Field | Value | Explanation |
|-------|--------|-------------|
| user | ForeignKey('profiles.Profile') | References the Profile model that created the like. Uses CASCADE deletion to remove likes when a user is deleted. |
| post | ForeignKey('Post') | References the Post being liked. Uses CASCADE deletion to remove likes when a post is deleted. Has a related_name of 'likes_set' for reverse lookups. |
| created_at | DateTimeField | Automatically set when the like is created (auto_now_add=True). Records when the like was made. |
| Meta class | unique_together = ('user', 'post') | Ensures a user can only like a post once by preventing duplicate combinations of user and post. |



#### ERD

![Database Entity Relationship Diagram](./docs/images/ERD/haiku_ERD.webp)

---

## Features

#### Implemented Features

- User Authentication & Profile Management
  - User registration and login system
  - Profile creation and customization
  - Profile picture upload and management via Cloudinary
  - Profile deletion capability
  - Public profile viewing

- Post Management
  - Create, edit and delete posts
  - AJAX-powered posting for seamless user experience
  - Haiku validation system ensuring proper syllable structure (5-7-5)
  - Homepage feed showing all users' posts
  - Input sanitization and cleaning
  - Dynamic syllable counting to give feedback when entering text

- Like system
  - Users can like/unlike posts with a single click
  - Like status visually indicated with filled/outlined heart icon
  - Real-time like count updates without page refresh
  - Optimistic UI updates (shows changes immediately before server confirmation)

#### Future Additions

- Social Features
  - Follow/unfollow other users
  - Comment system on posts
  - Private messaging between users
  - Share posts functionality
- Profile Enhancements
  - Private/public profile toggle
  - Custom themes/styling for individual profiles
  - Profile statistics (posts count, likes received, etc.)
  - Achievement/badge system for active users
- Content Features
  - Categorize haikus by themes/topics
  - Search functionality for posts and users
  - Trending haikus section
  - Seasonal themes and prompts
- Educational Components
  - Tutorial section for haiku writing
  - Writing prompts and challenges
  - Resources about haiku history and structure

---

## Agile Methodologies

#### Acceptance Criteria/User Stories
After the initial ideation I wrote a few possible user stories and using microsoft copilot I refined these rough sketches into actionable task lists, with acceptance criteria and what tasks needed to be done to meet them. These were then added to a Kanban Board.

#### Kanban Board
To help streamline design and pinpoint key features I employed a Kanban Board to track my progress and used the MoSCoW prioritisation method to sort tasks by how essential they were to the minimum viable product. This was impemented using githubs built in project boards, using custom labels to sort which items were must have/should have/could haves. 

---

## Deployment

- deployed to heroku

---

## Testing

#### HTML

Running the home, account and post pages generated from my templates through the WC3 HTML validator returns no errors.

#### CSS

W3C CSS validator returns no errors on any of the static css components.

#### JavaScript

#### Python / Unit tests

#### Lighthouse

- The homepage recieves a greater than or equal to 99/100 on all lighthouse metrics
- Individual post urls recieve high (>92) scores on all lighthouse metrics barring 'best practices' which is penalised for the use of third party cookies which are being imported by cloudinary
- Profile pages likewise recieve high scores excepting for the cloudinary cookies dragging down the best practices score
- User Posts page recieves either 100 or high 90s as it does not include cloudinary content

## Manual Testing


The following table details the manual testing performed on the application: 

| Context    | Feature         | Action                                   | Effect                                            | Tested |
| ------- | --------------- | ---------------------------------------- | ------------------------------------------------- | ------ |
| Site Wide    | Navigation      | Click on Logo                            | Redirects to home page                            | ✅    |
| Site Wide    | Individual Post Page      | Click on Post's text         | Redirects to post's unique URL                            | ✅    |
| Logged Out    | Login       | Click on Login link       | Redirects to login page                | ✅     |
| Logged Out    | Sign Up     | Click on Sign Up link                        | Redirects to registration page                    | ✅     |
| Logged In    | Log Out         | Click on Log Out link                  | Redirects to logout page         | ✅     |
| Logged In    | New Post  |    Click on Plus button   |       Opens create new post overlay      | ✅     |
| Logged In    |  Like Post  |   Click the heart button on unliked post    |    Like is registered and heart changes colour to give feedback    | ✅     |
| Logged In    |  Unlike Post   |   Click the heart button on liked post    |  Like is removed and heart changes colour to give feedback   | ✅     |
| Logged In    | Edit Post   |  Click the Edit Button on a post   |     Opens edit post overlay   | ✅     |
| Logged In    | Delete Post   |  Click the Delete Button on a post   |     Opens delete post confirmation   | ✅     |
| New Post    | Cancel   |     Click on cancel button         |     Closes create new post overlay        | ✅     |
| New Post    |  Post validation  |  Click on save with inccorect content (non haiku)  |  Error message shown, post not submitted  | ✅     |
| New Post    | Post Submission |  Click on save with correct content    |  Post submitted message shown, post submitted, UI updated    | ✅     |
| Edit Post    | Cancel   |     Click on cancel button         |     Closes edit post overlay        | ✅     |
| Edit Post    |  Post validation  |  Click on save with inccorect content (non haiku)  |  Error message shown, edit not submitted  | ✅     |
| Edit Post    | Post Submission |  Click on save with correct content    |  Post edited message shown, edit submitted, UI updated    | ✅     |
| Delete Post    | Cancel   |     Click on Cancel button         |     dismisses delete confirmation        | ✅     |
| Delete Post    | Delete   |     Click on Okay button         |     Post Deleted in database and UI         | ✅     |
| Profile | Profile Picture |  Upload new image                         | Updates profile picture in database and UI        | ✅     |
| Profile | Edit Bio             | Edit and save bio text                   | Updates bio in database and UI                    | ✅     |
| Profile | Delete Profile |   Click on Delete profile button    |     Opens delete profile confirmation     | ✅     |
| Delete Profile    | Cancel   |     Click on Cancel button         |     dismisses delete confirmation        | ✅     |
| Delete Profile    | Delete   |     Click on Confirm button         |     Profile Deleted in database and User redirected to homepage         | ✅     |
| Log Out Page   |   Sign Out Button   |   Click sign out button     |     User logged out and redirected to homepage   | ✅     |
| Log In Page    |  Login validation  |  Click Login button with incorrect credentials     |   user prompted to enter correct credentials  | ✅     |
| Log In Page    |  Login validation  |  Click Login button with correct credentials     |   User logged in and redirected to homepage      | ✅     |
| Sign Up Page    | Sign Up validation | Click sign up button with incorrect credentials   |    User prompted to enter correct credentials  | ✅     |
| Sign Up Page    | Sign Up validation |  Click sign up button with correct credentials  |   Account created, user logged in and redirected to homepage  | ✅     |
| Mobile | Responsive Design | View site on multiple screen sizes | Layout adapts appropriately | ✅ |

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Python
- Django
- PostgreSQL
- Cloudinary
- Whitenoise
- Balsamiq
- dbdiagram.io
- Miroboard

---

## Credits
