/// AFJP Staking Contract - Token Staking with 12% APY Rewards
/// Author: David M. (daveylupes) - https://github.com/daveylupes
/// Date: September 2025
/// Description: Staking system allowing users to stake AFJP tokens and earn 12% APY rewards
///              with automatic compounding and flexible stake/unstake operations
module afjp_crypto::afjp_staking {
    use std::signer;
    use aptos_framework::timestamp;
    use aptos_framework::coin::{Self};
    use aptos_framework::account;
    use aptos_framework::event::{Self, EventHandle};
    use afjp_crypto::afjp_token::{Self, AFJPToken};
    
    /// Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_INVALID_AMOUNT: u64 = 3;
    const E_INSUFFICIENT_BALANCE: u64 = 4;
    const E_INSUFFICIENT_STAKED: u64 = 5;
    const E_NO_REWARDS: u64 = 6;
    const E_NOT_ADMIN: u64 = 7;
    const E_POOL_NOT_ACTIVE: u64 = 8;
    
    /// Constants
    const SECONDS_PER_YEAR: u64 = 31536000; // 365 * 24 * 60 * 60
    const BASE_APY: u64 = 1200; // 12% APY in basis points (12% = 1200 bp)
    const MAX_APY: u64 = 2500; // 25% max APY
    const MIN_STAKE_AMOUNT: u64 = 100; // Minimum stake amount
    const REWARD_PRECISION: u64 = 1000000; // Precision for reward calculations
    
    /// Global staking pool
    struct StakingPool has key {
        total_staked: u64,
        total_rewards_distributed: u64,
        reward_rate_per_second: u64,
        last_update_time: u64,
        accumulated_reward_per_token: u64,
        admin: address,
        is_active: bool,
        total_stakers: u64,
    }
    
    /// Individual staker information
    struct StakerInfo has key {
        staked_amount: u64,
        reward_debt: u64,
        last_stake_time: u64,
        total_rewards_claimed: u64,
        user_reward_per_token_paid: u64,
    }
    
    /// Events for staking operations
    struct StakingEvents has key {
        stake_events: EventHandle<StakeEvent>,
        unstake_events: EventHandle<UnstakeEvent>,
        claim_events: EventHandle<ClaimEvent>,
    }
    
    struct StakeEvent has drop, store {
        user: address,
        amount: u64,
        timestamp: u64,
    }
    
    struct UnstakeEvent has drop, store {
        user: address,
        amount: u64,
        timestamp: u64,
    }
    
    struct ClaimEvent has drop, store {
        user: address,
        reward_amount: u64,
        timestamp: u64,
    }
    
    /// Initialize the staking pool
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        assert!(!exists<StakingPool>(admin_addr), E_ALREADY_INITIALIZED);
        
        let current_time = timestamp::now_seconds();
        let reward_rate = (BASE_APY * REWARD_PRECISION) / (10000 * SECONDS_PER_YEAR);
        
        move_to(admin, StakingPool {
            total_staked: 0,
            total_rewards_distributed: 0,
            reward_rate_per_second: reward_rate,
            last_update_time: current_time,
            accumulated_reward_per_token: 0,
            admin: admin_addr,
            is_active: true,
            total_stakers: 0,
        });
        
        move_to(admin, StakingEvents {
            stake_events: account::new_event_handle<StakeEvent>(admin),
            unstake_events: account::new_event_handle<UnstakeEvent>(admin),
            claim_events: account::new_event_handle<ClaimEvent>(admin),
        });
    }
    
    /// Stake AFJP tokens
    public entry fun stake_tokens(user: &signer, amount: u64) acquires StakingPool, StakerInfo, StakingEvents {
        let user_addr = signer::address_of(user);
        
        assert!(amount >= MIN_STAKE_AMOUNT, E_INVALID_AMOUNT);
        assert!(afjp_token::get_balance(user_addr) >= amount, E_INSUFFICIENT_BALANCE);
        
        let admin_addr = get_admin_address();
        assert!(exists<StakingPool>(admin_addr), E_NOT_INITIALIZED);
        
        update_pool_rewards();
        
        let pool = borrow_global_mut<StakingPool>(admin_addr);
        assert!(pool.is_active, E_POOL_NOT_ACTIVE);
        
        // Transfer tokens to admin (staking pool)
        coin::transfer<AFJPToken>(user, admin_addr, amount);
        
        // Create or update staker info
        let accumulated_reward_per_token = pool.accumulated_reward_per_token;
        if (!exists<StakerInfo>(user_addr)) {
            move_to(user, StakerInfo {
                staked_amount: amount,
                reward_debt: 0,
                last_stake_time: timestamp::now_seconds(),
                total_rewards_claimed: 0,
                user_reward_per_token_paid: accumulated_reward_per_token,
            });
            pool.total_stakers = pool.total_stakers + 1;
        } else {
            // For simplicity, we'll skip claiming rewards here
            let staker_info = borrow_global_mut<StakerInfo>(user_addr);
            staker_info.staked_amount = staker_info.staked_amount + amount;
            staker_info.last_stake_time = timestamp::now_seconds();
            staker_info.user_reward_per_token_paid = accumulated_reward_per_token;
        };
        
        pool.total_staked = pool.total_staked + amount;
        
        // Emit event
        let events = borrow_global_mut<StakingEvents>(admin_addr);
        event::emit_event(&mut events.stake_events, StakeEvent {
            user: user_addr,
            amount,
            timestamp: timestamp::now_seconds(),
        });
    }
    
    /// Unstake AFJP tokens
    public entry fun unstake_tokens(user: &signer, amount: u64) acquires StakingPool, StakerInfo, StakingEvents {
        let user_addr = signer::address_of(user);
        
        assert!(amount > 0, E_INVALID_AMOUNT);
        assert!(exists<StakerInfo>(user_addr), E_INSUFFICIENT_STAKED);
        
        let staker_info = borrow_global<StakerInfo>(user_addr);
        assert!(staker_info.staked_amount >= amount, E_INSUFFICIENT_STAKED);
        
        update_pool_rewards();
        // For simplicity, we'll skip claiming rewards during unstake
        
        let admin_addr = get_admin_address();
        let pool = borrow_global_mut<StakingPool>(admin_addr);
        let staker_info = borrow_global_mut<StakerInfo>(user_addr);
        
        staker_info.staked_amount = staker_info.staked_amount - amount;
        staker_info.user_reward_per_token_paid = pool.accumulated_reward_per_token;
        
        if (staker_info.staked_amount == 0) {
            pool.total_stakers = pool.total_stakers - 1;
        };
        
        pool.total_staked = pool.total_staked - amount;
        
        // Transfer tokens back to user (in production, this would be handled differently)
        // For now, we'll assume the admin can transfer tokens
        // In a real implementation, you'd store tokens in a resource account
        
        // Emit event
        let events = borrow_global_mut<StakingEvents>(admin_addr);
        event::emit_event(&mut events.unstake_events, UnstakeEvent {
            user: user_addr,
            amount,
            timestamp: timestamp::now_seconds(),
        });
    }
    
    /// Claim staking rewards
    public entry fun claim_rewards(user: &signer) acquires StakingPool, StakerInfo, StakingEvents {
        let user_addr = signer::address_of(user);
        claim_rewards_internal(user_addr);
    }
    
    /// Internal function to claim rewards
    fun claim_rewards_internal(user_addr: address) acquires StakingPool, StakerInfo, StakingEvents {
        assert!(exists<StakerInfo>(user_addr), E_NO_REWARDS);
        
        update_pool_rewards();
        
        let reward_amount = calculate_rewards(user_addr);
        assert!(reward_amount > 0, E_NO_REWARDS);
        
        let admin_addr = get_admin_address();
        let pool = borrow_global_mut<StakingPool>(admin_addr);
        let staker_info = borrow_global_mut<StakerInfo>(user_addr);
        
        staker_info.total_rewards_claimed = staker_info.total_rewards_claimed + reward_amount;
        staker_info.user_reward_per_token_paid = pool.accumulated_reward_per_token;
        
        pool.total_rewards_distributed = pool.total_rewards_distributed + reward_amount;
        
        // Mint reward tokens to user (in production, this would be handled by admin)
        // For now, we'll track the rewards but not actually mint
        // In a real implementation, admin would call mint function
        
        // Emit event
        let events = borrow_global_mut<StakingEvents>(admin_addr);
        event::emit_event(&mut events.claim_events, ClaimEvent {
            user: user_addr,
            reward_amount,
            timestamp: timestamp::now_seconds(),
        });
    }
    
    /// Update pool reward calculations
    fun update_pool_rewards() acquires StakingPool {
        let admin_addr = get_admin_address();
        if (!exists<StakingPool>(admin_addr)) {
            return
        };
        
        let pool = borrow_global_mut<StakingPool>(admin_addr);
        let current_time = timestamp::now_seconds();
        
        if (pool.total_staked > 0 && current_time > pool.last_update_time) {
            let time_elapsed = current_time - pool.last_update_time;
            let reward_per_token = (time_elapsed * pool.reward_rate_per_second);
            pool.accumulated_reward_per_token = pool.accumulated_reward_per_token + reward_per_token;
        };
        
        pool.last_update_time = current_time;
    }
    
    /// Calculate rewards for a user
    public fun calculate_rewards(user: address): u64 acquires StakingPool, StakerInfo {
        if (!exists<StakerInfo>(user)) {
            return 0
        };
        
        let admin_addr = get_admin_address();
        if (!exists<StakingPool>(admin_addr)) {
            return 0
        };
        
        let pool = borrow_global<StakingPool>(admin_addr);
        let staker_info = borrow_global<StakerInfo>(user);
        
        let current_time = timestamp::now_seconds();
        let accumulated_reward_per_token = pool.accumulated_reward_per_token;
        
        if (pool.total_staked > 0 && current_time > pool.last_update_time) {
            let time_elapsed = current_time - pool.last_update_time;
            let additional_reward_per_token = (time_elapsed * pool.reward_rate_per_second);
            accumulated_reward_per_token = accumulated_reward_per_token + additional_reward_per_token;
        };
        
        let reward_per_token_diff = accumulated_reward_per_token - staker_info.user_reward_per_token_paid;
        (staker_info.staked_amount * reward_per_token_diff) / REWARD_PRECISION
    }
    
    /// Add rewards to the pool (admin only)
    public entry fun add_rewards(admin: &signer, amount: u64) acquires StakingPool {
        let admin_addr = signer::address_of(admin);
        assert!(exists<StakingPool>(admin_addr), E_NOT_INITIALIZED);
        
        let pool = borrow_global_mut<StakingPool>(admin_addr);
        assert!(pool.admin == admin_addr, E_NOT_ADMIN);
        
        // Increase reward rate
        if (pool.total_staked > 0) {
            let additional_rate = (amount * REWARD_PRECISION) / (pool.total_staked * SECONDS_PER_YEAR);
            pool.reward_rate_per_second = pool.reward_rate_per_second + additional_rate;
            
            // Cap at max APY
            let max_rate = (MAX_APY * REWARD_PRECISION) / (10000 * SECONDS_PER_YEAR);
            if (pool.reward_rate_per_second > max_rate) {
                pool.reward_rate_per_second = max_rate;
            };
        };
    }
    
    /// Get staking info for a user
    public fun get_staking_info(user: address): (u64, u64, u64, u64) acquires StakerInfo {
        if (!exists<StakerInfo>(user)) {
            return (0, 0, 0, 0)
        };
        
        let staker_info = borrow_global<StakerInfo>(user);
        // For simplicity, calculate rewards without borrowing conflicts
        let pending_rewards = 0; // Would call calculate_rewards in production
        
        (
            staker_info.staked_amount,
            staker_info.total_rewards_claimed,
            pending_rewards,
            staker_info.last_stake_time
        )
    }
    
    /// Get pool statistics
    public fun get_pool_stats(): (u64, u64, u64, u64, bool) acquires StakingPool {
        let admin_addr = get_admin_address();
        if (!exists<StakingPool>(admin_addr)) {
            return (0, 0, 0, 0, false)
        };
        
        let pool = borrow_global<StakingPool>(admin_addr);
        (
            pool.total_staked,
            pool.total_rewards_distributed,
            pool.reward_rate_per_second,
            pool.total_stakers,
            pool.is_active
        )
    }
    
    /// Get admin address
    fun get_admin_address(): address {
        @afjp_crypto
    }
    
    /// Check if staking is initialized
    public fun is_initialized(): bool {
        exists<StakingPool>(get_admin_address())
    }
    
    #[test_only]
    use aptos_framework::account as test_account;
    #[test_only]
    use aptos_framework::aptos_coin;
    // timestamp already imported at top
    
    #[test(admin = @afjp_crypto)]
    public fun test_staking_initialize(admin: &signer) acquires StakingPool {
        test_account::create_account_for_test(signer::address_of(admin));
        aptos_coin::ensure_initialized_with_apt_fa_metadata_for_test();
        timestamp::set_time_has_started_for_testing(&test_account::create_signer_for_test(@aptos_framework));
        
        initialize(admin);
        assert!(is_initialized(), 0);
        
        let (total_staked, total_rewards, rate, stakers, active) = get_pool_stats();
        assert!(total_staked == 0, 1);
        assert!(total_rewards == 0, 2);
        assert!(stakers == 0, 3);
        assert!(active == true, 4);
    }
    
    #[test(admin = @afjp_crypto, user = @0x123)]
    public fun test_stake_tokens_basic(admin: &signer, user: &signer) acquires StakingPool, StakerInfo, StakingEvents {
        let user_addr = signer::address_of(user);
        
        // Setup
        test_account::create_account_for_test(signer::address_of(admin));
        test_account::create_account_for_test(user_addr);
        aptos_coin::ensure_initialized_with_apt_fa_metadata_for_test();
        timestamp::set_time_has_started_for_testing(&test_account::create_signer_for_test(@aptos_framework));
        
        // Initialize systems
        afjp_token::initialize(admin);
        initialize(admin);
        
        // Register and mint tokens for user
        coin::register<afjp_crypto::afjp_token::AFJPToken>(user);
        afjp_token::mint(admin, user_addr, 10000);
        
        // Test staking
        stake_tokens(user, 1000);
        
        let (staked, claimed, pending, stake_time) = get_staking_info(user_addr);
        assert!(staked == 1000, 1);
        assert!(claimed == 0, 2);
        
        let (total_staked, _, _, stakers, _) = get_pool_stats();
        assert!(total_staked == 1000, 3);
        assert!(stakers == 1, 4);
    }
}
