import 'reflect-metadata';
import { initializeTransactionalContext } from 'typeorm-transactional';

// Initialize CLS namespace for @Transactional tests
try {
  initializeTransactionalContext();
} catch {}


