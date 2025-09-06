"use client"

import styles from './page.module.css';
import { AuthRegisterForm } from '@repo/ui-auth';

export default function Page() {
  return (
    <main className={styles.main}>
      <AuthRegisterForm />
    </main>
  );
}
