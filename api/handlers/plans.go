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

type Plans struct {
	ID                int    `json:"id"`
	Name              string `json:"name"`
	Explanation       string `json:"explanation"`
	Price             int    `json:"price"`
	Image             string `json:"image"`
	StripePriceID     string `json:"stripe_price_id"`
	Delivery_interval string `json:"delivery_interval"`
}

type CreatePlansData struct {
	Name              string `json:"name"`
	Explanation       string `json:"explanation"`
	Price             string `json:"price"`
	Image             string `json:"image"`
	StripePriceID     string `json:"stripe_price_id"`
	Delivery_interval string `json:"delivery_interval"`
}

func GetPlans(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		rows, err := db.Query("SELECT id, name, explanation, price, image, stripe_price_id, delivery_interval FROM plans")
		if err != nil {
			log.Fatal(err)
		}

		var plans []Plans
		for rows.Next() {
			var plan Plans
			if err := rows.Scan(&plan.ID, &plan.Name, &plan.Explanation, &plan.Price, &plan.Image, &plan.StripePriceID, &plan.Delivery_interval); err != nil {
				log.Fatal(err)
			}
			plans = append(plans, plan)
		}

		// 構造体をJSON形式に変換する
		jsonData, err := json.Marshal(plans)
		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

func GetPlan(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		params := mux.Vars(r)
		id := params["id"]

		// アイテムIDに紐づくデータ取得
		var plan Plans
		err := db.QueryRow("SELECT id, name, explanation, price, image, stripe_price_id, delivery_interval FROM plans WHERE id = ?", id).Scan(&plan.ID, &plan.Name, &plan.Explanation, &plan.Price, &plan.Image, &plan.StripePriceID, &plan.Delivery_interval)
		if err != nil {
			// エラーが発生した場合はエラーレスポンスを返す
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Error: %v", err)
			return
		}
		// アイテム情報をJSONに変換してレスポンスとして返す
		jsonData, err := json.Marshal(plan)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Error: %v", err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

func CreatePlan(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var data CreatePlansData

		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		stmt, err := db.Prepare("INSERT INTO plans(name, explanation, price, image, stripe_price_id, delivery_interval) VALUES(?, ?, ?, ?, ?)")
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		res, err := stmt.Exec(data.Name, data.Explanation, data.Price, data.Image, data.StripePriceID, data.Delivery_interval)
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		lastID, err := res.LastInsertId()
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		var plan Plans

		err = db.QueryRow("SELECT id, name, explanation, price, image, stripe_price_id, delivery_interval FROM plans WHERE id = ?", lastID).Scan(&plan.ID, &plan.Name, &plan.Explanation, &plan.Price, &plan.Image, &plan.StripePriceID, &plan.Delivery_interval)
		if err != nil {
			log.Fatal(err)
		}

		jsonData, err := json.Marshal(plan)
		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

func PatchPlan(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		id := params["id"]

		var data Plans
		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		stmt, err := db.Prepare("UPDATE plans SET name=?, explanation=?, price=?, image=?, stripe_price_id=?, delivery_interval=? WHERE id=?")
		if err != nil {
			log.Fatal(err)
		}

		_, err = stmt.Exec(data.Name, data.Explanation, data.Price, data.Image, data.StripePriceID, data.Delivery_interval, id)
		if err != nil {
			log.Fatal(err)
		}

		var plan Plans
		err = db.QueryRow("SELECT id, name, explanation, price, image, stripe_price_id, delivery_interval FROM plans WHERE id = ?", id).Scan(&plan.ID, &plan.Name, &plan.Explanation, &plan.Price, &plan.Image, &plan.StripePriceID, &plan.Delivery_interval)
		if err != nil {
			log.Fatal(err)
		}

		jsonData, err := json.Marshal(plan)
		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

//　idで選択しないバージョン

// func PatchSidedish(db *sql.DB) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		var data Sidedishes

// 		err := json.NewDecoder(r.Body).Decode(&data)
// 		if err != nil {
// 			http.Error(w, err.Error(), http.StatusBadRequest)
// 			return
// 		}

// 		stmt, err := db.Prepare("UPDATE sidedishes SET name = ?, explanation = ?, price =?, quantity = ?, image = ? WHERE id = ?")
// 		if err != nil {
// 			log.Fatal(err)
// 		}

// 		// データベースから更新対象のレコードを取得する
// 		rows, err := db.Query("SELECT name, explanation, price, quantity, image FROM sidedishes WHERE id = ?", data.ID)
// 		if err != nil {
// 			http.Error(w, err.Error(), http.StatusInternalServerError)
// 			return
// 		}
// 		// レコードが存在しなければ、HTTPステータスコード404を返す
// 		if !rows.Next() {
// 			http.Error(w, "record not found", http.StatusNotFound)
// 			return
// 		}

// 		var dbData Sidedishes
// 		if err := rows.Scan(&dbData.Name, &dbData.Explanation, &dbData.Price, &dbData.Quantity, &dbData.Image); err != nil {
// 			http.Error(w, err.Error(), http.StatusInternalServerError)
// 			return
// 		}

// 		// レコードに変更が必要な場合は、構造体の対応するフィールドの値で上書きする
// 		if data.Name != "" {
// 			dbData.Name = data.Name
// 		}
// 		if data.Explanation != "" {
// 			dbData.Explanation = data.Explanation
// 		}
// 		if data.Price != "" {
// 			dbData.Price = data.Price
// 		}
// 		if data.Quantity != 0 {
// 			dbData.Quantity = data.Quantity
// 		}
// 		if data.Image != "" {
// 			dbData.Image = data.Image
// 		}

// 		_, err = stmt.Exec(dbData.Name, dbData.Explanation, dbData.Price, dbData.Quantity, dbData.Image, data.ID)
// 		if err != nil {
// 			http.Error(w, err.Error(), http.StatusInternalServerError)
// 			return
// 		}

// 		var sidedish Sidedishes

// 		err = db.QueryRow("SELECT id, name, explanation, price, quantity, image FROM sidedishes WHERE id = ?", data.ID).Scan(&sidedish.ID, &sidedish.Name, &sidedish.Explanation, &sidedish.Price, &sidedish.Quantity, &sidedish.Image)
// 		if err != nil {
// 			log.Fatal(err)
// 		}

// 		jsonData, err := json.Marshal(sidedish)
// 		if err != nil {
// 			log.Fatal(err)
// 		}

// 		w.Header().Set("Content-Type", "application/json")
// 		w.Write(jsonData)

// 	}
// }

func DeletePlan(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["id"]

		stmt, err := db.Prepare("DELETE FROM plans WHERE id = ?")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer stmt.Close()

		_, err = stmt.Exec(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(true)

	}
}
