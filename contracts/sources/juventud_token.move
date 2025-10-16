/// Juventud Token Contract - Rental Discount Token System
/// Author: David M. (daveylupes) - https://github.com/daveylupes
/// Date: September 2025
/// Description: Token system for rental discounts, obtained by burning AFJP tokens
///              at 1:10 ratio with tiered discount benefits for users
module afjp_crypto::juventud_token {
    use std::signer;
    use std::string;
    use aptos_framework::coin::{Self, BurnCapability, FreezeCapability, MintCapability};
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use aptos_framework::event::{Self, EventHandle};
    use afjp_crypto::afjp_token::{Self};
    
    /// Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_INVALID_AMOUNT: u64 = 3;
    const E_INSUFFICIENT_AFJP_BALANCE: u64 = 4;
    const E_INSUFFICIENT_JUVENTUD_BALANCE: u64 = 5;
    const E_NOT_ADMIN: u64 = 6;
    const E_DISCOUNT_NOT_AVAILABLE: u64 = 7;
    const E_INVALID_DISCOUNT_AMOUNT: u64 = 8;
    
    /// Constants
    const AFJP_TO_JUVENTUD_RATE: u64 = 10; // 1 AFJP = 10 JUVENTUD
    const MIN_BURN_AMOUNT: u64 = 100; // Minimum AFJP to burn (with decimals)
    const MAX_DISCOUNT_PERCENTAGE: u64 = 50; // Maximum 50% discount
    
    /// Juventud Token struct
    struct JuventudToken has key {}
    
    /// Token capabilities
    struct TokenCapabilities has key {
        mint_cap: MintCapability<JuventudToken>,
        burn_cap: BurnCapability<JuventudToken>,
        freeze_cap: FreezeCapability<JuventudToken>,
    }
    
    /// Token information and statistics
    struct TokenInfo has key {
        total_supply: u64,
        total_burned: u64,
        total_afjp_burned: u64, // Track AFJP burned for Juventud
        admin: address,
        exchange_rate: u64, // AFJP to Juventud rate
    }
    
    /// Rental discount system
    struct DiscountSystem has key {
        base_discount_rate: u64, // Base discount percentage (in basis points)
        max_discount_per_transaction: u64,
        total_discounts_applied: u64,
    }
    
    /// User discount tracking
    struct UserDiscountInfo has key {
        total_discounts_used: u64,
        last_discount_time: u64,
        discount_tier: u8, // 0: Basic, 1: Premium, 2: VIP
    }
    
    /// Events
    struct TokenEvents has key {
        burn_afjp_events: EventHandle<BurnAFJPEvent>,
        discount_applied_events: EventHandle<DiscountAppliedEvent>,
        exchange_rate_updated_events: EventHandle<ExchangeRateUpdatedEvent>,
    }
    
    struct BurnAFJPEvent has drop, store {
        user: address,
        afjp_amount: u64,
        juventud_received: u64,
        timestamp: u64,
    }
    
    struct DiscountAppliedEvent has drop, store {
        user: address,
        original_amount: u64,
        discount_amount: u64,
        final_amount: u64,
        timestamp: u64,
    }
    
    struct ExchangeRateUpdatedEvent has drop, store {
        old_rate: u64,
        new_rate: u64,
        timestamp: u64,
    }
    
    /// Initialize Juventud token
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        assert!(!exists<TokenCapabilities>(admin_addr), E_ALREADY_INITIALIZED);
        
        // Initialize the coin
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<JuventudToken>(
            admin,
            string::utf8(b"Juventud Token"),
            string::utf8(b"JUVENTUD"),
            8, // decimals
            true, // monitor_supply
        );
        
        // Store capabilities
        move_to(admin, TokenCapabilities {
            mint_cap,
            burn_cap,
            freeze_cap,
        });
        
        // Store token info
        move_to(admin, TokenInfo {
            total_supply: 0,
            total_burned: 0,
            total_afjp_burned: 0,
            admin: admin_addr,
            exchange_rate: AFJP_TO_JUVENTUD_RATE,
        });
        
        // Initialize discount system
        move_to(admin, DiscountSystem {
            base_discount_rate: 1000, // 10% base discount (1000 basis points)
            max_discount_per_transaction: 500000, // Max discount amount
            total_discounts_applied: 0,
        });
        
        // Initialize events
        move_to(admin, TokenEvents {
            burn_afjp_events: account::new_event_handle<BurnAFJPEvent>(admin),
            discount_applied_events: account::new_event_handle<DiscountAppliedEvent>(admin),
            exchange_rate_updated_events: account::new_event_handle<ExchangeRateUpdatedEvent>(admin),
        });
    }
    
    /// Burn AFJP tokens to get Juventud tokens
    public entry fun burn_afjp_for_juventud(
        user: &signer,
        afjp_amount: u64
    ) acquires TokenCapabilities, TokenInfo, TokenEvents {
        let user_addr = signer::address_of(user);
        
        assert!(afjp_amount >= MIN_BURN_AMOUNT, E_INVALID_AMOUNT);
        assert!(afjp_token::get_balance(user_addr) >= afjp_amount, E_INSUFFICIENT_AFJP_BALANCE);
        
        let admin_addr = get_admin_address();
        assert!(exists<TokenCapabilities>(admin_addr), E_NOT_INITIALIZED);
        
        let capabilities = borrow_global<TokenCapabilities>(admin_addr);
        let token_info = borrow_global_mut<TokenInfo>(admin_addr);
        let events = borrow_global_mut<TokenEvents>(admin_addr);
        
        // Calculate Juventud tokens to mint
        let juventud_amount = afjp_amount * token_info.exchange_rate;
        
        // Burn AFJP tokens
        afjp_token::burn(user, afjp_amount);
        
        // Mint Juventud tokens
        let juventud_coins = coin::mint<JuventudToken>(juventud_amount, &capabilities.mint_cap);
        coin::deposit<JuventudToken>(user_addr, juventud_coins);
        
        // Update statistics
        token_info.total_supply = token_info.total_supply + juventud_amount;
        token_info.total_afjp_burned = token_info.total_afjp_burned + afjp_amount;
        
        // Emit event
        event::emit_event(&mut events.burn_afjp_events, BurnAFJPEvent {
            user: user_addr,
            afjp_amount,
            juventud_received: juventud_amount,
            timestamp: timestamp::now_seconds(),
        });
    }
    
    /// Apply rental discount using Juventud tokens
    public entry fun apply_rental_discount(
        user: &signer,
        rental_amount: u64,
        discount_percentage: u64
    ) acquires DiscountSystem, UserDiscountInfo, TokenEvents, TokenCapabilities {
        let user_addr = signer::address_of(user);
        
        assert!(rental_amount > 0, E_INVALID_AMOUNT);
        assert!(discount_percentage > 0 && discount_percentage <= MAX_DISCOUNT_PERCENTAGE, E_INVALID_DISCOUNT_AMOUNT);
        
        let admin_addr = get_admin_address();
        assert!(exists<DiscountSystem>(admin_addr), E_NOT_INITIALIZED);
        
        let discount_system = borrow_global_mut<DiscountSystem>(admin_addr);
        
        // Calculate discount amount
        let discount_amount = (rental_amount * discount_percentage) / 100;
        assert!(discount_amount <= discount_system.max_discount_per_transaction, E_INVALID_DISCOUNT_AMOUNT);
        
        // Calculate required Juventud tokens (1:1 ratio with discount amount)
        let required_juventud = discount_amount;
        assert!(coin::balance<JuventudToken>(user_addr) >= required_juventud, E_INSUFFICIENT_JUVENTUD_BALANCE);
        
        // Burn Juventud tokens for discount
        let juventud_coins = coin::withdraw<JuventudToken>(user, required_juventud);
        let admin_addr = get_admin_address();
        let capabilities = borrow_global<TokenCapabilities>(admin_addr);
        coin::burn<JuventudToken>(juventud_coins, &capabilities.burn_cap);
        
        // Update or create user discount info
        if (!exists<UserDiscountInfo>(user_addr)) {
            move_to(user, UserDiscountInfo {
                total_discounts_used: discount_amount,
                last_discount_time: timestamp::now_seconds(),
                discount_tier: 0, // Start with basic tier
            });
        } else {
            let user_info = borrow_global_mut<UserDiscountInfo>(user_addr);
            user_info.total_discounts_used = user_info.total_discounts_used + discount_amount;
            user_info.last_discount_time = timestamp::now_seconds();
            
            // Update tier based on total discounts used
            if (user_info.total_discounts_used >= 100000) { // VIP tier
                user_info.discount_tier = 2;
            } else if (user_info.total_discounts_used >= 50000) { // Premium tier
                user_info.discount_tier = 1;
            };
        };
        
        // Update system statistics
        discount_system.total_discounts_applied = discount_system.total_discounts_applied + discount_amount;
        
        // Emit event
        let events = borrow_global_mut<TokenEvents>(admin_addr);
        let final_amount = rental_amount - discount_amount;
        event::emit_event(&mut events.discount_applied_events, DiscountAppliedEvent {
            user: user_addr,
            original_amount: rental_amount,
            discount_amount,
            final_amount,
            timestamp: timestamp::now_seconds(),
        });
    }
    
    /// Update exchange rate (admin only)
    public entry fun update_exchange_rate(admin: &signer, new_rate: u64) acquires TokenInfo, TokenEvents {
        let admin_addr = signer::address_of(admin);
        assert!(exists<TokenInfo>(admin_addr), E_NOT_INITIALIZED);
        
        let token_info = borrow_global_mut<TokenInfo>(admin_addr);
        assert!(token_info.admin == admin_addr, E_NOT_ADMIN);
        assert!(new_rate > 0, E_INVALID_AMOUNT);
        
        let old_rate = token_info.exchange_rate;
        token_info.exchange_rate = new_rate;
        
        // Emit event
        let events = borrow_global_mut<TokenEvents>(admin_addr);
        event::emit_event(&mut events.exchange_rate_updated_events, ExchangeRateUpdatedEvent {
            old_rate,
            new_rate,
            timestamp: timestamp::now_seconds(),
        });
    }
    
    /// Get token information
    public fun get_token_info(): (u64, u64, u64, u64) acquires TokenInfo {
        let admin_addr = get_admin_address();
        if (!exists<TokenInfo>(admin_addr)) {
            return (0, 0, 0, 0)
        };
        
        let token_info = borrow_global<TokenInfo>(admin_addr);
        (
            token_info.total_supply,
            token_info.total_burned,
            token_info.total_afjp_burned,
            token_info.exchange_rate
        )
    }
    
    /// Get user discount information
    public fun get_user_discount_info(user: address): (u64, u64, u8) acquires UserDiscountInfo {
        if (!exists<UserDiscountInfo>(user)) {
            return (0, 0, 0)
        };
        
        let user_info = borrow_global<UserDiscountInfo>(user);
        (
            user_info.total_discounts_used,
            user_info.last_discount_time,
            user_info.discount_tier
        )
    }
    
    /// Get discount system information
    public fun get_discount_system_info(): (u64, u64, u64) acquires DiscountSystem {
        let admin_addr = get_admin_address();
        if (!exists<DiscountSystem>(admin_addr)) {
            return (0, 0, 0)
        };
        
        let discount_system = borrow_global<DiscountSystem>(admin_addr);
        (
            discount_system.base_discount_rate,
            discount_system.max_discount_per_transaction,
            discount_system.total_discounts_applied
        )
    }
    
    /// Calculate Juventud tokens receivable for AFJP amount
    public fun calculate_juventud_for_afjp(afjp_amount: u64): u64 acquires TokenInfo {
        let admin_addr = get_admin_address();
        if (!exists<TokenInfo>(admin_addr)) {
            return 0
        };
        
        let token_info = borrow_global<TokenInfo>(admin_addr);
        afjp_amount * token_info.exchange_rate
    }
    
    /// Get balance of Juventud tokens
    public fun get_balance(user: address): u64 {
        coin::balance<JuventudToken>(user)
    }
    
    /// Get admin address
    fun get_admin_address(): address {
        @afjp_crypto
    }
    
    /// Check if token is initialized
    public fun is_initialized(): bool {
        exists<TokenCapabilities>(get_admin_address())
    }
    
    #[test_only]
    use aptos_framework::account as test_account;
    #[test_only]
    use aptos_framework::aptos_coin;
    // timestamp already imported at top
    
    #[test(admin = @afjp_crypto)]
    public fun test_juventud_initialize(admin: &signer) acquires TokenInfo {
        test_account::create_account_for_test(signer::address_of(admin));
        aptos_coin::ensure_initialized_with_apt_fa_metadata_for_test();
        timestamp::set_time_has_started_for_testing(&test_account::create_signer_for_test(@aptos_framework));
        
        initialize(admin);
        assert!(is_initialized(), 0);
        
        let (total_supply, total_burned, total_afjp_burned, exchange_rate) = get_token_info();
        assert!(total_supply == 0, 1);
        assert!(total_burned == 0, 2);
        assert!(total_afjp_burned == 0, 3);
        assert!(exchange_rate == 10, 4); // 1 AFJP = 10 JUVENTUD
    }
    
    #[test(admin = @afjp_crypto, user = @0x123)]
    public fun test_burn_afjp_for_juventud(admin: &signer, user: &signer) acquires TokenCapabilities, TokenInfo, TokenEvents {
        let user_addr = signer::address_of(user);
        
        // Setup
        test_account::create_account_for_test(signer::address_of(admin));
        test_account::create_account_for_test(user_addr);
        aptos_coin::ensure_initialized_with_apt_fa_metadata_for_test();
        timestamp::set_time_has_started_for_testing(&test_account::create_signer_for_test(@aptos_framework));
        
        // Initialize systems
        afjp_token::initialize(admin);
        initialize(admin);
        
        // Register and mint AFJP tokens for user
        coin::register<afjp_crypto::afjp_token::AFJPToken>(user);
        coin::register<JuventudToken>(user);
        afjp_token::mint(admin, user_addr, 1000);
        
        // Test burning AFJP for Juventud
        burn_afjp_for_juventud(user, 100); // Burn 100 AFJP
        
        // Should receive 100 * 10 = 1000 Juventud tokens
        assert!(get_balance(user_addr) == 1000, 1);
        assert!(afjp_token::get_balance(user_addr) == 900, 2); // 1000 - 100 burned
        
        let (total_supply, _, total_afjp_burned, _) = get_token_info();
        assert!(total_supply == 1000, 3);
        assert!(total_afjp_burned == 100, 4);
    }
    
    #[test(admin = @afjp_crypto)]
    public fun test_exchange_rate_calculation(admin: &signer) acquires TokenInfo {
        test_account::create_account_for_test(signer::address_of(admin));
        aptos_coin::ensure_initialized_with_apt_fa_metadata_for_test();
        timestamp::set_time_has_started_for_testing(&test_account::create_signer_for_test(@aptos_framework));
        
        initialize(admin);
        
        // Test calculation function
        let juventud_amount = calculate_juventud_for_afjp(500);
        assert!(juventud_amount == 5000, 1); // 500 * 10 = 5000
    }
}
