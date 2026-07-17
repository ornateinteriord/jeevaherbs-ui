
import IncomePageLayout from './IncomePageLayout';
import { useGetWalletOverview } from '../../../api/Memeber';
import TokenService from '../../../api/token/tokenService';

const DirectIncome = () => {
  const memberId = TokenService.getMemberId();
  const { data: walletOverview } = useGetWalletOverview(memberId);
  const directBenefitsAmount = walletOverview?.directBenefits || 0;

  return (
    <IncomePageLayout 
      title="Direct Income" 
      balanceLabel="Available Balance" 
      amount={directBenefitsAmount} 
      filterTypes={['direct', 'direct income', 'direct_income']} 
    />
  );
};

export default DirectIncome;
