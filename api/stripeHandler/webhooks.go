package stripeHandler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

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

		// endpointSecret := "whsec_e20dce021a0c0b8617fe2ba39f1134670b30d7d70fb34505383fca985ac5a1d9";

		event, err := webhook.ConstructEvent(b, r.Header.Get("Stripe-Signature"), STRIPE_WEBHOOK_SECRET)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			log.Printf("webhook.ConstructEvent: %v", err)
			return
		}
		eventJSON, err := json.MarshalIndent(event, "", "  ")

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Printf("json.MarshalIndent: %v", err)
			return
		}

		// Unmarshal the event data into an appropriate struct depending on its Type
		switch event.Type {

		// 顧客がサブスクリプションを作成
		case "customer.subscription.updated":
			fmt.Println("==================customer.subscription.updated==================")
			fmt.Println(string(eventJSON))

			var data map[string]interface{}
			err := json.Unmarshal([]byte(eventJSON), &data)
			if err != nil {
				fmt.Println("Error decoding JSON:", err)
				return
			}

			// 指定のキーの値にアクセス
			stripeSubscriptionID := data["data"].(map[string]interface{})["object"].(map[string]interface{})["id"].(string)
			stripePriceID := data["data"].(map[string]interface{})["object"].(map[string]interface{})["items"].(map[string]interface{})["data"].([]interface{})[0].(map[string]interface{})["plan"].(map[string]interface{})["id"].(string)
			stripeCustomerID := data["data"].(map[string]interface{})["object"].(map[string]interface{})["customer"].(string)
			// stripeCreateAt := data["data"].(map[string]interface{})["object"].(map[string]interface{})["items"].(map[string]interface{})["data"].([]interface{})[0].(map[string]interface{})["created"].(string)

			fmt.Println("Subscription ID:", stripeSubscriptionID)
			fmt.Println("Stripe Price ID:", stripePriceID)
			fmt.Println("Stripe Customer ID:", stripeCustomerID)
			// fmt.Println("Stripe Create At:", stripeCreateAt)

			// params := &stripe.CustomerSearchParams{
			// SearchParams: stripe.SearchParams{Query: fmt.Sprintf("id:\"%s\"", stripeCustomerID)},
			// }
			// result := customer.Search(params)
			// fmt.Println(result)

			// stmt, err := db.Prepare("INSERT INTO sidedishes(name, explanation, price, quantity, image) VALUES(?, ?, ?, ?, ?)")
			//if err != nil {
			//// エラー処理
			//log.Fatal(err)
			//}
			//fmt.Println((stmt))

		case "payment_intent.succeeded":
			// 支払いインテントが完了した
			fmt.Println("payment_intent.succeeded")
			fmt.Println(string(eventJSON))
		//case "charge.succeeded":
		//// 支払いが正常に完了した
		//fmt.Println("charge.succeeded")
		//fmt.Println(string(eventJSON))
		// ... handle other event types
		default:
			fmt.Fprintf(os.Stderr, "Unhandled event type: %s\n", event.Type)

		}

		//if event.Type == "invoice.paid" {
		//fmt.Println("event: invoice.paid")
		// Used to provision services after the trial has ended.
		// The status of the invoice will show up as paid. Store the status in your
		// database to reference when a user accesses your service to avoid hitting rate
		// limits.
		//return
		//}

		//if event.Type == "invoice.payment_failed" {
		//fmt.Println("event: invoice.payment_failed")
		// If the payment fails or the customer does not have a valid payment method,
		// an invoice.payment_failed event is sent, the subscription becomes past_due.
		// Use this webhook to notify your user that their payment has
		// failed and to retrieve new card details.
		///return
		///}

		///if event.Type == "customer.subscription.deleted" {
		///fmt.Println("event: customer.subscription.deleted")
		// handle subscription canceled automatically based
		// upon your subscription settings. Or if the user cancels it. {
		///return
		///}

		///if event.Type == "payment_method.attached" {
		///fmt.Println("event: payment_method.attached")
		///return
		///}

		///if event.Type == "invoice.updated" {
		///fmt.Println("event: invoice.updated")
		///return
		///}

		///if event.Type == "invoice.paid" {
		///fmt.Println("event: invoice.paid")
		///return
		///}

		///if event.Type == "invoice.payment_succeeded" {
		///fmt.Println("event: invoice.payment_succeeded")
		///return
		///}

		//if event.Type == "customer.subscription.updated" {
		//fmt.Println("event: customer.subscription.updated")
		//return
		//}

		/////if event.Type == "payment_intent.succeeded" {
		/////fmt.Println("event: payment_intent.succeeded")
		/////return
		/////}

		/////if event.Type == "invoice.upcoming" {
		/////fmt.Println("event: ")
		/////return
		/////}

	}
}
