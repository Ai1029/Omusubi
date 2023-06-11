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
	ID                   int    `json:"id"`
	PlanID               int    `json:"plan_id"`
	PaiduserID           int    `json:"paiduser_id"`
	ReceiveduserID       int    `json:"receiveduser_id"`
	IsActive             string `json:"is_active"`
	StripeCustomerID     string `json:"stripe_customer_id"`
	StripeSubscriptionID string `json:"stripe_subscription_id"`
}

type TypeCreateSubscription struct {
	PlanID               int    `json:"plan_id"`
	PaiduserID           int    `json:"paiduser_id"`
	ReceiveduserID       int    `json:"receiveduser_id"`
	IsActive             bool   `json:"is_active"`
	StripeCustomerID     string `json:"stripe_customer_id"`
	StripeSubscriptionID string `json:"stripe_subscription_id"`
}

// 支払い先毎のサブスクリプション一覧
func GetSubscriptionsPaidUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		params := mux.Vars(r)
		id := params["id"]

		rows, err := db.Query("SELECT id, plan_id, paiduser_id, receiveduser_id, is_active, stripe_customer_id, stripe_subscription_id FROM subscriptions WHERE paiduser_id = ? AND is_active = true", id)
		if err != nil {
			log.Fatal(err)
		}

		var subscriptions []Subscription
		for rows.Next() {
			var subscription Subscription
			if err := rows.Scan(&subscription.ID, &subscription.PlanID, &subscription.PaiduserID, &subscription.ReceiveduserID, &subscription.IsActive, &subscription.StripeCustomerID, &subscription.StripeSubscriptionID); err != nil {
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

// お届け先毎のサブスクリプション一覧
func GetSubscriptionsReceivedUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		params := mux.Vars(r)
		id := params["id"]

		rows, err := db.Query("SELECT id, plan_id, paiduser_id, receiveduser_id, is_active, stripe_customer_id, stripe_subscription_id FROM subscriptions WHERE receiveduser_id = ? AND is_active = true", id)
		if err != nil {
			log.Fatal(err)
		}

		var subscriptions []Subscription
		for rows.Next() {
			var subscription Subscription
			if err := rows.Scan(&subscription.ID, &subscription.PlanID, &subscription.PaiduserID, &subscription.ReceiveduserID, &subscription.IsActive, &subscription.StripeCustomerID, &subscription.StripeSubscriptionID); err != nil {
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
		err := db.QueryRow("SELECT id, plan_id, paiduser_id, receiveduser_id, is_active, stripe_customer_id, stripe_subscription_id FROM subscriptions WHERE id = ?", id).Scan(&subscription.ID, &subscription.PlanID, &subscription.PaiduserID, &subscription.ReceiveduserID, &subscription.IsActive, &subscription.StripeCustomerID, &subscription.StripeSubscriptionID)
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
