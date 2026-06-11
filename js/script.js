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

  /* 5. Homepage: transparent nav becomes solid after scrolling ----------- */

  var homeNav = document.querySelector(".home .site-nav");

  if (homeNav) {
    var updateNav = function () {
      homeNav.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", updateNav);
    updateNav();
  }

  /* 6. Homepage hero: generative "growing plants" animation ---------------
     Abstract branches grow upward from the bottom of the canvas, curve
     organically, fork into side shoots, and end in small seed-head blooms.
     Drifting spores rise through the scene. Trails fade slowly, giving a
     layered, abstract-art look. Honors prefers-reduced-motion by rendering
     a single static frame instead of animating. */

  var canvas = document.getElementById("hero-canvas");

  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var W = 0;
    var H = 0;
    var maxBranches = 16;
    var maxSpores = 36;
    var branches = [];
    var spores = [];
    var PALETTE = ["#4caf7d", "#6fc796", "#3d8f8f", "#a3d9ad", "#5d9ec9", "#8bc4a0"];

    var paintBackground = function (alpha) {
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "rgba(8, 19, 29, " + alpha + ")");
      g.addColorStop(0.6, "rgba(9, 22, 24, " + alpha + ")");
      g.addColorStop(1, "rgba(10, 26, 18, " + alpha + ")");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };

    var resize = function () {
      var dpr = window.devicePixelRatio || 1;
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Keep the garden equally dense on wide desktop screens.
      maxBranches = Math.max(14, Math.round(W / 85));
      maxSpores = Math.max(30, Math.round(W / 40));
      paintBackground(1);
    };

    var pick = function (list) {
      return list[Math.floor(Math.random() * list.length)];
    };

    var spawnBranch = function (parent) {
      if (parent) {
        branches.push({
          x: parent.x,
          y: parent.y,
          angle: parent.angle + (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.6),
          speed: parent.speed * 0.92,
          width: parent.width * 0.62,
          life: parent.life * 0.55,
          color: Math.random() < 0.3 ? pick(PALETTE) : parent.color,
          depth: parent.depth + 1
        });
      } else {
        branches.push({
          x: Math.random() * W,
          y: H + 10,
          angle: -Math.PI / 2 + (Math.random() - 0.5) * 0.5,
          speed: 1.1 + Math.random() * 0.9,
          width: 2 + Math.random() * 1.6,
          life: 130 + Math.random() * 140,
          color: pick(PALETTE),
          depth: 0
        });
      }
    };

    var bloom = function (b) {
      // Seed-head burst at the branch tip.
      var n = 5 + Math.floor(Math.random() * 5);
      for (var k = 0; k < n; k++) {
        var a = Math.random() * Math.PI * 2;
        var r = 2 + Math.random() * 7;
        ctx.globalAlpha = 0.25 + Math.random() * 0.45;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x + Math.cos(a) * r, b.y + Math.sin(a) * r,
                0.8 + Math.random() * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    var stepBranches = function () {
      for (var i = branches.length - 1; i >= 0; i--) {
        var b = branches[i];
        var nx = b.x + Math.cos(b.angle) * b.speed;
        var ny = b.y + Math.sin(b.angle) * b.speed;

        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = b.color;
        ctx.lineWidth = Math.max(0.4, b.width);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        ctx.globalAlpha = 1;

        b.x = nx;
        b.y = ny;
        b.angle += (Math.random() - 0.5) * 0.22;       // organic wobble
        b.angle += (-Math.PI / 2 - b.angle) * 0.02;    // gentle upward bias
        b.width *= 0.996;
        b.life--;

        if (b.depth < 3 && Math.random() < 0.022) {
          spawnBranch(b);
        }

        if (b.life <= 0 || b.y < -20 || b.x < -40 || b.x > W + 40) {
          if (b.y > -20) bloom(b);
          branches.splice(i, 1);
        }
      }

      if (branches.length < maxBranches && Math.random() < 0.1) {
        spawnBranch(null);
      }
    };

    var stepSpores = function () {
      while (spores.length < maxSpores) {
        spores.push({
          x: Math.random() * W,
          y: H + Math.random() * H * 0.3,
          vy: 0.25 + Math.random() * 0.55,
          sway: 0.4 + Math.random() * 0.9,
          phase: Math.random() * Math.PI * 2,
          size: 0.6 + Math.random() * 1.5,
          color: pick(PALETTE)
        });
      }

      for (var i = spores.length - 1; i >= 0; i--) {
        var s = spores[i];
        s.y -= s.vy;
        s.phase += 0.02;
        var x = s.x + Math.sin(s.phase) * s.sway * 14;

        ctx.globalAlpha = 0.4;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        if (s.y < -10) spores.splice(i, 1);
      }
    };

    var animate = function () {
      paintBackground(0.05); // low-alpha repaint leaves slowly fading trails
      stepBranches();
      stepSpores();
      requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      // Static frame: pre-grow a garden without animating.
      for (var t = 0; t < 10; t++) spawnBranch(null);
      for (var f = 0; f < 400; f++) stepBranches();
    } else {
      for (var p = 0; p < 4; p++) spawnBranch(null);
      animate();
    }
  }
})();
