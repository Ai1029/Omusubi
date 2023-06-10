package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

// 同じファミリーIDを持つユーザーを取得
func GetFamily(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		idStr := params["id"]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}
		fmt.Println(id)

		rows, err := db.Query("SELECT * FROM users WHERE family_id = ? ", id)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		var users []User
		for rows.Next() {
			var user User
			if err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.UID, &user.FamilyID, &user.Phonetic, &user.Zipcode, &user.Prefecture, &user.City, &user.Town, &user.Apartment, &user.PhoneNumber, &user.IsOwner, &user.IsVirtualUser); err != nil {
				log.Fatal(err)
			}
			users = append(users, user)
		}

		jsonData, err := json.Marshal(users)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

type Family struct {
	ID          int `json:"id"`
	OwnerUserID int `json:"owneruser_id"`
}

func CreateFamily(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var data Family

		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		stmt, err := db.Prepare("INSERT INTO family(owneruser_id) VALUES(?)")
		if err != nil {
			log.Fatal(err)
		}
		defer stmt.Close()

		result, err := stmt.Exec(data.OwnerUserID)
		if err != nil {
			log.Fatal(err)
		}

		lastID, err := result.LastInsertId()
		if err != nil {
			log.Fatal(err)
		}

		response := map[string]int64{"id": lastID}
		jsonData, err := json.Marshal(response)
		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}
