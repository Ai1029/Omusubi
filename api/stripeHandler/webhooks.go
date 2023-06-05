package stripeHandler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/webhook"

	_ "github.com/go-sql-driver/mysql"
)

func StripeWebhook(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if PRODUCTION_MODE {
			stripe.Key = SECRET_KEY_PRODUCTION
		} else {
			stripe.Key = SECRET_KEY_STAGING
		}

		if r.Method != "POST" {
			http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
			return
		}
		b, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			log.Printf("io.ReadAll: %v", err)
			return
		}

		event, err := webhook.ConstructEvent(b, r.Header.Get("Stripe-Signature"), STRIPE_WEBHOOK_SECRET)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			log.Printf("webhook.ConstructEvent: %v", err)
			return
		}
		fmt.Println(event)
		eventJSON, err := json.MarshalIndent(event, "", "  ")

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Printf("json.MarshalIndent: %v", err)
			return
		}

		fmt.Println(string(eventJSON))

		if event.Type == "invoice.paid" {
			fmt.Println("event: invoice.paid")
			// Used to provision services after the trial has ended.
			// The status of the invoice will show up as paid. Store the status in your
			// database to reference when a user accesses your service to avoid hitting rate
			// limits.
			return
		}

		if event.Type == "invoice.payment_failed" {
			fmt.Println("event: invoice.payment_failed")
			// If the payment fails or the customer does not have a valid payment method,
			// an invoice.payment_failed event is sent, the subscription becomes past_due.
			// Use this webhook to notify your user that their payment has
			// failed and to retrieve new card details.
			return
		}

		if event.Type == "customer.subscription.deleted" {
			fmt.Println("event: customer.subscription.deleted")
			// handle subscription canceled automatically based
			// upon your subscription settings. Or if the user cancels it. {
			return
		}

		if event.Type == "payment_method.attached" {
			fmt.Println("event: payment_method.attached")
			return
		}

		if event.Type == "invoice.updated" {
			fmt.Println("event: invoice.updated")
			return
		}

		if event.Type == "invoice.paid" {
			fmt.Println("event: invoice.paid")
			return
		}

		if event.Type == "invoice.payment_succeeded" {
			fmt.Println("event: invoice.payment_succeeded")
			return
		}

		if event.Type == "customer.subscription.updated" {
			fmt.Println("event: customer.subscription.updated")
			return
		}

		if event.Type == "payment_intent.succeeded" {
			fmt.Println("event: payment_intent.succeeded")
			return
		}

		if event.Type == "invoice.upcoming" {
			fmt.Println("event: ")
			return
		}

	}
}
