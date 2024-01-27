function updateColumnInputs() {
    var numberOfColumns = document.getElementById("columns").value;
    var columnNamesDiv = document.getElementById("columnNames");
    columnNamesDiv.innerHTML = '';

    for (var i = 0; i < numberOfColumns; i++) {
        var input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Column " + (i + 1);
        input.id = "columnName" + i;
        columnNamesDiv.appendChild(input);
    }
}

function generateCSV() {
    var numberOfColumns = document.getElementById("columns").value;
    var numberOfRows = document.getElementById("rows").value;
    var csvContent = "<table border='1'>";

    // Add column headers
    csvContent += "<tr>";
    for (var i = 0; i < numberOfColumns; i++) {
        var columnName = document.getElementById("columnName" + i).value || "Column " + (i + 1);
        csvContent += "<th>" + columnName + "</th>";
    }
    csvContent += "</tr>";

    // Add rows
    for (var row = 0; row < numberOfRows; row++) {
        csvContent += "<tr>";
        for (var column = 0; column < numberOfColumns; column++) {
            csvContent += "<td>Row " + (row + 1) + " Col " + (column + 1) + "</td>";
        }
        csvContent += "</tr>";
    }
    csvContent += "</table>";

    document.getElementById("csvDisplay").innerHTML = csvContent;
}

function downloadCSV() {
    var numberOfColumns = document.getElementById("columns").value;
    var numberOfRows = document.getElementById("rows").value;
    var csvString = "";

    // Add column headers
    for (var i = 0; i < numberOfColumns; i++) {
        var columnName = document.getElementById("columnName" + i).value || "Column " + (i + 1);
        csvString += '"' + columnName.replace(/"/g, '""') + '",';
    }
    csvString = csvString.substring(0, csvString.length - 1); // Remove last comma
    csvString += "\r\n";

    // Add rows
    for (var row = 0; row < numberOfRows; row++) {
        for (var column = 0; column < numberOfColumns; column++) {
            csvString += '"Cell ' + (row + 1) + '-' + (column + 1) + '",';
        }
        csvString = csvString.substring(0, csvString.length - 1); // Remove last comma
        csvString += "\r\n";
    }

    // Create a link and download the file
    var blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "generatedCSV.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

window.onload = function() {
    updateColumnInputs();
};