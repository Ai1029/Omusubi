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

type Sidedishes struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Explanation string `json:"explanation"`
	Price       string `json:"price"`
	Quantity    int    `json:"quantity"`
	Image       string `json:"image"`
}

type CreateSidedishesData struct {
	Name        string `json:"name"`
	Explanation string `json:"explanation"`
	Price       string `json:"price"`
	Quantity    int    `json:"quantity"`
	Image       string `json:"image"`
}

func GetSidedishes(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		rows, err := db.Query("SELECT id, name, explanation, price, quantity, image FROM sidedishes")
		if err != nil {
			log.Fatal(err)
		}

		var sidedishes []Sidedishes
		for rows.Next() {
			var sidedish Sidedishes
			if err := rows.Scan(&sidedish.ID, &sidedish.Name, &sidedish.Explanation, &sidedish.Price, &sidedish.Quantity, &sidedish.Image); err != nil {
				log.Fatal(err)
			}
			sidedishes = append(sidedishes, sidedish)
		}

		// 構造体をJSON形式に変換する
		jsonData, err := json.Marshal(sidedishes)
		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

func GetSidedish(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		params := mux.Vars(r)
		id := params["id"]

		// アイテムIDに紐づくデータ取得
		var sidedish Sidedishes
		err := db.QueryRow("SELECT id, name, explanation, price, quantity, image FROM sidedishes WHERE id = ?", id).Scan(&sidedish.ID, &sidedish.Name, &sidedish.Explanation, &sidedish.Price, &sidedish.Quantity, &sidedish.Image)
		if err != nil {
			// エラーが発生した場合はエラーレスポンスを返す
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Error: %v", err)
			return
		}
		// アイテム情報をJSONに変換してレスポンスとして返す
		jsonData, err := json.Marshal(sidedish)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Error: %v", err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

func CreateSidedish(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var data CreateSidedishesData

		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		stmt, err := db.Prepare("INSERT INTO sidedishes(name, explanation, price, quantity, image) VALUES(?, ?, ?, ?, ?)")
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		res, err := stmt.Exec(data.Name, data.Explanation, data.Price, data.Quantity, data.Image)
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		lastID, err := res.LastInsertId()
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		var sidedish Sidedishes

		err = db.QueryRow("SELECT id, name, explanation, price, quantity, image FROM sidedishes WHERE id = ?", lastID).Scan(&sidedish.ID, &sidedish.Name, &sidedish.Explanation, &sidedish.Price, &sidedish.Quantity, &sidedish.Image)
		if err != nil {
			log.Fatal(err)
		}

		jsonData, err := json.Marshal(sidedish)
		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

func PatchSidedish(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		id := params["id"]

		var data Sidedishes
		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		stmt, err := db.Prepare("UPDATE sidedishes SET name=?, explanation=?, price=?, quantity=?, image=? WHERE id=?")
		if err != nil {
			log.Fatal(err)
		}

		_, err = stmt.Exec(data.Name, data.Explanation, data.Price, data.Quantity, data.Image, id)
		if err != nil {
			log.Fatal(err)
		}

		var sidedish Sidedishes
		err = db.QueryRow("SELECT id, name, explanation, price, quantity, image FROM sidedishes WHERE id = ?", id).Scan(&sidedish.ID, &sidedish.Name, &sidedish.Explanation, &sidedish.Price, &sidedish.Quantity, &sidedish.Image)
		if err != nil {
			log.Fatal(err)
		}

		jsonData, err := json.Marshal(sidedish)
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

func DeleteSidedish(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["id"]

		stmt, err := db.Prepare("DELETE FROM sidedishes WHERE id = ?")
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
