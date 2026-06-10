/* ==========================================================================
   JUHR — site behavior (vanilla JavaScript, no dependencies)

   Features:
     1. Mobile navigation toggle
     2. Article search box (filters .searchable items on the page)
     3. Archive filter by year
     4. Back-to-top button
   Smooth scrolling for in-page anchors is handled in CSS
   (html { scroll-behavior: smooth; }).
   ========================================================================== */

(function () {
  "use strict";

  /* 1. Mobile navigation toggle ------------------------------------------ */

  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* 2. Article search ----------------------------------------------------
     Any page with <input id="article-search"> filters elements that carry
     the .searchable class by their text content. */

  var searchBox = document.getElementById("article-search");

  if (searchBox) {
    var searchables = document.querySelectorAll(".searchable");
    var noResults = document.getElementById("no-results");

    searchBox.addEventListener("input", function () {
      var query = searchBox.value.trim().toLowerCase();
      var visible = 0;

      searchables.forEach(function (item) {
        var match = item.textContent.toLowerCase().indexOf(query) !== -1;
        item.style.display = match ? "" : "none";
        if (match) visible++;
      });

      if (noResults) {
        noResults.style.display = visible === 0 ? "block" : "none";
      }
    });
  }

  /* 3. Archive filter by year --------------------------------------------
     Buttons inside .filter-bar carry data-year="all" | "2026" | ... and
     show/hide .archive-year sections with a matching data-year. */

  var filterBar = document.querySelector(".filter-bar");

  if (filterBar) {
    var filterButtons = filterBar.querySelectorAll("button[data-year]");
    var yearSections = document.querySelectorAll(".archive-year[data-year]");

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var year = button.getAttribute("data-year");

        filterButtons.forEach(function (b) { b.classList.remove("active"); });
        button.classList.add("active");

        yearSections.forEach(function (section) {
          var show = year === "all" || section.getAttribute("data-year") === year;
          section.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* 4. Back-to-top button ------------------------------------------------ */

  var backToTop = document.getElementById("back-to-top");

  if (backToTop) {
    window.addEventListener("scroll", function () {
      backToTop.classList.toggle("visible", window.scrollY > 400);
    });

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
