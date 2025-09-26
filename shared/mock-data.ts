import type { User } from "./types";
// In a real app, you'd likely have a password hashing library. For this demo, we'll use a simple mock hash.
export const MOCK_USERS: ReadonlyArray<User> = [
  {
    id: 'user1@example.com',
    name: 'Alice',
    email: 'user1@example.com',
    passwordHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', // 'password123'
    subscriptionTier: 'pro',
  },
  {
    id: 'user2@example.com',
    name: 'Bob',
    email: 'user2@example.com',
    passwordHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', // 'password123'
    subscriptionTier: 'free',
  },
];