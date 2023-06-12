package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

type Subscription struct {
	ID                   int     `json:"id"`
	PlanID               int     `json:"plan_id"`
	PaiduserID           int     `json:"paiduser_id"`
	ReceiveduserID       int     `json:"receiveduser_id"`
	IsActive             bool    `json:"is_active"`
	StripeCustomerID     string  `json:"stripe_customer_id"`
	StripeSubscriptionID string  `json:"stripe_subscription_id"`
	NextPayment          *string `json:"next_payment"`
}

type SubWidthUser struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Email       string  `json:"email"`
	Zipcode     string  `json:"zipcode"`
	Prefecture  string  `json:"prefecture"`
	City        string  `json:"city"`
	Town        string  `json:"town"`
	Apartment   *string `json:"apartment"`
	PhoneNumber string  `json:"phone_number"`
}

type SubscriptionDetail struct {
	ID                   int          `json:"id"`
	StripeSubscriptionID string       `json:"stripe_subscription_id"`
	CreateAt             *string      `json:"create_at"`
	NextPayment          *string      `json:"next_payment"`
	PaidUser             SubWidthUser `json:"paid_user"`
	ReceivedUser         SubWidthUser `json:"received_user"`
	Plan                 Plans        `json:"plan"`
}

type TypeCreateSubscription struct {
	PlanID               int    `json:"plan_id"`
	PaiduserID           int    `json:"paiduser_id"`
	ReceiveduserID       int    `json:"receiveduser_id"`
	IsActive             bool   `json:"is_active"`
	StripeCustomerID     string `json:"stripe_customer_id"`
	StripeSubscriptionID string `json:"stripe_subscription_id"`
}

// オーナーユーザーに紐づく家族のサブスク一覧
func GetSubscriptionsWidthFamily(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		params := mux.Vars(r)
		id := params["id"]

		rows, err := db.Query(`
	SELECT s.id, s.stripe_subscription_id, s.create_at, s.next_payment,
		p.id, p.name, p.explanation, p.price, p.image, p.delivery_interval, p.stripe_price_id,
		pu.id, pu.name, pu.email, pu.zipcode, pu.prefecture, pu.city, pu.town, pu.apartment, pu.phone_number,
		ru.id, ru.name, ru.email, ru.zipcode, ru.prefecture, ru.city, ru.town, ru.apartment, ru.phone_number
	FROM subscriptions s
	INNER JOIN plans p ON s.plan_id = p.id
	INNER JOIN users pu ON s.paiduser_id = pu.id
	INNER JOIN users ru ON s.receiveduser_id = ru.id
	WHERE s.paiduser_id = ? AND s.is_active = true AND s.paiduser_id <> s.receiveduser_id`,
			id)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		var subscriptions []SubscriptionDetail
		for rows.Next() {
			var subscription SubscriptionDetail
			err := rows.Scan(
				&subscription.ID,
				&subscription.StripeSubscriptionID,
				&subscription.CreateAt,
				&subscription.NextPayment,
				&subscription.Plan.ID,
				&subscription.Plan.Name,
				&subscription.Plan.Explanation,
				&subscription.Plan.Price,
				&subscription.Plan.Image,
				&subscription.Plan.Delivery_interval,
				&subscription.Plan.StripePriceID,
				&subscription.PaidUser.ID,
				&subscription.PaidUser.Name,
				&subscription.PaidUser.Email,
				&subscription.PaidUser.Zipcode,
				&subscription.PaidUser.Prefecture,
				&subscription.PaidUser.City,
				&subscription.PaidUser.Town,
				&subscription.PaidUser.Apartment,
				&subscription.PaidUser.PhoneNumber,
				&subscription.ReceivedUser.ID,
				&subscription.ReceivedUser.Name,
				&subscription.ReceivedUser.Email,
				&subscription.ReceivedUser.Zipcode,
				&subscription.ReceivedUser.Prefecture,
				&subscription.ReceivedUser.City,
				&subscription.ReceivedUser.Town,
				&subscription.ReceivedUser.Apartment,
				&subscription.ReceivedUser.PhoneNumber,
			)
			if err != nil {
				log.Fatal(err)
			}

			subscriptions = append(subscriptions, subscription)
		}

		// 構造体をJSON形式に変換する
		jsonData, err := json.Marshal(subscriptions)
		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

// 支払い先毎のサブスクリプション一覧
func GetSubscriptionsPaidUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		params := mux.Vars(r)
		id := params["id"]

		rows, err := db.Query(`
			SELECT s.id, s.stripe_subscription_id, s.create_at, s.next_payment,
				p.id, p.name, p.explanation, p.price, p.image, p.delivery_interval, p.stripe_price_id,
				pu.id, pu.name, pu.email, pu.zipcode, pu.prefecture, pu.city, pu.town, pu.apartment, pu.phone_number,
				ru.id, ru.name, ru.email, ru.zipcode, ru.prefecture, ru.city, ru.town, ru.apartment, ru.phone_number
			FROM subscriptions s
			INNER JOIN plans p ON s.plan_id = p.id
			INNER JOIN users pu ON s.paiduser_id = pu.id
			INNER JOIN users ru ON s.receiveduser_id = ru.id
			WHERE s.paiduser_id = ? AND s.is_active = true`,
			id)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		var subscriptions []SubscriptionDetail
		for rows.Next() {
			var subscription SubscriptionDetail
			err := rows.Scan(
				&subscription.ID,
				&subscription.StripeSubscriptionID,
				&subscription.CreateAt,
				&subscription.NextPayment,
				&subscription.Plan.ID,
				&subscription.Plan.Name,
				&subscription.Plan.Explanation,
				&subscription.Plan.Price,
				&subscription.Plan.Image,
				&subscription.Plan.Delivery_interval,
				&subscription.Plan.StripePriceID,
				&subscription.PaidUser.ID,
				&subscription.PaidUser.Name,
				&subscription.PaidUser.Email,
				&subscription.PaidUser.Zipcode,
				&subscription.PaidUser.Prefecture,
				&subscription.PaidUser.City,
				&subscription.PaidUser.Town,
				&subscription.PaidUser.Apartment,
				&subscription.PaidUser.PhoneNumber,
				&subscription.ReceivedUser.ID,
				&subscription.ReceivedUser.Name,
				&subscription.ReceivedUser.Email,
				&subscription.ReceivedUser.Zipcode,
				&subscription.ReceivedUser.Prefecture,
				&subscription.ReceivedUser.City,
				&subscription.ReceivedUser.Town,
				&subscription.ReceivedUser.Apartment,
				&subscription.ReceivedUser.PhoneNumber,
			)
			if err != nil {
				log.Fatal(err)
			}

			subscriptions = append(subscriptions, subscription)
		}
		if err := rows.Err(); err != nil {
			log.Fatal(err)
		}

		// 構造体をJSON形式に変換する
		jsonData, err := json.Marshal(subscriptions)
		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

// お届け先毎のサブスクリプション一覧
func GetSubscriptionsReceivedUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		params := mux.Vars(r)
		id := params["id"]

		rows, err := db.Query(`
			SELECT s.id, s.stripe_subscription_id, s.create_at, s.next_payment,
				p.id, p.name, p.explanation, p.price, p.image, p.delivery_interval, p.stripe_price_id,
				pu.id, pu.name, pu.email, pu.zipcode, pu.prefecture, pu.city, pu.town, pu.apartment, pu.phone_number,
				ru.id, ru.name, ru.email, ru.zipcode, ru.prefecture, ru.city, ru.town, ru.apartment, ru.phone_number
			FROM subscriptions s
			INNER JOIN plans p ON s.plan_id = p.id
			INNER JOIN users pu ON s.paiduser_id = pu.id
			INNER JOIN users ru ON s.receiveduser_id = ru.id
			WHERE s.receiveduser_id = ? AND s.is_active = true`,
			id)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		var subscriptions []SubscriptionDetail
		for rows.Next() {
			var subscription SubscriptionDetail
			err := rows.Scan(
				&subscription.ID,
				&subscription.StripeSubscriptionID,
				&subscription.CreateAt,
				&subscription.NextPayment,
				&subscription.Plan.ID,
				&subscription.Plan.Name,
				&subscription.Plan.Explanation,
				&subscription.Plan.Price,
				&subscription.Plan.Image,
				&subscription.Plan.Delivery_interval,
				&subscription.Plan.StripePriceID,
				&subscription.PaidUser.ID,
				&subscription.PaidUser.Name,
				&subscription.PaidUser.Email,
				&subscription.PaidUser.Zipcode,
				&subscription.PaidUser.Prefecture,
				&subscription.PaidUser.City,
				&subscription.PaidUser.Town,
				&subscription.PaidUser.Apartment,
				&subscription.PaidUser.PhoneNumber,
				&subscription.ReceivedUser.ID,
				&subscription.ReceivedUser.Name,
				&subscription.ReceivedUser.Email,
				&subscription.ReceivedUser.Zipcode,
				&subscription.ReceivedUser.Prefecture,
				&subscription.ReceivedUser.City,
				&subscription.ReceivedUser.Town,
				&subscription.ReceivedUser.Apartment,
				&subscription.ReceivedUser.PhoneNumber,
			)
			if err != nil {
				log.Fatal(err)
			}

			subscriptions = append(subscriptions, subscription)
		}

		// 構造体をJSON形式に変換する
		jsonData, err := json.Marshal(subscriptions)
		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

// サブスクリプション詳細
func GetSubscription(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		params := mux.Vars(r)
		id := params["id"]

		// アイテムIDに紐づくデータ取得
		var subscription Subscription
		err := db.QueryRow("SELECT id, plan_id, paiduser_id, receiveduser_id, is_active, stripe_customer_id, stripe_subscription_id, next_payment FROM subscriptions WHERE id = ?", id).Scan(&subscription.ID, &subscription.PlanID, &subscription.PaiduserID, &subscription.ReceiveduserID, &subscription.IsActive, &subscription.StripeCustomerID, &subscription.StripeSubscriptionID, &subscription.NextPayment)
		if err != nil {
			// エラーが発生した場合はエラーレスポンスを返す
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Error: %v", err)
			return
		}
		// アイテム情報をJSONに変換してレスポンスとして返す
		jsonData, err := json.Marshal(subscription)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Error: %v", err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

func CreateSubscription(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		var data TypeCreateSubscription

		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		stmt, err := db.Prepare("INSERT INTO subscriptions(plan_id, paiduser_id, receiveduser_id, is_active, stripe_customer_id, stripe_subscription_id ) VALUES(?, ?, ?, ?, ?, ?)")
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		res, err := stmt.Exec(data.PlanID, data.PaiduserID, data.ReceiveduserID, data.IsActive, data.StripeCustomerID, data.StripeSubscriptionID)
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		lastID, err := res.LastInsertId()
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		var subscription Subscription

		err = db.QueryRow("SELECT id, plan_id, paiduser_id, receiveduser_id, is_active, stripe_customer_id, stripe_subscription_id FROM subscriptions WHERE id = ?", lastID).Scan(&subscription.ID, &subscription.PlanID, &subscription.PaiduserID, &subscription.ReceiveduserID, &subscription.IsActive, &subscription.StripeCustomerID, &subscription.StripeSubscriptionID)
		if err != nil {
			log.Fatal(err)
		}

		jsonData, err := json.Marshal(subscription)
		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}
