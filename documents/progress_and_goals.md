# Progress and Goals

### Work Done


- Text:

  ✔  Journal title can be edited.

  ✔ Texts can be saved to the database

- Manuscripts

  ✔ Manuscripts can flow through the system according to the chart provided


### Goal for this semester  

This semester our goal is to complete the journal website by using React to create frontend code using backend API, and add or change functionalities in the backend if needed.  


- People:  

  - Users can edit and delete their own accounts.  
      using update people and delete people API  

  - Submitting a manuscript creates an account with the role of author  
      using create people and assign role API  

  - Assigning a referee to a manuscript adds the referee role to that person.
      using edit role API, might have to add "add_referee" API to manuscript in backend  

  - Only the editor and managing editor(s) have create / update / delete permissions for the accounts of others.  
      create different home page for editor account, frontend function with create_people, update_people, delete_people API only show in editor's home page  


  - Advanced: record a history of each user's interactions with the system.  

  - A listing of all people is available, but only to the editor and managing editor(s).  

  - A journal masthead can be generated from the database and displayed by the frontend.  

- Text:  

  -  These texts can be edited from the client application, but only by the editor and managing editor(s).  

- Manuscript:  

  - Only the editor and managing editor(s) see all manuscripts; everyone else only sees "their own." That means manuscripts for which they are the author or referee.  

  - A dashboard will present the manuscripts in visual form.   

