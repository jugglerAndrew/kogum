### Create New Fill Pattern

Can you generate a fill pattern that is `both vertical and horizontal lines`? Add it to the fill logic and each shape component.

### Refactor Card/Shape and how it interacts with the DB

I want to create an SvgEntity component. The SvgEntity component will have the attributes of Shape, Fill (this is the pattern applied to the SVG), and Color (this is the only color of the SVG, including any and all patterns and strokes). The inputs of the entity should include the necessary data from the shape, fill, and color tables that makes the most sense. The component should return either a polygon, path, ellipse, or circle SVG element. StrokeWidth should be hardcoded to 4.

Can you create a new Card component that takes in the same properties and SvgEntity plus Count (which is the number of SvgEntity that should appear within a card). It should return a div that will wrap around the SvgEntity SVG elements. Call this component NewCard so we can test it out. Feel free to use the existing logic in Card.tsx for positioning, styling, etc. However, it should only use the data passed into it to actually realize the SvgEntity values as this will be coming from the database.

### Email Verification Feature

I would like to add an email verification feature as part of the user registration flow. On registration, the user should be sent a verification email with a URL that will ensure their account is validated.

Functional Requirements

1.  Trigger on Sign-Up

    After a user submits the sign-up form, a unique verification email is automatically sent to the provided address.

    The email must include a verification link with a secure token.

2.  Email Verification Link

    The link must be unique to each user and include a token (e.g., UUID or JWT).

    The link should expire after a defined period (e.g., 24 hours).

    When clicked, the server should validate the token and update the user’s account status to “verified.”

3.  Verification Status

    Users should have a verified flag in the database (true/false).

    Unverified users should not be able to log in or access protected routes.

4.  User Feedback

    Show clear messages for:

        “Verification email sent”

        “Email verified successfully”

        “Verification link expired or invalid”

        “Already verified”

Security Requirements

    Tokens must be securely generated (e.g., using a cryptographic library).

    Tokens must expire and be single-use (can’t verify twice with same token).

    Avoid exposing internal IDs in the URL—use hashes or encoded tokens.

    Use HTTPS to prevent link interception.

Technical Requirements
Backend: Generate and store token.
Frontend: Show messages and forms based on verification status.
Database: User account verification status stored in the database, as well as any other important information that needs to persist.

Execution
You as the agent should break this down into smaller tasks and only do one task at a time. Tell me your plan ahead of each task and I will approve to go forward or not.

### User rankings feature

There are currently four different puzzles per day as part of the Daily Puzzle feature. I want to track users times on the daily puzzles, categorized by the four difference meal types (breakfast, lunch, dinner, dessert). Detailed requirements below.

1.  Track Puzzle Completion Time

    The system shall record the time a user takes to complete a puzzle from the moment the puzzle starts until it is completed, if and only if the user is signed in and an account is available. Use the existing timer if you can.

2.  Store Completion Times

    Each puzzle completed should result in the user and their time being stored. Times should be classified by meal type and by puzzle type (daily) as there may be other puzzle types in the future.

3.  User Leaderboards (aka the scøres page)

    The system shall provide leaderboards showing the fastest completion times for daily puzzles:

        Daily rankings (today only) by meal type and a daily ranking overall for anyone who has completed all of the meal types on a single day, ranked by their total time. Top 10

        Weekly rankings (starting on Sundays) Top 10

        Monthly rankings (calendar month) Top 10

        Yearly rankings (calendar year) Top 10

        Overall all-time rankings Top 10

    Each leaderboard should display:

        Rank

        Username

        Completion time

        Date/time of completion

4.  Personal Bests

    The system shall allow users to view their ptime for each of the dailys by meal type and their overall personal best.

5.  Tie Handling

    In the event of identical times, the earlier completion time shall be ranked higher.

6.  Access Control

        Only logged-in users can have their times tracked and appear on leaderboards. Efforts should be made to ensure completion times are based on server-side start and end timestamps to prevent cheating.

    Execution
    You as the agent should break this down into smaller tasks and only do one task at a time. Tell me your plan ahead of each task and I will approve to go forward or not.
