import React from 'react'

export const HomePageText = () => (
  <section className="home-page-text">
    <div>
      <span className="pilea-logo">Pilea</span> is a minimalist personal
      financial tracker that provides insight into your financial health and
      history at a glance.
    </div>
    <br />
    <div>
      Tired of companies selling your data? Don't want to see credit card
      advertisements?
    </div>
    Give <span className="pilea-logo">Pilea</span> a shot.
    <ul>
      <li>
        We <i>never</i> sell your data.
      </li>
      <li>
        <i>No</i> advertisements.
      </li>
      <li>
        Your data is <i>always</i> encrypted.
      </li>
    </ul>
    <div>
      <span className="pilea-logo">Pilea</span> uses Plaid, an industry standard
      banking API to securely access your financial data.
    </div>
    <div>
      Learn more about it{' '}
      <a href="https://plaid.com/">
        <u>here</u>.
      </a>
    </div>
    <br />
    <div>
      Pilea is created and maintained by a single developer. Have questions or
      concerns or want to help add new features? Contact{' '}
      <a
        href="mailto:jason@mypilea.com?Subject=Pilea"
        target="_top"
        style={{ textDecoration: 'underline' }}
      >
        jason@mypilea.com
      </a>
    </div>
    <br />
    <div>View day-by-day historical balances across all your accounts:</div>
    <img
      src="https://pilea-assets.s3.us-east-2.amazonaws.com/Balances.png"
      alt="Balances"
      className="home-page-image"
    />
    <div>View historical transactions across all your accounts:</div>
    <img
      src="https://pilea-assets.s3.us-east-2.amazonaws.com/Transactions.png"
      alt="Transactions"
      className="home-page-image"
    />
    <div>Analyze your transactions with a Pivot table interface:</div>
    <img
      src="https://pilea-assets.s3.us-east-2.amazonaws.com/Pivot.png"
      alt="Pivot"
      className="home-page-image"
    />
  </section>
)
