import { useEffect, useState, useRef } from "react";
import service from "./services/service";

const url = "/api/notes";

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [notification, setNotification] = useState(null);
  const timeout = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await service.index(url);
      setNotes(data ?? []);
    };

    fetchData();
  }, []);

  const toggleImportance = async (id) => {
    const noteToChange = notes.find((note) => note.id === id);

    const changedNote = {
      ...noteToChange,
      important: !noteToChange.important,
    };
    updateNote(changedNote);
  };

  const updateContent = async (id, content) => {
    const noteToChange = notes.find((note) => note.id === id);

    const changedNote = {
      ...noteToChange,
      content: content,
    };
    updateNote(changedNote);
  };

  const updateNote = async (note) => {
    const [result, error] = await service.update(url, note);

    if (error) {
      showNotification(error.error, "error");
      return;
    }
    setNotes((prev) => prev.map((n) => (n.id === note.id ? result.data : n)));
    showNotification(result.message, "success");
  };

  const filterNotes = () => {
    const filterSearch = notes.filter((n) =>
      n.content.toLowerCase().includes(searchTerm.toLocaleLowerCase()),
    );

    const filteredNotes = showAll
      ? filterSearch
      : filterSearch.filter((n) => n.important);

    return filteredNotes;
  };

  const filteredNotes = filterNotes();

  const addNewNote = async (content) => {
    const newNote = { content, important: false };
    const [result, error] = await service.create(url, newNote);

    if (error) {
      showNotification(error.error, "error");
      return;
    }

    setNotes(notes.concat(result.data));
    setNewNote("");
    showNotification(result.message, "success");
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Do you want to delete this note?")) {
      return;
    }

    const [result, error] = await service.remove(url, id);
    if (error) {
      showNotification(error.error, "error");
      return;
    }

    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    showNotification(result.message, "success");
  };

  const showNotification = (message, type) => {
    setNotification({
      message,
      type,
    });

    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      setNotification(null);
    }, 1000);
  };

  return {
    notes,
    toggleImportance,
    filteredNotes,
    setSearchTerm,
    searchTerm,
    setShowAll,
    showAll,
    newNote,
    setNewNote,
    addNewNote,
    deleteNote,
    notification,
    updateContent,
  };
};
