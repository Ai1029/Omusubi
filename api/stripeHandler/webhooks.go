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

type TypeCreateSubscription struct {
	PlanID               int    `json:"plan_id"`
	PaiduserID           int    `json:"paiduser_id"`
	ReceiveduserID       int    `json:"receiveduser_id"`
	IsActive             bool   `json:"is_active"`
	StripeCustomerID     string `json:"stripe_customer_id"`
	StripeSubscriptionID string `json:"stripe_subscription_id"`
}
type TypePlan struct {
	ID            int    `json:"id"`
	Name          string `json:"name"`
	Explanation   string `json:"explanation"`
	Price         string `json:"price"`
	Image         string `json:"image"`
	StripePriceID string `json:"stripe_price_id"`
}

func StripeWebhook(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if PRODUCTION_MODE {
			stripe.Key = SECRET_KEY_PRODUCTION
		} else {
			stripe.Key = SECRET_KEY_STAGING
		}
		stripeWebhookSecret := ""
		if os.Getenv("DB_ENV") == "production" {
			stripeWebhookSecret = os.Getenv("STRIPE_WEBHOOK_SECRET")
		} else {
			stripeWebhookSecret = STRIPE_WEBHOOK_SECRET
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

		event, err := webhook.ConstructEvent(b, r.Header.Get("Stripe-Signature"), stripeWebhookSecret)
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
			// fmt.Println(string(eventJSON))

			var data map[string]interface{}
			err := json.Unmarshal([]byte(eventJSON), &data)
			if err != nil {
				fmt.Println("Error decoding JSON:", err)
				return
			}

			// 指定のキーの値にアクセス
			stripeSubscriptionID := data["data"].(map[string]interface{})["object"].(map[string]interface{})["id"].(string)
			stripePriceID := data["data"].(map[string]interface{})["object"].(map[string]interface{})["items"].(map[string]interface{})["data"].([]interface{})[0].(map[string]interface{})["plan"].(map[string]interface{})["id"].(string)
			paidUserID := data["data"].(map[string]interface{})["object"].(map[string]interface{})["items"].(map[string]interface{})["data"].([]interface{})[0].(map[string]interface{})["metadata"].(map[string]interface{})["paid_user"].(string)
			receivedUserID := data["data"].(map[string]interface{})["object"].(map[string]interface{})["items"].(map[string]interface{})["data"].([]interface{})[0].(map[string]interface{})["metadata"].(map[string]interface{})["received_user"].(string)
			planID := data["data"].(map[string]interface{})["object"].(map[string]interface{})["items"].(map[string]interface{})["data"].([]interface{})[0].(map[string]interface{})["metadata"].(map[string]interface{})["plan_id"].(string)
			stripeCustomerID := data["data"].(map[string]interface{})["object"].(map[string]interface{})["customer"].(string)

			fmt.Println("Subscription ID:", stripeSubscriptionID)
			fmt.Println("Stripe Price ID:", stripePriceID)
			fmt.Println("Stripe PaidUser ID:", paidUserID)
			fmt.Println("Stripe ReceivedUser ID:", receivedUserID)
			fmt.Println("Stripe Plan ID:", planID)
			fmt.Println("Stripe Customer ID:", stripeCustomerID)
			stmt, err := db.Prepare("INSERT INTO subscriptions(plan_id, paiduser_id, receiveduser_id, stripe_customer_id, stripe_subscription_id ) VALUES(?, ?, ?, ?, ?)")
			if err != nil {
				// エラー処理
				log.Fatal(err)
			}

			_, err = stmt.Exec(planID, paidUserID, receivedUserID, stripeCustomerID, stripeSubscriptionID)
			if err != nil {
				// エラー処理
				log.Fatal(err)
			}

		case "invoice.payment_succeeded":
			// 支払いが正常に完了した
			fmt.Println("==================invoice.payment_succeeded==================")
			// fmt.Println(string(eventJSON))

			var data map[string]interface{}
			err := json.Unmarshal([]byte(eventJSON), &data)
			if err != nil {
				fmt.Println("Error decoding JSON:", err)
				return
			}

			// 指定のキーの値にアクセス
			stripeInvoiceID := data["data"].(map[string]interface{})["object"].(map[string]interface{})["id"].(string)
			paymentCreted := data["data"].(map[string]interface{})["object"].(map[string]interface{})["created"].(string)
			stripePriceID := data["data"].(map[string]interface{})["object"].(map[string]interface{})["lines"].(map[string]interface{})["data"].([]interface{})[0].(map[string]interface{})["plan"].(map[string]interface{})["id"].(string)
			stripeSubscriptionID := data["data"].(map[string]interface{})["object"].(map[string]interface{})["lines"].(map[string]interface{})["data"].([]interface{})[0].(map[string]interface{})["subscription"].(string)
			fmt.Println("Stripe Invoice ID:", stripeInvoiceID)
			fmt.Println("Payment Created:", paymentCreted)
			fmt.Println("Stripe Price ID:", stripePriceID)
			fmt.Println("Stripe Subscription ID:", stripeSubscriptionID)

			// アイテムIDに紐づくデータ取得
			var plan TypePlan
			planData := db.QueryRow("SELECT id, name, explanation, price  FROM plans WHERE stripe_price_id = ?", stripePriceID).Scan(&plan.ID, &plan.Name, &plan.Explanation, &plan.Price)
			if planData != nil {
				// エラーが発生した場合はエラーレスポンスを返す
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintf(w, "Error: %v", err)
				return
			}
			_, err = db.Exec("INSERT INTO orders (plan_id, plan_name, plan_explanation, price, stripe_invoice_id, stripe_subscription_id ) VALUES (?, ?, ?, ?, ?, ?)", plan.ID, plan.Name, plan.Explanation, plan.Price, stripeInvoiceID, stripeSubscriptionID)
			if err != nil {
				fmt.Println("Error inserting data into orders table:", err)
				return
			}

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
