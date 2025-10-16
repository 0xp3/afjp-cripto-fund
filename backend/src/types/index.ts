import { Request } from 'express';

// User types
export interface User {
  id: number;
  walletAddress: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  kycStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  walletAddress: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

// Token types
export type TokenType = 'AFJP' | 'JUVENTUD' | 'LADRILLO';

export interface TokenBalance {
  id: number;
  userId: number;
  tokenType: TokenType;
  balance: number;
  lockedBalance: number;
  updatedAt: Date;
}

export interface TokenTransaction {
  id: number;
  userId: number;
  tokenType: TokenType;
  transactionType: 'mint' | 'burn' | 'transfer' | 'stake' | 'unstake' | 'claim';
  amount: number;
  txHash?: string;
  blockNumber?: bigint;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: Date;
}

// Vesting types
export interface VestingSchedule {
  id: number;
  userId: number;
  totalAmount: number;
  releasedAmount: number;
  startTime: Date;
  endTime: Date;
  cliffTime?: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface CreateVestingRequest {
  beneficiary: string;
  amount: number;
}

// Staking types
export interface StakingRecord {
  id: number;
  userId: number;
  stakedAmount: number;
  rewardClaimed: number;
  stakedAt: Date;
  unstakedAt?: Date;
  isActive: boolean;
}

export interface StakingInfo {
  totalStaked: number;
  totalRewards: number;
  rewardRate: number;
  lastUpdateTime: number;
}

// Property types
export type PropertyType = 'building' | 'home' | 'tourism';

export interface Property {
  id: number;
  name: string;
  location: string;
  propertyType: PropertyType;
  totalValue: number;
  rentalIncome?: number;
  isTokenized: boolean;
  tokenId?: string;
  totalFractions?: bigint;
  ownerAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePropertyRequest {
  name: string;
  location: string;
  propertyType: PropertyType;
  value: number;
  rentalIncome?: number;
}

export interface PropertyAuction {
  id: number;
  propertyId: number;
  startingPrice: number;
  currentBid?: number;
  highestBidder?: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  createdAt: Date;
}

// Lending types
export interface Loan {
  id: number;
  borrowerId: number;
  collateralAmount: number;
  borrowedAmount: number;
  interestRate: number;
  startTime: Date;
  dueDate: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface CreateLoanRequest {
  collateralAmount: number;
  borrowAmount: number;
}

// Inheritance types
export interface Beneficiary {
  id: number;
  userId: number;
  beneficiaryAddress: string;
  isPrimary: boolean;
  distributionPercentage: number;
  createdAt: Date;
}

export interface InheritanceRequest {
  id: number;
  requesterId: number;
  deceasedAddress: string;
  requestTime: Date;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication types
export interface AuthenticatedRequest extends Request {
  user?: User;
  walletAddress?: string;
}

export interface WalletSignature {
  walletAddress: string;
  signature: string;
  message: string;
  timestamp: number;
}

// Aptos types
export interface AptosTransaction {
  hash: string;
  version: string;
  timestamp: string;
  changes: any[];
  events: any[];
  success: boolean;
  vm_status: string;
  gas_used: string;
  gas_unit_price: string;
}

export interface AptosResource {
  type: string;
  data: any;
}

// Error types
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Configuration types
export interface AppConfig {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  redisUrl: string;
  aptosNodeUrl: string;
  aptosFaucetUrl: string;
  afjpModuleAddress: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  corsOrigin: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  logLevel: string;
  logFile: string;
  healthCheckInterval: number;
}
