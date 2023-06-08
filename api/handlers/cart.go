package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

type CartUser struct {
	ID            int     `json:"id"`
	Name          string  `json:"name"`
	Email         *string `json:"email"`
	PostalCode    string  `json:"postal_code"`
	State         string  `json:"state"`
	City          string  `json:"city"`
	Line1         string  `json:"line1"`
	Line2         *string  `json:"line2"`
	PhoneNumber   string  `json:"phone_number"`
	IsOwner       bool    `json:"is_owner"`
	IsVirtualUser bool    `json:"is_virtual_user"`
}

func GetCartUsers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		id := params["id"]

		rows, err := db.Query("SELECT id, name, email, zipcode, prefecture, city, town, apartment, phone_number, is_owner, is_virtual_user FROM users WHERE family_id = ?", id)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		var users []CartUser
		for rows.Next() {
			var user CartUser
			if err := rows.Scan(
				&user.ID,
				&user.Name,
				&user.Email,
				&user.PostalCode,
				&user.State,
				&user.City,
				&user.Line1,
				&user.Line2,
				&user.PhoneNumber,
				&user.IsOwner,
				&user.IsVirtualUser,
			); err != nil {
				log.Fatal(err)
			}
			users = append(users, user)
		}

		// 構造体をJSON形式に変換する
		jsonData, err := json.Marshal(users)

		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)

	}
}
