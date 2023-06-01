package stripeHandler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/checkout/session"

	_ "github.com/go-sql-driver/mysql"
)

type CreateOrder struct {
	PaidUserID         int    `json:"paiduser_id"`
	ReceiveduserUserID int    `json:"receiveduser_id"`
	PlanID             int    `json:"plan_id"`
	PriceID            string `json:"stripe_id"`
}

func CreateCheckoutSession(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var data CreateOrder
		// リクエストボディの読み取り
		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		priceID := data.PriceID
		fmt.Println(priceID)

		// SUCCESS_URL := "http://localhost:3000/buy/success/?session_id="

		if PRODUCTION_MODE {
			stripe.Key = SECRET_KEY_PRODUCTION
		} else {
			stripe.Key = SECRET_KEY_STAGING
		}
		params := &stripe.CheckoutSessionParams{
			PaymentMethodTypes: stripe.StringSlice([]string{
				"card",
			}),
			LineItems: []*stripe.CheckoutSessionLineItemParams{
				{
					Price:    stripe.String(priceID), // サブスクリプションに関連付けられた価格ID
					Quantity: stripe.Int64(1),
				},
			},
			Mode:       stripe.String(string(stripe.CheckoutSessionModeSubscription)),
			SuccessURL: stripe.String("http://localhost:3000/buy/success?session_id={CHECKOUT_SESSION_ID}"),
			CancelURL:  stripe.String("http://localhost:3000/"),
		}

		s, err := session.New(params)
		if err != nil {
			// エラーハンドリング
			fmt.Println(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Println(s.URL)
		// リダイレクトの実行
		// http.Redirect(w, r, s.URL, http.StatusSeeOther)

		response := struct {
			SessionURL string `json:"sessionURL"`
		}{
			SessionURL: s.URL,
		}

		// レスポンスをJSON形式で返す
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
