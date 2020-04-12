import React from 'react';
import Note from '../Note/Note';
import './NotePageMain.css';
import NoteContext from '../NoteContext';
import { findNote } from '../notes-helpers';

import './NotePageMain.css'

export default class NotePageMain extends React.Component {
    static defaultProps = {
        match: {
            params: {}
        }
    }
    static contextType = NoteContext
    
    handleDeleteNote = noteId => {
        this.props.history.push(`/`)
    }
    
    render() {
        const { notes=[] } = this.context
        const { noteId } = this.props.match.params
        const note = findNote(notes, parseInt(noteId)) || { content: '' }
        const { id, title, content, date_modified} = note;
        return (
            <section className='NotePageMain'>
                <Note
                    id={id}
                    title={title}
                    date_modified={date_modified}
                    onDeleteNote={this.handleDeleteNote}
                />
                <div className='NotePageMain__content'>
                    {content.split(/\n \r|\n/).map((p, i) =>
                        <p key={i}>{p}</p>
                    )}
                </div>
            </section>
        )
    }
}