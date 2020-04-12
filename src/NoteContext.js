import React from "react";

 const NoteContext = React.createContext({
  notes: [],
  folders: [],
  deleteNote: () => {},
  addFolder: () => {},
  addNote:()=>{},
});


export default NoteContext;