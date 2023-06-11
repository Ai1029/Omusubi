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

		// 指定されたユーザーのfamily_idを取得
		var familyID int
		err = db.QueryRow("SELECT family_id FROM users WHERE id = ?", id).Scan(&familyID)
		if err != nil {
			http.Error(w, "User Not Found", http.StatusNotFound)
			return
		}

		// 同じfamily_idを持つユーザーを取得
		rows, err := db.Query("SELECT * FROM users WHERE family_id = ?", familyID)
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

func CreateFamilyMenber(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var data User

		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		stmt, err := db.Prepare("INSERT INTO users(name, email, uid, family_id, phonetic, zipcode, prefecture, city, town, apartment, phone_number,is_owner,is_virtual_user ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		res, err := stmt.Exec(data.Name, data.Email, data.UID, data.FamilyID, data.Phonetic, data.Zipcode, data.Prefecture, data.City, data.Town, data.Apartment, data.PhoneNumber, data.IsOwner, data.IsVirtualUser)
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		lastID, err := res.LastInsertId()
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		var resUser User

		err = db.QueryRow("SELECT * FROM users WHERE id = ?", lastID).Scan(&resUser.ID, &resUser.Name, &resUser.Email, &resUser.UID, &resUser.FamilyID, &resUser.Phonetic, &resUser.Zipcode, &resUser.Prefecture, &resUser.City, &resUser.Town, &resUser.Apartment, &resUser.PhoneNumber, &resUser.IsOwner, &resUser.IsVirtualUser)
		if err != nil {
			// エラー処理
			fmt.Println(err)
			log.Fatal(err)
		}

		jsonData, err := json.Marshal(resUser)
		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}
