import stripe from '../../lib/stripe'

export default async (req, res) => {
  try {
    // Stripe用の connected accountを作成する
    // このタイミングでアカウントのタイプを選択する（今回は'express'）
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'JP',
      capabilities: {card_payments: {requested: true}, transfers: {requested: true}}, // 追加
    })
    console.log('create account!', account)
    
    // なぜか最初の作成でrequestedにならないので、APIで上書き
    // https://stripe.com/docs/connect/account-capabilities?locale=ja-JP

    const connected_id = account.id;
    
    const capability = await stripe.accounts.updateCapability(
      connected_id,
      'card_payments',
      // 'transfers',
      {requested: true}
    );
    const capability_update = await stripe.accounts.retrieveCapability(
      connected_id,
      'card_payments'
    );
    const account_update = await stripe.accounts.retrieve(connected_id);
    console.log('account_update : ', account_update)
    console.log('capability_update : ', capability_update)

    // 作成したconnected accountのidから口座登録用のURLを発行する。
    const origin = process.env.NODE_ENV === 'development' ? `http://${req.headers.host}` : `https://${req.headers.host}`
    const accountLinkURL = await generateAccountLink(account.id, origin)
  
    res.statusCode = 200
    res.json({ url: accountLinkURL })
  } catch (err) {
    res.status(500).send({
      error: err.message
    });
  }
}

function generateAccountLink(accountID, origin) {
  return stripe.accountLinks.create({
    type: "account_onboarding",
    account: accountID,
    refresh_url: `${origin}/onboard-user/refresh`,
    return_url: `${origin}/success`,
  }).then((link) => link.url);
}
