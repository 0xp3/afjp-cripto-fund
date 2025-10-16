describe('Health Check', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have proper environment setup', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
