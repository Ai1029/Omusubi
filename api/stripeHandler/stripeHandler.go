package stripeHandler

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/stripe/stripe-go/v74"
	// "github.com/stripe/stripe-go/v74/checkout/session"
	"github.com/stripe/stripe-go/v74/paymentintent"

	_ "github.com/go-sql-driver/mysql"
)

type CreateOrder struct {
	PaidUserID         int    `json:"paiduser_id"`
	ReceiveduserUserID int    `json:"receiveduser_id"`
	PlanID             int    `json:"plan_id"`
	PriceID            string `json:"stripe_id"`
}
type item struct {
	id string
}

func calculateOrderAmount(items []item) int64 {
	// Replace this constant with a calculation of the order's amount
	// Calculate the order total on the server to prevent
	// people from directly manipulating the amount on the client
	return 1400
}

func CreateCheckoutSession(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if PRODUCTION_MODE {
			stripe.Key = SECRET_KEY_PRODUCTION
		} else {
			stripe.Key = SECRET_KEY_STAGING
		}

		// var data CreateOrder
		// SITE_URL := "http://localhost:3000"
		// if os.Getenv("DB_ENV") == "production" {
		// SITE_URL = os.Getenv("SITE_URL")
		// }
		// fmt.Println(SITE_URL)

		// // リクエストボディの読み取り
		// err := json.NewDecoder(r.Body).Decode(&data)
		// if err != nil {
		// http.Error(w, err.Error(), http.StatusBadRequest)
		// return
		// }

		// priceID := data.PriceID
		// fmt.Println(priceID)

		// params := &stripe.CheckoutSessionParams{
		// PaymentMethodTypes: stripe.StringSlice([]string{
		// "card",
		// }),
		// LineItems: []*stripe.CheckoutSessionLineItemParams{
		// {
		// Price:    stripe.String(priceID), // サブスクリプションに関連付けられた価格ID
		// Quantity: stripe.Int64(1),
		// },
		// },
		// Mode:       stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		// SuccessURL: stripe.String(SITE_URL + "/buy/success?session_id={CHECKOUT_SESSION_ID}"),
		// CancelURL:  stripe.String(SITE_URL),
		// }

		// s, err := session.New(params)
		// if err != nil {
		// // エラーハンドリング
		// fmt.Println(err)
		// http.Error(w, err.Error(), http.StatusInternalServerError)
		// return
		// }
		// fmt.Println(s.URL)
		// リダイレクトの実行
		// http.Redirect(w, r, s.URL, http.StatusSeeOther)

		// response := struct {
		// SessionURL string `json:"sessionURL"`
		// }{
		// SessionURL: s.URL,
		// }
		// レスポンスをJSON形式で返す
		// w.Header().Set("Content-Type", "application/json")
		// json.NewEncoder(w).Encode(response)

		if r.Method != "POST" {
			http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
			return
		}

		var req struct {
			Items []item `json:"items"`
		}
		fmt.Println(req)

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Printf("json.NewDecoder.Decode: %v", err)
			return
		}
		fmt.Println(req)

		// Create a PaymentIntent with amount and currency
		params := &stripe.PaymentIntentParams{
			Amount:   stripe.Int64(calculateOrderAmount(req.Items)),
			Currency: stripe.String(string(stripe.CurrencyJPY)),
			AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
				Enabled: stripe.Bool(true),
			},
		}
		fmt.Println(params)
		fmt.Println(params.Amount)

		pi, err := paymentintent.New(params)
		log.Printf("pi.New: %v", pi.ClientSecret)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Printf("pi.New: %v", err)
			return
		}

		writeJSON(w, struct {
			ClientSecret string `json:"clientSecret"`
		}{
			ClientSecret: pi.ClientSecret,
		})

	}
}
func writeJSON(w http.ResponseWriter, v interface{}) {
	var buf bytes.Buffer
	if err := json.NewEncoder(&buf).Encode(v); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("json.NewEncoder.Encode: %v", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if _, err := io.Copy(w, &buf); err != nil {
		log.Printf("io.Copy: %v", err)
		return
	}
}
