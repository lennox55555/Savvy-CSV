import React, { useState } from "react";
import { TableObject } from "../../../../utils/types";
import styles from './SavvyTable.module.css'

interface SavvyTableProps {
    data: TableObject | null,
    tableKey: string
}

const SavvyTable: React.FC<SavvyTableProps> = ({ data, tableKey }) => {
    const [isClicked, setIsClicked] = useState(false);

    if (!data || !tableKey) {
        console.log(data)
        console.log(tableKey)
        return <div>No Table Found</div>;
    }

    const handleTableClick = () => {
        setIsClicked(!isClicked);
    };

    const handleTableBlur = () => {
        setIsClicked(false);
    };

    return (
        <div className={styles.messageItemContainer}>
            <div className={styles.savvyResponse} tabIndex={0}>
                <div className={styles.tableWrapper}>
                    <table
                        className={`${styles.tableContainer} ${isClicked ? styles.clicked : ''}`}
                        onClick={handleTableClick}
                        onBlur={handleTableBlur}
                        tabIndex={0}
                    >
                        <thead className={styles.tableHeader}>
                        <tr>
                            {data[tableKey].SampleTableData.split('\n')[0].split(',').map((cell, cellIndex) => (
                                <th key={cellIndex} className={styles.tableHeaderData}>
                                    {cell.trim()}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className={styles.tableBody}>
                        {data[tableKey].SampleTableData.split('\n').slice(1).map((row, index) => (
                            <tr key={index} className={styles.tableRow}>
                                {row.split(',').map((cell, cellIndex) => (
                                    <td key={cellIndex} className={styles.tableBodyData}>
                                        {cell.trim()}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SavvyTable;