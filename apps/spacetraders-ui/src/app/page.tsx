'use client';

import styles from './page.module.css';
import { CreateNewAgentForm } from '@spacetraders/create-agent';

export default function Page() {
  return (
    <main className={styles.main}>
      <CreateNewAgentForm />
    </main>
  );
}
