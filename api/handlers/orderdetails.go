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

type Orderdetails struct {
	ID                   int    `json:"id"`
	Sidedish_id          int    `json:"sidedish_id"`
	Quantity             int    `json:"quantity"`
	Sidedish_name        string `json:"sidedish_name"`
	Sidedish_explanation string `json:"sidedish_explanation"`
	Sidedish_price       string `json:"sidedish_price"`
}

type CreateOrderdetailsData struct {
	Sidedish_id          int    `json:"sidedish_id"`
	Quantity             int    `json:"quantity"`
	Sidedish_name        string `json:"sidedish_name"`
	Sidedish_explanation string `json:"sidedish_explanation"`
	Sidedish_price       string `json:"sidedish_price"`
}

func GetOrderdetails(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		rows, err := db.Query("SELECT id, sidedish_id, quantity, sidedish_name, sidedish_explanation, sidedish_price FROM orderdetails")
		if err != nil {
			log.Fatal(err)
		}

		var orderdetails []Orderdetails
		for rows.Next() {
			var orderdetail Orderdetails
			if err := rows.Scan(&orderdetail.ID, &orderdetail.Sidedish_id, &orderdetail.Quantity, &orderdetail.Sidedish_name, &orderdetail.Sidedish_explanation, &orderdetail.Sidedish_price); err != nil {
				log.Fatal(err)
			}
			orderdetails = append(orderdetails, orderdetail)
		}

		// 構造体をJSON形式に変換する
		jsonData, err := json.Marshal(orderdetails)
		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

func GetOrderdetail(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		params := mux.Vars(r)
		id := params["id"]

		// アイテムIDに紐づくデータ取得
		var orderdetail Orderdetails
		err := db.QueryRow("SELECT id, sidedish_id, quantity, sidedish_name, sidedish_explanation, sidedish_price FROM orderdetails WHERE id = ?", id).Scan(&orderdetail.ID, &orderdetail.Sidedish_id, &orderdetail.Quantity, &orderdetail.Sidedish_name, &orderdetail.Sidedish_explanation, &orderdetail.Sidedish_price)
		if err != nil {
			// エラーが発生した場合はエラーレスポンスを返す
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Error: %v", err)
			return
		}
		// アイテム情報をJSONに変換してレスポンスとして返す
		jsonData, err := json.Marshal(orderdetail)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Error: %v", err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

func CreateOrderdetail(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var data CreateOrderdetailsData

		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// sidedishesテーブルからsidedish_name, sidedish_explanation, sidedish_priceを取得するクエリ
		sidedishQuery := "SELECT sidedish_name, sidedish_explanation, sidedish_price FROM sidedishes WHERE sidedish_id = ?"
		var (
			sidedishName        string
			sidedishExplanation string
			sidedishPrice       string
		)
		// sidedishesテーブルから詳細情報を取得
		err = db.QueryRow(sidedishQuery, data.Sidedish_id).Scan(&sidedishName, &sidedishExplanation, &sidedishPrice)
		if err != nil {
			log.Fatal(err)
		}

		stmt, err := db.Prepare("INSERT INTO orderdetails(sidedish_id, quantity, sidedish_name, sidedish_explanation, sidedish_price) VALUES(?, ?, ?, ?, ?)")
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		res, err := stmt.Exec(data.Sidedish_id, data.Quantity, sidedishName, sidedishExplanation, sidedishPrice)
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		lastID, err := res.LastInsertId()
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		var orderdetail Orderdetails

		err = db.QueryRow("SELECT id, sidedish_id, quantity, sidedish_name, sidedish_explanation, sidedish_price FROM orderdetails WHERE id = ?", lastID).Scan(&orderdetail.ID, &orderdetail.Sidedish_id, &orderdetail.Quantity, &orderdetail.Sidedish_name, &orderdetail.Sidedish_explanation, &orderdetail.Sidedish_price)
		if err != nil {
			log.Fatal(err)
		}

		jsonData, err := json.Marshal(orderdetail)
		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

// func PatchOderdetail(db *sql.DB) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		params := mux.Vars(r)
// 		id := params["id"]

// 		var data Sidedishes
// 		err := json.NewDecoder(r.Body).Decode(&data)
// 		if err != nil {
// 			http.Error(w, err.Error(), http.StatusBadRequest)
// 			return
// 		}

// 		stmt, err := db.Prepare("UPDATE sidedishes SET name=?, explanation=?, price=?, quantity=?, image=? WHERE id=?")
// 		if err != nil {
// 			log.Fatal(err)
// 		}

// 		_, err = stmt.Exec(data.Name, data.Explanation, data.Price, data.Quantity, data.Image, id)
// 		if err != nil {
// 			log.Fatal(err)
// 		}

// 		var sidedish Sidedishes
// 		err = db.QueryRow("SELECT id, name, explanation, price, quantity, image FROM sidedishes WHERE id = ?", id).Scan(&sidedish.ID, &sidedish.Name, &sidedish.Explanation, &sidedish.Price, &sidedish.Quantity, &sidedish.Image)
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

// //　idで選択しないバージョン

// // func PatchSidedish(db *sql.DB) http.HandlerFunc {
// // 	return func(w http.ResponseWriter, r *http.Request) {
// // 		var data Sidedishes

// // 		err := json.NewDecoder(r.Body).Decode(&data)
// // 		if err != nil {
// // 			http.Error(w, err.Error(), http.StatusBadRequest)
// // 			return
// // 		}

// // 		stmt, err := db.Prepare("UPDATE sidedishes SET name = ?, explanation = ?, price =?, quantity = ?, image = ? WHERE id = ?")
// // 		if err != nil {
// // 			log.Fatal(err)
// // 		}

// // 		// データベースから更新対象のレコードを取得する
// // 		rows, err := db.Query("SELECT name, explanation, price, quantity, image FROM sidedishes WHERE id = ?", data.ID)
// // 		if err != nil {
// // 			http.Error(w, err.Error(), http.StatusInternalServerError)
// // 			return
// // 		}
// // 		// レコードが存在しなければ、HTTPステータスコード404を返す
// // 		if !rows.Next() {
// // 			http.Error(w, "record not found", http.StatusNotFound)
// // 			return
// // 		}

// // 		var dbData Sidedishes
// // 		if err := rows.Scan(&dbData.Name, &dbData.Explanation, &dbData.Price, &dbData.Quantity, &dbData.Image); err != nil {
// // 			http.Error(w, err.Error(), http.StatusInternalServerError)
// // 			return
// // 		}

// // 		// レコードに変更が必要な場合は、構造体の対応するフィールドの値で上書きする
// // 		if data.Name != "" {
// // 			dbData.Name = data.Name
// // 		}
// // 		if data.Explanation != "" {
// // 			dbData.Explanation = data.Explanation
// // 		}
// // 		if data.Price != "" {
// // 			dbData.Price = data.Price
// // 		}
// // 		if data.Quantity != 0 {
// // 			dbData.Quantity = data.Quantity
// // 		}
// // 		if data.Image != "" {
// // 			dbData.Image = data.Image
// // 		}

// // 		_, err = stmt.Exec(dbData.Name, dbData.Explanation, dbData.Price, dbData.Quantity, dbData.Image, data.ID)
// // 		if err != nil {
// // 			http.Error(w, err.Error(), http.StatusInternalServerError)
// // 			return
// // 		}

// // 		var sidedish Sidedishes

// // 		err = db.QueryRow("SELECT id, name, explanation, price, quantity, image FROM sidedishes WHERE id = ?", data.ID).Scan(&sidedish.ID, &sidedish.Name, &sidedish.Explanation, &sidedish.Price, &sidedish.Quantity, &sidedish.Image)
// // 		if err != nil {
// // 			log.Fatal(err)
// // 		}

// // 		jsonData, err := json.Marshal(sidedish)
// // 		if err != nil {
// // 			log.Fatal(err)
// // 		}

// // 		w.Header().Set("Content-Type", "application/json")
// // 		w.Write(jsonData)

// // 	}
// // }

// func DeleteOderdetail(db *sql.DB) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		id := mux.Vars(r)["id"]

// 		stmt, err := db.Prepare("DELETE FROM sidedishes WHERE id = ?")
// 		if err != nil {
// 			http.Error(w, err.Error(), http.StatusInternalServerError)
// 			return
// 		}
// 		defer stmt.Close()

// 		_, err = stmt.Exec(id)
// 		if err != nil {
// 			http.Error(w, err.Error(), http.StatusInternalServerError)
// 			return
// 		}

// 		json.NewEncoder(w).Encode(true)

// 	}
// }
