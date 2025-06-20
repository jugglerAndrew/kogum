### Create New Fill Pattern
Can you generate a fill pattern that is `both vertical and horizontal lines`? Add it to the fill logic and each shape component.

### Refactor Card/Shape and how it interacts with the DB
I want to create an SvgEntity component. The SvgEntity component will have the attributes of Shape,  Fill (this is the pattern applied to the SVG), and Color (this is the only color of the SVG, including any and all patterns and strokes). The inputs of the entity should include the necessary data from the shape, fill, and color tables that makes the most sense. The component should return either a polygon, path, ellipse, or circle SVG element. StrokeWidth should be hardcoded to 4. 

Can you create a new Card component that takes in the same properties and SvgEntity plus Count (which is the number of SvgEntity that should appear within a card). It should return a div that will wrap around the SvgEntity SVG elements. Call this component NewCard so we can test it out. Feel free to use the existing logic in Card.tsx for positioning, styling, etc. However, it should only use the data passed into it to actually realize the SvgEntity values as this will be coming from the database.


### Email Verification Feature
I would like to add an email verification feature as part of the user registration flow. On registration, the user should be sent a verification email with a URL that will ensure their account is validated. 

Functional Requirements
1. Trigger on Sign-Up

    After a user submits the sign-up form, a unique verification email is automatically sent to the provided address.

    The email must include a verification link with a secure token.

2. Email Verification Link

    The link must be unique to each user and include a token (e.g., UUID or JWT).

    The link should expire after a defined period (e.g., 24 hours).

    When clicked, the server should validate the token and update the user’s account status to “verified.”

3. Verification Status

    Users should have a verified flag in the database (true/false).

    Unverified users should not be able to log in or access protected routes.

5. User Feedback

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