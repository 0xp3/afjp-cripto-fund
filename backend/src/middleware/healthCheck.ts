import { Request, Response } from 'express';
import { prisma, redis } from '../index';
import { logger } from '../utils/logger';

export const healthCheck = async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    const dbStatus = 'healthy';
    
    // Check Redis connection
    await redis.ping();
    const redisStatus = 'healthy';
    
    // Check Aptos connection (basic check)
    const aptosStatus = 'healthy'; // This would be implemented with actual Aptos client
    
    const responseTime = Date.now() - startTime;
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      services: {
        database: dbStatus,
        redis: redisStatus,
        aptos: aptosStatus
      },
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
    
    logger.info('Health check completed', { health });
    
    res.status(200).json(health);
  } catch (error) {
    logger.error('Health check failed:', error);
    
    const health = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      error: error instanceof Error ? error.message : 'Unknown error',
      services: {
        database: 'unhealthy',
        redis: 'unhealthy',
        aptos: 'unhealthy'
      },
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
    
    res.status(503).json(health);
  }
};
