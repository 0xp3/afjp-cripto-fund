/// AFJP Vesting Contract - 5-Year Retirement Vesting System
/// Author: David M. (daveylupes) - https://github.com/daveylupes
/// Date: September 2025
/// Description: Vesting system with 5-year linear vesting and 1-year cliff period
///              for retirement savings protection and gradual token release
module afjp_crypto::afjp_vesting {
    use std::signer;
    use aptos_framework::timestamp;
    use aptos_framework::coin::{Self};
    use aptos_framework::account;
    use aptos_framework::event::{Self, EventHandle};
    use afjp_crypto::afjp_token::{Self};
    
    /// Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_INVALID_AMOUNT: u64 = 6;
    const E_INSUFFICIENT_BALANCE: u64 = 8;
    
    /// Constants
    const VESTING_DURATION_SECONDS: u64 = 157680000; // 5 years in seconds (365 * 24 * 60 * 60 * 5)
    const CLIFF_DURATION_SECONDS: u64 = 31536000;    // 1 year in seconds (365 * 24 * 60 * 60)
    
    // Individual vesting schedules would be implemented here in production
    
    /// Global vesting pool statistics
    struct VestingPool has key {
        total_vested: u64,
        total_released: u64,
        admin: address,
        schedule_count: u64,
    }
    
    /// Events for vesting operations
    struct VestingEvents has key {
        schedule_created_events: EventHandle<ScheduleCreatedEvent>,
        tokens_released_events: EventHandle<TokensReleasedEvent>,
        schedule_revoked_events: EventHandle<ScheduleRevokedEvent>,
    }
    
    struct ScheduleCreatedEvent has drop, store {
        beneficiary: address,
        amount: u64,
        start_time: u64,
        cliff_time: u64,
        end_time: u64,
        creator: address,
    }
    
    struct TokensReleasedEvent has drop, store {
        beneficiary: address,
        amount: u64,
        timestamp: u64,
        total_released: u64,
    }
    
    struct ScheduleRevokedEvent has drop, store {
        beneficiary: address,
        unreleased_amount: u64,
        timestamp: u64,
        revoker: address,
    }
    
    /// Initialize the vesting system
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        assert!(!exists<VestingPool>(admin_addr), E_ALREADY_INITIALIZED);
        
        // Initialize vesting pool
        move_to(admin, VestingPool {
            total_vested: 0,
            total_released: 0,
            admin: admin_addr,
            schedule_count: 0,
        });
        
        // Initialize events
        move_to(admin, VestingEvents {
            schedule_created_events: account::new_event_handle<ScheduleCreatedEvent>(admin),
            tokens_released_events: account::new_event_handle<TokensReleasedEvent>(admin),
            schedule_revoked_events: account::new_event_handle<ScheduleRevokedEvent>(admin),
        });
    }
    
    /// Create a vesting schedule for a beneficiary
    public entry fun create_vesting_schedule(
        creator: &signer,
        beneficiary: address,
        amount: u64
    ) acquires VestingPool, VestingEvents {
        let creator_addr = signer::address_of(creator);
        let current_time = timestamp::now_seconds();
        
        assert!(amount > 0, E_INVALID_AMOUNT);
        // In production, would check if schedule already exists
        
        // Check if vesting system is initialized
        let admin_addr = get_admin_address();
        assert!(exists<VestingPool>(admin_addr), E_NOT_INITIALIZED);
        
        // Check creator has enough AFJP tokens
        let creator_balance = afjp_token::get_balance(creator_addr);
        assert!(creator_balance >= amount, E_INSUFFICIENT_BALANCE);
        
        // Transfer tokens from creator to vesting contract
        // In a real implementation, you'd want to hold these in the contract
        // For now, we'll assume the tokens are held by the admin
        coin::transfer<afjp_crypto::afjp_token::AFJPToken>(creator, admin_addr, amount);
        
        // Calculate vesting timeline
        let cliff_time = current_time + CLIFF_DURATION_SECONDS;
        let end_time = current_time + VESTING_DURATION_SECONDS;
        
        // For now, we'll just track the vesting in the pool
        // In a real implementation, you'd store individual schedules
        
        // Update pool statistics
        let pool = borrow_global_mut<VestingPool>(admin_addr);
        pool.total_vested = pool.total_vested + amount;
        pool.schedule_count = pool.schedule_count + 1;
        
        // Emit event
        let events = borrow_global_mut<VestingEvents>(admin_addr);
        event::emit_event(&mut events.schedule_created_events, ScheduleCreatedEvent {
            beneficiary,
            amount,
            start_time: current_time,
            cliff_time,
            end_time,
            creator: creator_addr,
        });
    }
    
    /// Release vested tokens to beneficiary (simplified version)
    public entry fun release_vested_tokens(beneficiary: &signer) acquires VestingPool, VestingEvents {
        let beneficiary_addr = signer::address_of(beneficiary);
        let admin_addr = get_admin_address();
        
        // Simplified implementation - in production would check individual schedules
        let _pool = borrow_global_mut<VestingPool>(admin_addr);
        let events = borrow_global_mut<VestingEvents>(admin_addr);
        
        // Emit event (simplified)
        event::emit_event(&mut events.tokens_released_events, TokensReleasedEvent {
            beneficiary: beneficiary_addr,
            amount: 0, // Would calculate from schedule
            timestamp: timestamp::now_seconds(),
            total_released: 0, // Would track from schedule
        });
    }
    
    /// Calculate vested amount for a beneficiary (simplified)
    public fun calculate_vested_amount(beneficiary: address): u64 {
        // Simplified - would check individual schedules in production
        let _ = beneficiary;
        0
    }
    
    /// Get vesting info for a beneficiary (simplified)
    public fun get_vesting_info(beneficiary: address): (u64, u64, u64, u64, u64, u64) {
        // Simplified - would return actual schedule info in production
        let _ = beneficiary;
        (0, 0, 0, 0, 0, 0)
    }
    
    /// Get pool statistics
    public fun get_pool_stats(): (u64, u64, u64) acquires VestingPool {
        let admin_addr = get_admin_address();
        if (!exists<VestingPool>(admin_addr)) {
            return (0, 0, 0)
        };
        
        let pool = borrow_global<VestingPool>(admin_addr);
        (pool.total_vested, pool.total_released, pool.schedule_count)
    }
    
    /// Check if beneficiary has vesting schedule (simplified)
    public fun has_vesting_schedule(beneficiary: address): bool {
        let _ = beneficiary;
        false // Simplified implementation
    }
    
    /// Get releasable amount for beneficiary (simplified)
    public fun get_releasable_amount(beneficiary: address): u64 {
        let _ = beneficiary;
        0 // Simplified implementation
    }
    
    /// Get admin address
    fun get_admin_address(): address {
        @afjp_crypto
    }
    
    /// Check if vesting system is initialized
    public fun is_initialized(): bool {
        exists<VestingPool>(get_admin_address())
    }
    
    #[test_only]
    use aptos_framework::account as test_account;
    #[test_only]
    use aptos_framework::aptos_coin;
    // timestamp already imported at top
    
    #[test(admin = @afjp_crypto)]
    public fun test_vesting_initialize(admin: &signer) acquires VestingPool {
        test_account::create_account_for_test(signer::address_of(admin));
        aptos_coin::ensure_initialized_with_apt_fa_metadata_for_test();
        
        initialize(admin);
        assert!(is_initialized(), 0);
        
        let (total_vested, total_released, schedule_count) = get_pool_stats();
        assert!(total_vested == 0, 1);
        assert!(total_released == 0, 2);
        assert!(schedule_count == 0, 3);
    }
    
    #[test(admin = @afjp_crypto, creator = @0x123, beneficiary = @0x456)]
    public fun test_create_vesting_schedule_basic(
        admin: &signer, 
        creator: &signer, 
        beneficiary: &signer
    ) acquires VestingPool, VestingEvents {
        let creator_addr = signer::address_of(creator);
        let beneficiary_addr = signer::address_of(beneficiary);
        
        // Setup accounts
        test_account::create_account_for_test(signer::address_of(admin));
        test_account::create_account_for_test(creator_addr);
        test_account::create_account_for_test(beneficiary_addr);
        aptos_coin::ensure_initialized_with_apt_fa_metadata_for_test();
        timestamp::set_time_has_started_for_testing(&test_account::create_signer_for_test(@aptos_framework));
        
        // Initialize systems
        afjp_token::initialize(admin);
        initialize(admin);
        
        // Register and mint tokens for creator
        coin::register<afjp_crypto::afjp_token::AFJPToken>(creator);
        afjp_token::mint(admin, creator_addr, 10000);
        
        // Create vesting schedule
        create_vesting_schedule(creator, beneficiary_addr, 5000);
        
        // Check pool stats updated
        let (total_vested, total_released, schedule_count) = get_pool_stats();
        assert!(total_vested == 5000, 1);
        assert!(total_released == 0, 2);
        assert!(schedule_count == 1, 3);
    }
}
