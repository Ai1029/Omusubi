package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

type CreateOrder struct {
	PlanID             int    `json:"plan_id"`
	PaidUserID         string `json:"paiduser_id"`
	ReceiveduserUserID string `json:"receiveduser_id"`
	// PlanName           string `json:"plan_name"`
	// PlanExplanation    string `json:"plan_explanation"`
	// PlanQuantity       string `json:"plan_quantity"`
}

type Response struct {
	Message string `json:"message"`
}

func CreateCheckoutSesstion(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		fmt.Println("create checkout sesstion")

		if r.Method != http.MethodPost {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		// リクエストボディの読み取り
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Fatal(err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// リクエストボディの内容をコンソールログに表示
		fmt.Println(string(body))

		response := Response{
			Message: "OK",
		}
		jsonData, err := json.Marshal(response)
		if err != nil {
			log.Fatal(err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// レスポンスの書き込み
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonData)

	}
}
