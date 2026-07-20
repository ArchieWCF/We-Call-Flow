document.addEventListener("DOMContentLoaded", function () {

      var menuBtn = document.getElementById("menuBtn");
      var navLinks = document.getElementById("navLinks");

      function setMenuState(open) {
        if (!menuBtn || !navLinks) return;
        navLinks.classList.toggle("open", open);
        menuBtn.classList.toggle("open", open);
        menuBtn.setAttribute("aria-expanded", String(open));
      }

      if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", function () {
          setMenuState(!navLinks.classList.contains("open"));
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
          link.addEventListener("click", function () {
            setMenuState(false);
          });
        });
      }

      var billingButtons = document.querySelectorAll("[data-billing]");
      var priceElements = document.querySelectorAll(".price[data-monthly][data-annual]");

      billingButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          var mode = button.dataset.billing;

          billingButtons.forEach(function (item) {
            item.classList.toggle("active", item === button);
          });

          priceElements.forEach(function (price) {
            if (mode === "annual") {
              price.innerHTML = "£" + Number(price.dataset.annual).toLocaleString("en-GB") + " <small>/year</small>";
            } else {
              price.innerHTML = "£" + Number(price.dataset.monthly).toFixed(2) + " <small>/month</small>";
            }
          });
        });
      });

      var year = document.getElementById("year");
      if (year) year.textContent = new Date().getFullYear();

      var jobValue = document.getElementById("jobValue");
      var missedCalls = document.getElementById("missedCalls");
      var closeRate = document.getElementById("closeRate");
      var annualLoss = document.getElementById("annualLoss");
      var monthlyLoss = document.getElementById("monthlyLoss");

      function updateCalculator() {
        if (!jobValue || !missedCalls || !closeRate || !annualLoss || !monthlyLoss) return;
        var job = Math.max(0, Number(jobValue.value) || 0);
        var missed = Math.max(0, Number(missedCalls.value) || 0);
        var rate = Math.min(100, Math.max(0, Number(closeRate.value) || 0)) / 100;
        var annual = job * missed * rate * 52;
        var monthly = annual / 12;
        annualLoss.textContent = annual.toLocaleString("en-GB", {
          style: "currency", currency: "GBP", maximumFractionDigits: 0
        });
        monthlyLoss.textContent = "Approximately " + monthly.toLocaleString("en-GB", {
          style: "currency", currency: "GBP", maximumFractionDigits: 0
        }) + " per month.";
      }

      [jobValue, missedCalls, closeRate].forEach(function (input) {
        if (input) input.addEventListener("input", updateCalculator);
      });
      updateCalculator();

      var dateInput = document.getElementById("bookingDate");
      var timeSelect = document.getElementById("bookingTime");
      if (dateInput) {
        var today = new Date();
        dateInput.min = today.toISOString().split("T")[0];
        dateInput.addEventListener("change", function () {
          if (!timeSelect || !dateInput.value) return;
          var selected = new Date(dateInput.value + "T12:00:00");
          var weekend = selected.getDay() === 0 || selected.getDay() === 6;
          Array.from(timeSelect.options).forEach(function (option) {
            if (!option.value) return;
            var hour = Number(option.value.slice(0, 2));
            option.disabled = weekend && hour >= 17;
          });
          if (timeSelect.selectedOptions[0] && timeSelect.selectedOptions[0].disabled) {
            timeSelect.value = "";
          }
        });
      }

      var bookingForm = document.getElementById("bookingForm");
      var bookingMessage = document.getElementById("bookingMessage");
      if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
          event.preventDefault();
          if (bookingMessage) {
            bookingMessage.textContent = "Appointment request captured in this preview. Once Cal.com is connected, this button will confirm the live booking and send calendar invitations.";
          }
        });
      }
    });
