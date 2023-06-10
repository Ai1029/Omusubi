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

type Family struct {
	ID          int `json:"id"`
	OwnerUserID int `json:"owneruser_id"`
}

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

func SCreateFamily(db *sql.DB, ownerUserID int) (int, error) {
	stmt, err := db.Prepare("INSERT INTO family(owneruser_id) VALUES(?)")
	if err != nil {
		return 0, err
	}
	defer stmt.Close()

	result, err := stmt.Exec(ownerUserID)
	if err != nil {
		return 0, err
	}

	familyID, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(familyID), nil
}
