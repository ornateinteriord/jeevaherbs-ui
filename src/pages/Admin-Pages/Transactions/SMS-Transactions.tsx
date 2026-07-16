import { getSMSTransactionColumns } from "../../../utils/DataTableColumnsProvider"
import { TransactionDataTable } from "./Transactions"



const data = [
  {
    date: '2021-09-01',
    id: '1',
    member: 'Rahul Sharma',
    messageType: 'Promotional',
    sentTo: '1234567890',
    status: 'Sent',
  },
  {
    date: '2021-09-02',
    id: '2',
    member: 'Priya Singh',
    messageType: 'Transactional',
    sentTo: '0987654321',
    status: 'Failed',
  },
]

const SMSTransactions = () => {
  return (
    <TransactionDataTable title="SMS Transactions" summaryTitle="List of SMS Transactions" data={data} columns={getSMSTransactionColumns()} />
  )
}

export default SMSTransactions