import React from 'react';
import config from '../config';
import NoteContext from '../NoteContext';
import ValidationError from '../ValidationError';
import PropTypes from 'prop-types';
import './AddNote.css';
class AddNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: {
                value: '',
                touched: false
            },
            folderId: {
                value: '',
                touched: false
        },
            content: {
                value: '',
                touched: false
            },
          
    }
    }
    
    static contextType = NoteContext;
    
    handleNoteSubmit = (event) => {
        event.preventDefault();
        
        const newNote = JSON.stringify({
            title: this.state.title.value,
            folder_id: this.state.folderId.value,
            content: this.state.content.value,
            date_modified: new Date()
        })
    
        fetch(`${config.API_ENDPOINT}/notes`,
            {
            method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: newNote
        })
            .then(res => {
                if (!res.ok)
                    return res.json().then(e => Promise.reject(e))
                return res.json()
            })
            .then(response => this.context.addNote(response))
            .then(
                this.props.history.push('/')
            )
            .catch(error => {
                alert(error.message)
            })
    }
    
    updateFolderId = (folderId) => {
        this.setState({
            folderId: {
                value: folderId,
                touched: true
            }
            })
    }
    
    updateTitle = (title) => {
        this.setState({
            title: {
                value: title,
                touched: true
            }
        })
    }
    
    updateContent = (content) => {
        this.setState({
            content: {
                value: content,
                touched: true
            }
        })
    }
    
    validateTitle() {
        const title = this.state.title.value.trim();
        if (title.length === 0) {
            return 'Name is required'
        }
    }
    
    validateFolderSelect() {
        const folderIsSelected = this.state.folderId.value;
        return !folderIsSelected;
    }
    
    render() {
        const folderList = this.context.folders.map (folder => {
        return (
                <option key= {folder.id} value={folder.id}>{folder.name}</option>
            )
        })
        
        
        return (
            <form onSubmit={this.handleNoteSubmit}>
                <label htmlFor="title">Title *</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    onChange={e => this.updateTitle(e.target.value)}
                >
                </input>
                {this.state.name.touched && (<ValidationError message = {this.validateTitle()}/>)}
                <label htmlFor="content">Content</label>
                <textarea id="content"
                          name="content"
                          onChange={e => this.updateContent(e.target.value)}
                ></textarea>
                <label htmlFor="folders">Save in *</label>
                <select
                    id="folders"
                    name="folders"
                    onChange={e => this.updateFolderId(e.target.value)}
                    defaultValue="Select Folder"
                >
                    <option disabled>Select Folder</option>
                    {folderList}
                        </select>
                <button type="submit"
                        disabled = {this.validateTitle()||this.validateFolderSelect()
                        }
                >Save</button>
            </form>
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