document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("tournament-form");
  var clientName = document.getElementById("client-name");
  var riotId = document.getElementById("riot-id");
  var clientEmail = document.getElementById("client-email");
  var clientPhone = document.getElementById("client-phone");
  var clientRole = document.getElementById("client-role");
  var clientRank = document.getElementById("client-rank");
  var matchDate = document.getElementById("match-date");
  var clientNotes = document.getElementById("client-notes");

  var emptyState = document.getElementById("status-empty");
  var activeState = document.getElementById("status-active");
  var btnCancel = document.getElementById("btn-cancel");

  var dispName = document.getElementById("disp-name");
  var dispRiotId = document.getElementById("disp-riot-id");
  var dispEmail = document.getElementById("disp-email");
  var dispPhone = document.getElementById("disp-phone");
  var dispRole = document.getElementById("disp-role");
  var dispRank = document.getElementById("disp-rank");
  var dispDate = document.getElementById("disp-date");
  var dispNotes = document.getElementById("disp-notes");

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  var todayStr = yyyy + '-' + mm + '-' + dd;
  if (matchDate) {
    matchDate.setAttribute("min", todayStr);
  }

  loadSavedData();

  function loadSavedData() {
    var activeDataJson = localStorage.getItem("valorant_hub_tournament_active");
    var draftDataJson = localStorage.getItem("valorant_hub_tournament_draft");

    if (activeDataJson) {
      var activeData = JSON.parse(activeDataJson);
      renderActiveCard(activeData);
      fillForm(activeData);
    } else if (draftDataJson) {
      var draftData = JSON.parse(draftDataJson);
      fillForm(draftData);
      showEmptyState();
    } else {
      showEmptyState();
    }
  }

  function fillForm(data) {
    if (data.name && clientName) clientName.value = data.name;
    if (data.riotId && riotId) riotId.value = data.riotId;
    if (data.email && clientEmail) clientEmail.value = data.email;
    if (data.phone && clientPhone) clientPhone.value = data.phone;
    if (data.role && clientRole) clientRole.value = data.role;
    if (data.rank && clientRank) clientRank.value = data.rank;
    if (data.rawDate && matchDate) {
      matchDate.value = data.rawDate;
    } else if (data.date && matchDate && !data.rawDate) {
      matchDate.value = data.date;
    }
    if (data.notes && clientNotes) clientNotes.value = data.notes;

    if (clientName) validateField(clientName, "name-error");
    if (riotId) validateField(riotId, "riot-id-error");
    if (clientEmail) validateField(clientEmail, "email-error");
    if (clientPhone) validateField(clientPhone, "phone-error");
    if (clientRole) validateField(clientRole, "role-error");
    if (clientRank) validateField(clientRank, "rank-error");
    if (matchDate) validateField(matchDate, "date-error");
    if (clientNotes) validateField(clientNotes, "notes-error");
  }

  var inputs = [clientName, riotId, clientEmail, clientPhone, clientRole, clientRank, matchDate, clientNotes];
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i]) {
      inputs[i].addEventListener("input", saveDraft);
      if (inputs[i].tagName === "SELECT") {
        inputs[i].addEventListener("change", saveDraft);
      }
    }
  }

  function saveDraft() {
    var draft = {
      name: clientName ? clientName.value : "",
      riotId: riotId ? riotId.value : "",
      email: clientEmail ? clientEmail.value : "",
      phone: clientPhone ? clientPhone.value : "",
      role: clientRole ? clientRole.value : "",
      rank: clientRank ? clientRank.value : "",
      rawDate: matchDate ? matchDate.value : "",
      notes: clientNotes ? clientNotes.value : ""
    };
    localStorage.setItem("valorant_hub_tournament_draft", JSON.stringify(draft));
  }

  if (clientName) clientName.addEventListener("blur", function() { validateField(clientName, "name-error"); });
  if (riotId) riotId.addEventListener("blur", function() { validateField(riotId, "riot-id-error"); });
  if (clientEmail) clientEmail.addEventListener("blur", function() { validateField(clientEmail, "email-error"); });
  if (clientPhone) clientPhone.addEventListener("blur", function() { validateField(clientPhone, "phone-error"); });
  if (clientRole) clientRole.addEventListener("change", function() { validateField(clientRole, "role-error"); });
  if (clientRank) clientRank.addEventListener("change", function() { validateField(clientRank, "rank-error"); });
  if (matchDate) matchDate.addEventListener("blur", function() { validateField(matchDate, "date-error"); });
  if (clientNotes) clientNotes.addEventListener("blur", function() { validateField(clientNotes, "notes-error"); });

  function validateField(inputEl, errorId) {
    if (!inputEl) return false;
    var errorEl = document.getElementById(errorId);
    var isValid = inputEl.checkValidity();

    if (inputEl.id === "match-date" && inputEl.value) {
      var selectDate = new Date(inputEl.value);
      var currentDay = new Date();
      currentDay.setHours(0, 0, 0, 0);
      selectDate.setHours(0, 0, 0, 0);

      if (selectDate < currentDay) {
        isValid = false;
      }
    }

    if (isValid && inputEl.value !== "") {
      inputEl.classList.remove("is-invalid");
      inputEl.classList.add("is-valid");
      if (errorEl) errorEl.style.display = "none";
      return true;
    } else {
      if (inputEl.value !== "" || (form && form.classList.contains("was-validated"))) {
        inputEl.classList.remove("is-valid");
        inputEl.classList.add("is-invalid");
        if (errorEl) errorEl.style.display = "block";
      }
      return false;
    }
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.classList.add("was-validated");

      var isNameValid = validateField(clientName, "name-error");
      var isRiotIdValid = validateField(riotId, "riot-id-error");
      var isEmailValid = validateField(clientEmail, "email-error");
      var isPhoneValid = validateField(clientPhone, "phone-error");
      var isRoleValid = validateField(clientRole, "role-error");
      var isRankValid = validateField(clientRank, "rank-error");
      var isDateValid = validateField(matchDate, "date-error");
      var isNotesValid = validateField(clientNotes, "notes-error");

      var isFormValid = isNameValid && isRiotIdValid && isEmailValid && isPhoneValid && isRoleValid && isRankValid && isDateValid && isNotesValid;

      if (isFormValid) {
        var tournamentData = {
          name: clientName.value,
          riotId: riotId.value,
          email: clientEmail.value,
          phone: clientPhone.value,
          role: clientRole.value,
          rank: clientRank.value,
          date: formatDateIndo(matchDate.value),
          rawDate: matchDate.value,
          notes: clientNotes.value
        };

        localStorage.setItem("valorant_hub_tournament_active", JSON.stringify(tournamentData));
        localStorage.removeItem("valorant_hub_tournament_draft");
        renderActiveCard(tournamentData);

        if (window.innerWidth <= 1024 && activeState) {
          activeState.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        var firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

  function renderActiveCard(data) {
    if (dispName) dispName.textContent = data.name;
    if (dispRiotId) dispRiotId.textContent = data.riotId;
    if (dispEmail) dispEmail.textContent = data.email;
    if (dispPhone) dispPhone.textContent = data.phone;
    if (dispRole) dispRole.textContent = data.role;
    if (dispRank) dispRank.textContent = data.rank;
    if (dispDate) dispDate.textContent = data.date;
    if (dispNotes) dispNotes.textContent = data.notes;

    if (emptyState) emptyState.style.display = "none";
    if (activeState) activeState.style.display = "block";
  }

  function showEmptyState() {
    if (emptyState) emptyState.style.display = "flex";
    if (activeState) activeState.style.display = "none";
  }

  if (btnCancel) {
    btnCancel.addEventListener("click", function () {
      if (confirm("Apakah Anda yakin ingin membatalkan pendaftaran turnamen ini? Semua data pendaftaran Anda akan dihapus.")) {
        localStorage.removeItem("valorant_hub_tournament_active");
        localStorage.removeItem("valorant_hub_tournament_draft");

        if (form) {
          form.reset();
          form.classList.remove("was-validated");
        }

        for (var i = 0; i < inputs.length; i++) {
          if (inputs[i]) {
            inputs[i].classList.remove("is-valid");
            inputs[i].classList.remove("is-invalid");
          }
        }

        var errorMessages = document.querySelectorAll(".error-message");
        for (var j = 0; j < errorMessages.length; j++) {
          errorMessages[j].style.display = "none";
        }

        showEmptyState();
      }
    });
  }

  function formatDateIndo(dateStr) {
    if (!dateStr) return "";
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', options);
  }
});
