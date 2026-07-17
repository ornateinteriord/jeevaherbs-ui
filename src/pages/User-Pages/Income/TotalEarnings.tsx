
import IncomePageLayout from './IncomePageLayout';
import { useGetWalletOverview } from '../../../api/Memeber';
import TokenService from '../../../api/token/tokenService';

const TotalEarnings = () => {
  const memberId = TokenService.getMemberId();
  const { data: walletOverview } = useGetWalletOverview(memberId);
  const totalEarningsAmount = walletOverview?.totalEarnings || 0;

  return (
    <IncomePageLayout 
      title="Total Earnings" 
      balanceLabel="Total Earnings Balance" 
      amount={totalEarningsAmount} 
      filterTypes={[]} // Empty array to not filter anything (show all earnings)
    />
  );
};

export default TotalEarnings;
