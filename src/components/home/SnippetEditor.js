import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./SnippetEditor.scss";
import ErrorMessage from "../misc/ErrorMessage";
import domain from "../../util/domain";

function SnippetEditor({ getSnippets, setSnippetEditorOpen, editSnippetData }) {
  const [editorTitle, setEditorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (editSnippetData) {
      setEditorTitle(editSnippetData.title ? editSnippetData.title : "");
    }
  }, [editSnippetData]);

  async function saveSnippet(e) {
    e.preventDefault();

    const snippetData = {
      title: editorTitle ? editorTitle : undefined,
      parent:
        editSnippetData && editSnippetData.parent
          ? editSnippetData.parent
          : undefined,
    };

    try {
      console.log(editSnippetData);
      console.log(snippetData);
      if (!(editSnippetData && editSnippetData._id))
        await Axios.post(`${domain}/snippet/`, snippetData);
      else
        await Axios.put(
          `${domain}/snippet/${editSnippetData._id}`,
          snippetData
        );
    } catch (err) {
      console.log(err);
      if (err.response) {
        if (err.response.data.errorMessage) {
          setErrorMessage(err.response.data.errorMessage);
        }
      }
      return;
    }

    getSnippets();
    closeEditor();
  }

  function closeEditor() {
    setSnippetEditorOpen(false);
    setEditorTitle("");
  }

  return (
    <div className="snippet-editor">
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          clear={() => setErrorMessage(null)}
        />
      )}
      <form className="form" onSubmit={saveSnippet}>
        <label htmlFor="editor-title">Description:</label>
        <input
          id="editor-title"
          type="text"
          value={editorTitle}
          onChange={(e) => setEditorTitle(e.target.value)}
        />

        <button className="btn-save" type="submit">
          Save
        </button>
        <button className="btn-cancel" type="button" onClick={closeEditor}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default SnippetEditor;
