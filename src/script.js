document.addEventListener("DOMContentLoaded", () => {

    const fromCurrency = document.querySelector("[name='from']");
    const toCurrency = document.querySelector("[name='to']");
    const amountInput = document.getElementById("amount");
    const resultDisplay = document.getElementById("result-display");
    const rateDisplay = document.getElementById("rate-display");
    const dateElement = document.getElementById("date");
    const swapBtn = document.getElementById("swap-icon");
    const resetBtn = document.getElementById("reset-btn");
    const currencySymbol = document.getElementById("currency-symbol");

    const BASE_API_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

    const getCurrencySymbol = (code) => {
        try {
            return new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: code,
                maximumFractionDigits: 0
            })
                .format(0)
                .replace(/\d/g, "")
                .trim();
        } catch {
            return code;
        }
    };

    const adjustInputPadding = () => {
        const width = currencySymbol.getBoundingClientRect().width;
        amountInput.style.paddingLeft = `${width + 28}px`;
    };

    const adjustFontSize = (length) => {
        resultDisplay.classList.remove(
            "text-6xl",
            "text-5xl",
            "text-4xl",
            "text-3xl",
            "text-2xl"
        );

        if (length < 10) resultDisplay.classList.add("text-6xl");
        else if (length < 15) resultDisplay.classList.add("text-5xl");
        else if (length < 20) resultDisplay.classList.add("text-4xl");
        else if (length < 26) resultDisplay.classList.add("text-3xl");
        else resultDisplay.classList.add("text-2xl");
    };

    const setDate = () => {
        dateElement.innerText = new Date().toLocaleDateString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const updateFlagAndName = (select) => {
        const code = select.value;
        const wrapper = select.parentElement.parentElement;

        wrapper.querySelector("img").src =
            `https://flagsapi.com/${countryList[code]}/flat/64.png`;

        wrapper.querySelector(".currency-name").innerText =
            currency_dict[code] || code;

        if (select.name === "from") {
            currencySymbol.innerText = getCurrencySymbol(code);
            adjustInputPadding();
        }
    };

    const convertCurrency = async () => {
        const amount = Number(amountInput.value || 0);
        const from = fromCurrency.value.toLowerCase();
        const to = toCurrency.value.toLowerCase();

        try {
            const res = await fetch(`${BASE_API_URL}/${from}.json`);
            const data = await res.json();
            const rate = data[from][to];

            const output = `${getCurrencySymbol(toCurrency.value)} ${(amount * rate).toFixed(2)}`;

            adjustFontSize(output.length);
            resultDisplay.innerText = output;
            rateDisplay.innerText = `1 ${toCurrency.value} = ${(1 / rate).toFixed(4)} ${fromCurrency.value}`;
        } catch {
            resultDisplay.innerText = "Error";
            rateDisplay.innerText = "Check connection";
        }
    };

    amountInput.addEventListener("keydown", (e) => {
        if (["e", "E", "+", "-"].includes(e.key)) {
            e.preventDefault();
        }
    });

    document.querySelectorAll(".Currency").forEach((select) => {
        Object.keys(countryList).forEach((code) => {
            const option = document.createElement("option");
            option.value = code;
            option.textContent = `${code} - ${currency_dict[code] || ""}`;
            option.className = "bg-slate-900 text-white";

            if (select.name === "from" && code === "USD") option.selected = true;
            if (select.name === "to" && code === "INR") option.selected = true;

            select.appendChild(option);
        });

        select.addEventListener("change", () => {
            updateFlagAndName(select);
            convertCurrency();
        });
    });

    amountInput.addEventListener("input", convertCurrency);

    swapBtn.addEventListener("click", (e) => {
        e.preventDefault();
        [fromCurrency.value, toCurrency.value] = [
            toCurrency.value,
            fromCurrency.value
        ];
        updateFlagAndName(fromCurrency);
        updateFlagAndName(toCurrency);
        convertCurrency();
    });

    resetBtn.addEventListener("click", (e) => {
        e.preventDefault();
        amountInput.value = 1;
        convertCurrency();
    });

    setDate();
    updateFlagAndName(fromCurrency);
    updateFlagAndName(toCurrency);
    adjustInputPadding();
    convertCurrency();
});