import { PrismaClient } from '@prisma/client';

// Mock Prisma client for testing
export const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  tokenBalance: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  tokenTransaction: {
    findMany: jest.fn(),
    create: jest.fn(),
    aggregate: jest.fn(),
  },
  vestingSchedule: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  stakingRecord: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  property: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  propertyAuction: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  loan: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  beneficiary: {
    findMany: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
  inheritanceRequest: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $queryRaw: jest.fn(),
};

// Mock the prisma module
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

// Mock Redis
jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn(),
    quit: jest.fn(),
    ping: jest.fn(),
  })),
}));

// Mock Aptos service
jest.mock('../services/aptosService', () => ({
  aptosService: {
    getTokenBalance: jest.fn(),
    executeTransaction: jest.fn(),
    contribute: jest.fn(),
    burnAFJPForJuventud: jest.fn(),
    burnAFJPForLadrillo: jest.fn(),
    stakeTokens: jest.fn(),
    unstakeTokens: jest.fn(),
    claimRewards: jest.fn(),
    releaseVestedTokens: jest.fn(),
    createLoan: jest.fn(),
    repayLoan: jest.fn(),
    designateBeneficiaries: jest.fn(),
    registerProperty: jest.fn(),
    tokenizeProperty: jest.fn(),
    getVestingInfo: jest.fn(),
    getStakingInfo: jest.fn(),
    getLoanInfo: jest.fn(),
    getPropertyInfo: jest.fn(),
  },
}));

// Set up test environment
beforeEach(() => {
  jest.clearAllMocks();
});

// Global test utilities
(global as any).mockPrisma = mockPrisma;
