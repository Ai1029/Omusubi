package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

type Item struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Detail   string `json:"detail"`
	Quantity string `json:"quantity"`
}

func GetAllItem(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		rows, err := db.Query("SELECT id, name, quantity, detail FROM items")
		if err != nil {
			log.Fatal(err)
		}

		var items []Item
		for rows.Next() {
			var item Item
			if err := rows.Scan(&item.ID, &item.Name, &item.Quantity, &item.Detail); err != nil {
				log.Fatal(err)
			}
			items = append(items, item)
		}

		// 構造体をJSON形式に変換する
		jsonData, err := json.Marshal(items)

		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}
