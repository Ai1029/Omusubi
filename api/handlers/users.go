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

type User struct {
	ID            int    `json:"id"`
	Name          string `json:"name"`
	Email         string `json:"email"`
	UID           string `json:"uid"`
	FamilyID      int    `json:"family_id"`
	Phonetic      string `json:"phonetic"`
	Zipcode       string `json:"zipcode"`
	Prefecture    string `json:"prefecture"`
	City          string `json:"city"`
	Town          string `json:"town"`
	Apartment     *string `json:"apartment"`
	PhoneNumber   string `json:"phone_number"`
	IsOwner       bool   `json:"is_owner"`
	IsVirtualUser bool   `json:"is_virtual_user"`
}

type CreateUser struct {
	Name        string `json:"name"`
	Email       string `json:"email"`
	UID         string `json:"uid"`
	FamilyID    int    `json:"family_id"`
	Phonetic    string `json:"phonetic"`
	Zipcode     string `json:"zipcode"`
	Prefecture  string `json:"prefecture"`
	City        string `json:"city"`
	Town        string `json:"town"`
	Apartment   *string `json:"apartment"`
	PhoneNumber string `json:"phone_number"`
}

func GetUsers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		rows, err := db.Query("SELECT * FROM users")
		if err != nil {
			log.Fatal(err)
		}

		var users []User
		for rows.Next() {
			var user User
			if err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.UID, &user.FamilyID, &user.Phonetic, &user.Zipcode, &user.Prefecture, &user.City, &user.Town, &user.Apartment, &user.PhoneNumber, &user.IsOwner, &user.IsVirtualUser); err != nil {
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

func GetUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		id := params["id"]

		// ユーザIDに紐づくデータ取得
		var user User
		err := db.QueryRow("SELECT * FROM users WHERE id = ?", id).Scan(&user.ID, &user.Name, &user.Email, &user.UID, &user.FamilyID, &user.Phonetic, &user.Zipcode, &user.Prefecture, &user.City, &user.Town, &user.Apartment, &user.PhoneNumber, &user.IsOwner, &user.IsVirtualUser)
		if err != nil {
			// エラーが発生した場合はエラーレスポンスを返す
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Error: %v", err)
			return
		}
		// ユーザー情報をJSONに変換してレスポンスとして返す
		responseJSON, err := json.Marshal(user)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Error: %v", err)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(responseJSON)
	}
}

func CreateUsers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var data CreateUser

		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		stmt, err := db.Prepare("INSERT INTO users(name, email, uid, family_id, phonetic, zipcode, prefecture, city, town, apartment, phone_number ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		res, err := stmt.Exec(data.Name, data.Email, data.UID, data.FamilyID, data.Phonetic, data.Zipcode, data.Prefecture, data.City, data.Town, data.Apartment, data.PhoneNumber)
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
			log.Fatal(err)
		}

		fmt.Println(err)
		jsonData, err := json.Marshal(resUser)
		if err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}
