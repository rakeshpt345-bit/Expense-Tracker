document.addEventListener("DOMContentLoaded", () => {

    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");
    const searchExpense = document.getElementById("search-expense");

    let expenses =
        JSON.parse(localStorage.getItem("expenses")) || [];

    let budget =
        parseFloat(localStorage.getItem("budget")) || 0;

    document.getElementById("budget-amount").textContent = budget;

    displayExpenses(expenses);
    updateTotalAmount();
    updateMonthlySummary();
    checkBudget();

    function saveExpenses() {
        localStorage.setItem(
            "expenses",
            JSON.stringify(expenses)
        );
    }

    function saveBudget() {
        localStorage.setItem(
            "budget",
            budget
        );
    }

    expenseForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const name =
            document.getElementById("expense-name").value;

        const amount = Math.abs(
            parseFloat(
                document.getElementById("expense-amount").value
            )
            );

        const category =
            document.getElementById("expense-category").value;

        const date =
            document.getElementById("expense-date").value;

        const expense = {
            id: Date.now(),
            name,
            amount,
            category,
            date
        };

        expenses.push(expense);

        saveExpenses();
        displayExpenses(expenses);
        updateTotalAmount();
        updateMonthlySummary();
        checkBudget();

        expenseForm.reset();
    });

    expenseList.addEventListener("click", (e) => {

        const id =
            parseInt(e.target.dataset.id);

        if (e.target.classList.contains("delete-btn")) {

            expenses =
                expenses.filter(
                    expense => expense.id !== id
                );

            saveExpenses();
            displayExpenses(expenses);
            updateTotalAmount();
            updateMonthlySummary();
            checkBudget();
        }

        if (e.target.classList.contains("edit-btn")) {

            const expense =
                expenses.find(
                    expense => expense.id === id
                );

            document.getElementById("expense-name").value =
                expense.name;

            document.getElementById("expense-amount").value =
                expense.amount;

            document.getElementById("expense-category").value =
                expense.category;

            document.getElementById("expense-date").value =
                expense.date;

            expenses =
                expenses.filter(
                    expense => expense.id !== id
                );

            saveExpenses();

            displayExpenses(expenses);
            updateTotalAmount();
            updateMonthlySummary();
            checkBudget();
        }
    });

    filterCategory.addEventListener("change", (e) => {

        const category = e.target.value;

        if (category === "All") {
            displayExpenses(expenses);
        } else {

            const filtered =
                expenses.filter(
                    expense =>
                        expense.category === category
                );

            displayExpenses(filtered);
        }
    });

    searchExpense.addEventListener("input", (e) => {

        const search =
            e.target.value.toLowerCase();

        const filtered =
            expenses.filter(expense =>
                expense.name
                    .toLowerCase()
                    .includes(search)
            );

        displayExpenses(filtered);
    });

    document
        .getElementById("set-budget-btn")
        .addEventListener("click", () => {

            budget =
                parseFloat(
                    document.getElementById("budget-input").value
                ) || 0;

            document.getElementById(
                "budget-amount"
            ).textContent = budget;

            saveBudget();
            checkBudget();
        });

    function displayExpenses(expensesToShow) {

        expenseList.innerHTML = "";

        expensesToShow.forEach(expense => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${expense.name}</td>
                <td>₹${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">
                        Edit
                    </button>

                    <button class="delete-btn" data-id="${expense.id}">
                        Delete
                    </button>
                </td>
            `;

            expenseList.appendChild(row);
        });
    }

    // function updateTotalAmount() {

    //     const total =
    //         expenses.reduce(
    //             (sum, expense) =>
    //                 sum + expense.amount,
    //             0
    //         );

    //     totalAmount.textContent =
    //         total.toFixed(2);
    // }
function updateTotalAmount() {

    const total = expenses.reduce(
        (sum, expense) =>
            sum + Math.abs(expense.amount),
        0
    );

    totalAmount.textContent =
        total.toFixed(2);
}

    function checkBudget() {

    const total = expenses.reduce(
        (sum, expense) =>
            sum + Math.abs(expense.amount),
        0
    );

    const warning =
        document.getElementById("budget-warning");

    if (budget > 0 && total >= budget) {

        warning.textContent =
            `⚠ Budget Exceeded! Over by ₹${(total - budget).toFixed(2)}`;

        warning.style.color = "red";

    } else {

        warning.textContent =
            `✅ Budget Under Control. Remaining ₹${(budget - total).toFixed(2)}`;

        warning.style.color = "green";
    }
}
function updateMonthlySummary() {

    const currentMonth =
        new Date().getMonth();

    const currentYear =
        new Date().getFullYear();

    const monthlyTotal =
        expenses
            .filter(expense => {

                const d =
                    new Date(expense.date);

                return (
                    d.getMonth() === currentMonth &&
                    d.getFullYear() === currentYear
                );

            })
            .reduce(
                (sum, expense) =>
                    sum + Math.abs(expense.amount),
                0
            );

    document.getElementById(
        "monthly-total"
    ).textContent =
        monthlyTotal.toFixed(2);
}
});