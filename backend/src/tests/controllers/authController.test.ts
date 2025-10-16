import request from 'supertest';
import app from '../../index';
import { mockPrisma } from '../setup';

describe('AuthController', () => {
  describe('POST /api/auth/wallet-connect', () => {
    it('should connect wallet successfully', async () => {
      const walletData = {
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        signature: '0xsignature',
        message: 'test message',
        timestamp: Date.now()
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 1,
        walletAddress: walletData.walletAddress,
        kycStatus: 'pending'
      });

      const response = await request(app)
        .post('/api/auth/wallet-connect')
        .send(walletData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.walletAddress).toBe(walletData.walletAddress);
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/wallet-connect')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Missing required fields');
    });

    it('should return 401 for expired request', async () => {
      const walletData = {
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        signature: '0xsignature',
        message: 'test message',
        timestamp: Date.now() - 400000 // 6+ minutes ago
      };

      const response = await request(app)
        .post('/api/auth/wallet-connect')
        .send(walletData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Request expired');
    });
  });

  describe('POST /api/auth/verify-signature', () => {
    it('should verify signature successfully', async () => {
      const signatureData = {
        address: '0x1234567890abcdef1234567890abcdef12345678',
        signature: '0xsignature',
        message: 'test message'
      };

      const response = await request(app)
        .post('/api/auth/verify-signature')
        .send(signatureData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('verified');
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/verify-signature')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Missing required fields');
    });
  });
});
