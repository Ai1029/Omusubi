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

type SubscriptionAddPlan struct {
	ID                   int     `json:"id"`
	PlanID               int     `json:"plan_id"`
	PaidUserID           int     `json:"paiduser_id"`
	ReceivedUserID       int     `json:"receiveduser_id"`
	IsActive             bool    `json:"is_active"`
	StripeCustomerID     string  `json:"stripe_customer_id"`
	StripeSubscriptionID string  `json:"stripe_subscription_id"`
	NextPayment          *string `json:"next_payment"`
	Plan                 Plans   `json:"plan"`
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
			SELECT s.id, s.plan_id, s.paiduser_id, s.receiveduser_id, s.is_active,
						s.stripe_customer_id, s.stripe_subscription_id, s.next_payment,
						p.name, p.explanation, p.price, p.image, p.delivery_interval, p.stripe_price_id
			FROM subscriptions s
			INNER JOIN plans p ON s.plan_id = p.id
			WHERE s.paiduser_id = ? AND s.is_active = true AND s.paiduser_id <> s.receiveduser_id`,
			id)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		var subscriptions []SubscriptionAddPlan
		for rows.Next() {
			var subscription SubscriptionAddPlan
			err := rows.Scan(
				&subscription.ID,
				&subscription.PlanID,
				&subscription.PaidUserID,
				&subscription.ReceivedUserID,
				&subscription.IsActive,
				&subscription.StripeCustomerID,
				&subscription.StripeSubscriptionID,
				&subscription.NextPayment,
				&subscription.Plan.Name,
				&subscription.Plan.Explanation,
				&subscription.Plan.Price,
				&subscription.Plan.Image,
				&subscription.Plan.Delivery_interval,
				&subscription.Plan.StripePriceID,
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
			SELECT s.id, s.plan_id, s.paiduser_id, s.receiveduser_id, s.is_active,
						s.stripe_customer_id, s.stripe_subscription_id, s.next_payment,
						p.name, p.explanation, p.price, p.image, p.delivery_interval, p.stripe_price_id
			FROM subscriptions s
			INNER JOIN plans p ON s.plan_id = p.id
			WHERE s.paiduser_id = ? AND s.is_active = true`,
			id)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		var subscriptions []SubscriptionAddPlan
		for rows.Next() {
			var subscription SubscriptionAddPlan
			err := rows.Scan(
				&subscription.ID,
				&subscription.PlanID,
				&subscription.PaidUserID,
				&subscription.ReceivedUserID,
				&subscription.IsActive,
				&subscription.StripeCustomerID,
				&subscription.StripeSubscriptionID,
				&subscription.NextPayment,
				&subscription.Plan.Name,
				&subscription.Plan.Explanation,
				&subscription.Plan.Price,
				&subscription.Plan.Image,
				&subscription.Plan.Delivery_interval,
				&subscription.Plan.StripePriceID,
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
			SELECT s.id, s.plan_id, s.paiduser_id, s.receiveduser_id, s.is_active,
						s.stripe_customer_id, s.stripe_subscription_id, s.next_payment,
						p.name, p.explanation, p.price, p.image, p.delivery_interval, p.stripe_price_id
			FROM subscriptions s
			INNER JOIN plans p ON s.plan_id = p.id
			WHERE s.receiveduser_id = ? AND s.is_active = true`,
			id)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		var subscriptions []SubscriptionAddPlan
		for rows.Next() {
			var subscription SubscriptionAddPlan
			err := rows.Scan(
				&subscription.ID,
				&subscription.PlanID,
				&subscription.PaidUserID,
				&subscription.ReceivedUserID,
				&subscription.IsActive,
				&subscription.StripeCustomerID,
				&subscription.StripeSubscriptionID,
				&subscription.NextPayment,
				&subscription.Plan.Name,
				&subscription.Plan.Explanation,
				&subscription.Plan.Price,
				&subscription.Plan.Image,
				&subscription.Plan.Delivery_interval,
				&subscription.Plan.StripePriceID,
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
