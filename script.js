const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let num = "";
let isCalculated = false;

const operators = ["+", "-", "*", "/"];


/* =========================================
   UPDATE DISPLAY
========================================= */

function updateDisplay() {
    display.value = num;
}


/* =========================================
   BUTTON ANIMATION
========================================= */

function animateButton(button) {

    if (!button) return;

    button.classList.add("pressed");

    setTimeout(() => {
        button.classList.remove("pressed");
    }, 150);
}


/* =========================================
   FIND BUTTON
========================================= */

function findButton(value) {

    return [...buttons].find((button) => {

        return button.textContent.trim() === value;

    });
}


/* =========================================
   CLEAR
========================================= */

function clearCalculator() {

    num = "";

    isCalculated = false;

    updateDisplay();
}


/* =========================================
   DELETE
========================================= */

function deleteLastCharacter() {

    num = num.slice(0, -1);

    isCalculated = false;

    updateDisplay();
}


/* =========================================
   DECIMAL
========================================= */

function handleDecimal() {

    const parts = num.split(/[+\-*/]/);

    const currentNumber =
        parts[parts.length - 1];


    // Prevent multiple decimals

    if (currentNumber.includes(".")) {
        return;
    }


    // If decimal is the first value

    if (
        num === "" ||
        operators.includes(num[num.length - 1])
    ) {

        num += "0.";

        isCalculated = false;

        updateDisplay();

        return;
    }


    num += ".";

    isCalculated = false;

    updateDisplay();
}


/* =========================================
   OPERATOR
========================================= */

function handleOperator(operator) {

    // Don't allow operator
    // as first character

    if (num === "") {
        return;
    }


    // After calculation

    if (isCalculated) {

        num += operator;

        isCalculated = false;

        updateDisplay();

        return;
    }


    const lastCharacter =
        num[num.length - 1];


    // Prevent ++, --, **, //

    if (operators.includes(lastCharacter)) {
        return;
    }


    num += operator;

    updateDisplay();
}


/* =========================================
   NUMBER
========================================= */

function handleNumber(value) {

    // Start new calculation
    // after pressing =

    if (isCalculated) {

        num = value;

        isCalculated = false;

    } else {

        num += value;

    }

    updateDisplay();
}


/* =========================================
   CALCULATE
========================================= */

function calculateResult() {

    // Nothing to calculate

    if (num === "") {
        return;
    }


    // Don't calculate if expression
    // ends with operator

    const lastCharacter =
        num[num.length - 1];

    if (operators.includes(lastCharacter)) {

        display.value = "Error";

        num = "";

        isCalculated = false;

        return;
    }


    try {

        const result = eval(num);


        // Check invalid result

        if (!Number.isFinite(result)) {

            display.value = "Error";

            num = "";

            isCalculated = false;

            return;
        }


        num = result.toString();

        display.value = num;

        isCalculated = true;


    } catch (error) {

        console.log(
            "Invalid calculation:",
            error
        );

        display.value = "Error";

        num = "";

        isCalculated = false;
    }
}


/* =========================================
   HANDLE VALUE
========================================= */

function handleValue(value) {

    value = value.trim();


    // C

    if (value === "C") {

        clearCalculator();

        return;
    }


    // DEL

    if (value === "DEL") {

        deleteLastCharacter();

        return;
    }


    // =

    if (value === "=") {

        calculateResult();

        return;
    }


    // Decimal

    if (value === ".") {

        handleDecimal();

        return;
    }


    // Operator

    if (operators.includes(value)) {

        handleOperator(value);

        return;
    }


    // Number

    if (
        value >= "0" &&
        value <= "9"
    ) {

        handleNumber(value);

        return;
    }
}


/* =========================================
   MOUSE CLICK
========================================= */

buttons.forEach((button) => {

    button.addEventListener("click", () => {

        const value =
            button.textContent.trim();

        console.log(
            "Clicked:",
            value
        );

        animateButton(button);

        handleValue(value);

    });

});


/* =========================================
   KEYBOARD HANDLER
========================================= */

let lastEnterTime = 0;


function handleKeyboard(event) {

    const key = event.key;

    console.log(
        "Keyboard:",
        key
    );

    console.log(
        "Event:",
        event.type
    );


    /* =====================================
       ENTER / =
    ===================================== */

    if (
        key === "Enter" ||
        key === "="
    ) {

        event.preventDefault();


        // Prevent keydown + keypress
        // from calculating twice

        const currentTime =
            Date.now();

        if (
            currentTime - lastEnterTime < 100
        ) {

            return;
        }

        lastEnterTime = currentTime;


        const equalButton =
            document.getElementById("equal");

        animateButton(equalButton);

        calculateResult();

        return;
    }


    /* =====================================
       NUMBERS
    ===================================== */

    if (
        key >= "0" &&
        key <= "9"
    ) {

        event.preventDefault();

        const button =
            findButton(key);

        animateButton(button);

        handleNumber(key);

        return;
    }


    /* =====================================
       OPERATORS
    ===================================== */

    if (
        operators.includes(key)
    ) {

        event.preventDefault();

        const button =
            findButton(key);

        animateButton(button);

        handleOperator(key);

        return;
    }


    /* =====================================
       DECIMAL
    ===================================== */

    if (key === ".") {

        event.preventDefault();

        const button =
            findButton(".");

        animateButton(button);

        handleDecimal();

        return;
    }


    /* =====================================
       BACKSPACE
    ===================================== */

    if (
        key === "Backspace" ||
        key === "Delete"
    ) {

        event.preventDefault();

        const deleteButton =
            document.getElementById("delete");

        animateButton(deleteButton);

        deleteLastCharacter();

        return;
    }


    /* =====================================
       ESCAPE
    ===================================== */

    if (key === "Escape") {

        event.preventDefault();

        const clearButton =
            document.getElementById("clear");

        animateButton(clearButton);

        clearCalculator();

        return;
    }
}


/* =========================================
   KEYDOWN EVENT
========================================= */

document.addEventListener(
    "keydown",
    handleKeyboard
);


/* =========================================
   KEYPRESS EVENT
========================================= */

document.addEventListener(
    "keypress",
    handleKeyboard
);