import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import config from '../config';
import NoteContext from '../NoteContext';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNotes/AddNote';
import './App.css';
import ErrorBoundary from '../ErrorBoundary';

class App extends Component {
  state = {
    notes: [],
    folders: []
  };

  handleDelete = ( noteId ) => {
    this.setState({
      notes: this.state.notes.filter( note => note.id !== noteId )
    });
  };

  handleAddFolder = ( folder ) => {
    this.setState({
      folders:[...this.state.folders, folder] 
    });
  }

  handleAddNote = ( note ) =>{
    this.setState({
      notes:[...this.state.notes, note]
    });
  }
   
  componentDidMount() {
    Promise.all([
      fetch( `${ config.API_ENDPOINT }/notes` ),
      fetch( `${ config.API_ENDPOINT }/folders` )
    ])
    .then(( [ notesRes, foldersRes ]) => {
      if ( !notesRes.ok ) 
        return notesRes.json().then( event => Promise.reject( event ) );
      if ( !foldersRes.ok ) 
        return foldersRes.json().then( event => Promise.reject( event ) );

      return Promise.all( [ notesRes.json(), foldersRes.json() ] );
    })
    .then(( [ notes, folders ]) => {
      this.setState({ notes, folders })
    })
    .catch( error => {
      console.log({ error })
    });
  }

  renderNavRoutes() {
    return (
    
      <> 
        {['/', '/folder/:folderId'].map(path => (
          <Route 
            exact={true} 
            key={path} 
            path={path} 
            component={NoteListNav}
          />
        ))} 
        <Route 
          path="/note/:noteId" 
          component={NotePageNav} 
        /> 
        <Route 
          path="/add-folder" 
          component={NotePageNav}
        />
        <Route 
          path="/add-note" 
          component={NotePageNav}
        />
      </>
    );
  }

  renderMainRoutes() {
    return (
    <> 
      {['/', '/folder/:folderId'].map(path => (
        <Route 
          exact={true} 
          key={path} 
          path={path} 
          component={NoteListMain}
        />
      ))}
      <Route 
        path="/note/:noteId" 
        component = {NotePageMain}
      />
      <Route 
        path="/add-folder" 
        component={AddFolder}
      />
      <Route 
        path="/add-note"
        component={AddNote}
      />
    </>);
  }

  render(){
    const ctxValue = {
      notes: this.state.notes,
      folders: this.state.folders,
      addFolder: this.handleAddFolder,
      addNote: this.handleAddNote,
      deleteNote: this.handleDelete
    };
    return (
        <ErrorBoundary>
        
    <NoteContext.Provider value={ctxValue}>
      <div className="App">
        <nav className="App__nav">{this.renderNavRoutes()}</nav>
        <header className="App__header">
          <h1>
            <Link
              to="/"
            >
              Noteful
            </Link>
            {' '}
            <FontAwesomeIcon icon="check-double"/>
          </h1>
        </header>
        <main className="App__main">{this.renderMainRoutes()}</main>
      </div>
      </NoteContext.Provider>
        </ErrorBoundary>
    );
  }

}

export default App;
