import React from "react";
import styles from './Message.module.css';
var Message = function (_a) {
    var message = _a.message, index = _a.index, downloadCSV = _a.downloadCSV;
    return (React.createElement(React.Fragment, null, message.user ? (React.createElement("div", null,
        React.createElement("div", { className: styles.messageItemContainer },
            React.createElement("div", { key: index, className: styles.userMessage },
                React.createElement("div", { className: styles.messageBubble }, message.text))))) : (React.createElement("div", null,
        React.createElement("div", { className: styles.messageItemContainer },
            React.createElement("div", null, message.text),
            message.rank != null && (React.createElement("div", { className: styles.tableButtonGroup },
                React.createElement("span", { onClick: function () { return downloadCSV(message.table, message.rank); }, className: "material-symbols-outlined", title: "Download CSV" }, "download"),
                React.createElement("span", { className: "material-symbols-outlined", title: "Data Source" },
                    React.createElement("a", { href: message.source, target: "_blank", rel: "noopener noreferrer" }, "link")))))))));
};
export default Message;
