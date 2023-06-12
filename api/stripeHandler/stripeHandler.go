package stripeHandler

import (
	"database/sql"
	"encoding/json"
	"os"
	"strconv"

	"fmt"
	"log"
	"net/http"

	"github.com/joho/godotenv"

	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/customer"
	"github.com/stripe/stripe-go/v74/subscription"

	_ "github.com/go-sql-driver/mysql"
)

type Plan struct {
	ID            int    `json:"id"`
	Name          string `json:"name"`
	Explanation   string `json:"explanation"`
	Price         int    `json:"price"`
	Image         string `json:"image"`
	StripePriceID string `json:"stripe_price_id"`
}
type CreateOrder struct {
	PlanID  int    `json:"plan_id"`
	PriceID string `json:"stripe_price_id"`
}
type PaidUser struct {
	ID            int     `json:"id"`
	Name          string  `json:"name"`
	Email         string  `json:"email"`
	UID           string  `json:"uid"`
	FamilyID      int     `json:"family_id"`
	Phonetic      string  `json:"phonetic"`
	Zipcode       string  `json:"zipcode"`
	Prefecture    string  `json:"prefecture"`
	City          string  `json:"city"`
	Town          string  `json:"town"`
	Apartment     *string `json:"apartment"`
	PhoneNumber   string  `json:"phone_number"`
	IsOwner       bool    `json:"is_owner"`
	IsVirtualUser bool    `json:"is_virtual_user"`
}
type ReceivedUser struct {
	ID            int     `json:"id"`
	Name          string  `json:"name"`
	Email         *string `json:"email"`
	UID           *string `json:"uid"`
	FamilyID      int     `json:"family_id"`
	Phonetic      string  `json:"phonetic"`
	Zipcode       string  `json:"zipcode"`
	Prefecture    string  `json:"prefecture"`
	City          string  `json:"city"`
	Town          string  `json:"town"`
	Apartment     *string `json:"apartment"`
	PhoneNumber   string  `json:"phone_number"`
	IsOwner       bool    `json:"is_owner"`
	IsVirtualUser bool    `json:"is_virtual_user"`
}
type StrypeUser struct {
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
	Plan         Plan         `json:"plan"`
	PaidUser     PaidUser     `json:"paidUser"`
	ReceivedUser ReceivedUser `json:"receivedUser"`
}
type TypeStripePaymentIntent struct {
	PaymentIntentID string `json:"paymentIntent"`
}

func CreateCheckoutSession(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// .envファイルの読み込み
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

		if os.Getenv("DB_ENV") == "production" {
			stripe.Key = os.Getenv("SECRET_KEY_PRODUCTION")
		} else {
			stripe.Key = os.Getenv("SECRET_KEY_STAGING")
		}

		var data OrderData

		// リクエストボディの読み取り
		err = json.NewDecoder(r.Body).Decode(&data)
		fmt.Println(err)
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
					State:      stripe.String(data.PaidUser.Prefecture),
					City:       stripe.String(data.PaidUser.City),
					Line1:      stripe.String(data.PaidUser.Town),
					Line2:      stripe.String(*data.PaidUser.Apartment),
					PostalCode: stripe.String(data.PaidUser.Zipcode),
				},
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
	}
}
