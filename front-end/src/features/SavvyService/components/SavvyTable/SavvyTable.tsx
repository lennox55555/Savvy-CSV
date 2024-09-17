import React from "react";
import { TableObject } from "../../../../utils/types";
import styles from './SavvyTable.module.css'

interface SavvyTableProps {
    data: TableObject | null,
    tableKey: string
}

const SavvyTable: React.FC<SavvyTableProps> = ({ data, tableKey }) => {

    if (!data || !tableKey) {
        console.log(data)
        console.log(tableKey)
        return <div>No Table Found</div>;
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.tableContainer}>
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
    );
};

export default SavvyTable;