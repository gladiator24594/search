const appliedFiltersContainer = document.querySelector('.applied-filters-container');
const appliedFiltersBox = document.querySelector('.applied-filters-text-box');

const enableFilterRemoval = () => {
  const svgs = document.querySelectorAll('.applied-filters-text svg');
  const container = document.querySelector('.applied-filters-container');

  for (const svg of svgs) {
    svg.addEventListener('click', () => {
      svg.parentElement.remove();

      // hide container if no spans left
      if (!container.querySelector('.applied-filters-text')) {
        container.style.display = 'none';
      }
    });
  }
};

const createFilterSpan = (text) => {
  const span = document.createElement('span');
  span.className = 'applied-filters-text';
  span.innerHTML = `${text} <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m256-200-56-56 224-224-224-224 56-56 224 224  224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;
  
  span.querySelector('svg').addEventListener('click', () => {
    // Remove the span
    span.remove();
    
    // Uncheck the corresponding checkbox
    const checkboxes = document.querySelectorAll('.checkbox-styling');
    for (const checkbox of checkboxes) {
      if (checkbox.nextElementSibling.textContent.trim() === text) {
        checkbox.checked = false;
        break;
      }
    }

    toggleContainerDisplay();
  });

  return span;
};

const toggleContainerDisplay = () => {
  appliedFiltersContainer.style.display = appliedFiltersBox.children.length ? 'flex' : 'none';
};


const handleCheckboxes = () => {
  for (const checkbox of document.querySelectorAll('.checkbox-styling')) {
    checkbox.addEventListener('change', e => {
      const label = e.target.nextElementSibling.textContent;

      if (checkbox.checked) {
        appliedFiltersBox.appendChild(createFilterSpan(label));
      } else {
        for (const span of appliedFiltersBox.children) {
          if (span.textContent.trim() === label) {
            span.remove();
            break;
          }
        }
      }

      toggleContainerDisplay();
    });
  }
};

const sortBy = () => {
  const boxes = document.querySelectorAll(".sort-by-box");

  boxes.forEach(box => {
    const sortInput = box.querySelector(".sort-by-input");
    const optionsContainer = box.querySelector(".sort-by-options-continer");
    const options = box.querySelectorAll(".sort-by-options li");
    const checkSVG = box.querySelector("li svg");

    sortInput.addEventListener("focus", () => {
      optionsContainer.style.display = "flex";
    });

    options.forEach(li => {
      li.addEventListener("click", () => {
        if (checkSVG) li.appendChild(checkSVG);
        sortInput.value = li.textContent.trim();
        optionsContainer.style.display = "none";
      });
    });

    document.addEventListener("click", e => {
      if (!sortInput.contains(e.target) && !optionsContainer.contains(e.target)) {
        optionsContainer.style.display = "none";
      }
    });
  });
};

const initHotelDropdown = () => {
  const hotelList = [
    "Rixos Dubai",
    "Hilton Marina",
    "Jumeirah Beach",
    "Atlantis Palm",
    "Taj Exotica Resort & Spa, The Palm, Dubai",
    "Address Sky View, Downtown Dubai Hotel"
  ];

  const dropdowns = document.querySelectorAll(".hotel-name-box");

  dropdowns.forEach(dropdown => {
    const input = dropdown.querySelector(".hotel-input");
    const container = dropdown.querySelector(".hotel-options-continer");
    const hotelOptions = dropdown.querySelector(".hotel-options");

    const renderList = (list) => {
      hotelOptions.innerHTML = list.length
        ? list.map(h => `<li>${h}</li>`).join("")
        : `<p>Hotel not found</p>`;
    };

    renderList(hotelList);

    input.addEventListener("focus", () => {
      container.style.display = "flex";
    });

    input.addEventListener("input", () => {
      const value = input.value.toLowerCase();
      const filtered = hotelList.filter(h => h.toLowerCase().includes(value));
      renderList(filtered);
    });

    hotelOptions.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        input.value = e.target.textContent;
        container.style.display = "none";
      }
    });

    document.addEventListener("click", e => {
      if (!container.contains(e.target) && e.target !== input) {
        container.style.display = "none";
      }
    });
  });
};

const priceInfo = () => {
    const infoIcon = document.querySelector('.price-details svg');
    const infoBox = document.querySelector('.continer-price-info');

    infoIcon.addEventListener('mouseenter', () => {
    infoBox.style.display = 'flex';
    });

    infoIcon.addEventListener('mouseleave', () => {
    setTimeout(() => {
        if (!infoBox.matches(':hover')) infoBox.style.display = 'none';
    }, 150);
    });

    infoBox.addEventListener('mouseleave', () => {
    infoBox.style.display = 'none';
    });
}

const handleMobileFilters = () => {
    const filterBtn = document.querySelector('.filter-box');
    const filterContainer = document.querySelector('.filter-container');
    const secondBackground = document.querySelector('.second-background');
    const headerBar = document.querySelector('.header-bar');
    const lineDivider = document.querySelector('.line-divider');
    const applyBtn = filterContainer.querySelector('.filters-apply-btn');

    // Store original display of second-background children
    const originalDisplay = [];
    for (const el of secondBackground.children) {
        originalDisplay.push({ el, display: el.style.display || '' });
    }

    // Show filter container
    filterBtn.addEventListener('click', () => {
        filterContainer.style.display = 'block';
        for (const el of secondBackground.children) {
            if (el !== filterContainer) el.style.display = 'none';
        }
        if (headerBar) headerBar.style.display = 'none';
        if (lineDivider) lineDivider.style.display = 'none';
        filterBtn.style.display = 'none';
    });

    // Close container (close SVG)
    const closeBtn = filterContainer.querySelector('div.controles > .controls-left span svg');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            filterContainer.style.display = 'none';
            if (headerBar) headerBar.style.display = '';
            if (lineDivider) lineDivider.style.display = '';
            filterBtn.style.display = '';
            for (const item of originalDisplay) {
                item.el.style.display = item.display;
            }
        });
    }

    // Delete/Clear filters (delete SVG)
    const deleteBtn = filterContainer.querySelector('div.controles > span svg');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            // Uncheck all checkboxes
            const checkboxes = filterContainer.querySelectorAll('input.checkbox-styling');
            for (const cb of checkboxes) cb.checked = false;

            // Reset "Sort by" input to default
            const sortInput = filterContainer.querySelector('.sort-by-input');
            if (sortInput) sortInput.value = 'popularity';

            // Clear "Hotel name" input
            const hotelInput = filterContainer.querySelector('.hotel-input');
            if (hotelInput) hotelInput.value = '';
        });
    }

    // Apply button
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            // You can optionally save the current state here if needed

            // Close container and restore layout
            filterContainer.style.display = 'none';
            if (headerBar) headerBar.style.display = '';
            if (lineDivider) lineDivider.style.display = '';
            filterBtn.style.display = '';
            for (const item of originalDisplay) {
                item.el.style.display = item.display;
            }
        });
    }
};



priceInfo();
initHotelDropdown();
enableFilterRemoval();
handleCheckboxes();
sortBy();
handleMobileFilters();





const handleSearchModifer = () => {
    const destination = document.querySelector(".destination");
    const roomGuests = document.querySelector(".room-guests");
    const guestCitizenship = document.querySelector(".guest-citizenship");
    const destInput = document.getElementById("dest-input");
    const roomGuestsInput = document.getElementById("room-guests-input");
    const guestCitizenshipInput = document.getElementById("guest-citizenship-input");
    const destContainer = document.querySelector(".destnation-conatiner");
    const regionContainer = document.querySelectorAll(".dest-list")[0];
    const hotelsContainer = document.querySelectorAll(".dest-list")[1];
    const optionsCitizenship = document.querySelector(".options");
    const guestContainer = document.querySelector(".guest-citizenship-conatiner");
    const guestRoomsContainer = document.querySelector(".guest-room-conatiner");
    const doneBtn = document.querySelector(".done-btn");
    const datepicker = document.querySelector(".datepicker");
    const datePickerInput = document.getElementById("datepicker-input");
    const calendarContainer = datepicker.querySelector(".calendar-container");
    const leftCalendar = datepicker.querySelector(".left-side");
    const rightCalendar = datepicker.querySelector(".right-side");
    const prevButton = datepicker.querySelector(".prev");
    const nextButton = datepicker.querySelector(".next");
    const selectionEl = datepicker.querySelector(".selection");
    const applyButton = datepicker.querySelector(".apply");
    const checkIn = document.querySelector(".Check-in"); 
    const checkOut = document.querySelector(".Check-out"); 
    const numOfNights = document.getElementById("num_of_night");



    const hotels_arr = [
        "SLS Dubai Hotel & Residences, United Arab Emirates",
        "Address Sky View, Downtown Dubai Hotel, United Arab Emirates",
        "V Hotel Dubai Curio Collection by Hilton Hotel, United Arab Emirates",
        "Hilton Dubai Palm Jumeirah, United Arab Emirates",
        "Millennium Plaza Downtown Hotel",
        "Paramount Hotel Dubai",
        "Paramount Hotel midtown",
        "Me dubai by meila",
        "the lana",
        "atlantis the royal",
        "Hotel 25hours Hotel Dubai One Central",
        "Address Beach Resort Hotel"
    ];

    const region_arr = [
    "New York",
    "London",
    "Paris",
    "Tokyo",
    "Dubai",
    "Singapore",
    "Los Angeles",
    "Sydney",
    "Berlin",
    "Rome",
    "Barcelona",
    "Moscow",
    "Toronto",
    "Chicago",
    "Istanbul",
    "Hong Kong",
    "Bangkok",
    "Amsterdam",
    "Vienna",
    "Madrid",
    "Seoul",
    "Mexico City",
    "Mumbai",
    "Cairo",
    "Kuala Lumpur",
    "Rio de Janeiro",
    "Cape Town",
    "San Francisco",
    "Athens",
    "Prague"
    ];

    const countries = [
        "Afghanistan",
        "Albania",
        "Algeria",
        "American Samoa",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antarctica",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas (the)",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia (Plurinational State of)",
        "Bonaire, Sint Eustatius and Saba",
        "Bosnia and Herzegovina",
        "Botswana",
        "Bouvet Island",
        "Brazil",
        "British Indian Ocean Territory (the)",
        "Brunei Darussalam",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Cayman Islands (the)",
        "Central African Republic (the)",
        "Chad",
        "Chile",
        "China",
        "Christmas Island",
        "Cocos (Keeling) Islands (the)",
        "Colombia",
        "Comoros (the)",
        "Congo (the Democratic Republic of the)",
        "Congo (the)",
        "Cook Islands (the)",
        "Costa Rica",
        "Croatia",
        "Cuba",
        "Curaçao",
        "Cyprus",
        "Czechia",
        "Côte d'Ivoire",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic (the)",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Eswatini",
        "Ethiopia",
        "Falkland Islands (the) [Malvinas]",
        "Faroe Islands (the)",
        "Fiji",
        "Finland",
        "France",
        "French Guiana",
        "French Polynesia",
        "French Southern Territories (the)",
        "Gabon",
        "Gambia (the)",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guadeloupe",
        "Guam",
        "Guatemala",
        "Guernsey",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Heard Island and McDonald Islands",
        "Holy See (the)",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran (Islamic Republic of)",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Korea (the Democratic People's Republic of)",
        "Korea (the Republic of)",
        "Kuwait",
        "Kyrgyzstan",
        "Lao People's Democratic Republic (the)",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macao",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands (the)",
        "Martinique",
        "Mauritania",
        "Mauritius",
        "Mayotte",
        "Mexico",
        "Micronesia (Federated States of)",
        "Moldova (the Republic of)",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands (the)",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger (the)",
        "Nigeria",
        "Niue",
        "Norfolk Island",
        "Northern Mariana Islands (the)",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestine, State of",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines (the)",
        "Pitcairn",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Republic of North Macedonia",
        "Romania",
        "Russian Federation (the)",
        "Rwanda",
        "Réunion",
        "Saint Barthélemy",
        "Saint Helena, Ascension and Tristan da Cunha",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Martin (French part)",
        "Saint Pierre and Miquelon",
        "Saint Vincent and the Grenadines",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Sint Maarten (Dutch part)",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Georgia and the South Sandwich Islands",
        "South Sudan",
        "Spain",
        "Sri Lanka",
        "Sudan (the)",
        "Suriname",
        "Svalbard and Jan Mayen",
        "Sweden",
        "Switzerland",
        "Syrian Arab Republic",
        "Taiwan",
        "Tajikistan",
        "Tanzania, United Republic of",
        "Thailand",
        "Timor-Leste",
        "Togo",
        "Tokelau",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks and Caicos Islands (the)",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates (the)",
        "United Kingdom of Great Britain and Northern Ireland (the)",
        "United States Minor Outlying Islands (the)",
        "United States of America (the)",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Venezuela (Bolivarian Republic of)",
        "Viet Nam",
        "Virgin Islands (British)",
        "Virgin Islands (U.S.)",
        "Wallis and Futuna",
        "Western Sahara",
        "Yemen",
        "Zambia",
        "Zimbabwe",
        "Åland Islands"
    ];
    

    const showRoomsData = () => {

        const closeYearsOnScroll = () => {
            const handleScroll = (e) => {
                const target = e.target;
                // Only check closest if target is an Element
                if (target instanceof Element) {
                    const scrollInsideYears = target.closest('.years-container');
                    if (!scrollInsideYears) {
                        document.querySelectorAll('.years-container').forEach(y => y.hidden = true);
                    }
                } else {
                    // fallback for window/document scroll
                    document.querySelectorAll('.years-container').forEach(y => y.hidden = true);
                }
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            document.addEventListener('wheel', handleScroll, { passive: true });
            document.addEventListener('touchmove', handleScroll, { passive: true });

            if (guestRoomsContainer) guestRoomsContainer.addEventListener('scroll', handleScroll, { passive: true });
        };


        // Adult Counter Functionality
        const initAdultBox = (box) => {
            const decrement = box.querySelector(".decrement");
            const increment = box.querySelector(".increment");
            const input = box.querySelector(".counter-display");
            const decSvg = decrement.querySelector("svg");
            const incSvg = increment.querySelector("svg");
            const MIN_ADULTS = 1;
            const MAX_ADULTS = 6;
            input.value = 2;

            const updateColor = (val) => {
                decSvg.classList.toggle("disabled", val <= MIN_ADULTS);
                incSvg.classList.toggle("disabled", val >= MAX_ADULTS);
            };
            updateColor(2);

            decrement.addEventListener("click", (e) => {
                e.stopPropagation();
                let val = parseInt(input.value);
                if (val > MIN_ADULTS) val--;
                input.value = val;
                updateColor(val);
            });

            increment.addEventListener("click", (e) => {
                e.stopPropagation();
                let val = parseInt(input.value);
                if (val < MAX_ADULTS) val++;
                input.value = val;
                updateColor(val);
            });
        };

        // Child Selection Functionality
        const initChildSelect = (childSelect) => {
            let childInput = childSelect.querySelector(".add-a-child-defulat-input");
            const selectedContainer = childSelect.closest(".children-number").querySelector(".selected-child-age-container");
            const yearsContainer = childSelect.querySelector(".years-container");
            const MAX_CHILDREN = 4;

            const hideAllYears = () => {
                document.querySelectorAll(".years-container").forEach((y) => (y.hidden = true));
            };

            const showYears = () => {
                hideAllYears();
                document.body.appendChild(yearsContainer);
                const rect = childInput.getBoundingClientRect();
                yearsContainer.style.position = "absolute";
                yearsContainer.style.top = rect.bottom + window.scrollY + "px";
                yearsContainer.style.left = rect.left + window.scrollX + "px";
                yearsContainer.style.zIndex = 9999;
                yearsContainer.hidden = false;
            };

            const createDefaultInput = () => {
                const input = document.createElement("input");
                input.type = "text";
                input.value = "Add a child";
                input.readOnly = true;
                input.classList.add("add-a-child-defulat-input");
                input.addEventListener("click", (e) => {
                    e.stopPropagation();
                    childInput = input;
                    showYears();
                });
                return input;
            };

            const createPlusInput = () => {
                const input = document.createElement("input");
                input.type = "text";
                input.value = "+";
                input.readOnly = true;
                input.classList.add("add-a-child-plus-input");
                input.addEventListener("click", (e) => {
                    e.stopPropagation();
                    childInput = input;
                    showYears();
                });
                return input;
            };

            const addChild = (year) => {
                if (selectedContainer.children.length >= MAX_CHILDREN) return;

                const childDiv = document.createElement("div");
                childDiv.classList.add("child-age-selected");
                childDiv.innerHTML = `
                    <span><span class="child-age">${year}</span> years old</span>
                    <button class="cancel-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 
                            224-224 56 56-224 224 224 224-56 56-224-224-224 
                            224Z"/>
                        </svg>
                    </button>
                `;
                selectedContainer.appendChild(childDiv);

                if (childInput.classList.contains("add-a-child-defulat-input") && window.innerWidth > 600) {
                    const plusInput = createPlusInput();
                    childSelect.replaceChild(plusInput, childInput);
                    childInput = plusInput;
                }

                if (selectedContainer.children.length >= MAX_CHILDREN) {
                    childInput.style.display = "none";
                }

                childDiv.querySelector(".cancel-btn").addEventListener("click", (e) => {
                    e.stopPropagation();
                    childDiv.remove();
                    if (selectedContainer.children.length === 0) {
                        const defaultInput = createDefaultInput();
                        childSelect.replaceChild(defaultInput, childInput);
                        childInput = defaultInput;
                    } else if (childInput.style.display === "none") {
                        childInput.style.display = "block";
                    }
                });
            };

            for (const li of yearsContainer.querySelectorAll("li")) {
                li.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const year = li.textContent.replace(" years old", "");
                    addChild(year);
                    yearsContainer.hidden = true;
                });
            }

            childInput.addEventListener("click", (e) => {
                e.stopPropagation();
                showYears();
            });

            yearsContainer.addEventListener("click", (e) => e.stopPropagation());
        };

        // Room Functionality
        const initRoomFunctionality = () => {
            const addRoomBtn = document.querySelector(".add-room-btn");
            const submitAddRoom = document.querySelector(".submit-add-room");
            const MAX_ROOMS = 5;
            let usedRoomNumbers = [1];

            const updateRoomTitles = () => {
                const rooms = document.querySelectorAll(".room-container");
                for (let i = 0; i < rooms.length; i++) {
                    rooms[i].querySelector(".room-title span").textContent = i + 1;
                    const divider = rooms[i].querySelector(".guest-room-line-divider");
                    if (divider) divider.style.display = i === 0 ? "none" : "block";
                }
                usedRoomNumbers = Array.from({ length: rooms.length }, (_, i) => i + 1);
            };

            const updateAddRoomBtnState = () => {
                const isMax = usedRoomNumbers.length >= MAX_ROOMS;
                addRoomBtn.style.opacity = isMax ? 0 : 1;
                addRoomBtn.style.pointerEvents = isMax ? "none" : "auto";
            };

            const getNextRoomNumber = () => {
                for (let i = 1; i <= MAX_ROOMS; i++) {
                    if (!usedRoomNumbers.includes(i)) return i;
                }
                return null;
            };

            for (const room of document.querySelectorAll(".room-container")) {
                for (const box of room.querySelectorAll(".adults-number")) initAdultBox(box);
                for (const child of room.querySelectorAll(".child-select")) initChildSelect(child);
            }

            addRoomBtn.addEventListener("click", () => {
                if (usedRoomNumbers.length >= MAX_ROOMS) return;

                const roomNumber = getNextRoomNumber();
                if (!roomNumber) return;

                usedRoomNumbers.push(roomNumber);
                usedRoomNumbers.sort((a, b) => a - b);

                const roomContainer = document.createElement("div");
                roomContainer.classList.add("room-container");
                roomContainer.innerHTML = `
                    <div class="guest-room-line-divider"></div>
                    <div class="room-title">
                        <h1>Room <span>${roomNumber}</span></h1>
                        <button class="remove-added-room-btn">remove</button>
                    </div>
                    <div class="guest-info">
                        <div class="adults-box">
                            <h3>Adults</h3>
                            <div class="adults-number">
                                <button class="decrement"><svg xmlns="http://www.w3.org/2000/svg" height="24px" 
                                viewBox="0 -960 960 960" width="24px"><path d="M200-440v-80h560v80H200Z"/></svg></button>
                                <input type="text" class="counter-display" value="2" readonly>
                                <button class="increment"><svg xmlns="http://www.w3.org/2000/svg" height="24px" 
                                viewBox="0 -960 960 960" width="24px"><path d="M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z"/></svg></button>
                            </div>
                        </div>
                        <div class="children-box">
                            <h3>Children</h3>
                            <div class="children-number">
                                <div class="selected-child-age-container"></div>
                                <div class="child-select">
                                    <input type="text" value="Add a child" readonly class="add-a-child-defulat-input">
                                    <div class="years-container" hidden>
                                        <ul class="years-container-options">
                                            ${Array.from({ length: 18 }, (_, i) => `<li>${i} years old</li>`).join('')}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                submitAddRoom.before(roomContainer);

                for (const box of roomContainer.querySelectorAll(".adults-number")) initAdultBox(box);
                for (const child of roomContainer.querySelectorAll(".child-select")) initChildSelect(child);

                const removeBtn = roomContainer.querySelector(".remove-added-room-btn");
                removeBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    roomContainer.remove();
                    updateRoomTitles();
                    updateAddRoomBtnState();
                });

                updateRoomTitles();
                updateAddRoomBtnState();
            });

            updateAddRoomBtnState();
        };

        // Guest Container Handling
        guestRoomsContainer.style.display = "none";

        roomGuestsInput.addEventListener("focus", (e) => {
            e.stopPropagation();
            guestRoomsContainer.style.display = "flex";
        });

        doneBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            let totalGuests = 0;
            const roomsList = document.querySelectorAll(".room-container");

            for (const room of roomsList) {
                const adults = parseInt(room.querySelector(".adults-number .counter-display").value) || 0;
                const children = room.querySelectorAll(".child-age-selected").length;
                totalGuests += adults + children;
            }

            const rooms = roomsList.length;
            let resultText = rooms === 1
                ? `${rooms} room, ${totalGuests} ${totalGuests > 1 ? "guests" : "guest"}`
                : `${rooms} rooms, ${totalGuests} guests`;

            roomGuestsInput.value = resultText;
            guestRoomsContainer.style.display = "none";
        });

        // Click Handling Only (No scroll)
        document.addEventListener("click", (e) => {
            if (!roomGuests.contains(e.target) && !guestRoomsContainer.contains(e.target)) {
                guestRoomsContainer.style.display = "none";
            }
            document.querySelectorAll(".years-container").forEach((y) => y.hidden = true);
        });

        guestRoomsContainer.addEventListener("click", (e) => {
            if (!e.target.closest(".years-container")) document.querySelectorAll(".years-container").forEach((y) => y.hidden = true);
            e.stopPropagation();
        });

        
        // Initialize Rooms
        initRoomFunctionality();
        closeYearsOnScroll();
    };


    const handleDateDescription = () => {
        const descriptionContainer = document.querySelector(".description-datepicker");
        const h6Elements = descriptionContainer.querySelectorAll("h6");

        const addClass = () => {
            for (const el of h6Elements) {
                el.classList.add("active-label");
            }
        }

        const removeClass = () => {
            for (const el of h6Elements) {
                el.classList.remove("active-label");
            }
        }

        // Focus → add active class
        datePickerInput.addEventListener("focus", () => {
            addClass();
        });

        // Remove class if clicking outside calendar
        document.addEventListener("click", (e) => {
            if (!calendarContainer.contains(e.target) && e.target !== datePickerInput) {
                removeClass();
            }
        });

        // Observe changes to Check-in and Check-out text
        const observerCallback = (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    removeClass();
                }
            }
        };

        const observer = new MutationObserver(observerCallback);
        observer.observe(checkIn, { childList: true });
        observer.observe(checkOut, { childList: true });
    }

    const handlePlaceholder = (container, input) => {
    const placeholder = container.querySelector(".placeholder");
    const description = container.querySelector(".description");

    input.addEventListener("focus", () => {
        placeholder && (placeholder.hidden = true);
        description.classList.add("active");
    });

    document.addEventListener("click", (e) => {
        if (!container.contains(e.target)) {
        if (input.value.trim() === "") {
            placeholder && (placeholder.hidden = false);
        }
        description.classList.remove("active");
        }
    });

    input.addEventListener("input", () => {
        if (input.value.trim() !== "") description.classList.remove("active");
    });

    const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
    Object.defineProperty(input, "value", {
        set(val) {
        descriptor.set.call(this, val);
        if (val.trim() !== "") description.classList.remove("active");
        },
        get: descriptor.get,
    });
    };


    const showDestinationData = () => { 

        // ----- SVGs -----
        const region_svg = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
        <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/>
        </svg>
        `;

        const hotels_svg = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
        <path d="M40-200v-600h80v400h320v-320h320q66 0 113 47t47 113v360h-80v-120H120v120H40Zm240-240q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm240 40h320v-160q0-33-23.5-56.5T760-640H520v240ZM280-520q17 0 28.5-11.5T320-560q0-17-11.5-28.5T280-600q-17 0-28.5 11.5T240-560q0 17 11.5 28.5T280-520Zm0-40Zm240-80v240-240Z"/>
        </svg>
        `;


    // Placeholder "Place not found"
    const createNotFoundMsg = () => {
        let msg = destContainer.querySelector(".not-found-msg");
        if (!msg) {
        msg = document.createElement("p");
        msg.className = "not-found-msg";
        msg.textContent = "Place not found";
        msg.style.display = "none";
        destContainer.appendChild(msg);
        }
        return msg;
    };
    const notFoundMsg = createNotFoundMsg();

    let currentIndex = -1;

    // Fill container with items (max 5)
    const fillItems = (container, dataArr, className, svg) => {
        container.innerHTML = "";
        const itemsToShow = dataArr.slice(0, 5);
        for (const item of itemsToShow) {
        const div = document.createElement("div");
        div.className = className;
        div.innerHTML = `${svg}<span>${item}</span>`;
        container.appendChild(div);
        }
        return itemsToShow.length > 0;
    };

    // Update hover class (mouse only)
    const updateHover = index => {
        const allItems = destContainer.querySelectorAll(".region-item, .hotels-item");
        for (const item of allItems) item.classList.remove("hovered");
        if (index >= 0) allItems[index].classList.add("hovered");
    };

    // Bind click events to items
    const bindClick = () => {
        const allItems = destContainer.querySelectorAll(".region-item, .hotels-item");
        for (const [idx, item] of allItems.entries()) {
        item.onclick = () => {
            destInput.value = item.querySelector("span").innerText;
            notFoundMsg.style.display = "none";
            currentIndex = idx;
            updateHover(currentIndex);
            hideContainer();
        };
        }
    };

    // Show/hide container
    const showContainer = () => {
        destContainer.style.display = "flex";
        highlightSelected();
    };
    const hideContainer = () => {
        destContainer.style.display = "none";
        currentIndex = -1;
        updateHover(currentIndex);
    };

    // Highlight previously selected item
    const highlightSelected = () => {
        const allItems = Array.from(destContainer.querySelectorAll(".region-item, .hotels-item"));
        const selectedValue = destInput.value.trim().toLowerCase();
        if (!selectedValue) return;

        for (const [idx, item] of allItems.entries()) {
        if (item.querySelector("span").innerText.toLowerCase() === selectedValue) {
            currentIndex = idx;
            updateHover(currentIndex);
            item.scrollIntoView({ block: "nearest" });
            break;
        }
        }
    };

    // Filter function
    const filterItems = () => {
        const term = destInput.value.toLowerCase();

        const filteredRegions = region_arr.filter(r => r.toLowerCase().includes(term));
        const regionVisible = fillItems(regionContainer, filteredRegions, "region-item", region_svg);
        regionContainer.closest(".destnation-region-box").style.display = regionVisible ? "block" : "none";

        const filteredHotels = hotels_arr.filter(h => h.toLowerCase().includes(term));
        const hotelVisible = term ? fillItems(hotelsContainer, filteredHotels, "hotels-item", hotels_svg) : false;
        hotelsContainer.closest(".destnation-region-box").style.display = hotelVisible ? "block" : "none";

        notFoundMsg.style.display = !regionVisible && !hotelVisible ? "block" : "none";

        bindClick();
        showContainer();
    };

    // Mouse hover
    const handleMouseHover = e => {
        const target = e.target.closest(".region-item, .hotels-item");
        if (!target) return;

        const allItems = Array.from(destContainer.querySelectorAll(".region-item, .hotels-item"));
        const index = allItems.indexOf(target);
        updateHover(index);
    };

    // Initialize container
    const initContainer = () => {
        fillItems(regionContainer, region_arr, "region-item", region_svg);
        regionContainer.closest(".destnation-region-box").style.display = "block";
        hotelsContainer.closest(".destnation-region-box").style.display = "none";
        bindClick();
    };

    // Attach events
    const attachEvents = () => {
        destInput.addEventListener("focus", showContainer);
        destInput.addEventListener("click", showContainer);
        destInput.addEventListener("input", filterItems);

        destContainer.addEventListener("mousemove", handleMouseHover);

        document.addEventListener("click", e => {
        if (!destination.contains(e.target)) hideContainer();
        });

        destContainer.addEventListener("mouseleave", () => updateHover(-1));
    };

    const handleEnterSelect = () => {
        destInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
            const allItems = Array.from(destContainer.querySelectorAll(".region-item, .hotels-item"));
            if (currentIndex >= 0 && currentIndex < allItems.length) {
                const selectedItem = allItems[currentIndex];
                destInput.value = selectedItem.querySelector("span").innerText;
                notFoundMsg.style.display = "none";
                hideContainer();
                e.preventDefault(); // prevent form submit
            }
            }
        });
        };


    // Run
    hideContainer();
    initContainer();
    attachEvents();
    handleEnterSelect();
    }


    const showCitizenshipCountries = () => {
        const renderList = (list) => {
    optionsCitizenship.innerHTML = "";

    if (list.length === 0) {
        const p = document.createElement("p");
        p.textContent = "Country not found";
        optionsCitizenship.appendChild(p);
        return;
    }

    for (const country of list) {
        const li = document.createElement("li");
        li.textContent = country;

        // Mouse hover effect
        li.addEventListener("mouseenter", () => li.classList.add("hovered"));
        li.addEventListener("mouseleave", () => li.classList.remove("hovered"));

        // Click to select
        li.addEventListener("click", () => {
        guestCitizenshipInput.value = country;
        hideContainer();
        });

        optionsCitizenship.appendChild(li);
    }
    };

    const hideContainer = () => guestContainer.style.display = "none";

    const showContainer = () => {
    guestContainer.style.display = "block";
    renderList(countries);
    };

    const filterCountries = () => {
    const searchedValue = guestCitizenshipInput.value.toLowerCase();
    const filtered = countries.filter(c => c.toLowerCase().startsWith(searchedValue));
    renderList(filtered);
    };

    const setupEvents = () => {
    guestCitizenshipInput.addEventListener("focus", showContainer);
    guestCitizenshipInput.addEventListener("click", showContainer);
    guestCitizenshipInput.addEventListener("input", filterCountries);

    // Hide container if clicked outside mainBox
    document.addEventListener("click", (e) => {
        if (!guestCitizenship.contains(e.target)) hideContainer();
    });
    };

    /* ========== INIT ========== */
    setupEvents();
    renderList(countries);

    } 


    const showDatePicker = () => {
        calendarContainer.hidden = true;

        let start = null;
        let end = null;
        let originalStart = null;
        let originalEnd = null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 364);

        let leftDate = new Date(); 
        leftDate.setDate(1);
        let rightDate = new Date(leftDate);
        rightDate.setMonth(rightDate.getMonth() + 1); 

        //format date as YYYY-MM-DD
        const formatDate = (date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const d = String(date.getDate()).padStart(2, "0");
            return `${y}-${m}-${d}`;
        }

        //generate a date element
        const createDateEl = (date, isDisabled, isToday) =>{
            const span = document.createElement("span");
            span.textContent = date.getDate();

            // disable past or too-far-future dates
            if (date < today || date > maxDate) isDisabled = true;

            span.classList.toggle("disabled", isDisabled);

            if(!isDisabled){
                span.classList.toggle("today", isToday)
                span.setAttribute("data-date", formatDate(date))
                span.addEventListener("click", handleDateClick)
                span.addEventListener("mouseover", handleDateMouseover)
            }

            return span;
        } 

        const displaySelection = () => { 
            if (start && end){
                const startDate = start.toLocaleDateString("en-GB")
                const endDate = end.toLocaleDateString("en-GB")
                selectionEl.textContent = `${startDate} - ${endDate}`;
            }
        }

        const applyHighighting = () => {
            // clear previous highlighting
            const dateElements = datepicker.querySelectorAll("span[data-date]");
            for ( const dateEl of dateElements){
                dateEl.classList.remove("range-start", "range-end", "in-range");
            }

            // highlight the start day 
            if (start){
                const startDate = formatDate(start);
                const startEl = datepicker.querySelector(`span[data-date="${startDate}"]`);
                if (startEl) {
                    startEl.classList.add("range-start");
                    if (!end) startEl.classList.add("range-end");
                }
            }

            // highlight the end date
            if (end) {
                const endDate = formatDate(end);
                const endEl = datepicker.querySelector(`span[data-date="${endDate}"]`);
                if(endEl) endEl.classList.add("range-end");
            }

            if (start && end){
                for (const dateEl of dateElements){
                    const date = new Date(dateEl.dataset.date);
                    if (date > start && date < end){
                        dateEl.classList.add("in-range");
                    }
                }
            }
        }

        const handleDateMouseover = (event) => { 
            const hoverEl = event.target;
            if (start && !end){
                applyHighighting();
                const hoverDate = new Date(hoverEl.dataset.date);
                datepicker.querySelectorAll("span[data-date]").forEach((dateEl) => {
                    const date = new Date(dateEl.dataset.date);
                    if (date > start && date < hoverDate && start < hoverDate){
                        dateEl.classList.add("in-range");
                    }
                })
            }
        }

        // -----------------------------
        // UPDATED handleDateClick FUNCTION
        // -----------------------------
        const handleDateClick = (event) => {
            const dateEl = event.target;
            const selectedDate = new Date(dateEl.dataset.date);
            const warningEl = datepicker.querySelector(".action-menu p");

            if (!start || (start && end)) {
                // first date or selecting a new range
                start = selectedDate;
                end = null;
                warningEl.hidden = true;
            } else if (selectedDate < start) { 
                // clicked date before the selected date
                start = selectedDate;
                end = null;
                warningEl.hidden = true;
            } else {
                // clicked date after start: enforce max 30 days
                const diffTime = selectedDate - start;
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 30) {
                    end = new Date(start);
                    end.setDate(start.getDate() + 30);
                    warningEl.hidden = false; // show warning
                } else {
                    end = selectedDate;
                    warningEl.hidden = true;
                }
            }

            applyHighighting();
            displaySelection();
        };

        //function the render a month for spific year
        const renderCalendar = (Calendar, year, month) =>{
            const label  = Calendar.querySelector('.label');
            label.textContent = new Date(year, month).toLocaleDateString('en', 
                {
                    year: 'numeric',
                    month:'long'
                }
            ); //Month YYYY
            
            const datesContainer = Calendar.querySelector('.dates');
            datesContainer.innerHTML = ''

            //start on the first Sunday of the Month
            const startDate = new Date(year, month, 1);
            startDate.setDate(startDate.getDate() - startDate.getDay());

            //end in 6 weeks
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 42)

            const fragment = document.createDocumentFragment();
            while(startDate <  endDate){
                const isDisabled = startDate.getMonth() !== month;
                const isToday = formatDate(startDate) === formatDate(new Date());
                const dateEl = createDateEl(startDate, isDisabled, isToday);
                fragment.appendChild(dateEl);
                startDate.setDate(startDate.getDate() + 1)
            }
            datesContainer.appendChild(fragment);

            applyHighighting();
        }

        //show datePicker
        datePickerInput.addEventListener('focus', () =>{
            originalStart = start;
            originalEnd = end;
            calendarContainer.hidden = false;
        })

        //hide datePicker by click outside the calender
        document.addEventListener('click', (event) =>{
            if(!datepicker.contains(event.target)){
                calendarContainer.hidden = true ;  
            }
        })

        const updateNavButtons = () => {
            // disable prev if left calendar is in current month/year
            if (leftDate.getFullYear() === today.getFullYear() &&
                leftDate.getMonth() === today.getMonth()) {
                prevButton.disabled = true;
            } else {
                prevButton.disabled = false;
            }

            // disable next if right calendar is in max month/year
            if (rightDate.getFullYear() === maxDate.getFullYear() &&
                rightDate.getMonth() === maxDate.getMonth()) {
                nextButton.disabled = true;
            } else {
                nextButton.disabled = false;
            }
        }

        const updateCalendars = () => { 
            renderCalendar(leftCalendar, leftDate.getFullYear(), leftDate.getMonth())
            renderCalendar(rightCalendar, rightDate.getFullYear(), rightDate.getMonth())
            updateNavButtons();
        }

        //navigate to the previous month
        prevButton.addEventListener("click", () =>{
            leftDate.setMonth(leftDate.getMonth() - 1);
            rightDate.setMonth(rightDate.getMonth() - 1);
            updateCalendars();
        })

        //navigate to the next month
        nextButton.addEventListener("click", () =>{
            leftDate.setMonth(leftDate.getMonth() + 1);
            rightDate.setMonth(rightDate.getMonth() + 1);
            updateCalendars();
        })

        // handle apply selection
        applyButton.addEventListener("click", () => { 
            if (start && end) {
                const options = { weekday: "short", month: "short", day: "numeric" };
                const startDate = start.toLocaleDateString("en-GB", options);
                const endDate   = end.toLocaleDateString("en-GB", options);

                // show in input after clicking Apply
                // datePickerInput.value = `${startDate} - ${endDate}`;

                // Calculate difference in days
                const diffInMs = end - start; // difference in milliseconds
                const diffInDays = diffInMs / (1000 * 60 * 60 * 24);


                numOfNights.textContent = diffInDays;
                checkIn.textContent = startDate;
                checkOut.textContent = endDate;
                calendarContainer.hidden = true;
            }
        });

        //defulat value 
        const defaultCheckInOutValue = () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            start = new Date(today);
            end = new Date(tomorrow);

            const options = { weekday: "short", month: "short", day: "numeric" };
            checkIn.textContent = start.toLocaleDateString("en-GB", options);
            checkOut.textContent = end.toLocaleDateString("en-GB", options);

            const diffInMs = end - start;
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
            numOfNights.textContent = diffInDays;
        };

        //inialize the datePicker
        defaultCheckInOutValue();
        updateCalendars();
    }

    const initDateModifier = () => {
    const overlay = document.querySelector('.overlay-background');
    const openBtn = document.getElementById('search-modifier'); // your trigger
    const closeBtn = document.querySelector('.close-date-modifier'); // the X button

    if (overlay && openBtn && closeBtn) {
      // Open overlay on click
      openBtn.addEventListener('click', () => {
        overlay.style.display = 'flex';
      });

      // Close overlay on click
      closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
      });
    }
  };

    // Apply to each field
    initDateModifier();
    handleDateDescription();
    handlePlaceholder(destination, destInput);
    handlePlaceholder(roomGuests, roomGuestsInput);
    handlePlaceholder(guestCitizenship, guestCitizenshipInput);
    showDestinationData();
    showCitizenshipCountries();
    showRoomsData();
    showDatePicker();
}
handleSearchModifer();

const handleMapSearchPage = () => {
  const mapOverlay = document.querySelector('.map-overlay-background');
  const closeMapBtn = document.querySelector('.close-map');

  if (!mapOverlay || !closeMapBtn) return;

  closeMapBtn.addEventListener('click', () => {
    mapOverlay.style.display = 'none';
  });
};

// Initialize
handleMapSearchPage();


const initDateModifier = () => {
  const overlay = document.querySelector('.overlay-background');
  const openBtns = document.querySelectorAll('#search-modifier, #mobile-search-modifier');
  const closeBtn = document.querySelector('.close-date-modifier');

  if (!overlay || !openBtns.length || !closeBtn) return;

  for (const btn of openBtns) {
    btn.addEventListener('click', () => {
      overlay.style.display = 'flex';
      document.body.style.overflowY = 'hidden'; // disable scroll
    });
  }

  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    document.body.style.overflowY = ''; // restore scroll
  });
};

initDateModifier();
