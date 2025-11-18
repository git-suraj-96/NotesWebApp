const saveBtns = document.querySelectorAll(".save-btn");
const titles = document.querySelectorAll(".title");
const note = document.querySelectorAll(".note-data");


saveBtns.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    const noteid = btn.dataset.note;
    const notedata = note[i].value;
    const title = titles[i].value;

    fetch("/savechanges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        noteid : noteid,
        notedata : notedata,
        desc : title,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.redirect){
            window.location.href = data.redirect;
        }
      })
      .catch((err) => console.error(err));
  });
});
