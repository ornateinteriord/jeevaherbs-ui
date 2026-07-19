import IncomePageLayout from './IncomePageLayout';
import { useGetWalletOverview } from '../../../api/Memeber';
import TokenService from '../../../api/token/tokenService';

const DailyIncentive = () => {
  const memberId = TokenService.getMemberId();
  const { data: walletOverview } = useGetWalletOverview(memberId);
  const dailyIncentiveAmount = walletOverview?.dailyIncentive || 0;

  return (
    <IncomePageLayout 
      title="Daily Incentive" 
      balanceLabel="Available Balance" 
      amount={dailyIncentiveAmount} 
      filterTypes={['daily incentive']} 
    />
  );
};

export default DailyIncentive;
