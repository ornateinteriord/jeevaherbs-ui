
import IncomePageLayout from './IncomePageLayout';
import { useGetWalletOverview } from '../../../api/Memeber';
import TokenService from '../../../api/token/tokenService';

const DailyROI = () => {
  const memberId = TokenService.getMemberId();
  const { data: walletOverview } = useGetWalletOverview(memberId);
  const dailyRoiAmount = walletOverview?.dailyRoi || 0;

  return (
    <IncomePageLayout 
      title="Daily ROI" 
      balanceLabel="Available Balance" 
      amount={dailyRoiAmount} 
      filterTypes={['daily roi', 'roi', 'daily_roi']} 
    />
  );
};

export default DailyROI;
