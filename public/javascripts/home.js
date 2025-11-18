const newNoteBtn = document.querySelector(".new-note");
const box = document.querySelector(".new-note-creation-box");
const xBtn = document.querySelector(".x-btn");
const saveBtn = document.querySelector(".save");
const descriptionBox = document.getElementById("description");
const notesBox = document.getElementById("notes");
const pondx = document.querySelector(".p-o-n-d-x");
const readBox = document.querySelector(".page-of-note-data");
const parent = document.querySelectorAll(".parent");
const readDescription = document.querySelector(".read-description");
const readNotes = document.querySelector(".read-note");
const deleBtns = document.querySelectorAll(".delete");
const notes = document.querySelectorAll(".parent");
const flashMessage = document.querySelector(".message");
const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-btn");
const anchor = document.querySelector(".anchor-search");

newNoteBtn.addEventListener("click", () => {
  box.style.display = "block";
});

xBtn.addEventListener("click", () => {
  box.style.display = "none";
});

function creatElement(description, notes, date) {
  const notesMainBox = document.createElement("div");
  notesMainBox.className =
    "group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111318] p-4 transition-all hover:shadow-lg hover:-translate-y-1 dark:hover:border-primary/50 parent";

  notesMainBox.innerHTML = `<div
        class="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
        <button
        class="p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                  <span class="material-symbols-outlined text-base"
                      >edit</span
                      >
                  </button>
                  <button
                    class="p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    >
                    <span class="material-symbols-outlined text-base"
                    >delete</span
                    >
                    </button>
                    </div>
                    <div>
                    <p
                    class="text-slate-900 dark:text-white text-base font-medium leading-normal pr-16 set-description ankur"
                    >
                    ${description}
                    </p>
                    <p
                    class="text-slate-500 dark:text-[#9da6b9] text-sm font-normal leading-normal mt-1 line-clamp-2 set-notes suraj"
                    >
                    ${notes}
                    </p>
                    <p
                    class="text-slate-400 dark:text-slate-500 text-xs font-normal leading-normal mt-3"
                    >
                    Last modified: ${date}
                    </p>
                    </div>`;

  document.querySelector(".main-box-grid").appendChild(notesMainBox);
}

saveBtn.addEventListener("click", () => {
  const description = descriptionBox.value;
  const notes = notesBox.value;
  if (!description || !notes) {
    flashMessage.innerHTML = "Please fill all input fileds.";
    flashMessage.style.display = "block";
    setTimeout(() => {
      flashMessage.style.display = "none";
    }, 2000);
    return;
  }
  fetch("/createnotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: description,
      notes: notes,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        creatElement(data.description, data.noteData, data.date);
        box.style.display = "none";
        descriptionBox.value = "";
        notesBox.value = "";

        window.location.reload();

      } else {
        console.log(error);
      }
    })
    .catch((err) => console.error(err));
});
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready");
  document.querySelector(".main-box-grid").scrollTo(0, document.querySelector(".main-box-grid").getBoundingClientRect().height+1000);
});


pondx.addEventListener("click", () => {
  readBox.style.display = "none";
});

parent.forEach((btn) =>
  btn.addEventListener("click", (event) => {
    if (!(event.target.closest(".edit") || event.target.closest(".delete"))) {
      const suraj = document.querySelectorAll(".suraj");
      const ankur = document.querySelectorAll(".ankur");

      const surajArr = Array.from(suraj);
      const ankurArr = Array.from(ankur);
      let index = 0;

      if (surajArr.indexOf(event.target) !== -1) {
        index = surajArr.indexOf(event.target);
      } else if (ankurArr.indexOf(event.target) !== -1) {
        index = ankurArr.indexOf(event.target);
      }

      readDescription.innerText = ankurArr[index].innerText;
      readNotes.innerText = surajArr[index].innerText;
      if (surajArr.length > 0) {
        readBox.style.display = "block";
      }
    }
  })
);

deleBtns.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    const noteId = btn.dataset.post;

    fetch("deletenote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        noteid: noteId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          notes[i].style.display = "none";
          flashMessage.style.display = "block";
          let timer = setTimeout(() => {
            flashMessage.style.display = "none";
          }, 2000);

          flashMessage.addEventListener("mouseenter", () => {
            clearTimeout(timer);
            console.log("timer stopped");
          });
        } else {
          console.error(data.error);
        }
      })
      .catch((err) => console.log(err));
  });
});

flashMessage.addEventListener("mouseleave", () => {
  setTimeout(() => {
    flashMessage.style.display = "none";
  }, 1000);
});

searchBtn.addEventListener("click", ()=>{
  console.log(searchBox.value);
  anchor.setAttribute("href", `/search/${searchBox.value}`);
})
