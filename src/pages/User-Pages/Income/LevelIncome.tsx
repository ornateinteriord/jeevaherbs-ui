
import IncomePageLayout from './IncomePageLayout';
import { useGetWalletOverview } from '../../../api/Memeber';
import TokenService from '../../../api/token/tokenService';

const LevelIncome = () => {
  const memberId = TokenService.getMemberId();
  const { data: walletOverview } = useGetWalletOverview(memberId);
  const levelBenefitsAmount = walletOverview?.levelBenefits || 0;

  return (
    <IncomePageLayout 
      title="Level Income" 
      balanceLabel="Available Balance" 
      amount={levelBenefitsAmount} 
      filterTypes={['level', 'level income', 'level_income']} 
    />
  );
};

export default LevelIncome;
