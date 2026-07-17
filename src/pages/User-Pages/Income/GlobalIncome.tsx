
import IncomePageLayout from './IncomePageLayout';
import { useGetWalletOverview } from '../../../api/Memeber';
import TokenService from '../../../api/token/tokenService';

const GlobalIncome = () => {
  const memberId = TokenService.getMemberId();
  const { data: walletOverview } = useGetWalletOverview(memberId);
  const globalIncomeAmount = walletOverview?.globalIncome || 0;

  return (
    <IncomePageLayout 
      title="Global Income" 
      balanceLabel="Available Balance" 
      amount={globalIncomeAmount} 
      filterTypes={['global income', 'global', 'global_income']} 
    />
  );
};

export default GlobalIncome;
