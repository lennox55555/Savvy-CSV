import './SavvyTable.css'

const SavvyTable: React.FC = () => {

    const tableData: any = {
        Price: [1524, 1457, 1515, 1529],
        Date: ['1/1/2024', '2/1/2024', '3/1/2024', '4/1/2024'],
        Volume: [6210941, 6253254, 6234590, 6723492]
    }

    const keys = Object.keys(tableData);

    return (
        <>
            <table className='table-container'>
                <thead className='table-header'>
                    <tr>
                        {keys.map((key) => 
                        <th key={key}>
                            {key}
                        </th>
                        )}
                    </tr>
                </thead>
                <tbody className='table-body'>
                    {Array.from({ length: tableData[keys[0]].length}).map((_, index) => (
                        <tr key={index}>
                        {keys.map((key) => (
                          <td key={key}>{tableData[key][index]}</td>
                        ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default SavvyTable;