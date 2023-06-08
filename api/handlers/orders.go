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

type Order struct {
	ID              int    `json:"id"`
	PlanID          int    `json:"plan_id"`
	PlanName        string `json:"plan_name"`
	PlanExplanation string `json:"plan_explanation"`
	Price           string `json:"price"`
	Date            string `json:"date"`
	PaiduserID      int    `json:"paiduser_id"`
	StripeID        int    `json:"stripe_id"`
	SubscribeID     int    `json:"subscribe_id"`
}

type TypeCreateOrder struct {
	PlanID          int    `json:"plan_id"`
	PlanName        string `json:"plan_name"`
	PlanExplanation string `json:"plan_explanation"`
	Price           string `json:"price"`
	Date            string `json:"date"`
	PaiduserID      int    `json:"paiduser_id"`
	StripeID        int    `json:"stripe_id"`
	SubscribeID     int    `json:"subscribe_id"`
}

func GetOrders(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		rows, err := db.Query("SELECT id, plan_id, paiduser_id, receiveduser_id, is_active, stripe_price_id FROM orders")
		if err != nil {
			log.Fatal(err)
		}

		var orders []Order
		for rows.Next() {
			var order Order
			if err := rows.Scan(&order.ID, &order.PlanID, &order.PlanName, &order.PlanExplanation, &order.Price, &order.Date, &order.PaiduserID, &order.StripeID, &order.SubscribeID); err != nil {
				log.Fatal(err)
			}
			orders = append(orders, order)
		}

		// 構造体をJSON形式に変換する
		jsonData, err := json.Marshal(orders)
		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

func GetOrder(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		params := mux.Vars(r)
		id := params["id"]

		// アイテムIDに紐づくデータ取得
		var order Order
		err := db.QueryRow("SELECT id, plan_id, plan_name, plan_explanation, price, date, paiduser_id, receiveduser_id, stripe_id, subscribe_id FROM orders WHERE id = ?", id).Scan(&order.ID, &order.PlanID, &order.PlanName, &order.PlanExplanation, &order.Price, &order.Date, &order.PaiduserID, &order.StripeID, &order.SubscribeID)
		if err != nil {
			// エラーが発生した場合はエラーレスポンスを返す
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Error: %v", err)
			return
		}
		// アイテム情報をJSONに変換してレスポンスとして返す
		jsonData, err := json.Marshal(order)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Error: %v", err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

func CreateOrder(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		fmt.Println("くりえいとorder")
		var data TypeCreateOrder

		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		stmt, err := db.Prepare("INSERT INTO orders(plan_id, plan_name, plan_explanation, price, date, paiduser_id, receiveduser_id, stripe_id, subscribe_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)")
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		res, err := stmt.Exec(&data.PlanID, &data.PlanName, &data.PlanExplanation, &data.Price, &data.Date, &data.PaiduserID, &data.StripeID, &data.SubscribeID)
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		lastID, err := res.LastInsertId()
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		var order Order

		err = db.QueryRow("SELECT id, plan_id, plan_name, plan_explanation, price, date, paiduser_id, receiveduser_id, stripe_id, subscribe_id FROM orders WHERE id = ?", lastID).Scan(&order.ID, &order.PlanID, &order.PlanName, &order.PlanExplanation, &order.Price, &order.Date, &order.PaiduserID, &order.StripeID, &order.SubscribeID)
		if err != nil {
			log.Fatal(err)
		}

		jsonData, err := json.Marshal(order)
		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}
