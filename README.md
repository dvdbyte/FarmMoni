# FarmMoni (Web): <a href="https://farmmonie.onrender.com" target="_blank">Visit Here</a>


<a href="https://shawncharles.com/travelara" target="_blank">
<img src="https://github.com/CharlesCreativeContent/CharlesCreativeContent/blob/main/images/gif1.gif?raw=true" width="100%" alt="FarmMoni Demo Video"/>
</a

A comprehensive **Fintech Investment Platform** designed to bridge the gap
between digital investors and real agricultural projects. FarmMoni allows
users to securely fund their wallets, invest in farm cycles, track returns,
and withdraw profits, while **administrators** manage the entire financial
and operational flow from a centralized dashboard.

The platform focuses on transparency, transactional integrity, and
real-world agricultural investment use cases.

---

## Tech Used

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Paystack](https://img.shields.io/badge/Paystack-0BA6FF?style=for-the-badge&logo=paystack&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)

---

## Key Learning Focus

The core learning objective of this project was building a **secure and
traceable financial loop**, ensuring money moves correctly and safely
through every stage of the system:

**Paystack Payment → User Wallet → Farm Investment → ROI Calculation →
Wallet Credit → Bank Withdrawal**

Each step was implemented with strict backend validations, balance checks,
and transaction logs to prevent inconsistencies, double spending, or data
loss.

---

## Optimizations

A major architectural consideration was **financial consistency**.

- All wallet updates were handled **server-side only** to prevent
  client-side manipulation.
- Investment and payout logic was isolated into dedicated services to
  ensure atomic transactions.
- Admin analytics leveraged **MongoDB Aggregation Pipelines** to generate
  investment summaries, ROI reports, and platform metrics efficiently.

### Future Improvements

Future iterations will focus on improving communication and reliability:

- **Email Notifications** using **Nodemailer** to notify users when:
  - Investments mature
  - Withdrawals are approved or declined
- **Queue-based webhook handling** to prevent missed Paystack callbacks
  during high traffic or server downtime.

---

## Lessons Learned

-   In **Fintech applications**, server uptime is critical. Relying on
    free-tier hosting introduced issues with *sleeping servers*, which
    caused missed payment webhooks.
-   I also learned the power of **MongoDB Aggregations** for generating
    complex admin statistics efficiently using a single query.
---

## Admin Capabilities

Admins can:

- Approve or reject withdrawals
- Create and manage farm investment cycles
- Monitor total platform inflow and outflow
- Track user investments and ROI performance

Access is protected using **JWT-based authentication** and role-based
authorization.

---

## Installation

```bash
git clone <repo-url>
cd <project-folder>
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory and add:

```env
MONGO_URI=your_mongodb_connection_string
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
JWT_SECRET=your_jwt_secret
```

---

## Usage

### Backend

```bash
npm run server
```

### Frontend

```bash
npm start
```



---

## More Projects

<table bordercolor="#66b2b2">
  
  <tr>
    <td width="33.3%"  style="align:center;" valign="top">
<a target="_blank" href="https://github.com/CharlesCreativeContent/Rigley2-FlappyBug">Rigley 2: Flappy Bug</a>
        <br />
      <a target="_blank" href="https://github.com/CharlesCreativeContent/Rigley2-FlappyBug">
            <img src="https://github.com/CharlesCreativeContent/CharlesCreativeContent/raw/main/images/gif2.gif" width="100%"  alt="Rigley 2: Flappy Bug"/>
        </a>
    </td>
    <td width="33.3%" valign="top">
<a target="_blank" href="https://github.com/CharlesCreativeContent/matching-card-game"> Matching Card Game</a>
      <br />
        <a target="_blank" href="https://github.com/CharlesCreativeContent/matching-card-game">
          <img src="https://github.com/CharlesCreativeContent/CharlesCreativeContent/raw/main/images/gif3.gif" width="100%" alt="Matching Card Game"/>
        </a>
    </td>
    <td width="33.3%" valign="top">
<a target="_blank" href="https://github.com/CharlesCreativeContent/Portfolio2021">Portfolio</a>
        <br />
        <a target="_blank" href="https://github.com/CharlesCreativeContent/Portfolio2021/">
          <img src="https://github.com/CharlesCreativeContent/CharlesCreativeContent/raw/main/images/gif4.gif" width="100%" alt="Portfolio"/>
        </a>
    </td>
  </tr>
</table>
