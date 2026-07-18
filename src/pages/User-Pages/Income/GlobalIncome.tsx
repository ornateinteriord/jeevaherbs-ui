
import IncomePageLayout from './IncomePageLayout';
import { useGetWalletOverview } from '../../../api/Memeber';
import TokenService from '../../../api/token/tokenService';

const GlobalIncome = () => {
  const memberId = TokenService.getMemberId();
  const { data: walletOverview } = useGetWalletOverview(memberId);
  const globalIncomeAmount = walletOverview?.globalIncome || 0;

  return (
    <IncomePageLayout 
      title="Reward" 
      balanceLabel="Available Balance" 
      amount={globalIncomeAmount} 
      filterTypes={['global income', 'global', 'global_income', 'reward']} 
    />
  );
};

export default GlobalIncome;
