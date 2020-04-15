import React from 'react';
import config from '../config';
import NoteContext from '../NoteContext';
import NotefulForm from '../NotefulForm/NotefulForm';
//import ValidationError from '../ValidationError';
import PropTypes from 'prop-types';
import './AddNote.css';
class AddNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            folder: '',
            content: ''
        }
    }
    static defaultProps = {
        history: {
            push: () => { }
        }
    }
    
    static contextType = NoteContext;
    
 
    
    handleNoteSubmit = (event) => {
        event.preventDefault();
    
        const newNote = {
            name: this.state.name,
            folder_id: this.state.folder,
            content: this.state.content,
            modified: new Date()
        }
    
        fetch(`${config.API_ENDPOINT}/notes`,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(newNote)
            })
                    .then(res => {
                        if (!res.ok)
                            return res.json().then(e => Promise.reject(e))
                        return res.json()
                    })
                    .then(note => this.context.addNote(note))
                    .then(
                        this.props.history.push('/')
                    )
                    .catch(error => {
                        alert(error.message)
                    })
            
    }

    
    updateFolder = (e) => {
        this.setState({
            folder: e.target.value
            }, () => {
            console.log(this.state.folder)
           })
    }
    
    updateName = (e) => {
        this.setState({
            name: e.target.value
        }, () => {
            console.log(this.state.name)
        })
    }
    
    updateContent = (e) => {
        this.setState({
            content: e.target.value
        })
    }
    /*
    validateName() {
        const name = this.state.name.trim();
        if (name.length === 0) {
            return 'Name is required'
        }
    }
    validateFolderSelect() {
        const folderIsSelected = this.state.folderId.value;
        return !folderIsSelected;
    }
    */
    
    
    render() {
       const {folders = []} = this.context;
       
        
        
        return (
            <NotefulForm onSubmit={this.handleNoteSubmit}>
                <label htmlFor="note-name">Note name: </label>
                <input
                    id="note-name"
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.updateName}
                    required
                >
                </input>
              
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    name="content"
                    value={this.state.content}
                    onChange={this.updateContent}
                    required
                />
                <label htmlFor="folders">Store in...</label>
                <select
                    id="folders"
                    name="folder"
                    onChange={this.updateFolder}
                    defaultValue="Select Folder"
                    required
                >
                    <option value={null}>...</option>
                    {folders.map(folder =>
                        <option key={folder.id} value={folder.id}>
                            {folder.name}
                        </option>
                    )}
                        </select>
                    
                <button
                    id='save-note'
                    type="submit"
                >Save</button>
            </NotefulForm>
        )
    }
}
export default AddNote;

AddNote.propTypes = {
    folders: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    })),
    addNote: PropTypes.func
}