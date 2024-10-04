import React from "react";
import styles from './SavvyTable.module.css';
var SavvyTable = function (_a) {
    var data = _a.data, tableKey = _a.tableKey;
    if (!data || !tableKey) {
        console.log(data);
        console.log(tableKey);
        return React.createElement("div", null, "No Table Found");
    }
    return (React.createElement("div", { className: styles.messageItemContainer },
        React.createElement("div", { className: styles.savvyResponse, tabIndex: 0 },
            React.createElement("div", { className: styles.tableWrapper },
                React.createElement("table", { className: styles.tableContainer },
                    React.createElement("thead", { className: styles.tableHeader },
                        React.createElement("tr", null, data[tableKey].SampleTableData.split('\n')[0].split(',').map(function (cell, cellIndex) { return (React.createElement("th", { key: cellIndex, className: styles.tableHeaderData }, cell.trim())); }))),
                    React.createElement("tbody", { className: styles.tableBody }, data[tableKey].SampleTableData.split('\n').slice(1).map(function (row, index) { return (React.createElement("tr", { key: index, className: styles.tableRow }, row.split(',').map(function (cell, cellIndex) { return (React.createElement("td", { key: cellIndex, className: styles.tableBodyData }, cell.trim())); }))); })))))));
};
export default SavvyTable;
