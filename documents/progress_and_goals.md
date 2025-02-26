# Progress and Goals

### Work Done

Last semester, we have implemented CRUD for people, text, and manuscript with MongoDB. We also have the implementation of the FSM for the manuscript. 


- Text:

  ✔  Journal title can be edited.

  ✔ Texts can be saved to the database

- Manuscripts

  ✔ Manuscripts can flow through the system according to the chart provided


### Goal for this semester  

This semester our goal is to complete the journal website by using React to create frontend code using backend API, and add or change functionalities in the backend if needed. Combining the frontend and backend, we will create a user-friendly journal website that can visualize the backend functionalities to the user. To achieve the different permissions for different users, we will work on the frontend to create different home pages for different users.


- People:  

  - Users can edit and delete their own accounts.  
      - using update people and delete people API  

  - Submitting a manuscript creates an account with the role of author  
      - using create people and assign role API  

  - Assigning a referee to a manuscript adds the referee role to that person.
      - using edit role API, might have to add "add_referee" API to manuscript in backend  

  - Only the editor and managing editor(s) have create / update / delete permissions for the accounts of others.  
      - create different home page for editor account, frontend function with create_people, update_people, delete_people API only show in editor's home page  


  - Advanced: record a history of each user's interactions with the system.
  
      - Define interactions as an enum of strings. For each account, keep an array to maintain the interaction and the timestamp. 

  - A listing of all people is available, but only to the editor and managing editor(s).  

    - Accounts with the "editor" flag have access to the people API with no input (unconditional). A button will be created to call this API.
      
  - A journal masthead can be generated from the database and displayed by the front end.

    - A button will be created to call the get_masthead API to retrieve the mastheads.

- Text:  

  -  These texts can be edited from the client application, but only by the editor and managing editor(s).
    
      - Only the accounts with the mark "editors" or "managing editors" have access to the "update_text" API.

- Manuscript:  

  - Only the editor and managing editor(s) see all manuscripts; everyone else only sees "their own." That means manuscripts for which they are the author or referee.
 
    - After clicking the "browse manuscripts" button, the accounts with the mark "editors" or "managing editors" will call the "manuscript" API to retrieve ALL manuscripts, and the normal account can only call the "manuscript" API with the "ID" input with their own IDs.

  - A dashboard will present the manuscripts in visual form.
    - Retrieving the manuscript data structure, reading the history entry, and using the plot library to produce the visual form.


## Webpage design

- Sign Up/Login Page

  - Sign Up Fields: Email, Password, Confirm Password, First Name, Last Name, Affiliation
  - Sign Up Button
  - Login Fields: Email, Password
  - Login Button
- Home Page
- Masthead Page
- Submission Page

  - Submission Fields: Title, Author, Author email, Abstract, File Upload(text), Editor(Submit here?)
  - Submit Button
  - Cancel Button

- Dashboard (handle the manuscript FSM)


## To Do List:
- Roles
  - Dropdown List, allow multiple roles selection
  - Map role name to abbreviation

- Manuscript 
  - Larger box for text by default
  - Display text

- Submission page

- People
  - Button design: trash can and pencil (optional)