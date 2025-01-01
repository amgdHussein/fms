# Database Schema

Schema for an online platform for managing invoices.

1. **User:**

   - Centralized table for managing users, which includes various roles such as Admin, Support, and User. Key attributes include email, phone number, address,
     and account status.

2. **Account:**

   - User can has multiple accounts. Account can has type (Business, Freelancer).
   - <!-- TODO -->
   - Role-based access, where certain features or data (within the organization) are only accessible by accounts with specific roles (e.g., admin, accountant).
   - Invited user(account) to work for an organization with specific role by invitation sent to email.
   - Can be switched between accounts in realtime on the front end.

3. **Account Preferences:**

   - User-specific preferences for display language and communication method (email or phone) to define how notifications are delivered and how the UI is
     displayed.

4. **Notifications, Logs, and Events:**

   - Tables for handling notifications, logs, and event tracking. These serve to monitor system activities and user interactions, ensuring comprehensive
   tracking and auditing capabilities.
   <!-- TODO -->
   - Automatically send reminders for unpaid invoices, upcoming payments, or due dates via email, SMS, or push notifications.
   - Add a customizable reminder schedule based on the invoice status (e.g., overdue, pending).

5. **Organization:**

   - A workspace that user can create new invoices and send it to client.
   - Organization primary currency only set once and can’t be changed.
   <!-- TODO -->
   - Organization can has multiple tax authority (new Collection).
   - taxDetails ⇒ etaSettings
     - invoiceVersion: eta invoice version like 1.0
     - activityCodes: eta invoice associated activity codes that comes from eta portal
     - issuer: some info to be used in mapping invoice to eta invoice

6. **Organization Branch:**

   - Organization can have multiple branches.
   - When invoice is issued, it will assigned to the organization branch. Therefor the invoice will have branch billing address and formatted date by branch
     timezone, etc.

7. **Organization Preferences:**

   - Organization can has multiple currencies, and each invoice currency should relay on the organization selected currencies. To allow client to only pay his
     invoice in the organization specific currencies.

8. **Client:**

   - An external user wants the Organization/Freelancer service.
     <!-- TODO -->
   - Give clients access to their invoices, payment history, and the ability to make online payments.
   - Include an option for clients to dispute or request modifications to an invoice directly through the portal.
   - taxInfo
     - type: eta client type
     - id: national id or any id for this client

9. **Invoice:**

   - Client Invoice, ETA Invoice, Subscription Invoice,
   - The invoice currency is displayed for the primary organization currency with the exchange rate (of invoice).
   <!-- TODO -->
   - Support recurring billing for clients who have monthly, quarterly, or yearly subscriptions. The system should automatically generate and send invoices.
   - Implement multi-language invoice support based on client preferences.
   - Make invoice sent in specific date or cycle

   - **ETA Invoice:**
     - **look for invoices if the invoice is new (add it), and check for status to update** Query for received eta invoice every 4 hours if etta active
     - **add retry mechanism for e invoice** Query after send e invoice for status
     - **add to queue** Retry mechanism for e invoice
     - **send invoice => queue (check if invoice is submitted), add anther queue send to client by email** change invoice cycle if eta send first to eta and if
       accepted and valid then sent to client by email

10. **Invoice Item:**

    - A product with price and quantity to apply taxes on it.

    - **Products & Stock Management:**

      - Predefined items (_products_) that can be used in any invoice withing the organization.
      - Each item has limited number of units, and every time the item included in the invoice and invoice was issued, the units will be decreased.

11. **Discounts & Promo Codes:**
    <!-- TODO -->

    - Add promo codes for special clients or during promotions.

12. **Taxation Support:**

    - Provide customizable tax rates based on the client’s country or region. This is crucial for global invoicing.
    - Support VAT, sales tax, or custom tax schemes.

    - **Tax Code:**
       <!-- TODO -->

      - codeType: eta code type
      - requestType: eta requestType either new or reuse old one from portal
      - itemCode: the unique id for the code
      - gpcItemLinkedCode: a global id the must be associated with the codes
      - requestReason: eta reason why the code is requested
      - egsRelatedLinkedCode: if this code is related to another one so add it
      - comment: used when requestType is reused Invoice
      - taxData: eta extra info used when map invoice to eta invoice _ taxpayerActivityCode: selected activity code from eta for this invoice _ taxStatus: the
        status of the doc in his way to eta _ uuid: eta uuid _ submissionUUID: eta submission uuid _ publicUrl: eta invoice url in the portal _
        submissionStatus: if the doc is accepted in first validation steps or not _ rejectDocument: if its rejected in first validation then save it here _
        etaError: any other error _ fullData: eta invoice full data from portal json _ documentDirection?: DocumentDirection; // Only applies to ETA documents
        (sent, received)

13. **Codes:**

    - An identifier for tax authorities to apply items on it.
    <!-- TODO -->
    - User can sync codes from eta portal (import codes trigger)
    - Cron job for submitted codes from eta portal (check code status)
    - Cron job for expired codes from eta portal (create index => code has expireAt, check if the expireAt is less than now (status = inactive))
    - **look for code if the code is new (add it), and check for status to update** Query for codes every 12 hours

14. **Payment & Payment Gateways:**
    <!-- TODO -->

    - Allow the system to track payments in different currencies and handle conversions.
    - Integrate with payment gateways such as Stripe, PayPal, or local payment processors to allow seamless payment processing.
    - Allow partial payments on invoices, where clients can make installments. Track outstanding balances for better financial planning.
    - Add a Payment Schedule feature that splits large invoices into smaller installments.

15. **Analytics & Reporting:**
    <!-- TODO -->

    - A user dashboard that offers analytics and quick summaries of invoice status, total outstanding payments, and performance insights.
    - Add financial and performance reporting for users and administrators, such as:
      - Outstanding invoices
      - Payments received over time
      - Client activity and spending behavior
      - Organization-level sales and profitability reports.

16. **Penalties and Late Fees:**
    <!-- TODO -->

    - Automatically calculate and apply penalties or late fees for overdue invoices, ensuring payment discipline among clients.

17. **Subscription:**

    - Define different plans that users or organizations can subscribe to (e.g., Basic, Pro, Enterprise). Each plan may have different features, pricing, usage
      limits, and billing cycles. Set usage limits or quotas for each subscription plan, such as API calls, storage, lesson bookings, etc.
    - Track which organizations are subscribed to which plans. Track of subscription status (active, expired, canceled), payment history, and start/end dates.

    <!-- TODO -->

    <!-- - Enable subscription billing, tracking clients who subscribe to ongoing services, and automatically managing renewals and cancellations. -->

    - Automatically generate invoices based on subscription plans and billing cycles (monthly, yearly). Manage automatic payments for recurring subscriptions,
      and handle manual payments as well.

---

- exception handling (custom exceptions entity)
  <!-- - organization tax support -->
  <!-- - tax code & eta integration -->
  <!-- - tax invoice & eta integration -->
- code cron jobs
- invoice cron jobs
- payment module
- account switching and module security
- subscription plans and limitations
- account invitation
- notifications & logs
- payment gateway integration
- client dashboard (to view payments and invoices)
- reports
