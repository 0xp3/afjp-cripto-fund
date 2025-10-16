/// AFJP Token Contract - Core Retirement Savings Token
/// Author: David M. (daveylupes) - https://github.com/daveylupes
/// Date: September 2025
/// Description: ERC20-style token with minting, burning, and transfer capabilities
///              for the AFJP crypto retirement platform
module afjp_crypto::afjp_token {
    use std::signer;
    use std::string;
    use aptos_framework::coin::{Self, BurnCapability, FreezeCapability, MintCapability};
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use aptos_framework::event::{Self, EventHandle};
    
    /// Error codes
    const E_NOT_ADMIN: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_NOT_INITIALIZED: u64 = 3;
    const E_INSUFFICIENT_BALANCE: u64 = 4;
    const E_INVALID_AMOUNT: u64 = 5;
    
    /// AFJP Token struct - this will be used as the coin type
    struct AFJPToken has key {}
    
    /// Capabilities for minting, burning, and freezing
    struct TokenCapabilities has key {
        mint_cap: MintCapability<AFJPToken>,
        burn_cap: BurnCapability<AFJPToken>,
        freeze_cap: FreezeCapability<AFJPToken>,
    }
    
    /// Token metadata and statistics
    struct TokenInfo has key {
        total_supply: u64,
        burned_amount: u64,
        admin: address,
    }
    
    /// Events
    struct TokenEvents has key {
        mint_events: EventHandle<MintEvent>,
        burn_events: EventHandle<BurnEvent>,
        transfer_events: EventHandle<TransferEvent>,
    }
    
    struct MintEvent has drop, store {
        amount: u64,
        recipient: address,
        timestamp: u64,
    }
    
    struct BurnEvent has drop, store {
        amount: u64,
        burner: address,
        timestamp: u64,
    }
    
    struct TransferEvent has drop, store {
        amount: u64,
        from: address,
        to: address,
        timestamp: u64,
    }
    
    /// Initialize the AFJP token
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Ensure not already initialized
        assert!(!exists<TokenCapabilities>(admin_addr), E_ALREADY_INITIALIZED);
        
        // Initialize the coin
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<AFJPToken>(
            admin,
            string::utf8(b"AFJP Token"),
            string::utf8(b"AFJP"),
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
            burned_amount: 0,
            admin: admin_addr,
        });
        
        // Initialize events
        move_to(admin, TokenEvents {
            mint_events: account::new_event_handle<MintEvent>(admin),
            burn_events: account::new_event_handle<BurnEvent>(admin),
            transfer_events: account::new_event_handle<TransferEvent>(admin),
        });
    }
    
    /// Mint tokens to a specific address (admin only)
    public entry fun mint(admin: &signer, recipient: address, amount: u64) acquires TokenCapabilities, TokenInfo, TokenEvents {
        let admin_addr = signer::address_of(admin);
        
        // Ensure initialized
        assert!(exists<TokenCapabilities>(admin_addr), E_NOT_INITIALIZED);
        assert!(amount > 0, E_INVALID_AMOUNT);
        
        let capabilities = borrow_global<TokenCapabilities>(admin_addr);
        let token_info = borrow_global_mut<TokenInfo>(admin_addr);
        let events = borrow_global_mut<TokenEvents>(admin_addr);
        
        // Ensure only admin can mint
        assert!(token_info.admin == admin_addr, E_NOT_ADMIN);
        
        // Mint the coins
        let coins = coin::mint<AFJPToken>(amount, &capabilities.mint_cap);
        
        // Deposit to recipient
        coin::deposit<AFJPToken>(recipient, coins);
        
        // Update total supply
        token_info.total_supply = token_info.total_supply + amount;
        
        // Emit event
        event::emit_event(&mut events.mint_events, MintEvent {
            amount,
            recipient,
            timestamp: timestamp::now_seconds(),
        });
    }
    
    /// Burn tokens from caller's account
    public entry fun burn(account: &signer, amount: u64) acquires TokenCapabilities, TokenInfo, TokenEvents {
        let account_addr = signer::address_of(account);
        
        // Get admin address (assuming it's the first account that initialized)
        // In a real implementation, you'd store this more systematically
        let admin_addr = get_admin_address();
        
        assert!(exists<TokenCapabilities>(admin_addr), E_NOT_INITIALIZED);
        assert!(amount > 0, E_INVALID_AMOUNT);
        
        let capabilities = borrow_global<TokenCapabilities>(admin_addr);
        let token_info = borrow_global_mut<TokenInfo>(admin_addr);
        let events = borrow_global_mut<TokenEvents>(admin_addr);
        
        // Check balance
        let balance = coin::balance<AFJPToken>(account_addr);
        assert!(balance >= amount, E_INSUFFICIENT_BALANCE);
        
        // Withdraw and burn
        let coins = coin::withdraw<AFJPToken>(account, amount);
        coin::burn<AFJPToken>(coins, &capabilities.burn_cap);
        
        // Update burned amount
        token_info.burned_amount = token_info.burned_amount + amount;
        
        // Emit event
        event::emit_event(&mut events.burn_events, BurnEvent {
            amount,
            burner: account_addr,
            timestamp: timestamp::now_seconds(),
        });
    }
    
    /// Transfer tokens from one account to another
    public entry fun transfer(from: &signer, to: address, amount: u64) acquires TokenEvents {
        let from_addr = signer::address_of(from);
        
        assert!(amount > 0, E_INVALID_AMOUNT);
        assert!(coin::balance<AFJPToken>(from_addr) >= amount, E_INSUFFICIENT_BALANCE);
        
        // Perform transfer
        coin::transfer<AFJPToken>(from, to, amount);
        
        // Emit event if events are initialized
        let admin_addr = get_admin_address();
        if (exists<TokenEvents>(admin_addr)) {
            let events = borrow_global_mut<TokenEvents>(admin_addr);
            event::emit_event(&mut events.transfer_events, TransferEvent {
                amount,
                from: from_addr,
                to,
                timestamp: timestamp::now_seconds(),
            });
        };
    }
    
    /// Get total supply of tokens
    public fun get_total_supply(): u64 acquires TokenInfo {
        let admin_addr = get_admin_address();
        if (exists<TokenInfo>(admin_addr)) {
            borrow_global<TokenInfo>(admin_addr).total_supply
        } else {
            0
        }
    }
    
    /// Get total burned amount
    public fun get_burned_amount(): u64 acquires TokenInfo {
        let admin_addr = get_admin_address();
        if (exists<TokenInfo>(admin_addr)) {
            borrow_global<TokenInfo>(admin_addr).burned_amount
        } else {
            0
        }
    }
    
    /// Get circulating supply (total - burned)
    public fun get_circulating_supply(): u64 acquires TokenInfo {
        get_total_supply() - get_burned_amount()
    }
    
    /// Get balance of an account
    public fun get_balance(account: address): u64 {
        coin::balance<AFJPToken>(account)
    }
    
    /// Get admin address (helper function)
    /// In a real implementation, this should be stored more systematically
    fun get_admin_address(): address {
        // This is a placeholder - in production, store admin address in a global resource
        @afjp_crypto
    }
    
    /// Check if token is initialized
    public fun is_initialized(): bool {
        exists<TokenCapabilities>(get_admin_address())
    }
    
    #[test_only]
    use aptos_framework::account as test_account;
    // Removed unused import
    #[test_only]
    use aptos_framework::aptos_coin;
    // timestamp already imported at top
    
    #[test_only]
    public fun setup_test_environment(admin: &signer, user: &signer) {
        let admin_addr = signer::address_of(admin);
        let user_addr = signer::address_of(user);
        
        // Create accounts
        test_account::create_account_for_test(admin_addr);
        test_account::create_account_for_test(user_addr);
        
        // Initialize AptosCoin for the test environment
        aptos_coin::ensure_initialized_with_apt_fa_metadata_for_test();
        
        // Initialize timestamp for testing
        timestamp::set_time_has_started_for_testing(&test_account::create_signer_for_test(@aptos_framework));
        
        // Initialize our token
        initialize(admin);
    }
    
    #[test(admin = @afjp_crypto)]
    public fun test_initialize(admin: &signer) {
        test_account::create_account_for_test(signer::address_of(admin));
        
        // Initialize AptosCoin first
        aptos_coin::ensure_initialized_with_apt_fa_metadata_for_test();
        
        // Initialize timestamp for testing
        timestamp::set_time_has_started_for_testing(&test_account::create_signer_for_test(@aptos_framework));
        
        initialize(admin);
        assert!(is_initialized(), 0);
    }
    
    #[test(admin = @afjp_crypto, user = @0x123)]
    public fun test_mint_and_balance(admin: &signer, user: &signer) acquires TokenCapabilities, TokenInfo, TokenEvents {
        let user_addr = signer::address_of(user);
        
        // Setup test environment
        setup_test_environment(admin, user);
        
        // Register user for coin
        coin::register<AFJPToken>(user);
        
        // Test minting
        mint(admin, user_addr, 1000);
        assert!(get_balance(user_addr) == 1000, 1);
        assert!(get_total_supply() == 1000, 2);
        assert!(get_circulating_supply() == 1000, 3);
    }
    
    #[test(admin = @afjp_crypto, user = @0x123)]
    public fun test_burn_functionality(admin: &signer, user: &signer) acquires TokenCapabilities, TokenInfo, TokenEvents {
        let user_addr = signer::address_of(user);
        
        // Setup test environment
        setup_test_environment(admin, user);
        
        // Register user for coin
        coin::register<AFJPToken>(user);
        
        // Mint tokens first
        mint(admin, user_addr, 1000);
        assert!(get_balance(user_addr) == 1000, 1);
        
        // Test burning
        burn(user, 300);
        assert!(get_balance(user_addr) == 700, 2);
        assert!(get_burned_amount() == 300, 3);
        assert!(get_total_supply() == 1000, 4); // Total supply stays same
        assert!(get_circulating_supply() == 700, 5); // Circulating decreases
    }
    
    #[test(admin = @afjp_crypto, user1 = @0x123, user2 = @0x456)]
    public fun test_transfer_functionality(
        admin: &signer, 
        user1: &signer, 
        user2: &signer
    ) acquires TokenEvents, TokenCapabilities, TokenInfo {
        let user1_addr = signer::address_of(user1);
        let user2_addr = signer::address_of(user2);
        
        // Setup test environment
        setup_test_environment(admin, user1);
        test_account::create_account_for_test(user2_addr);
        
        // Register users for coin
        coin::register<AFJPToken>(user1);
        coin::register<AFJPToken>(user2);
        
        // Mint tokens to user1
        mint(admin, user1_addr, 1000);
        assert!(get_balance(user1_addr) == 1000, 1);
        
        // Transfer from user1 to user2
        transfer(user1, user2_addr, 300);
        assert!(get_balance(user1_addr) == 700, 2);
        assert!(get_balance(user2_addr) == 300, 3);
    }
}
