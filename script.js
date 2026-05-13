const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {

  e.preventDefault();

  const username = document.getElementById("username").value.trim();

  if(username === ""){
    alert("Please enter your name");
    return;
  }

  localStorage.setItem("currentUser", username);

  if(!localStorage.getItem(`finance_${username}`)){

    const userData = {
      budget:0,
      expenses:[]
    };

    localStorage.setItem(
      `finance_${username}`,
      JSON.stringify(userData)
    );
  }

  window.location.href = "Finance.html";

});