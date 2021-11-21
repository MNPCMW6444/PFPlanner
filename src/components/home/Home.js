import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Snippet from "./Snippet";
import SnippetEditor from "./SnippetEditor";
import "./Home.scss";
import UserContext from "../../context/UserContext";
import { Link } from "react-router-dom";
import domain from "../../util/domain";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Home() {
  const [snippets, setSnippets] = useState([]);
  const [edit, setEdit] = useState(false);
  const [snippetEditorOpen, setSnippetEditorOpen] = useState(false);
  const [editSnippetData, setEditSnippetData] = useState(null);
  const [anycheck, anycheckP] = useState(104);
  const [waiting, setWaiting] = useState(false);

  const [order, setOrder] = useState();

  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log(anycheck);
    if (!user) setSnippets([]);
    else getSnippets();
  }, [user, anycheck]);

  async function getSnippets() {
    const snippetsRes = await Axios.get(`${domain}/snippet/`);
    setSnippets(snippetsRes.data);
    const snippets = snippetsRes.data;
    let order2 = [];
    for (let i = 0; i < snippets.length; i++) {
      order2.push(snippets[i].order2);
    }
    setOrder(order2);
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
    let snippets2 = snippets;
    let order2 = order;
    debugger;
    let sortedSnippets = [];
    for (let i = 0; i < snippets2.length; i++) {
      sortedSnippets.push(snippets2[order2[i]]);
    }

    function subf(parent) {
      return function (snippet) {
        return snippet.parent && snippet.parent === parent._id;
      };
    }

    return sortedSnippets.map((snippet, i, index) => {
      return (
        !snippet.parent && (
          <Draggable key={i} draggableId={"i" + i} index={i}>
            {(provided) => (
              <li
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <Snippet
                  snippet={snippet}
                  getSnippets={getSnippets}
                  addsubSnippet={addsubSnippet}
                  editSnippet={editSnippet}
                  snippets={snippets}
                  subSnippets={snippets.filter(subf(snippet))}
                  edit={edit}
                  setedit={setEdit}
                  anycheckP={anycheckP}
                  anycheck={anycheck}
                  waiting2={waiting}
                />
              </li>
            )}
          </Draggable>
        )
      );
    });
  }

  return (
    <DragDropContext>
      <Droppable droppableId="home">
        {(provided) => (
          <ul
            className="home"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {user && (
              <div className="editSwitch">
                <p className="editogle">Edit: </p>
                <label class="switch">
                  <input
                    type="checkbox"
                    edit={edit}
                    onChange={() => {
                      setEdit(!edit);
                      setWaiting(!waiting);
                    }}
                  ></input>
                  <span class="slider round"></span>
                </label>
              </div>
            )}
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
                {/*<h2> !שים לב שכיום לא ניתן להציג תת-תת-תת משימות </h2>*/}
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
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Home;
