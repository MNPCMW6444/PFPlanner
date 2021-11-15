import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Snippet from "./Snippet";
import SnippetEditor from "./SnippetEditor";
import "./Home.scss";
import UserContext from "../../context/UserContext";
import { Link } from "react-router-dom";
import domain from "../../util/domain";

function Home() {
  const [snippets, setSnippets] = useState([]);
  const [edit, setEdit] = useState(false);
  const [snippetEditorOpen, setSnippetEditorOpen] = useState(false);
  const [editSnippetData, setEditSnippetData] = useState(null);

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user) setSnippets([]);
    else getSnippets();
  }, [user]);

  async function getSnippets() {
    const snippetsRes = await Axios.get(`${domain}/snippet/`);
    setSnippets(snippetsRes.data);
  }

  function editSnippet(snippetData) {
    setEditSnippetData(snippetData);
    setSnippetEditorOpen(true);
  }

  function addsubSnippet(parent) {
    setEditSnippetData({ title: undefined, parent: parent });
    setSnippetEditorOpen(true);
  }

  function renderSnippets() {
    let sortedSnippets = [...snippets];
    sortedSnippets = sortedSnippets.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    function subf(parent) {
      return function (snippet) {
        return snippet.parent && snippet.parent === parent._id;
      };
    }

    return sortedSnippets.map((snippet, i) => {
      return (
        !snippet.parent && (
          <Snippet
            key={i}
            snippet={snippet}
            getSnippets={getSnippets}
            addsubSnippet={addsubSnippet}
            editSnippet={editSnippet}
            snippets={snippets}
            subSnippets={snippets.filter(subf(snippet))}
            edit={edit}
          />
        )
      );
    });
  }

  return (
    <div className="home">
      <div className="editSwitch">
        <p className="editogle">Edit: </p>
        <label class="switch">
          <input
            type="checkbox"
            edit={edit}
            onChange={() => {
              setEdit(!edit);
            }}
          ></input>
          <span class="slider round"></span>
        </label>
      </div>
      {!snippetEditorOpen && user && edit && (
        <button
          className="btn-editor-toggle"
          style={{ backgroundColor: "#11CC11", color: "white" }}
          onClick={() => setSnippetEditorOpen(true)}
        >
          Add a new Main Component
        </button>
      )}
      {snippetEditorOpen && (
        <>
          <h2> !שים לב שכיום לא ניתן להציג תת-תת-תת משימות </h2>
          <SnippetEditor
            setSnippetEditorOpen={setSnippetEditorOpen}
            getSnippets={getSnippets}
            editSnippetData={editSnippetData}
          />
        </>
      )}
      {snippets.length > 0
        ? renderSnippets()
        : user && <p className="no-snippets-msg">NO COMPONENTS YET :(</p>}
      {user === null && (
        <div className="no-user-message">
          <h2>Welcome to PF Planner</h2>
          <Link to="/login">Login here</Link>
        </div>
      )}
    </div>
  );
}

export default Home;
