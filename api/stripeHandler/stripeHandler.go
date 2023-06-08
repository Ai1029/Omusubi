package stripeHandler

import (
	"database/sql"
	"encoding/json"
	"strconv"

	"fmt"
	"log"
	"net/http"

	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/customer"
	"github.com/stripe/stripe-go/v74/subscription"

	_ "github.com/go-sql-driver/mysql"
)

type Plan struct {
	ID            int    `json:"id"`
	Name          string `json:"name"`
	Explanation   string `json:"explanation"`
	Price         string `json:"price"`
	Image         string `json:"image"`
	StripePriceID string `json:"stripe_price_id"`
}

type CreateOrder struct {
	PlanID  int    `json:"plan_id"`
	PriceID string `json:"stripe_price_id"`
}
type User struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	PostalCode  string `json:"postal_code"`
	State       string `json:"state"`
	City        string `json:"city"`
	Line1       string `json:"line1"`
	Line2       string `json:"line2"`
	PhoneNumber string `json:"phone_number"`
}
type OrderData struct {
	Plan         Plan `json:"plan"`
	PaidUser     User `json:"paiduser"`
	ReceivedUser User `json:"receiveduser"`
}
type TypeStripePaymentIntent struct {
	PaymentIntentID string `json:"paymentIntent"`
}

func CreateCheckoutSession(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if PRODUCTION_MODE {
			stripe.Key = SECRET_KEY_PRODUCTION
		} else {
			stripe.Key = SECRET_KEY_STAGING
		}

		// SITE_URL := "http://localhost:3000"
		// if os.Getenv("DB_ENV") == "production" {
		// SITE_URL = os.Getenv("SITE_URL")
		// }
		// fmt.Println(SITE_URL)

		var data OrderData

		// リクエストボディの読み取り
		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		fmt.Println(data)
		PriceID := data.Plan.StripePriceID

		// 顧客が登録済みか確認する
		// 顧客が複数の配送先を設定できれば一つの顧客で管理したい
		// 請求先＋配送先が完全に一致したら同一顧客として、新規登録はせずに契約商品を追加するフローにしたい
		searchUserParams := &stripe.CustomerSearchParams{}
		searchUserParams.Query = *stripe.String(fmt.Sprintf("email:'%s'", data.PaidUser.Email))
		iter := customer.Search(searchUserParams)
		foundUser := false // ユーザーが見つかったかどうかを示すフラグ
		customerID := ""
		for iter.Next() {
			searchUserResult := iter.Current()
			// searchUserResultをJSON形式のバイト配列に変換
			jsonData, err := json.Marshal(searchUserResult)
			if err != nil {
				fmt.Println("JSON encoding error:", err)
				return
			}

			// JSONデータを解析し、customerIDを取得
			var data map[string]interface{}
			err = json.Unmarshal(jsonData, &data)
			if err != nil {
				fmt.Println("JSON decoding error:", err)
				return
			}

			_customerID, ok := data["id"].(string)
			if !ok {
				fmt.Println("Invalid customer ID format")
				return
			}
			customerID = _customerID
			foundUser = true // ユーザーが見つかったことを示すフラグを立てる
		}

		// 顧客がいなかったら新規作成する(未実装：今は決済ごとに顧客を新規作成している)
		if !foundUser {
		createUserParams := &stripe.CustomerParams{
			Email: stripe.String(data.PaidUser.Email),
			Name:  stripe.String(data.PaidUser.Name),
			Address: &stripe.AddressParams{
				Country:    stripe.String("JP"),
				State:      stripe.String(data.PaidUser.State),
				City:       stripe.String(data.PaidUser.City),
				Line1:      stripe.String(data.PaidUser.Line1),
				Line2:      stripe.String(data.PaidUser.Line2),
				PostalCode: stripe.String(data.PaidUser.PostalCode),
			},
			// Shipping: &stripe.CustomerShippingParams{
			// Name: stripe.String(data.ReceivedUser.Name),
			// Address: &stripe.AddressParams{
			// Country:    stripe.String("JP"),
			// State:      stripe.String(data.ReceivedUser.State),
			// City:       stripe.String(data.ReceivedUser.City),
			// Line1:      stripe.String(data.ReceivedUser.Line1),
			// Line2:      stripe.String(data.ReceivedUser.Line2),
			// PostalCode: stripe.String(data.ReceivedUser.PostalCode),
			// },
			// },
			Phone: stripe.String(data.PaidUser.PhoneNumber),
		}
		// createUserParams.AddMetadata("PaidUserID", strconv.Itoa(data.PaidUser.ID))
		// createUserParams.AddMetadata("ReceivedUser", strconv.Itoa(data.ReceivedUser.ID))
		c, _ := customer.New(createUserParams)
		customerID = c.ID
		}

		paymentSettings := &stripe.SubscriptionPaymentSettingsParams{
			SaveDefaultPaymentMethod: stripe.String("on_subscription"),
		}
		// Create subscription
		subscriptionParams := &stripe.SubscriptionParams{
			Customer: stripe.String(customerID),
			Items: []*stripe.SubscriptionItemsParams{
				{
					Price: stripe.String(PriceID),
					Metadata: map[string]string{
						"paid_user":     strconv.Itoa(data.PaidUser.ID),
						"received_user": strconv.Itoa(data.ReceivedUser.ID),
						"plan_id":       strconv.Itoa(data.Plan.ID),
					},
				},
			},
			PaymentSettings: paymentSettings,
			PaymentBehavior: stripe.String("default_incomplete"),
		}
		subscriptionParams.AddExpand("latest_invoice.payment_intent")
		s, err := subscription.New(subscriptionParams)
		if err != nil {
			log.Printf("sub.New: %v", err)
			return
		}

		response := struct {
			ClientSecret string `json:"clientSecret"`
		}{
			ClientSecret: s.LatestInvoice.PaymentIntent.ClientSecret,
		}
		// レスポンスをJSON形式で返す
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)

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

	}
}

func SetStripePaymentId(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if PRODUCTION_MODE {
			stripe.Key = SECRET_KEY_PRODUCTION
		} else {
			stripe.Key = SECRET_KEY_STAGING
		}
		var data TypeStripePaymentIntent
		// リクエストボディの読み取り
		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// dataをJSONとしてレスポンスする
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(data)
	}
}
