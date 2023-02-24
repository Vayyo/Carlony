(function () {
  "use strict";
  const menuIcon = document.querySelector("#menu-icon");
  const menuPopUp = document.querySelector(".menu");
  const modalsParent = document.querySelector(".modals");
  const modals = document.querySelectorAll(".modal");
  const signUp_logIn = document.querySelectorAll(".logIn-signUp");
  const purchaseModal = document.querySelector(".purchase-modal");
  const purchaseBtns = document.querySelectorAll(".purchase");
  const exitModalBtns = document.querySelectorAll(".exit");
  const brandsNav = document.querySelectorAll("[data-brand]");
  const extras = document.querySelectorAll("[data-extra]");
  const showFaqIcons = document.querySelectorAll(".faq .show");
  const cartItems = document.querySelector(".cart-items");
  const searchBtn = document.querySelector(".search-btn");
  const themeNav = document.querySelector(".theme");
  const loadingIcon = document.querySelector(".loading");
  let carModal;
  let currentItemName;
  let currentItemPrice;
  let currentItemDetails;
  let currentItemImgSrc;

  // Enabling Menu Icon
  menuIcon.addEventListener("click", () => {
    document.querySelector(".menu-popup").classList.toggle("active");

    //   Disabling Menu Icon
    document.body.addEventListener("click", (e) => {
      if (e.target.closest(".active") === null && e.target.id !== "menu-icon") {
        document.querySelector(".menu-popup").classList.remove("active");
      }
    });
  });

  // Opening and closing of navigation in header
  const nav = document.querySelector(".nav");
  const categories = document.querySelector(".categories");
  let navMenuOpened = false;

  categories.addEventListener("click", () => {
    navMenuOpened = !navMenuOpened;
    nav.classList.toggle("show-nav", navMenuOpened);
    categories.classList.toggle("active", navMenuOpened);

    document.body.addEventListener("click", (e) => {
      if (!e.target.closest(".sliding-nav")) {
        nav.classList.remove("show-nav");
        categories.classList.remove("active");
        navMenuOpened = false;
      }
    });
  });

  document.querySelector(".sliding-nav").addEventListener("mouseover", () => {
    if (!navMenuOpened) {
      nav.classList.add("show-nav");
      categories.classList.add("active");
    }
  });

  document.querySelector(".sliding-nav").addEventListener("mouseout", () => {
    if (!navMenuOpened) {
      nav.classList.remove("show-nav");
      categories.classList.remove("active");
    }
  });

  // Open the section for clicked car brand e.g tesla section
  brandsNav.forEach((each) => {
    each.addEventListener("click", (e) => {
      e.preventDefault();
      const clickedBrandNav = e.currentTarget.dataset.brand;
      [carModal] = [...modals].filter((ele) => ele.id === clickedBrandNav);

      showModal(carModal);
    });
  });

  // Open purchase modal to display full detail about a car
  purchaseBtns.forEach((each) => {
    each.addEventListener("click", (e) => {
      createPurchaseModal(e.target);
    });
  });

  // exit buttons to close modals
  exitModalBtns.forEach((each) => {
    each.addEventListener("click", (e) => {
      removeModal(e.target);
    });
  });

  //Open cart, search, reviews or faq section
  menuPopUp.addEventListener("click", (e) => {
    e.preventDefault();
    switch (e.target.id) {
      case "cart-icon":
        const cartModal = document.querySelector(".cart-modal");
        showModal(cartModal);
        break;
      case "menuSearchBtn":
        let userInputInMenu = document.querySelector("#menuSearch");
        let searchModal = document.querySelector(".search-modal");
        if (userInputInMenu.value.trim() === "") {
          showNotification("Invalid Search Value", "#EF403D");
          return;
        }
        runSearch(userInputInMenu);
        showModal(searchModal);

        userInputInMenu.value = "";
        break;
      case "reviewsNav":
        const reviewModal = document.querySelector(".reviews-modal");
        showModal(reviewModal);
        break;
      case "faqsNav":
        const faqModal = document.querySelector(".faq-modal");
        showModal(faqModal);
        break;
      default:
        break;
    }
  });

  // Add an item to cart(garage)
  purchaseModal.addEventListener("click", (e) => {
    if (e.target.id === "addToCart") {
      const newCartItem = `<div class="item">
      <div class="container">
      <div class="img">
      <img src="${currentItemImgSrc}" alt="">
      </div>
      <div class="info">
      <p class="name">${currentItemName}</p>
      <p class="color">White</p>
      <p class="price">$${currentItemPrice}</p>
      </div>
      </div>
      <i class="fa-solid fa-minus remove"></i>
      </div>`;

      const cart = document.querySelector(".cart-items");
      cart.insertAdjacentHTML("afterbegin", newCartItem);

      showNotification(`${currentItemName} added to Garage.`, "#96df73");
      cartItemsCalculation();
      removeModal(e.target);
    }
  });

  // Cart section functionality
  cartItems.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove")) {
      // Remove items from cart
      clearValues();
      e.target.parentElement.remove();
      // run calculations for remaining items in car
      cartItemsCalculation("minus");
    } else if (e.target.id === "apply") {
      e.preventDefault();
      // Applying discounts code for cart items
      applyDiscount();
    } else if (e.target.id === "checkout") {
      showNotification(`We'd get back to you...`, "#EF403D");
    }
  });

  // Show answer of faq questions
  [...showFaqIcons].forEach((showFaqIcon, index) => {
    showFaqIcon.addEventListener("click", () => {
      const faqAnswer = document.querySelectorAll(".faq .answer");
      if (showFaqIcon.classList.contains("fa-plus")) {
        // Close of all opened faqs first...
        [...faqAnswer].forEach((each) => (each.style.display = "none"));
        [...showFaqIcons].forEach((each) =>
          each.classList.replace("fa-minus", "fa-plus")
        );

        //show only the answer of clicked faq
        showFaqIcon.classList.replace("fa-plus", "fa-minus");
        faqAnswer[index].style.display = "block";
      } else {
        // close all faqs if one faq is closed
        showFaqIcon.classList.replace("fa-minus", "fa-plus");
        faqAnswer[index].style.display = "none";
      }
    });
  });

  // Show Sign In or Log In Modal
  signUp_logIn.forEach((each) => {
    each.addEventListener("click", (e) => {
      e.preventDefault();
      const accessModal = document.querySelector(".access-modal");
      const signUpModal = document.querySelector("#signUp");
      const logInModal = document.querySelector("#logIn");
      const signUpTab = document.querySelector(".signUp-tab");
      const logInTab = document.querySelector(".logIn-tab");
      const formInputs = document.querySelectorAll(
        ".access-modal input:not([type=submit])"
      );

      if (e.target.classList.contains("signUp-nav")) {
        logInModal.style.display = "none";
        logInTab.classList.remove("active");
        signUpModal.style.display = "block";
        signUpTab.classList.add("active");
        formInputs.forEach((each) => (each.value = ""));
        showModal(accessModal);
      } else if (e.target.classList.contains("logIn-nav")) {
        signUpModal.style.display = "none";
        signUpTab.classList.remove("active");
        logInModal.style.display = "block";
        logInTab.classList.add("active");
        formInputs.forEach((each) => (each.value = ""));
        showModal(accessModal);
      }
    });
  });

  // Apply Dark theme
  themeNav.addEventListener("click", (e) => {
    e.preventDefault();
    const root = document.documentElement;
    const prefersDarkTheme = window.matchMedia("(prefers-color-scheme:dark)");
    if (prefersDarkTheme.matches) {
      root.classList.toggle("light");
    } else {
      root.classList.toggle("dark");
    }

    // Change theme switch text to opposit theme
    if (root.classList.contains("light")) {
      themeNav.innerHTML = "Dark Mode";
    } else {
      themeNav.innerHTML = "Light Mode";
    }
  });

  // Search btn in search modal(**not menuPopup search btn**)
  searchBtn.addEventListener("click", (e) => {
    let searchModalInput = document.querySelector("#search-bar");
    if (searchModalInput.value.trim() === "") {
      showNotification("Invalid Search Value", "#EF403D");
      return;
    }
    loadingIcon.style.display = "grid";
    let loadingTime = Math.floor(Math.random() * (1200 - 200) + 200);
    setTimeout(() => {
      runSearch(searchModalInput);
      searchModalInput.value = "";
      loadingIcon.style.display = "none";
    }, loadingTime);
  });

  // ability to purchase from search result
  document.querySelector(".searches").addEventListener("click", (e) => {
    if (e.target.classList.contains("view")) {
      createPurchaseModal(e.target);
    }
  });

  // Extra Features
  extras.forEach((eachExtra) => {
    eachExtra.addEventListener("click", (e) => {
      const currentExtra = e.target.dataset.extra;
      switch (currentExtra) {
        case "whatsNew":
          e.preventDefault();
          removeModal(document.body);
          document.querySelector(".cars").scrollIntoView(true);
          break;
        case "bestSellers":
          e.preventDefault();
          removeModal(document.body);
          document.querySelector(".trends").scrollIntoView(true);
          break;
        case "accessories":
          e.preventDefault();
          removeModal(document.body);
          document.querySelector(".toy-cars").scrollIntoView(true);
          break;
        case "coupons":
          e.preventDefault();
          showNotification("No Coupons Available At The Moment", "#EF403D");
          break;
        case "siteName":
          window.location.reload();
          break;
        default:
          break;
      }
    });
  });

  /******* FUNCTIONS ******/
  // Function that shows any modal
  function showModal(currentModal) {
    document.querySelector(".nav").classList.remove("show-nav");
    menuPopUp.classList.remove("active");
    document.querySelector(".menu-popup").classList.remove("active");

    if (carModal && currentModal.id === "purchase-modal") {
      // Don't close the car modal, if purchase btn is clicked
      document.body.style.overflowY = "hidden";
      modalsParent.style.display = "block";
      currentModal.style.display = "block";
      return;
    }

    loadingIcon.style.display = "grid";
    let loadingTime = Math.floor(Math.random() * (1200 - 200) + 200);
    setTimeout(() => {
      [...modals].forEach((each) => (each.style.display = "none"));
      document.body.style.overflowY = "hidden";
      modalsParent.style.display = "block";
      currentModal.style.display = "block";
      loadingIcon.style.display = "none";
    }, loadingTime);
  }

  // Function that exits any modal
  function removeModal(clickedExit) {
    if (carModal && clickedExit.closest(".purchase-modal")) {
      // Close only purchase modal, leave others open
      purchaseModal.style.display = "none";
      clearValues();
    } else {
      // Close all opened modal
      carModal = null;
      clearValues();
      document.querySelector(".nav").classList.remove("show-nav");

      document.body.style.overflowY = "initial";
      [...modals].forEach((each) => (each.style.display = "none"));
      modalsParent.style.display = "none";
    }
  }

  // Notification panel for user interactions
  function showNotification(info, bg) {
    const notifPanel = document.querySelector(".notif-panel");
    const notification = document.querySelector(".notification");
    notification.innerHTML = info;
    notifPanel.style.backgroundColor = bg;
    notifPanel.style.left = "0%";
    setTimeout(() => {
      notifPanel.style.left = "-100%";
    }, 3000);
  }

  // SetUp purchase Modal with full details of clicked item
  function createPurchaseModal(foo) {
    // Each purchase btn of cars have the full details stored in its dataset.
    currentItemName = foo.dataset.name;
    currentItemPrice = foo.dataset.price;
    currentItemDetails = foo.dataset.details;
    currentItemImgSrc = foo.dataset.imgSrc;

    const itemImg = document.querySelector(".purchase-modal img");
    const itemName = document.querySelector(".purchase-modal .name");
    const itemDetails = document.querySelector(".purchase-modal .details");
    const itemPrice = document.querySelector(".purchase-modal .price");
    if (foo.parentElement.classList.contains("toy-info")) {
      // make toy image show at center
      itemImg.style.objectPosition = "center 55%";
    }

    itemImg.setAttribute("src", `${currentItemImgSrc}`);
    itemName.innerText = currentItemName;
    itemPrice.innerText = `$${currentItemPrice}`;
    itemDetails.innerText = `${currentItemDetails}`;

    showModal(purchaseModal);
  }

  // This has a use but i can't remember what for...sorry!
  function clearValues() {
    currentItemName = null;
    currentItemPrice = null;
    currentItemDetails = null;
    currentItemImgSrc = null;
  }

  // Calculation for all items in cart(garage)
  function cartItemsCalculation(operator = "plus") {
    let cartItemPrices = [...document.querySelectorAll(".cart-items .price")];

    //Getting the total of cart items prices...used 'slice' to remove $ sign from the prices
    cartItemPrices = cartItemPrices
      .map((each) => Number(each.innerText.slice(1)))
      .reduce((total, amount) => total + amount, 0);

    const discount = document.querySelector("#discount");
    const delivery = document.querySelector("#delivery");
    const subtotal = document.querySelector("#subtotal");
    const total = document.querySelector("#total");

    let discountValue = 0,
      deliveryValue = 0,
      subtotalValue = 0;

    if (operator === "minus") {
      subtotalValue = cartItemPrices - subtotalValue;
    } else {
      discountValue = +discount.innerHTML;
      deliveryValue = +delivery.innerHTML;
      subtotalValue = cartItemPrices + subtotalValue;
    }

    discount.innerHTML = discountValue;
    delivery.innerHTML = deliveryValue;
    subtotal.innerHTML = subtotalValue;
    total.innerHTML = subtotalValue + deliveryValue - discountValue;
  }

  // Apply discount to cart checkout
  function applyDiscount() {
    //free discount codes to apply
    const discountCodes = [
      {
        name: "toy",
        value: 25,
      },
      {
        name: "tesla",
        value: 4550,
      },
      {
        name: "benz",
        value: 4750,
      },
      {
        name: "bmw",
        value: 5000,
      },
      {
        name: "nissan",
        value: 3100,
      },
      {
        name: "porsche",
        value: 5850,
      },
      {
        name: "audi",
        value: 4100,
      },
      {
        name: "ferrari",
        value: 5900,
      },
      {
        name: "ford",
        value: 4500,
      },
    ];

    const inputDiscount = document
      .querySelector("#inputDiscount")
      .value.toLowerCase();

    const cartItemNames = [
      ...document.querySelectorAll(".cart-items > .item .name"),
    ];

    // To use discount code like 'Tesla', a tesla must be present in the cart
    const codeInCartItem = cartItemNames
      .map((each) => each.innerText.toLowerCase())
      .find((each) => each.split(" ").includes(inputDiscount));

    // check if the inputted code matches listed discount code
    let [discountCode] = discountCodes.filter((e) => e.name === inputDiscount);
    if (!discountCode || !codeInCartItem) {
      showNotification("Discount Code Invalid", "#EF403D");
      document.querySelector("#inputDiscount").value = "";
      return;
    }

    document.querySelector("#discount").innerHTML = discountCode
      ? discountCode.value
      : 0;
    showNotification("Discount Successfully Added", "#96df73");
    cartItemsCalculation();
    document.querySelector("#inputDiscount").value = "";
  }

  // Show products that matches userSearchInput
  function runSearch(inputParameter) {
    // Remove all previous search results
    let searches = document.querySelector(".searches");
    while (searches.firstElementChild) {
      searches.removeChild(searches.lastElementChild);
    }

    let searchWord = document.querySelector(".search-word span");
    let carDatabase = document.querySelectorAll("[data-name]");

    // Check car database for search input
    carDatabase.forEach((each, index) => {
      let carNameInDatabase = each.dataset.name.toLowerCase();
      let userSearch = inputParameter.value.toLowerCase().trim();
      if (carNameInDatabase.includes(userSearch)) {
        let resultCarName = carDatabase[index].dataset.name;
        let resultCarDetails = carDatabase[index].dataset.details;
        let resultCarPrice = carDatabase[index].dataset.price;
        let resultCarImgSrc = carDatabase[index].dataset.imgSrc;
        let template = `
           <div class="car">
           <div class="img">
           <img src="${resultCarImgSrc}" alt="" />
           </div>
           <div class="info">
           <p class="name">${resultCarName}</p>
           <button class="view btn purchase" data-name="${resultCarName}" data-details="${resultCarDetails}" data-price="${resultCarPrice}" data-img-src="${resultCarImgSrc}">View</button>
           </div>`;

        searches.insertAdjacentHTML("beforeend", template);
      }
    });
    carModal = true;
    searchWord.innerText = inputParameter.value;
    searchWord.parentElement.style.visibility = "visible";

    // if searches.firstElementChild is null after running userSearchInput through database then the search is invalid
    if (searches.firstElementChild === null) {
      showNotification(`No results for '${inputParameter.value}'`, "#EF403D");
    }
  }
})();
