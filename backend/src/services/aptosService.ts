import { AptosClient, AptosAccount, Types } from 'aptos';
import { logger } from '../utils/logger';
import { AppError } from '../types';

export class AptosService {
  private client: AptosClient;
  private moduleAddress: string;

  constructor(nodeUrl: string, moduleAddress: string) {
    this.client = new AptosClient(nodeUrl);
    this.moduleAddress = moduleAddress;
  }

  /**
   * Get token balance for a specific address and token type
   */
  async getTokenBalance(address: string, tokenType: string): Promise<number> {
    try {
      const resource = await this.client.getAccountResource(
        address,
        `${this.moduleAddress}::${tokenType.toLowerCase()}_token::${tokenType}Token`
      );
      
      return (resource.data as any).coin.value || 0;
    } catch (error) {
      logger.error('Failed to get token balance:', error);
      return 0;
    }
  }

  /**
   * Execute a transaction on the blockchain
   */
  async executeTransaction(
    account: AptosAccount,
    functionName: string,
    typeArguments: string[] = [],
    args: any[] = []
  ): Promise<string> {
    try {
      const payload: Types.TransactionPayload = {
        type: "entry_function_payload",
        function: `${this.moduleAddress}::${functionName}`,
        type_arguments: typeArguments,
        arguments: args
      };

      const txnRequest = await this.client.generateTransaction(
        account.address(),
        payload
      );

      const signedTxn = await this.client.signTransaction(account, txnRequest);
      const result = await this.client.submitTransaction(signedTxn);
      await this.client.waitForTransaction(result.hash);

      logger.info('Transaction executed successfully:', {
        hash: result.hash,
        function: functionName,
        address: account.address()
      });

      return result.hash;
    } catch (error) {
      logger.error('Transaction failed:', error);
      throw new AppError('Transaction failed', 500);
    }
  }

  /**
   * Contribute to the fund (create vesting schedule)
   */
  async contribute(account: AptosAccount, amount: number): Promise<string> {
    return this.executeTransaction(
      account,
      'afjp_vesting::create_vesting_schedule',
      [],
      [amount]
    );
  }

  /**
   * Burn AFJP for Juventud tokens
   */
  async burnAFJPForJuventud(account: AptosAccount, afjpAmount: number): Promise<string> {
    return this.executeTransaction(
      account,
      'juventud_token::burn_afjp_for_juventud',
      [],
      [afjpAmount]
    );
  }

  /**
   * Burn AFJP for Ladrillo fractions
   */
  async burnAFJPForLadrillo(
    account: AptosAccount,
    afjpAmount: number,
    propertyId: number,
    fractions: number
  ): Promise<string> {
    return this.executeTransaction(
      account,
      'ladrillo_token::burn_afjp_for_ladrillo',
      [],
      [afjpAmount, propertyId, fractions]
    );
  }

  /**
   * Stake tokens
   */
  async stakeTokens(account: AptosAccount, amount: number): Promise<string> {
    return this.executeTransaction(
      account,
      'afjp_staking::stake_tokens',
      [],
      [amount]
    );
  }

  /**
   * Unstake tokens
   */
  async unstakeTokens(account: AptosAccount, amount: number): Promise<string> {
    return this.executeTransaction(
      account,
      'afjp_staking::unstake_tokens',
      [],
      [amount]
    );
  }

  /**
   * Claim staking rewards
   */
  async claimRewards(account: AptosAccount): Promise<string> {
    return this.executeTransaction(
      account,
      'afjp_staking::claim_rewards',
      [],
      []
    );
  }

  /**
   * Release vested tokens
   */
  async releaseVestedTokens(account: AptosAccount): Promise<string> {
    return this.executeTransaction(
      account,
      'afjp_vesting::release_vested_tokens',
      [],
      []
    );
  }

  /**
   * Create a loan
   */
  async createLoan(
    account: AptosAccount,
    collateralAmount: number,
    borrowAmount: number
  ): Promise<string> {
    return this.executeTransaction(
      account,
      'afjp_lending::create_loan',
      [],
      [collateralAmount, borrowAmount]
    );
  }

  /**
   * Repay a loan
   */
  async repayLoan(account: AptosAccount, loanId: number, amount: number): Promise<string> {
    return this.executeTransaction(
      account,
      'afjp_lending::repay_loan',
      [],
      [loanId, amount]
    );
  }

  /**
   * Designate beneficiaries
   */
  async designateBeneficiaries(
    account: AptosAccount,
    primary: string,
    secondary: string[],
    percentages: number[]
  ): Promise<string> {
    return this.executeTransaction(
      account,
      'afjp_inheritance::designate_beneficiaries',
      [],
      [primary, secondary, percentages]
    );
  }

  /**
   * Register a property
   */
  async registerProperty(
    account: AptosAccount,
    name: string,
    location: string,
    propertyType: string,
    value: number
  ): Promise<string> {
    return this.executeTransaction(
      account,
      'property_manager::register_property',
      [],
      [name, location, propertyType, value]
    );
  }

  /**
   * Tokenize a property
   */
  async tokenizeProperty(
    account: AptosAccount,
    propertyId: number,
    fractions: number
  ): Promise<string> {
    return this.executeTransaction(
      account,
      'property_manager::tokenize_property',
      [],
      [propertyId, fractions]
    );
  }

  /**
   * Get vesting information
   */
  async getVestingInfo(address: string): Promise<any> {
    try {
      const resource = await this.client.getAccountResource(
        address,
        `${this.moduleAddress}::afjp_vesting::VestingSchedule`
      );
      return resource.data;
    } catch (error) {
      logger.error('Failed to get vesting info:', error);
      return null;
    }
  }

  /**
   * Get staking information
   */
  async getStakingInfo(address: string): Promise<any> {
    try {
      const resource = await this.client.getAccountResource(
        address,
        `${this.moduleAddress}::afjp_staking::StakerInfo`
      );
      return resource.data;
    } catch (error) {
      logger.error('Failed to get staking info:', error);
      return null;
    }
  }

  /**
   * Get loan information
   */
  async getLoanInfo(loanId: number): Promise<any> {
    try {
      // This would need to be implemented based on the actual contract structure
      // For now, return null
      return null;
    } catch (error) {
      logger.error('Failed to get loan info:', error);
      return null;
    }
  }

  /**
   * Get property information
   */
  async getPropertyInfo(propertyId: number): Promise<any> {
    try {
      // This would need to be implemented based on the actual contract structure
      // For now, return null
      return null;
    } catch (error) {
      logger.error('Failed to get property info:', error);
      return null;
    }
  }
}

// Export singleton instance
export const aptosService = new AptosService(
  process.env.APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com',
  process.env.AFJP_MODULE_ADDRESS || '0x1234567890abcdef1234567890abcdef12345678'
);
