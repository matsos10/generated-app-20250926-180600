/**
 * Minimal real-world demo: One Durable Object instance per entity (User), with Indexes for listing.
 */
import { IndexedEntity } from "./core-utils";
import type { User } from "@shared/types";
import { MOCK_USERS } from "@shared/mock-data";
// USER ENTITY: one DO instance per user
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "", email: "", passwordHash: "", subscriptionTier: 'free' };
  static seedData = MOCK_USERS;
  // The default keyOf uses the `id` property, which we will set to the user's email.
}