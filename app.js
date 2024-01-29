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
    let numberOfColumns = document.getElementById("columns").value;
    let numberOfRows = document.getElementById("rows").value;
    let csvContent = "<table border='1'>";

    // Add column headers
    csvContent += "<tr>";
    for (let i = 0; i < numberOfColumns; i++) {
        let columnName = document.getElementById("columnName" + i).value || "Column " + (i + 1);
        csvContent += "<th>" + columnName + "</th>";
    }
    csvContent += "</tr>";

    // Add rows
    for (let row = 0; row < numberOfRows; row++) {
        csvContent += "<tr>";
        for (let column = 0; column < numberOfColumns; column++) {
            csvContent += "<td>Row " + (row + 1) + " Col " + (column + 1) + "</td>";
        }
        csvContent += "</tr>";
    }
    csvContent += "</table>";

    document.getElementById("csvDisplay").innerHTML = csvContent;
}

function downloadCSV() {
    let numberOfColumns = document.getElementById("columns").value;
    let numberOfRows = document.getElementById("rows").value;
    let csvString = "";

    // Add column headers
    for (let i = 0; i < numberOfColumns; i++) {
        let columnName = document.getElementById("columnName" + i).value || "Column " + (i + 1);
        csvString += '"' + columnName.replace(/"/g, '""') + '",';
    }
    csvString = csvString.substring(0, csvString.length - 1); // Remove last comma
    csvString += "\r\n";

    // Add rows
    for (let row = 0; row < numberOfRows; row++) {
        for (let column = 0; column < numberOfColumns; column++) {
            csvString += '"Cell ' + (row + 1) + '-' + (column + 1) + '",';
        }
        csvString = csvString.substring(0, csvString.length - 1); // Remove last comma
        csvString += "\r\n";
    }

    // Create a link and download the file
    let blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "generatedCSV.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

document.getElementById('checkbox').addEventListener('change', function(event) {
    if (event.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
});



window.onload = function() {
    updateColumnInputs();
};