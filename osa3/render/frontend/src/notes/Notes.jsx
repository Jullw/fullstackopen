import "./notes.css";
import { useNotes } from "./UseNotes";
import { useState } from "react";

const Notes = () => {
  const {
    toggleImportance,
    filteredNotes,
    setShowAll,
    showAll,
    searchTerm,
    setSearchTerm,
    addNewNote,
    newNote,
    setNewNote,
    deleteNote,
    notification,
    updateContent,
  } = useNotes();

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="col">
      <h1>Notes</h1>
      <div>
        <Filter setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        <BasicButton
          onClick={toggleShowAll}
          text={showAll ? "All" : "Important"}
        />
      </div>
      <div className="notes-container">
        {filteredNotes.map((n) => (
          <div key={n.id + "row"} className="row">
            <Note
              key={n.id}
              note={n}
              onToggle={() => toggleImportance(n.id)}
              updateContent={updateContent}
            />
            <DeleteButton
              key={n.id + "delete"}
              onClick={() => deleteNote(n.id)}
              symbol="✕"
            />
          </div>
        ))}
      </div>
      <AddNote
        newNote={newNote}
        setNewNote={setNewNote}
        addNewNote={addNewNote}
      />
      {notification && (
        <p className={`${notification.type}`}>{notification.message}</p>
      )}
    </div>
  );
};

const AddNote = ({ newNote, setNewNote, addNewNote }) => {
  return (
    <div>
      <input
        placeholder="New Note..."
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
      />
      <BasicButton text={"Add Note"} onClick={() => addNewNote(newNote)} />
    </div>
  );
};

const Filter = ({ setSearchTerm, searchTerm }) => {
  const handleSearch = (e) => setSearchTerm(e.target.value);

  return (
    <>
      <input placeholder="Search" value={searchTerm} onChange={handleSearch} />
    </>
  );
};

const Note = ({ note, onToggle, updateContent }) => {
  return (
    <div className="row">
      <ImportantButton important={note.important} onClick={onToggle} />
      <EditableNote note={note} updateContent={updateContent} />
    </div>
  );
};

const EditableNote = ({ note, updateContent }) => {
  const [draft, setDraft] = useState("");
  const [edit, setEdit] = useState(false);

  return (
    <>
      {!edit ? (
        <div
          className="editableText"
          onClick={() => {
            setEdit(true);
            setDraft(note.content);
          }}
        >
          {note.content}
        </div>
      ) : (
        <input
          autoFocus
          className="inlineEdit"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => setEdit(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateContent(note.id, draft);
              setEdit(false);
            }
            if (e.key === "Escape") setEdit(false);
          }}
        />
      )}
    </>
  );
};

const ImportantButton = ({ important, onClick }) => {
  return (
    <button
      type="button"
      className={important ? "note important" : "note"}
      onClick={onClick}
    >
      {important.toString()}
    </button>
  );
};

const BasicButton = ({ text, onClick }) => {
  return (
    <button type="button" onClick={onClick}>
      {text}
    </button>
  );
};

const DeleteButton = ({ onClick, symbol }) => {
  return (
    <button className="crudButton" type="button" onClick={onClick}>
      <div> {symbol}</div>
    </button>
  );
};

export default Notes;
