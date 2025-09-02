export async function getSubscriptionStatus(userId: string) {
  // This is where you'd integrate with Stripe, Paddle, or your billing provider
  // For now, returning mock data
  return {
    plan: 'free', // 'free', 'basic', 'premium', 'professional'
    status: 'active',
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false
  }
}