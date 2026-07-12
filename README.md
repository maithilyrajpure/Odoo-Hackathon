# EcoSphere: Circular ESG Ledger & Gamified Engagement Hub

EcoSphere is a real-time, circular ESG (Environmental, Social, Governance) platform designed for the **Odoo Hackathon**. Connected to a Supabase backend server, it bridges the gap between raw business operations and corporate sustainability auditing by translating actions into a live circular ESG ledger.

---

## 🚀 Key Features & Modules

### 🍀 1. Environmental: ERP Operations Logger & Ledger
* **ERP Carbon Logger**: Enter business logs (Logistics, Utilities, Heating, and Travel) and track carbon transactions in real-time.
* **Eco-Calculation Engine**: Live math formulas (`Quantity` × `Emission Factor`) shown directly in the UI before submission.
* **Manual Override**: Toggle-able setting to allow manual entry of CO₂ values if auto-calculation is disabled.
* **Reduction Targets**: Monitor progress toward reduction goals with auto-updating progress bar metrics.

### 🤝 2. Social: CSR Activities & Proof Uploads
* **CSR Campaigns & Sign-ups**: Employees can join CSR outreach programs to earn points/XP.
* **Dynamic Evidence Validation**: Upload proof files before enrolling. Form verification blocks entry if evidence is required.
* **Engagement Indicators**: Displays average tenure and equal pay scores to reflect social health metrics.

### ⚖️ 3. Governance: Auditor Timelines & Violation Logs
* **Auditor Signature Timeline**: Formatted chronological timeline displaying policy signatures with precise timestamp logging.
* **Violation Tickets**: Raise and audit compliance issues, assign owners, set severity ranks, and dispatch automated notification alerts.

### 🏆 4. Gamification: Leaderboards & Auto Badges
* **Challenge Lifecycle**: Multi-stage state machine (Draft ➔ Active ➔ Joined ➔ Under Review ➔ Approved ➔ Completed). Draft challenges are hidden from employees.
* **Department Leaderboard**: Sorted ranking panel on the dashboard highlighting scores across departments.
* **Auto-Awarding Badges**: Automatically unlocks badges based on criteria (e.g., `Green Beginner` on the first approved challenge, `Team Player` on the third CSR campaign approval).

### 📊 5. Reports: Unified Custom Builder & PDF Export
* **Section-Based Queries**: Filter data and toggle checkboxes to include/exclude summary charts, carbon tables, CSR actions, or compliance tickets.
* **Print-Optimized Stylesheet**: Click "Export PDF" to hide sidebar controls, header items, and buttons, generating a clean print layout sheet.

---

## 🛠️ Technology Stack
* **Frontend**: React (Vite environment, SPA router)
* **Styling**: Vanilla CSS with glassmorphic cards and dark-mode aesthetic
* **Database & Auth**: Supabase JS Client with client-side multi-tenant localStorage fallbacks
* **Visualizations**: Recharts for carbon trajectory lines and distribution charts
* **Iconography**: Lucide React Icons

---

## 💻 Quick Start & Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Credentials
Create a `.env` file in the root directory by copying the example environment file:
```bash
cp .env.example .env
```
*(The pre-configured hackathon database keys are already present inside `.env.example` for instant setup.)*

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build Client Environment for Production
```bash
npm run build
```
The compiled output will be generated inside the `dist/` directory.
