import DataTable from 'react-data-table-component';
import { DASHBOARD_CUTSOM_STYLE } from '../../utils/DataTableColumnsProvider';

const DashboardTable = ({ data , columns}: { data: any , columns: any }) => {

    return (
        <DataTable
            columns={columns}
            data={data}
            pagination
            highlightOnHover
            customStyles={DASHBOARD_CUTSOM_STYLE}
            pointerOnHover
            noDataComponent={<div>No data available</div>}
        />
    );
}

export default DashboardTable