package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"strings"

	"net/http"

	firebase"firebase.google.com/go"
	_ "github.com/go-sql-driver/mysql"
	"google.golang.org/api/option"
)

type LoginUser struct {
	ID           int     `json:"id"`
	Name         string  `json:"name"`
	Email        string  `json:"email"`
	UID          string  `json:"uid"`
	FamilyID     int     `json:"family_id"`
	Phonetic     string  `json:"phonetic"`
	Zipcode      string  `json:"zipcode"`
	Prefecture   string  `json:"prefecture"`
	City         string  `json:"city"`
	Town         string  `json:"town"`
	Apartment    string  `json:"apartment"`
	PhoneNumber  string  `json:"phone_number"`
	IsOwner      bool    `json:"is_owner"`
	IsVirtualUser bool    `json:"is_virtual_user"`
}

type LoginedUser struct {
	ID           int     `json:"id"`
	FamilyID     int     `json:"family_id"`
	IsOwner      bool    `json:"is_owner"`
	IsVirtualUser bool    `json:"is_virtual_user"`
}

func Login(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")
		token := strings.Split(authHeader, " ")[1]

		// Firebase Admin SDKを初期化する
		opt := option.WithCredentialsFile("./Omusubi-serviceAccountKey.json")
		app, err := firebase.NewApp(context.Background(), nil, opt)
		if err != nil {
			// エラー処理
			log.Fatal(err)
		}

		// アクセストークンを検証する
		authClient, err := app.Auth(context.Background())
		if err != nil {
			// エラー処理
			log.Fatal(err)
			http.Error(w, "Failed to create firebase auth client", http.StatusInternalServerError)
			return
		}

		// tokenInfoには検証済みのトークン情報が含まれている
		tokenInfo, err := authClient.VerifyIDToken(context.Background(), token)
		if err != nil {
			log.Fatal(err)
			http.Error(w, "Invalid access token", http.StatusUnauthorized)
			return
		}

		// 検証済みトークンからuidを取得
		uid := tokenInfo.Claims["user_id"].(string)

		var resData LoginedUser

		err = db.QueryRow("SELECT id, family_id FROM users WHERE uid = ?", uid).Scan(&resData.ID, &resData.FamilyID)
		if err != nil {
			log.Fatal(err)
		}

		jsonData, err := json.Marshal(resData)
		if err != nil {
			log.Fatal(err)
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)

	}
}

