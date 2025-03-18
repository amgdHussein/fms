import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';

import { CurrencyCode } from '../../enums';
import { StripeConfigs } from './stripe.config';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(readonly configs: StripeConfigs) {
    this.stripe = new Stripe(configs.secretKey, {
      apiVersion: '2025-01-27.acacia', //TODO: UPDATE STRIPE VERSION
    });

    // TODO:CHECK IF FIRST TIME THEN SET WEEBHOOKS ELSE DO NOTHING
    // create webhook

    this.logger.log('StripeService initialized with API version 2024-11-20');
  }

  // ? Products

  async addProduct(name: string, type: 'good' | 'service', description?: string): Promise<Stripe.Product> {
    return this.stripe.products.create({
      name,
      type,
      description,
    });
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

  // ? Prices

  async addPrice(productId: string, amount: number, currency: CurrencyCode): Promise<Stripe.Price> {
    return this.stripe.prices.create({
      product: productId,
      unit_amount: Math.round(parseFloat(amount.toFixed(2)) * 100),
      currency: currency.toLowerCase(),
    });
  }

  // ? Customers

  /**
   * Retrieves a customer by their ID from the Stripe API.
   *
   * @param {string} id - the ID of the customer to retrieve
   * @return {Promise<Stripe.Customer>} a Promise that resolves to the retrieved customer
   */
  async getCustomer(id: string): Promise<Stripe.Customer> {
    return this.stripe.customers
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
    return this.stripe.customers
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
    return this.stripe.customers
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
  async addCustomer(name: string, email: string, phone?: string, address?: Stripe.AddressParam, metadata?: Stripe.Metadata): Promise<Stripe.Customer> {
    return this.stripe.customers.create({ name, email, phone, address, metadata }).catch(error => {
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
    return this.stripe.customers.del(id).catch(error => {
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

  // ? Checkout sessions

  async addSession(): Promise<Stripe.Checkout.Session> {
    // * TEST
    return;
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
    return this.stripe.paymentIntents
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
    return this.stripe.paymentIntents
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
    return this.stripe.paymentIntents
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
    return this.stripe.paymentIntents.cancel(id).catch(error => {
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
    return this.stripe.invoices.retrieve(id).catch(error => {
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
    return this.stripe.invoices
      .search({ query, limit, page })
      .then(res => res.data)
      .catch(error => {
        throw new InternalServerErrorException('Something went wrong while querying the invoices!');
      });
  }

  /**
   * Create a new invoice.
   *
   * @param {string} customer - the customer identifier
   * @param {string} description - the description of the invoice
   * @param {CurrencyCode} [currency='usd'] - the currency of the invoice
   * @param {Stripe.InvoiceCreateParams.CollectionMethod} [collectionMethod] - the collection method of the invoice
   * @param {Stripe.InvoiceCreateParams.PaymentSettings} [paymentSettings] - the payment settings of the invoice
   * @param {boolean} [autoAdvance] - Whether to automatically advance the invoice to paid status once the payment is successful.
   * @param {number} [daysUntilDue=30] - Number of days until the invoice is due
   * @param {Stripe.MetadataParam} [metadata] - The metadata associated with the invoice
   * @return {Promise<Stripe.Invoice>} the created invoice
   */
  async addInvoice(
    customer: string,
    description: string,
    currency?: CurrencyCode,
    collectionMethod?: Stripe.InvoiceCreateParams.CollectionMethod,
    paymentSettings?: Stripe.InvoiceCreateParams.PaymentSettings,
    autoAdvance?: boolean,
    daysUntilDue: number = 30,
    metadata?: Stripe.MetadataParam,
  ): Promise<Stripe.Invoice> {
    return this.stripe.invoices
      .create({
        customer,
        description,
        currency: currency.toLowerCase() || 'usd',
        collection_method: collectionMethod,
        payment_settings: paymentSettings,
        auto_advance: autoAdvance,
        days_until_due: daysUntilDue,
        metadata,
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
    return this.stripe.invoices.del(id).catch(error => {
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
    currency?: CurrencyCode,
  ): Promise<Stripe.InvoiceItem> {
    return this.stripe.invoiceItems.create({ customer, invoice, price, quantity, description, currency: currency.toLowerCase() || 'usd' }).catch(error => {
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
    return this.stripe.invoiceItems.update(id, params).catch(error => {
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
    return this.stripe.invoiceItems.del(id).catch(error => {
      throw new InternalServerErrorException('Error while deleting the invoice item!');
    });
  }

  /**
   * Finalizes an invoice by its ID.
   *
   * @param {string} invoiceId - The ID of the invoice to finalize.
   * @return {Promise<Stripe.Invoice>} A promise that resolves to the finalized invoice.
   */
  async finalizeInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    return this.stripe.invoices.finalizeInvoice(invoiceId).catch(error => {
      throw new InternalServerErrorException('Error while finalizing the invoice!');
    });
  }

  // ? Webhooks

  /**
   * Adds a new webhook endpoint to the Stripe API.
   *
   * @param {string} url - The URL of the webhook endpoint.
   * @param {Stripe.WebhookEndpointCreateParams.EnabledEvent[]} events - An array of events to be enabled for the endpoint.
   * @return {Promise<Stripe.WebhookEndpoint>} A promise that resolves to the newly created webhook endpoint.
   */
  async addWebhookEndpoint(url: string, events: Stripe.WebhookEndpointCreateParams.EnabledEvent[]): Promise<Stripe.WebhookEndpoint> {
    return this.stripe.webhookEndpoints
      .create({
        // url: `${process.env.PROD_URL}/${url}`,
        url: `${process.env.PROD_URL}/${url}`,
        enabled_events: events,
        // metadata: {} //TODO: THINK OF ADD TOKEN TO THIS
      })
      .catch(error => {
        throw new InternalServerErrorException(error);
      });
  }
}
