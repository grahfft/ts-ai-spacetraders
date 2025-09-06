"use client"

import styles from './page.module.css';
import { AuthRegisterForm } from '@spacetraders/create-agent';

export default function Page() {
  return (
    <main className={styles.main}>
      <AuthRegisterForm />
    </main>
  );
}
