import Axios from "axios";
import React, { useState } from "react";
import domain from "../../util/domain";
import "./Snippet.scss";

function Snippet({
  snippet,
  getSnippets,
  editSnippet,
  addsubSnippet,
  subSnippets,
  snippets,
  edit,
}) {
  const [checked, setChecked] = useState(snippet.done);

  async function deleteSnippet() {
    if (window.confirm("Do you want to delete this snippet?")) {
      await Axios.delete(`${domain}/snippet/${snippet._id}`);

      getSnippets();
    }
  }

  async function handlecheck() {
    if (
      window.confirm(checked ? "עחי? תבטוח שלא סיימת?" : "עחי? תבטוח שסיימת?")
    ) {
      await Axios.put(`${domain}/snippet/check/${snippet._id}`, {
        done: !checked,
      });

      getSnippets();
    }
    setChecked(!checked);
  }

  function renderSubSnippets() {
    let sortedsubSnippets = [...subSnippets];
    sortedsubSnippets = sortedsubSnippets.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    function subf(parent) {
      return function (snippet) {
        return snippet.parent && snippet.parent === parent._id;
      };
    }

    return sortedsubSnippets.map((snippet, i) => {
      return (
        <Snippet
          key={i}
          snippet={snippet}
          getSnippets={getSnippets}
          addsubSnippet={addsubSnippet}
          editSnippet={editSnippet}
          subSnippets={snippets && snippets.filter(subf(snippet))}
          edit={edit}
        />
      );
    });
  }

  return (
    <div className="snippet">
      {snippet.title && (
        <>
          {edit && (
            <input
              className="bigcb"
              type="checkbox"
              checked={checked}
              onChange={handlecheck}
            />
          )}
          <h2 className="title">{"           " + snippet.title}</h2>
        </>
      )}
      {subSnippets && subSnippets.length > 0
        ? renderSubSnippets()
        : edit && <p className="no-snippets-msg">NO SUB-COMPONENTS YET :(</p>}
      {edit && (
        <>
          <button className="btn-edit" onClick={() => editSnippet(snippet)}>
            Edit
          </button>
          <button
            className="btn-edit"
            style={{ backgroundColor: "#11CC11" }}
            onClick={() => addsubSnippet(snippet)}
          >
            Add Sub
          </button>
          <button className="btn-delete" onClick={deleteSnippet}>
            Delete
          </button>
        </>
      )}
    </div>
  );
}

export default Snippet;
