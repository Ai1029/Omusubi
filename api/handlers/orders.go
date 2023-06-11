package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

type Order struct {
	ID                int          `json:"id"`
	PlanID            int          `json:"plan_id"`
	PlanName          string       `json:"plan_name"`
	PlanExplanation   string       `json:"plan_explanation"`
	Price             int          `json:"price"`
	PaymentDate       *string      `json:"payment_date"`
	StripeSubscribeID string       `json:"stripe_subscription_id"`
	PaidUser          SubWidthUser `json:"paid_user"`
	ReceivedUser      SubWidthUser `json:"received_user"`
}

func GetOrders(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		params := mux.Vars(r)
		id := params["id"]

		// オーナーユーザー（支払い者）の購入履歴
		rows, err := db.Query(`
			SELECT o.id, o.plan_id, o.plan_name, o.plan_explanation, o.price, o.payment_date, o.stripe_subscription_id,
				pu.id, pu.name, pu.email, pu.zipcode, pu.prefecture, pu.city, pu.town, pu.apartment, pu.phone_number,
				ru.id, ru.name, ru.email, ru.zipcode, ru.prefecture, ru.city, ru.town, ru.apartment, ru.phone_number
			FROM subscriptions s
			INNER JOIN orders o ON s.stripe_subscription_id = o.stripe_subscription_id
			INNER JOIN users pu ON s.paiduser_id = pu.id
			INNER JOIN users ru ON s.receiveduser_id = ru.id
			WHERE s.paiduser_id = ?`,
			id)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		var orders []Order
		for rows.Next() {
			var order Order
			err := rows.Scan(
				&order.ID,
				&order.PlanID,
				&order.PlanName,
				&order.PlanExplanation,
				&order.Price,
				&order.PaymentDate,
				&order.StripeSubscribeID,
				&order.PaidUser.ID,
				&order.PaidUser.Name,
				&order.PaidUser.Email,
				&order.PaidUser.Zipcode,
				&order.PaidUser.Prefecture,
				&order.PaidUser.City,
				&order.PaidUser.Town,
				&order.PaidUser.Apartment,
				&order.PaidUser.PhoneNumber,
				&order.ReceivedUser.ID,
				&order.ReceivedUser.Name,
				&order.ReceivedUser.Email,
				&order.ReceivedUser.Zipcode,
				&order.ReceivedUser.Prefecture,
				&order.ReceivedUser.City,
				&order.ReceivedUser.Town,
				&order.ReceivedUser.Apartment,
				&order.ReceivedUser.PhoneNumber,
			)
			if err != nil {
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
