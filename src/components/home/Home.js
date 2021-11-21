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
  const [savable, setSavable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snippetEditorOpen, setSnippetEditorOpen] = useState(false);
  const [editSnippetData, setEditSnippetData] = useState(null);
  const [anycheck, anycheckP] = useState(104);
  const [waiting, setWaiting] = useState(false);

  const [ordered, setOrdered] = useState();
  const [oordered, setoordered] = useState("DIDNT");

  const { user } = useContext(UserContext);

  function handleOnDragEnd(result) {
    const items = Array.from(ordered);
    if (oordered === "DIDNT") setoordered(items);
    /* const from = result.source.index;
    const to = result.destination.index;
    if (to > from) {
      const moves = to - from + 1;
      const fromVal = items[from];
      for (let i = from; i < moves; i++) {
        items[i] = items[i + 1];
      }
      items[to] = fromVal;
    } else {
      const moves = from - to + 1;
      const toVal = items[to];
      for (let i = to; i < moves; i++) {
        items[i] = items[i + 1];
      }
      items[to] = toVal;
    } */
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setOrdered(items);
    setSavable(true);
  }

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
      if (!snippets[i].parent) order2.push(snippets[i].order);
    }
    let snippets2 = [];
    for (let i = 0; i < snippets.length; i++)
      if (!snippets[i].parent) snippets2.push(snippets[i]);
    let sortedSnippets = [];
    if (order2)
      for (let i = 0; i < snippets2.length; i++) {
        sortedSnippets[order2[i] - 1] = snippets2[i];
      }
    setOrdered(sortedSnippets);
  }

  function editSnippet(snippetData) {
    setEditSnippetData(snippetData);
    setSnippetEditorOpen(true);
  }

  function addsubSnippet(parent) {
    setEditSnippetData({ title: undefined, parent: parent });
    setSnippetEditorOpen(true);
  }

  async function saveOrderChanges() {
    setSaving(true);
    debugger;

    let needssavingtoDB = [];
    let ordered3 = ordered;
    let oordered3 = oordered;
    for (let i = 0; i < ordered3.length; i++) {
      if (ordered3[i] !== oordered3[i])
        needssavingtoDB.push({ id: ordered3[i]._id, newOrder: i + 1 });
    }

    for (let i = 0; i < needssavingtoDB.length; i++) {
      await Axios.put(`${domain}/snippetO/${needssavingtoDB[i].id}`, {
        newOrder: needssavingtoDB[i].newOrder,
      });
    }

    setSaving(false);
    setSavable(false);
  }

  function renderSnippets() {
    let sortedSnippets = ordered;
    function subf(parent) {
      return function (snippet) {
        return snippet.parent && snippet.parent === parent._id;
      };
    }

    return (
      sortedSnippets &&
      sortedSnippets.map((snippet, i, index) => {
        return (
          !snippet.parent && (
            <Draggable
              key={i}
              draggableId={"i" + i}
              index={i}
              isDragDisabled={!edit}
            >
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
      })
    );
  }

  return (
    <div className="home">
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

      {edit && savable && (
        <div
          style={{
            textAlign: "center",
          }}
        >
          <button
            className="btn-editor-toggle"
            style={{
              backgroundColor: "#154490",
              color: "red",
              fontWeight: "bolder",
            }}
            onClick={() => {
              saveOrderChanges();
            }}
          >
            {saving ? "Saving...   DONT TOUCH ANYTHING!!!!!" : "Save New Order"}
          </button>
        </div>
      )}

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="thelist">
          {(provided) => (
            <ul
              className="thelist"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {snippets.length > 0
                ? renderSnippets()
                : user && (
                    <p className="no-snippets-msg">NO COMPONENTS YET :(</p>
                  )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

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
