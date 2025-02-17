import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';

import { StripeConfigs } from './stripe.config';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(readonly configs: StripeConfigs) {
    this.stripe = new Stripe(configs.apiKey, {
      apiVersion: '2025-01-27.acacia',
    });

    this.logger.log('StripeService initialized with API version 2024-11-20');
  }

  async getProducts(): Promise<Stripe.Product[]> {
    try {
      const products = await this.stripe.products.list();
      this.logger.log('Products fetched successfully');
      return products.data;
    } catch (error) {
      this.logger.error('Failed to fetch products from Stripe', error.stack);
      throw new Error('Unable to fetch products from Stripe');
    }
  }

  // ? Customers

  /**
   * Retrieves a customer by their ID from the Stripe API.
   *
   * @param {string} id - the ID of the customer to retrieve
   * @return {Promise<Stripe.Customer>} a Promise that resolves to the retrieved customer
   */
  async getCustomer(id: string): Promise<Stripe.Customer> {
    return await this.stripe.customers
      .retrieve(id)
      .then(res => res as Stripe.Customer)
      .catch(error => {
        throw new NotFoundException(`The customer with specified id(${id}) does not exist!`);
      });
  }

  /**
   * Retrieves customers by email.
   *
   * @param {string} email - the email of the customer
   * @return {Promise<Stripe.Customer[]>} a promise that resolves to an array of Customer objects
   */
  async getCustomersByEmail(email: string): Promise<Stripe.Customer[]> {
    return await this.stripe.customers
      .list({ email })
      .then(res => res.data)
      .catch(error => {
        throw new InternalServerErrorException(`Something went wrong while fetching the customer with (${email})!`);
      });
  }

  /**
   * Retrieves customers from the stripe API.
   *
   * @param {number} limit - The maximum number of customers to retrieve
   * @param {string} startId - The ID of the customer to start retrieving from
   * @return {Promise<Stripe.Customer[]>} A promise that resolves to an array of Customer objects
   */
  async getCustomers(limit: number = 10, startId?: string): Promise<Stripe.Customer[]> {
    const customers: Stripe.Customer[] = [];

    let hasMore = true;

    while (hasMore && limit) {
      const items: number = Math.min(limit, 100);

      const currentCustomers = await this.stripe.customers
        .list({
          limit: items,
          starting_after: startId,
        })
        .catch(error => {
          throw new InternalServerErrorException('Something went wrong while fetching customers!');
        });

      customers.push(...currentCustomers.data);

      startId = customers.at(-1)?.id;
      hasMore = currentCustomers.has_more;
      limit -= items;
    }

    return customers;
  }

  /**
   * Query customers.
   *
   * @link https://docs.stripe.com/api/customers/search
   *
   * @param {string} query - the search query string
   * @param {number} [limit] - a limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10
   * @param {string} [page] - a cursor for pagination across multiple pages of results. Don't include this parameter on the first call. Use the next_page value returned in a previous response to request subsequent results
   * @return {Promise<Stripe.ApiSearchResultPromise<Stripe.Customer>>} a promise resolving to the search result
   *
   * @example
   * FIELD       USAGE                        TYPE (TOKEN, STRING, NUMERIC)
   * created     created>1620310503           numeric
   * email       email~"amyt"                 string
   * metadata    metadata["key"]:"value"      token
   * name        name~"amy"                   string
   * phone       phone:"+19999999999"         string
   */
  async queryCustomers(query: string, limit?: number, page?: string): Promise<Stripe.Customer[]> {
    return await this.stripe.customers
      .search({ query, limit, page })
      .then(res => res.data)
      .catch(error => {
        throw new InternalServerErrorException('Something went wrong while querying the customers!');
      });
  }

  /**
   * Create a new customer with the given name, email, phone, and address.
   *
   * @param {string} name - the name of the customer
   * @param {string} email - the email of the customer
   * @param {string} [phone] - the phone number of the customer (optional)
   * @param {Stripe.AddressParam} [address] - the address of the customer (optional)
   * @return {Promise<Stripe.Customer>} the newly created customer
   */
  async addCustomer(name: string, email: string, phone?: string, address?: Stripe.AddressParam): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({ name, email, phone, address }).catch(error => {
      throw new InternalServerErrorException('Can not create a new customer!');
    });
  }

  /**
   * Delete a customer by ID.
   * @link https://docs.stripe.com/api/customers/delete
   *
   * @param {string} id - The ID of the customer to be deleted
   * @return {Promise<Stripe.Response<Stripe.DeletedCustomer>>} A promise that resolves to the deleted customer
   */
  async deleteCustomer(id: string): Promise<Stripe.DeletedCustomer> {
    return await this.stripe.customers.del(id).catch(error => {
      throw new InternalServerErrorException('Error while deleting the customer!');
    });
  }

  /**
   * Retrieves the balance transactions history for the account.
   * @link https://stripe.com/docs/api/balance_transactions/list
   * @return {Promise<Stripe.ApiList<any>>} A promise that resolves to the balance transactions history
   */
  async getBalanceTransactions(): Promise<Stripe.ApiList<any>> {
    return this.stripe.balanceTransactions.list().catch(error => {
      throw new InternalServerErrorException('Error while retrieving the balance!');
    });
  }

  // Checkout sessions

  async addSession(): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'egp',
            product_data: {
              name: 'Yearly subscription',
            },
            unit_amount: 4200,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:4200/success',
      cancel_url: 'http://localhost:4200/settings',
    });
  }

  // ? Payments

  /**
   * Retrieves a payment intent by its ID.
   *
   * @param {string} id - The ID of the payment intent to retrieve
   * @return {Promise<PaymentIntent>} The retrieved payment intent
   */
  async getPayment(id: string): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents
      .retrieve(id)
      .then(res => res)
      .catch(error => {
        throw new NotFoundException(`The payment with specified id(${id}) does not exist!`);
      });
  }

  /**
   * Retrieves payment intents within a specified range.
   *
   * @param {number} start - the start of the range
   * @param {number} end - the end of the range
   * @return {Promise<Stripe.PaymentIntent[]>} an array of payment intents within the specified range
   */
  async getPayments(start: number, end: number): Promise<Stripe.PaymentIntent[]> {
    const payments: Stripe.PaymentIntent[] = [];

    const rangeQuery: Stripe.RangeQueryParam = { gte: start, lte: end };
    let hasMore: boolean = false;

    do {
      const currentPayments = await this.stripe.paymentIntents
        .list({
          created: rangeQuery,
          limit: 100,
          starting_after: payments.at(-1)?.id,
        })
        .catch(error => {
          throw new InternalServerErrorException('Something went wrong while fetching the payments!');
        });

      payments.push(...currentPayments.data);
      hasMore = currentPayments.has_more;
    } while (hasMore);

    return payments;
  }

  /**
   * Retrieves the payment intents for a specific customer.
   *
   * @param {string} customerId - The ID of the customer
   * @return {Promise<Stripe.PaymentIntent[]>} A Promise that resolves to an array of PaymentIntent objects
   */
  async getCustomerPayments(customerId: string): Promise<Stripe.PaymentIntent[]> {
    return await this.stripe.paymentIntents
      .list({
        limit: 100,
        customer: customerId,
      })
      .then(res => res.data)
      .catch(error => {
        throw new InternalServerErrorException('Something went wrong while fetching the payments!');
      });
  }

  /**
   * Add a new payment using the given amount, customer, description, currency, and confirmation status.
   *
   * @link https://docs.stripe.com/api/payment_intents/create
   * @param {number} amount - The amount of the payment
   * @param {string} customer - The customer's identifier
   * @param {string} description - The description of the payment
   * @param {string} currency - (Optional) The currency of the payment (default is 'usd')
   * @param {boolean} confirm - (Optional) The confirmation status of the payment (default is false)
   * @return {Promise<Stripe.PaymentIntent>} The created payment intent
   */
  async addPayment(amount: number, customer: string, description: string, currency: string = 'usd', confirm: boolean = false): Promise<Stripe.PaymentIntent> {
    this.logger.log('customer', customer);
    return await this.stripe.paymentIntents
      .create({
        amount,
        currency,
        customer,
        description,
        confirm,
      })
      .then(res => res)
      .catch(error => {
        throw new InternalServerErrorException('Something went wrong while adding a new payment!');
      });
  }

  /**
   * Asynchronously cancels a payment using the provided id.
   *
   * @param {string} id - The id of the payment to be canceled
   * @return {Promise<Stripe.PaymentIntent>} A Promise resolving to the canceled PaymentIntent
   */
  async cancelPayment(id: string): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.cancel(id).catch(error => {
      throw new InternalServerErrorException('Error while cancelling the payment!');
    });
  }

  // ? Invoices

  /**
   * Retrieves a Stripe invoice by ID.
   *
   * @param {string} id - the ID of the invoice to retrieve
   * @return {Promise<Stripe.Invoice>} the retrieved invoice
   */
  async getInvoice(id: string): Promise<Stripe.Invoice> {
    return await this.stripe.invoices.retrieve(id).catch(error => {
      throw new NotFoundException(`The invoice with specified id(${id}) does not exist!`);
    });
  }

  /**
   * Retrieves invoices from Stripe with optional limit and starting ID.
   *
   * @param {number} limit - The maximum number of invoices to retrieve
   * @param {string} [startId] - The starting ID for fetching invoices
   * @return {Promise<Stripe.Invoice[]>} A promise that resolves to an array of Stripe invoices
   */
  async getInvoices(limit: number = 10, startId?: string): Promise<Stripe.Invoice[]> {
    const invoices: Stripe.Invoice[] = [];

    let hasMore: boolean = true;

    while (hasMore && limit) {
      const items: number = Math.min(limit, 100);

      const currentCustomers = await this.stripe.invoices
        .list({
          limit: items,
          starting_after: startId,
        })
        .catch(error => {
          throw new InternalServerErrorException('Something went wrong while fetching invoices!');
        });

      invoices.push(...currentCustomers.data);

      startId = invoices.at(-1)?.id;
      hasMore = currentCustomers.has_more;
      limit -= items;
    }

    return invoices;
  }

  /**
   * Asynchronously queries invoices.
   *
   * @param {string} query - the query string
   * @param {number} [limit] - the maximum number of results to return
   * @param {string} [page] - the pagination cursor
   * @return {Promise<Stripe.Invoice[]>} the array of invoices
   *
   * @example
   * FIELD          USAGE                         TYPE (TOKEN, STRING, NUMERIC)
   * created        created>1620310503            numeric
   * customer       customer:"cus_123"            token
   * metadata       metadata["key"]:"value"       token
   * number         number:"MYSHOP-123"           string
   * receipt_number receipt_number:"RECEIPT-123"  string
   * status         status:"open"                 string
   * subscription   subscription:"SUBS-123"       string
   * total          total>1000                    numeric
   */
  async queryInvoices(query: string, limit?: number, page?: string): Promise<Stripe.Invoice[]> {
    return await this.stripe.invoices
      .search({ query, limit, page })
      .then(res => res.data)
      .catch(error => {
        throw new InternalServerErrorException('Something went wrong while querying the invoices!');
      });
  }

  /**
   * Creates an invoice for the given customer with the provided description and currency.
   *
   * @param {string} customer - The customer for whom the invoice is created
   * @param {string} description - The description of the invoice
   * @param {string} currency - The currency for the invoice (default is 'usd')
   * @param {Stripe.InvoiceCreateParams.CollectionMethod} collectionMethod - The collection method for the invoice (default is 'charge_automatically')
   * @return {Promise<Stripe.Invoice>} The created invoice
   */
  async addInvoice(
    customer: string,
    description: string,
    currency: string = 'usd',
    collectionMethod?: Stripe.InvoiceCreateParams.CollectionMethod,
  ): Promise<Stripe.Invoice> {
    return await this.stripe.invoices
      .create({
        customer,
        description,
        currency,
        collection_method: collectionMethod,
      })
      .catch(error => {
        throw new InternalServerErrorException('Error while adding an invoice!');
      });
  }

  /**
   * Deletes an invoice by ID.
   *
   * @param {string} id - The ID of the invoice to delete.
   * @return {Promise<Stripe.DeletedInvoice>} A promise that resolves with the deleted invoice.
   */
  async deleteInvoice(id: string): Promise<Stripe.DeletedInvoice> {
    return await this.stripe.invoices.del(id).catch(error => {
      throw new InternalServerErrorException('Error while deleting the invoice!');
    });
  }

  /**
   * To add an invoice item.
   *
   * @param {string} customer - the customer ID
   * @param {string} invoice - the invoice ID
   * @param {string} price - the price of the item
   * @param {number} quantity - the quantity of the item
   * @param {string} [description] - optional description of the item
   * @param {string} [currency='usd'] - the currency for the item
   * @return {Promise<Stripe.InvoiceItem>} a promise that resolves to the created invoice item
   */
  async addInvoiceItem(
    customer: string,
    invoice: string,
    price: string,
    quantity: number,
    description?: string,
    currency: string = 'usd',
  ): Promise<Stripe.InvoiceItem> {
    return this.stripe.invoiceItems.create({ customer, invoice, price, quantity, description, currency }).catch(error => {
      throw new InternalServerErrorException('Error while adding new invoice item!');
    });
  }

  /**
   * Updates an invoice item in the Stripe API.
   *
   * @param {string} id - The ID of the invoice item to update.
   * @param {{ price?: string; quantity?: number; description?: string }} params - Optional parameters for updating the invoice item.
   * @return {Promise<Stripe.InvoiceItem>} The updated invoice item.
   */
  async updateInvoiceItem(id: string, params?: { price?: string; quantity?: number; description?: string }): Promise<Stripe.InvoiceItem> {
    return await this.stripe.invoiceItems.update(id, params).catch(error => {
      throw new InternalServerErrorException('Error while updating the invoice item!');
    });
  }

  /**
   * To delete an invoice item.
   *
   * @param {string} id - the ID of the invoice item to be deleted
   * @return {Promise<Stripe.DeletedInvoiceItem>} a promise that resolves with the deleted invoice item
   */
  async deleteInvoiceItem(id: string): Promise<Stripe.DeletedInvoiceItem> {
    return await this.stripe.invoiceItems.del(id).catch(error => {
      throw new InternalServerErrorException('Error while deleting the invoice item!');
    });
  }

  // ? Webhooks

  /**
   * Handles a Stripe webhook event.
   *
   * @param {Stripe.Event} event - The webhook event received from Stripe.
   * @return {Promise<string>} A promise that resolves with a string indicating the type of event that was handled:
   *    - 'payment_succeeded' if the event was an 'invoice.payment_succeeded' event
   *    - 'payment_failed' if the event was an 'invoice.payment_failed' event
   *    - null if the event was not handled
   */
  async handleWebhook(event: Stripe.Event): Promise<string> {
    // Handle the event
    switch (event.type) {
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        this.logger.log(`Invoice payment succeeded: ${invoice.id}`);
        return 'payment_succeeded';

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        this.logger.log(`Invoice payment failed: ${failedInvoice.id}`);
        return 'payment_failed';

      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
        return null;
    }
  }

  /**
   * Adds a new webhook endpoint to Stripe to receive webhooks for successful and failed invoice payments.
   *
   * The webhook endpoint will be created with the following settings:
   * - URL: `${process.env.PROD_URL}/payments/stripe/handle-webhook`
   * - Enabled events: `invoice.payment_succeeded` and `invoice.payment_failed`
   *
   * If the webhook endpoint cannot be created, an `InternalServerErrorException` will be thrown.
   *
   * @return {Promise<Stripe.WebhookEndpoint>} A promise that resolves with the created webhook endpoint
   */
  async addWebhookEndpoint(): Promise<Stripe.WebhookEndpoint> {
    return this.stripe.webhookEndpoints
      .create({
        url: `${process.env.PROD_URL}/payments/stripe/handle-webhook`,
        enabled_events: ['invoice.payment_succeeded', 'invoice.payment_failed'],
      })
      .catch(error => {
        throw new InternalServerErrorException(error);
      });
  }

  // Payment Invoice
  // async createStripeInvoice(mofawtarInvoice: Invoice): Promise<Stripe.Invoice> {
  //   try {
  //     const customerSearchResult = await this.stripe.customers.search({
  //       query: `email:"${mofawtarInvoice.receiver.email}"`,
  //     });
  //     let customer: Stripe.Customer;
  //     if (customerSearchResult.data.length > 0) {
  //       this.logger.log('Customer already exists');
  //       customer = customerSearchResult.data[0];
  //     } else {
  //       this.logger.log('Create new customer');
  //       customer = await this.stripe.customers.create({
  //         name: `Created By Mofawtar: Invoice for ${mofawtarInvoice.receiver.name}` || 'Mofawtar Client',
  //         email: mofawtarInvoice.receiver.email || 'defaultemail@gmail.com',
  //         phone:
  //           mofawtarInvoice.receiver.phone && mofawtarInvoice.receiver.phone.value
  //             ? `${mofawtarInvoice.receiver.phone.code}${mofawtarInvoice.receiver.phone.value}`
  //             : '',
  //         metadata: {
  //           preferred_currency: mofawtarInvoice.currency.code.toString().toLowerCase(),
  //         },
  //       });
  //     }
  //     const product = await this.stripe.products.create({
  //       name: `Created By Mofawtar: Invoice for ${customer.name}`,
  //       type: 'service',
  //     });
  //     const price = await this.stripe.prices.create({
  //       unit_amount: Math.round(parseFloat(mofawtarInvoice.totalAmount.toFixed(2)) * 100),
  //       currency: mofawtarInvoice.currency.code.toString().toLowerCase(),
  //       product: product.id,
  //     });
  //     const invoice = await this.stripe.invoices.create({
  //       customer: customer.id,
  //       collection_method: 'send_invoice',
  //       description: `Created By Mofawtar: Invoice for ${customer.name}`,
  //       days_until_due: 30, //TODO Can be changed
  //       payment_settings: {
  //         payment_method_types: ['card'], //TODO Can be changed
  //       },
  //       auto_advance: true,
  //       pending_invoice_items_behavior: 'exclude',
  //       currency: customer.metadata.preferred_currency,
  //       metadata: {
  //         mofawtarInvoice: mofawtarInvoice.id,
  //       },
  //     });
  //     const invoiceItem = await this.stripe.invoiceItems.create({
  //       customer: customer.id,
  //       price: price.id,
  //       invoice: invoice.id,
  //       currency: customer.metadata.preferred_currency,
  //     });
  //     const finalizedInvoice = await this.stripe.invoices.finalizeInvoice(invoice.id);
  //     return finalizedInvoice;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
}
