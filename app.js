const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const notesList = document.getElementById("notesList");
const noteCount = document.getElementById("noteCount");
const message = document.getElementById("message");
const saveBtn = document.getElementById("saveBtn");
const refreshBtn = document.getElementById("refreshBtn");

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showMessage(text, type = "") {
  message.textContent = text;
  message.style.color = type === "error" ? "#d64545" : "#39855d";
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleString();
}

function renderNotes(notes) {
  noteCount.textContent = notes.length;

  if (!notes.length) {
    notesList.innerHTML = '<div class="empty">No notes yet. Create your first note!</div>';
    return;
  }

  notesList.innerHTML = notes.map(note => `
    <article class="note">
      <div class="note-top">
        <div>
          <h4>${escapeHTML(note.title)}</h4>
        </div>
        <button class="delete-btn" type="button" data-id="${escapeHTML(note.id)}">Delete</button>
      </div>
      <p>${escapeHTML(note.content)}</p>
      <small>Created: ${escapeHTML(formatDate(note.createdAt))}</small>
    </article>
  `).join("");
}

async function loadNotes() {
  notesList.innerHTML = '<div class="loading">Loading notes...</div>';

  try {
    const response = await fetch("/api/notes");
    if (!response.ok) throw new Error("Unable to load notes.");
    const notes = await response.json();
    renderNotes(notes);
  } catch (error) {
    notesList.innerHTML = `<div class="error">${escapeHTML(error.message)}</div>`;
  }
}

noteForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    showMessage("Please enter both title and content.", "error");
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";

  try {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not save note.");
    }

    noteForm.reset();
    showMessage("Note saved successfully.");
    await loadNotes();
    titleInput.focus();
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "+ Save Note";
  }
});

notesList.addEventListener("click", async (event) => {
  const button = event.target.closest(".delete-btn");
  if (!button) return;

  const id = button.dataset.id;

  if (!confirm("Delete this note?")) return;

  button.disabled = true;
  button.textContent = "Deleting...";

  try {
    const response = await fetch(`/api/notes/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Could not delete note.");

    await loadNotes();
  } catch (error) {
    alert(error.message);
    button.disabled = false;
    button.textContent = "Delete";
  }
});

refreshBtn.addEventListener("click", loadNotes);

loadNotes();