let zoomLevel = 100;
let intervalId = null;
let intervalRate = 120
let columnNames = ["Column 1", "Column 2", "Column 3"];



function updateColumnInputs() {
    let numberOfColumns = document.getElementById("columns").value;
    let columnNamesDiv = document.getElementById("columnNames");
    columnNamesDiv.innerHTML = '';

    for (let i = 0; i < numberOfColumns; i++) {
        let input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Column " + (i + 1);
        input.id = "columnName" + i;
        columnNamesDiv.appendChild(input);
    }
}

function generateCSV() {
    let numberOfRows = parseInt(document.getElementById("rowsDisplay").textContent);

    // Initialize the CSV content with zoom controls
    let csvContent = "<div class='zoom-controls'>" +
        "<button id='increaseSize' onclick='adjustZoom(true)'>+</button>" +
        "<button id='decreaseSize' onclick='adjustZoom(false)'>-</button>" +
        "</div>";

    // Start building the table
    csvContent += "<table border='1' style='width:100%;'>";

    // Add column headers
    csvContent += "<tr>";
    columnNames.forEach((name) => {
        csvContent += `<th>${name}</th>`;
    });
    csvContent += "</tr>";

    // Add rows and their columns
    for (let row = 0; row < numberOfRows; row++) {
        csvContent += "<tr>";
        for (let column = 0; column < columnNames.length; column++) {
            csvContent += `<td>Row ${row + 1} Col ${column + 1}</td>`;
        }
        csvContent += "</tr>";
    }
    csvContent += "</table>";

    document.getElementById("csvDisplay").innerHTML = csvContent;

}

function updateColumnNamesDisplay() {
    // Update UI for column names
    const columnNamesDiv = document.getElementById("columnNames");
    columnNamesDiv.innerHTML = ''; // Clear existing inputs

    columnNames.forEach((name, index) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = name;
        input.onchange = (e) => updateColumnName(index, e.target.value);
        columnNamesDiv.appendChild(input);
    });
}

function updateColumnName(index, newName) {
    columnNames[index] = newName;
}

function addColumn() {
    columnNames.push(`Column ${columnNames.length + 1}`);
    updateColumnNamesDisplay();
}

function removeColumn() {
    if (columnNames.length > 1) {
        columnNames.pop();
        updateColumnNamesDisplay();
    }
}



function downloadCSV() {
    let numberOfColumns = parseInt(document.getElementById("columnsDisplay").textContent);
    let numberOfRows = parseInt(document.getElementById("rowsDisplay").textContent);
    let csvString = "";

    for (let i = 0; i < numberOfColumns; i++) {
        let columnNameInput = document.getElementById("columnName" + i);
        let columnName = columnNameInput && columnNameInput.value ? columnNameInput.value : "Column " + (i + 1);
        csvString += '"' + columnName.replace(/"/g, '""') + '",';
    }
    csvString = csvString.slice(0, -1);
    csvString += "\r\n";

    // Generate rows data
    for (let row = 0; row < numberOfRows; row++) {
        for (let column = 0; column < numberOfColumns; column++) {
            csvString += '"Cell ' + (row + 1) + '-' + (column + 1) + '",';
        }
        csvString = csvString.slice(0, -1);
        csvString += "\r\n";
    }

    // Create and download the CSV file
    let blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "generatedCSV.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


function deleteTable() {
    let isConfirmed = confirm("Are you sure you want to delete the table?");
    if (isConfirmed) {
        document.getElementById("csvDisplay").innerHTML = '';
    }
}

function startChange(changeFunction) {
    changeFunction();
    if (intervalId !== null) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(changeFunction, intervalRate);
}

function stopChange() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

function increaseColumns() {
    addColumn();
    let columnsDisplay = document.getElementById("columnsDisplay");
    columnsDisplay.textContent = parseInt(columnsDisplay.textContent) + 1;

}

function decreaseColumns() {
    removeColumn()
    let columnsDisplay = document.getElementById("columnsDisplay");
    columnsDisplay.textContent = Math.max(1, parseInt(columnsDisplay.textContent) - 1); // Prevent going below 1

}

function increaseRows() {
    let rowsDisplay = document.getElementById("rowsDisplay");
    rowsDisplay.textContent = parseInt(rowsDisplay.textContent) + 1;
}

function decreaseRows() {
    let rowsDisplay = document.getElementById("rowsDisplay");
    rowsDisplay.textContent = Math.max(1, parseInt(rowsDisplay.textContent) - 1); // Prevent going below 1
}

function addZoomControlListeners() {
    // Ensure the DOM has been updated
    setTimeout(() => {
        // Increase size button listener
        document.getElementById("increaseSize").addEventListener("click", function() {
            adjustZoom(true);
        });

        // Decrease size button listener
        document.getElementById("decreaseSize").addEventListener("click", function() {
            adjustZoom(false);
        });
    }, 0);
}

function adjustZoom(increase) {
    zoomLevel += increase ? 10 : -10;
    zoomLevel = Math.max(50, Math.min(200, zoomLevel));
    // Apply the scale transformation to the table itself
    document.querySelector("#csvDisplay table").style.transform = `scale(${zoomLevel / 100})`;
    document.querySelector("#csvDisplay table").style.transformOrigin = 'top left'; // Adjust as needed
}


document.getElementById("increaseSize").addEventListener("click", function() {
    adjustZoom(true);
});

document.getElementById("decreaseSize").addEventListener("click", function() {
    adjustZoom(false);
});


document.addEventListener('DOMContentLoaded', function() {
    const themeCheckbox = document.getElementById('themeCheckbox');

    // Initialize theme from localStorage
    const currentTheme = localStorage.getItem('theme') || 'light'; // Default to 'light' theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeCheckbox.checked = currentTheme === 'dark';

    // Toggle theme on change
    themeCheckbox.addEventListener('change', function() {
        const theme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
});




window.onload = function() {
    updateColumnInputs();
    document.getElementById("deleteTableBtn").addEventListener("click", deleteTable);
    document.getElementById("increaseSize").addEventListener("click", increaseRows);
    document.getElementById("decreaseSize").addEventListener("click", decreaseRows);
    document.querySelector(".increase.columns").addEventListener("click", increaseColumns);
    document.querySelector(".decrease.columns").addEventListener("click", decreaseColumns);
};