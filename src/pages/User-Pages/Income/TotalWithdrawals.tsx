
import IncomePageLayout from './IncomePageLayout';
import { useGetWalletOverview } from '../../../api/Memeber';
import TokenService from '../../../api/token/tokenService';

const TotalWithdrawals = () => {
  const memberId = TokenService.getMemberId();
  const { data: walletOverview } = useGetWalletOverview(memberId);
  const totalWithdrawsAmount = walletOverview?.totalWithdraws || 0;

  return (
    <IncomePageLayout 
      title="Total Withdrawals" 
      balanceLabel="Total Withdrawn" 
      amount={totalWithdrawsAmount} 
      filterTypes={['withdraw', 'withdrawal']} 
    />
  );
};

export default TotalWithdrawals;
