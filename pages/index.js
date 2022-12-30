import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Layout from '../component/Layout'
import styles from '../styles/Home.module.css'
import { POST, GET } from '../lib/axios'
import stripe from '../lib/stripe'

const IndexPage = (props) => {
  const router = useRouter()

  const post = async () => {
    const result = await POST('/api/create-connect-account', { name: 'test', email: 'test@mail.com'})
    await router.push(result.url)
  }

  return (
    <Layout>
      <main className={styles.main}>
        <h2 className={styles.title}>
          Stripe Connectのプロトタイプ
        </h2>
        <h2>ユーザー用のメニュー</h2>
        <div className={styles.grid}>	
          <Link href="customer/shop">
            <span className={styles.card}>	
              <h3>商品を購入する</h3>	
              <p>
                商品を購入する
              </p>
            </span>
          </Link>
          <Link href="customer/register">
            <span className={styles.card}>	
              <h3>クレジットカードを登録する</h3>	
              <p>
                商品を購入するためのクレジットカードを登録する
              </p>	
            </span>
          </Link>
        </div>
        <h2>店舗オーナー用のメニュー</h2>
        <div className={styles.grid}>	
          <Link href="owner/register">
            <span className={styles.card}>	
              <h3>店舗の登録</h3>	
              <p>
                店舗の銀行口座を登録する
              </p>
            </span>
          </Link>
          <Link href="owner/shop">
            <span className={styles.card}>	
              <h3>店舗の一覧</h3>	
              <p>
                口座登録が完了した店舗の一覧
              </p>
            </span>
          </Link>
        </div>
      </main>
    </Layout>
  )
}

export const getServerSideProps = async () => {
  const accounts = await stripe.accounts.list()

  const accountData = []
  accounts.data.forEach(account => {
    accountData.push({
      name: account.business_profile.name,
      id: account.id
    })
  })

  return {
    props: {
      accountData: accountData,
    }
  }
}

export default IndexPage
